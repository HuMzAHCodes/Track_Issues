"use client"

import { TextField, Button, Callout, Text } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { useForm, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { createissueschema } from '@/app/validationschemas'
import { z } from "zod"
import ErrorMessage from '@/app/components/ErrorMessage'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Issue } from '@prisma/client'


// Disable SSR for SimpleMDE since it doesn't support server-side rendering
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  // loading: () => <Skeleton height="20rem" />
})


// Automatically infer the TypeScript type from the Zod schema
// This way we don't need to manually define the interface — schema and type stay in sync
type IssueFormData = z.infer<typeof createissueschema>



const IssueForm = ({issue}:{issue:Issue}) => {

  const {
    register,            // Connects inputs to react-hook-form so it tracks their values
    control,             // Used for custom/third-party inputs that can't use register directly
    handleSubmit,        // Validates form then runs your submit function with the collected data
    formState: { errors } // Contains validation errors for each field, populated by zodResolver
  } = useForm<IssueFormData>({
    // zodResolver connects our Zod schema to react-hook-form for automatic validation
    resolver: zodResolver(createissueschema)
  })

  // useRouter allows programmatic navigation — used here to redirect after form submission
  const router = useRouter()

  // Stores a generic error message to display when the API call fails
  const [error, seterror] = useState("")


  const onsubmit = handleSubmit(async (data) => {
    try {
      // Send form data to our API route via PUT request
      await axios.put('/api/issues', data)

      // After successful submission, redirect user to the Issues list page
      router.push('/Issues')
    } catch (error) {
      // If API call fails, show a generic error message to the user
      seterror("A generic Error Occured")
      console.log(error)
    }
  })


  return (
    <div className="w-1/2 space-y-3 border-2 border-black p-4">

      {/* Show error callout only if a server/API error occurred */}
      {error && (
        <Callout.Root color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onsubmit} className="space-y-4">

        {/* Title input — tracked and validated by react-hook-form */}
        <TextField.Root
        defaultValue={issue?.title}
          placeholder="Title"
          {...register("title")}
        />

        

        {/* Show title validation error if it exists */}
        <ErrorMessage>
          <Text>{errors.title?.message}</Text>
        </ErrorMessage>

        {/* Controller wraps SimpleMDE since it's a custom component, not a native input */}
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />

        {/* Show description validation error if it exists */}
        <ErrorMessage>
          <Text>{errors.description?.message}</Text>
        </ErrorMessage>

        <Button>Submit New Issue</Button>

      </form>

    </div>
  )
}

export default IssueForm