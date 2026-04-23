import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import prisma from '@/prisma/client'
import { Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation'
import ReactMarkDown from "react-markdown"
import NextLink from 'next/link';

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
        <Heading>{issue.title}</Heading>
        <Flex className="space-x-3" my="2">
          <IssueStatusBadge status={issue.status} />
        </Flex>
        <Text>{issue.createdAt.toDateString()}</Text>
        <Card className='prose' mt="4">
          <ReactMarkDown>{issue.description}</ReactMarkDown>
        </Card>
      </Box>

      <Box>
        <Button asChild>
          <NextLink href={`/Issues/${issue.id}/edit`}>
            Edit Issue
          </NextLink>
        </Button>
      </Box>

    </Grid>
  )
}

export default IssueDetailPage;