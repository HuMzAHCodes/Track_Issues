"use client"
import React from 'react'
import { TextArea, TextField ,Button} from '@radix-ui/themes'

const page = () => {
  return (
    <div className="w-1/2 space-y-3 border-2 border-black p-4">
      <TextField.Root placeholder="Title" />
      <TextArea placeholder="Description" />
      <Button> Submit New Issue </Button>
    </div>
  )
}

export default page;