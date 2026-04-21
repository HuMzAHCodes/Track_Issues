import { Button } from '@radix-ui/themes/components/button'
import Link from 'next/link'
import React from 'react'

const issueactions = () => {
  return (
     
          <div className="mb-5">
            <Button>
              <Link href="/issues/new">New Issue</Link>
            </Button>
          </div>
  )
}

export default issueactions;