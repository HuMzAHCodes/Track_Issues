"use client"


import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

const DeleteButton = ({ issueId }: { issueId: number }) => {
    const router=useRouter();
    return (

        <AlertDialog.Root>
            <AlertDialog.Trigger> 
                 <Button color="red"> Delete Issue </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Title>
                    Conifrm Deletion
                </AlertDialog.Title>
                <AlertDialog.Description>
                    Are you sure you want to perfomr this ACTION??
                </AlertDialog.Description>

                 <Flex gap="3" mt="4">

                 <AlertDialog.Cancel>
                 <Button variant="soft" color="gray" > Cancel </Button>
                 </AlertDialog.Cancel>

                 <AlertDialog.Action>
                    <Button  onClick={async ()=>{
                  await axios.delete("/api/issues/"+issueId)
                  router.push("/Issues")
                  router.refresh();
                    }}color="red"> Delete Issue </Button>


                 </AlertDialog.Action>

                  </Flex>


            </AlertDialog.Content>

           
        </AlertDialog.Root>
        
    )
}

export default DeleteButton;