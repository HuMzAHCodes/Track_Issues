import { NextRequest, NextResponse } from "next/server";
import prisma from"@/prisma/client"
import { createissueschema } from "../../validationschemas";


// we have schema to validate the body of request




export  async function PUT (request:NextRequest){
    const body= await request.json();
    const validation=createissueschema.safeParse(body)

    if(!validation.success){
        return NextResponse.json(validation.error.format(),{status:400})
    }

    // now if a valid issue , store this in DATABASE via PRISMA CLIENT
  
     const newissue=await prisma.issue.create( { data:{title:body.title,
            description:body.description
        }}
        
    ) 

    return NextResponse.json(newissue,{status:201})
    
}

