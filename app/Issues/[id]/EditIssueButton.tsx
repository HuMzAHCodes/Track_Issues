"use client"

import { Button } from '@radix-ui/themes'
import NextLink from 'next/link'

import {Pencil2Icon} from "@radix-ui/react-icons"
import React from 'react'

const EditIssueButton = ({issueId}:{issueId:number}) => {
  return (
     <Button asChild>
          
          <NextLink href={`/Issues/${issueId}/edit`}>
           <Pencil2Icon/>
            Edit Issue
          </NextLink>
        </Button>
  )
}

export default EditIssueButton