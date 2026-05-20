import { issueschema } from "@/app/validationschemas";
import prisma from "@/prisma/client";
import delay from "delay";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json();

  const validation = issueschema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const issueId = parseInt(id);
  if (isNaN(issueId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

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
    },
  });

  return NextResponse.json(updatedIssue);
}


export async function DELETE(

 
  request: NextRequest,
  // ❌ ISSUE 1: params is a Promise in Next.js 15 — must be typed as Promise<{id:string}>
  // and destructured with await, same as PATCH above
  { params }: { params: Promise<{ id: string }> }  // ✅ FIX: typed as Promise
) {

  // ✅ FIX: await params before accessing id — same pattern as PATCH
  const { id } = await params;

  // ✅ FIX: parse id from the awaited destructure, not from params.id directly
  const issueId = parseInt(id);

  // ✅ FIX: validate that id is actually a number before querying
  if (isNaN(issueId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

   await delay(2000);
  const issue = await prisma.issue.findUnique({
    where: { id: issueId }
  })

  // ❌ ISSUE 2: missing return keyword — without it, execution continues past this block
  // even when the issue is not found, causing prisma.issue.delete() to run with undefined
  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 }) // ✅ FIX: added return

  // ❌ ISSUE 3: issue.id could be undefined if the if-check above didn't return
  // now that the return is fixed above, issue is guaranteed to exist here
  // so issue.id is safe to use
  await prisma.issue.delete({
    where: { id: issue.id }  // ✅ safe to use issue.id now
  })

  return NextResponse.json({});

}