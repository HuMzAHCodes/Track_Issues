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
import { Metadata } from 'next';


interface Props {
  params: Promise<{ id: string }>
}


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
export async function generateMetadata({ params }: Props): Promise<Metadata> {

  // await params — same Next.js 15 requirement as the page component below
  const { id } = await params;

  // fetch the issue — only need the title for metadata
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) }
  });

  return {
    // dynamic title — each issue gets its own unique browser tab title
    // e.g. "Fix login bug | Issue Tracker"
    title: `${issue?.title} | Issue Tracker`,

    // dynamic description — used by search engines and social previews
    description: `Details of issue: ${issue?.title}`,

    // Open Graph — controls the preview card when this URL is shared
    // on Facebook, LinkedIn, WhatsApp, Discord etc.
    openGraph: {
      title: `${issue?.title} | Issue Tracker`,
      description: `Details of issue: ${issue?.title}`,
    },

    // Twitter Card — controls the preview card when shared on Twitter/X
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

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">

      <Box className='md:col-span-4'>
        <IssueDetails issue={issue} />
      </Box>

      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteButton issueId={issue.id} />
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
// NOTE ON DOUBLE DATABASE FETCH
// ─────────────────────────────────────────────────────────────────────────────
// Both generateMetadata and IssueDetailPage call prisma.issue.findUnique()
// separately. This means the database is hit twice per page load.
// This is acceptable for a tutorial project. In production you would use
// React cache() to deduplicate the fetch so Prisma is only called once.
// ─────────────────────────────────────────────────────────────────────────────



