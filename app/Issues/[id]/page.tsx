import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import prisma from '@/prisma/client'
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation'
import { number } from 'zod';

interface props {
  params: Promise<{ id: string }>
}

const IssueDetailPage = async ({ params }: props) => {

    // if(typeof (await params).id !=="number") notFound();

  // In Next.js 15, params is a Promise and must be awaited
  const { id } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) }
  })

  if (!issue) notFound();

  return (
    <div>

        {/* // using radiux ui components mostly */}
      <Heading>{issue!.title}</Heading>
      <Flex className="space-x-3" my="2">
        {/* // that component to display the color  */}
         <IssueStatusBadge status={issue.status}/>
      </Flex>

      {/* radix ui componet */}
       <Text>{issue!.createdAt.toDateString()}</Text>

       <Card>   <p>{issue!.description}</p> </Card>
    
      
     
    </div>
  )
}

export default IssueDetailPage;