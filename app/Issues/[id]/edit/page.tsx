import React from 'react'
import IssueForm from '../../_components/IssueForm'
import prisma from '@/prisma/client';
import { notFound } from 'next/navigation';


// In Next.js 15, params is now a Promise — must be typed as Promise<{...}>
// This is a breaking change from Next.js 14 where params was a plain object
interface props {
  params: Promise<{ id: string }>
}


const EditIssuePage = async ({ params }: props) => {

  // Must await params before accessing its properties
  // In Next.js 14 you could do params.id directly — no longer valid in Next.js 15
  const { id } = await params


  // prisma.issue refers to the "issue" model defined in schema.prisma
  // Prisma auto-generates a client with methods for every model you define
  // Here we are querying the database for a single issue by its unique field (id)
  //
  // Other available Prisma query methods on prisma.issue:
  // ─────────────────────────────────────────────────────
  // prisma.issue.findMany()        → fetch all issues (can filter, sort, paginate)
  // prisma.issue.findFirst()       → fetch first match (like findUnique but no uniqueness required)
  // prisma.issue.findUnique()      → fetch one record by a unique field (id, email, etc.)
  // prisma.issue.create()          → insert a new issue into the database
  // prisma.issue.update()          → update an existing issue by unique field
  // prisma.issue.upsert()          → update if exists, create if not
  // prisma.issue.delete()          → delete a single issue by unique field
  // prisma.issue.deleteMany()      → delete multiple issues matching a filter
  // prisma.issue.updateMany()      → update multiple issues matching a filter
  // prisma.issue.count()           → count issues matching a filter
  // prisma.issue.aggregate()       → run aggregations like sum, avg, min, max on fields
  // prisma.issue.groupBy()         → group results by a field and aggregate
  // ─────────────────────────────────────────────────────
  //
  // findUnique() is used here because id is a unique field in our schema
  // It will return the issue object if found, or null if not found
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) }   // parseInt because params.id is a string, but DB expects an Int
  })


  // If no issue was found with that id, redirect to the built-in Next.js 404 page
  if (!issue) notFound()


  // Pass the fetched issue to IssueForm so it can pre-populate the fields for editing
  // IssueForm is a shared component used for both creating and editing issues
  return (
    <IssueForm issue={issue} />
  )
}

export default EditIssuePage