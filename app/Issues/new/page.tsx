"use client"

import { TextField, Button, Callout } from '@radix-ui/themes'
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Disable SSR for SimpleMDE since it doesn't support server-side rendering
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

interface IssueForm {
  title: string;
  description: string;
}

const page = () => {

  const { 
    register,     // Connects inputs to react-hook-form so it tracks their values
    control,      // Used for custom/third-party inputs that can't use register directly
    handleSubmit  // Validates form then runs your submit function with the collected data
  } = useForm<IssueForm>();

  // useRouter allows programmatic navigation — used here to redirect after form submission
  const router = useRouter();

  const[error,seterror]=useState("");

  return (

    <div className="w-1/2 space-y-3 border-2 border-black p-4" >

      {error && <Callout.Root color="red"> 
        
         <Callout.Text>
	      {error}
        	</Callout.Text>
        
        </Callout.Root>}
    <form 
      
      onSubmit={handleSubmit(async (data) => { 

        try {
           // Send form data to our API route via PUT request
        await axios.put('/api/issues', data) 

        // After successful submission, redirect user to the Issues list page
        router.push('/Issues')
        } catch (error) {
          
           seterror("A generic Error Occured")
           console.log(error)
        }

       
      })}
    >
      
      {/* TextField.Input removed in newer radix — use TextField.Root directly */}
      <TextField.Root 
        placeholder="Title" 
        {...register("title")} 
      />

      {/* Controller wraps SimpleMDE since it's a custom component, not a native input */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />

      <Button>Submit New Issue</Button>

    </form>

    </div>
  )
}

export default page;