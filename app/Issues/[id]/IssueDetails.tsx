import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { Issue } from '@prisma/client'
import { Card, Flex, Heading ,Text} from '@radix-ui/themes'
import React from 'react'
import ReactMarkdown from 'react-markdown'


// find reason why the issue is of type Issue 

const IssueDetails = ({issue}:{issue:Issue}) => {
  return (
    <div>
     <Heading>{issue.title}</Heading>
        <Flex className="space-x-3" my="2">
          <IssueStatusBadge status={issue.status} />
        </Flex>
        <Text>{issue.createdAt.toDateString()}</Text>
        <Card className='prose' mt="4">
          <ReactMarkdown>{issue.description}</ReactMarkdown>
        </Card>

        </div>
  )
}

export default IssueDetails