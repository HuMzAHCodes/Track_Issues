import prisma from '@/prisma/client'
import { Avatar, Card, Flex, Heading, Table } from '@radix-ui/themes'
import React from 'react'

import IssueStatusBadge from './components/IssueStatusBadge'
import { Link } from '@radix-ui/themes'



const LatestIssues = async() => {


    const latestissues=await prisma.issue.findMany({
        orderBy:{createdAt:"desc"},
        take:5,
        include:{
            assignedToUser:true
        }
    })
  return (
   <div>
    <Card >
 <Heading size="4" mb="3" > Latest_Issues</Heading>
   
    <Table.Root>
        <Table.Body>
              {latestissues.map(latestissue=><Table.Row key={latestissue.id}> 
                <Table.Cell>
                     <Flex justify="between">
                    <Flex direction="column" align="start" gap="2"> 
                        <Link href={`/Issues/${latestissue.id}`}> {latestissue.title}</Link>
                        <IssueStatusBadge status={latestissue.status}/>
                    </Flex>

                     <Flex> 
              {latestissue.assignedToUser &&(
                <Avatar src={latestissue.assignedToUser.image!}
                fallback="?"
                size="2"
                radius='full'/>
              )}
                     </Flex>
                    </Flex>
                   </Table.Cell>
                </Table.Row>)}
        </Table.Body>
    </Table.Root>
     </Card>
   </div>
  )
}

export default LatestIssues