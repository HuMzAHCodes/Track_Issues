import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import prisma from"@/prisma/client"


 const createissueschema=z.object({
    title:z.string().min(1).max(255),
    description:z.string().min(1)
})

// we have schema to validate the bosy of request




export  async function PUT (request:NextRequest){
    const body= await request.json();
    const validation=createissueschema.safeParse(body)

    if(!validation.success){
        return NextResponse.json(validation.error.errors,{status:400})
    }

    // now if a valid issue , store this in DATABASE via PRISMA CLIENT
  
     const newissue=await prisma.issue.create( { data:{title:body.title,
            description:body.description
        }}
        
    ) 

    return NextResponse.json(newissue,{status:201})
    
}

