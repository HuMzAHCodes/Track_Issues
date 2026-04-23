import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import prisma from '@/prisma/client'
import { Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation'
import ReactMarkdown from "react-markdown"
import EditIssueButton from './EditIssueButton';

import NextLink from 'next/link'
import IssueDetails from './IssueDetails';


interface Props {
  params: Promise<{ id: string }>
}

const IssueDetailPage = async ({ params }: Props) => {

  const { id } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) }
  })

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">

      <Box>
        <IssueDetails issue={issue}/>
      </Box>

      <Box>
         <EditIssueButton issueId={issue.id}/>
      </Box>

    </Grid>
  )
}

export default IssueDetailPage;