import authOptions from "@/app/auth/authOptions";
import { PatchIssueSchema } from "@/app/validationschemas";
import prisma from "@/prisma/client";
import delay from "delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({}, { status: 401 })

  const validation = PatchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const issueId = parseInt(id);
  if (isNaN(issueId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  if (body.assignedToUserId) {
    const user = await prisma.user.findUnique({ where: { id: body.assignedToUserId } })
    if (!user)
      return NextResponse.json({ error: "invalid User" }, { status: 400 })
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue ID" }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      title: body.title,
      description: body.description,
      assignedToUserId: body.assignedToUserId
    },
  });

  return NextResponse.json(updatedIssue);
}


export async function DELETE(
  request: NextRequest,
  // params is a Promise in Next.js 15 — must be typed as Promise<{id:string}>
  // and destructured with await, same as PATCH above
  { params }: { params: Promise<{ id: string }> }
) {

  // await params before accessing id
  const { id } = await params;

  // parse id from the awaited destructure, not from params.id directly
  const issueId = parseInt(id);

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({}, { status: 401 })

  // validate that id is actually a number before querying
  if (isNaN(issueId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await delay(2000);

  const issue = await prisma.issue.findUnique({
    where: { id: issueId }
  })

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 })

  await prisma.issue.delete({
    where: { id: issue.id }
  })

  return NextResponse.json({});
}


// ─────────────────────────────────────────────────────────────────────────────
// getServerSession(authOptions) — WHAT IT DOES
// ─────────────────────────────────────────────────────────────────────────────
// Runs on the server inside this API route (not in the browser).
// It reads the NextAuth session cookie from the incoming request, validates it using
// the same authOptions config (providers, adapter, secrets), and returns the current
// user's session object — or null if the user is not signed in.
// We pass authOptions so NextAuth knows how this app was configured when checking the cookie.
// If it returns null, we respond with 401 Unauthorized and skip the database update/delete.
// Middleware only guards page URLs; API routes must protect themselves this way.
// ─────────────────────────────────────────────────────────────────────────────
// session — WHAT IT IS
// ─────────────────────────────────────────────────────────────────────────────
// The variable `session` is the logged-in user's auth record from NextAuth.
// When truthy, someone signed in (e.g. via Google); you can use session.user.email, etc.
// When null/undefined, the request is anonymous — we reject PATCH and DELETE with 401.
// The session cookie was originally created at sign-in through /api/auth/* using authOptions.
// ─────────────────────────────────────────────────────────────────────────────
// PATCH — COMPLETE FLOW
// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/issues/[id] is used to PARTIALLY update an existing issue
// unlike PUT which replaces the entire record, PATCH only updates what you send
//
// Step 1 — await params to get the issue id from the URL
//           e.g. /api/issues/5 → id = "5"
//
// Step 2 — await request.json() to read the request body
//           body can contain: title, description, assignedToUserId (all optional)
//
// Step 3 — getServerSession() checks if the user is logged in
//           if not logged in → return 401 Unauthorized immediately
//
// Step 4 — PatchIssueSchema.safeParse(body) validates the body against the Zod schema
//           safeParse does NOT throw — returns { success: true/false }
//           if invalid → return 400 Bad Request with formatted error messages
//
// Step 5 — parseInt(id) converts the string id to a number
//           if isNaN → the URL had something like /api/issues/abc → return 400
//
// Step 6 — if body contains assignedToUserId, verify that user actually exists
//           in the database — if not → return 400 Bad Request
//           this prevents assigning an issue to a non-existent user
//
// Step 7 — findUnique checks if the issue exists in the database
//           if not found → return 404 Not Found
//
// Step 8 — prisma.issue.update() applies the changes to the database
//           only the fields present in body are updated — others stay unchanged
//           this is the PARTIAL update behavior of PATCH
//
// Step 9 — return the updated issue as JSON with default 200 OK status
// ─────────────────────────────────────────────────────────────────────────────