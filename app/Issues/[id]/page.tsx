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


interface Props {
  params: Promise<{ id: string }>
}

const IssueDetailPage = async ({ params }: Props) => {

 const session=await getServerSession(authOptions);

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
      {session && (<Box>
        <Flex direction="column" gap="4">
          <AssigneeSelect/>
          <EditIssueButton issueId={issue.id} />
          <DeleteButton issueId={issue.id} />
        </Flex>

       </Box>)}
      

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