import { issueschema } from "@/app/validationschemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ FIX

  const body = await request.json();

  const validation = issueschema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const issueId = parseInt(id); // ✅ use id here
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