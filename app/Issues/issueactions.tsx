import { Flex } from '@radix-ui/themes'
import { Button } from '@radix-ui/themes/components/button'
import Link from 'next/link'
import React from 'react'
import IssueStatusFilter from './issueStatusFilter'

const issueactions = () => {
  return (
     
          <Flex mb="5" justify="between">
            <IssueStatusFilter/>
            <Button>
              <Link href="/Issues/new">New Issue</Link>
            </Button>
          </Flex>
  )
}

export default issueactions;