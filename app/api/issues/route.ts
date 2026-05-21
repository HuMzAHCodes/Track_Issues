import { NextRequest, NextResponse } from "next/server";
import prisma from"@/prisma/client"
import { issueschema } from "../../validationschemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";


// we have schema to validate the body of request




export  async function PUT (request:NextRequest){

    const session=await getServerSession(authOptions);
    if(!session)
        return NextResponse.json({},{status:401})
    const body= await request.json();

    
    const validation=issueschema.safeParse(body)

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

