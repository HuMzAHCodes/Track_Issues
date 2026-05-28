import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import prisma from '@/prisma/client'
import { Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation'
import ReactMarkdown from "react-markdown"
import EditIssueButton from './EditIssueButton';
import NextLink from 'next/link'
import IssueDetails from './IssueDetails';
import DeleteButton from './DeleteButton';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import AssigneeSelect from './AssigneeSelect';
import StatusSelect from './StatusSelect';
import { Metadata } from 'next';
import { cache } from 'react';


interface Props {
  params: Promise<{ id: string }>
}



const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);


export async function generateMetadata({ params }: Props): Promise<Metadata> {

  // await params — Next.js 15 requirement
  const { id } = await params;

  // uses the cached fetch — if IssueDetailPage already called this,
  // no new DB query is made — the cached result is returned instantly
  const issue = await fetchIssue(parseInt(id));

  return {
    title: `${issue?.title} | Issue Tracker`,
    description: `Details of issue: ${issue?.title}`,

    openGraph: {
      title: `${issue?.title} | Issue Tracker`,
      description: `Details of issue: ${issue?.title}`,
    },

    twitter: {
      card: 'summary',
      title: `${issue?.title} | Issue Tracker`,
      description: `Details of issue: ${issue?.title}`,
    }
  };
}


const IssueDetailPage = async ({ params }: Props) => {

  const session = await getServerSession(authOptions);

  const { id } = await params;

  const issueId = parseInt(id, 10);
  if (Number.isNaN(issueId)) notFound();

  // uses the cached fetch — if generateMetadata already called this,
  // no new DB query is made — same result returned from cache
  const issue = await fetchIssue(issueId);

  if (!issue) notFound();

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">

      <Box className='md:col-span-4'>
        <IssueDetails issue={issue} />
      </Box>

      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <StatusSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            {isAdmin && <DeleteButton issueId={issue.id} />}
          </Flex>
        </Box>
      )}

    </Grid>
  )
}

export default IssueDetailPage;


// ─────────────────────────────────────────────────────────────────────────────
// getServerSession(authOptions) — WHAT IT DOES
// ─────────────────────────────────────────────────────────────────────────────
// Runs on the server before this page is rendered (this is an async Server Component).
// It reads the NextAuth session cookie from the request, validates it with authOptions,
// and returns who is logged in — or null if nobody is signed in.
// Unlike useSession() in client components, this runs once on the server with no loading flash.
// ─────────────────────────────────────────────────────────────────────────────
// session — WHAT IT IS
// ─────────────────────────────────────────────────────────────────────────────
// `session` holds the current user's login state from NextAuth (set at Google sign-in).
// We use it in `{session && (...)}` so Edit and Delete only appear for logged-in users.
// Delete has no separate page, so middleware cannot block that button — hiding it when
// session is missing is the UI-side guard; the DELETE API still returns 401 without a session.
// ─────────────────────────────────────────────────────────────────────────────
// WHY generateMetadata AND THE PAGE COMPONENT BOTH RECEIVE Props
// ─────────────────────────────────────────────────────────────────────────────
// Both functions need the issue id from the URL params to do their job.
// generateMetadata uses it to fetch the title for the <head> metadata.
// IssueDetailPage uses it to fetch the full issue for rendering the page body.
// Next.js calls generateMetadata first, then renders the page component.
// They share the same Props interface to avoid duplicating the type definition.
// ─────────────────────────────────────────────────────────────────────────────









// ─────────────────────────────────────────────────────────────────────────────
// generateMetadata — DYNAMIC METADATA PER ISSUE
// ─────────────────────────────────────────────────────────────────────────────
// Next.js calls this function before rendering the page
// it receives the same Props as the page component (params with the issue id)
// we fetch the issue title from the database and use it to build
// a unique title and description for each individual issue page
//
// this runs on the server — Prisma is available here
// the result is injected into the <head> of the page automatically by Next.js







// ─────────────────────────────────────────────────────────────────────────────
// getServerSession(authOptions) — WHAT IT DOES
// ─────────────────────────────────────────────────────────────────────────────
// Runs on the server before this page is rendered (this is an async Server Component).
// It reads the NextAuth session cookie from the request, validates it with authOptions,
// and returns who is logged in — or null if nobody is signed in.
// Unlike useSession() in client components, this runs once on the server with no loading flash.





// ─────────────────────────────────────────────────────────────────────────────
// session — WHAT IT IS
// ─────────────────────────────────────────────────────────────────────────────
// `session` holds the current user's login state from NextAuth (set at Google sign-in).
// We use it in `{session && (...)}` so Edit and Delete only appear for logged-in users.
// Delete has no separate page, so middleware cannot block that button — hiding it when
// session is missing is the UI-side guard; the DELETE API still returns 401 without a session.





// ─────────────────────────────────────────────────────────────────────────────
// WHY generateMetadata AND THE PAGE COMPONENT BOTH RECEIVE Props
// ─────────────────────────────────────────────────────────────────────────────
// Both functions need the issue id from the URL params to do their job.
// generateMetadata uses it to fetch the title for the <head> metadata.
// IssueDetailPage uses it to fetch the full issue for rendering the page body.
// Next.js calls generateMetadata first, then renders the page component.
// They share the same Props interface to avoid duplicating the type definition.





// ─────────────────────────────────────────────────────────────────────────────
// NOTE ON DOUBLE DATABASE FETCH
// ─────────────────────────────────────────────────────────────────────────────
// Both generateMetadata and IssueDetailPage call prisma.issue.findUnique()
// separately. This means the database is hit twice per page load.
// This is acceptable for a tutorial project. In production you would use
// React cache() to deduplicate the fetch so Prisma is only called once.
// ─────────────────────────────────────────────────────────────────────────────





// ─────────────────────────────────────────────────────────────────────────────
// fetchIssue — CACHED DATABASE FETCH
// ─────────────────────────────────────────────────────────────────────────────
// cache() is a React function that memoizes the result of an async function
// for the duration of a single server request.
//
// WITHOUT cache():
// → generateMetadata() calls prisma.issue.findUnique() → 1 DB hit
// → IssueDetailPage calls prisma.issue.findUnique() → 2nd DB hit (same data)
// → total: 2 database queries for the exact same record
//




