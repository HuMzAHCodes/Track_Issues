import prisma from '@/prisma/client'
import { Avatar, Flex, Heading } from '@radix-ui/themes'
import React from 'react'
import IssueStatusBadge from './components/IssueStatusBadge'
import Link from 'next/link'

const LatestIssues = async () => {
  const latestissues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true
    }
  });

  return (
    <div className="glass-card p-6 shadow-xl">
      <Heading size="4" className="text-cherry font-extrabold tracking-tight mb-4 border-b border-cherry/10 pb-3">
        Latest Issues
      </Heading>
      <div className="flex flex-col space-y-1">
        {latestissues.map((latestissue) => (
          <div 
            key={latestissue.id} 
            className="flex justify-between items-center p-3 rounded-2xl hover:bg-cherry/5 dark:hover:bg-cherry/10 transition-all duration-300 group"
          >
            <Flex direction="column" align="start" gap="2">
              <Link 
                href={`/Issues/${latestissue.id}`}
                className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-cherry dark:hover:text-cherry transition-colors duration-300"
              >
                {latestissue.title}
              </Link>
              <IssueStatusBadge status={latestissue.status} />
            </Flex>

            {latestissue.assignedToUser && (
              <div className="relative group/avatar">
                <Avatar 
                  src={latestissue.assignedToUser.image!}
                  fallback="?"
                  size="2"
                  radius="full"
                  className="border border-cherry/20 group-hover/avatar:border-cherry transition-all duration-300 shadow-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestIssues;