"use client"
import React from 'react'
import {  TextField ,Button} from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const page = () => {
  return (
    <div className="w-1/2 space-y-3 border-2 border-black p-4">
      <TextField.Root placeholder="Title" />
      <SimpleMDE placeholder="Description" />
      <Button> Submit New Issue </Button>
    </div>
  )
}

export default page;