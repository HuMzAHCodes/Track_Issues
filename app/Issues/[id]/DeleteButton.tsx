"use client"

import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

const DeleteButton = ({ issueId }: { issueId: number }) => {

    const router = useRouter();

    return (

        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button color="red"> Delete Issue </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
                <AlertDialog.Title>
                    Confirm Deletion
                </AlertDialog.Title>
                <AlertDialog.Description>
                    Are you sure you want to perform this ACTION??
                </AlertDialog.Description>

                <Flex gap="3" mt="4">

                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray"> Cancel </Button>
                    </AlertDialog.Cancel>

                    <AlertDialog.Action>
                        <Button color="red" onClick={async () => {

                            // axios.delete() sends an HTTP DELETE request to our API route
                            // equivalent to: fetch("/api/issues/"+issueId, { method: "DELETE" })
                            // but axios is shorter, handles errors better, and auto-parses JSON
                            //
                            // other axios methods available:
                            // axios.get("/api/issues")              → fetch all issues
                            // axios.post("/api/issues", data)       → create a new issue
                            // axios.put("/api/issues/"+id, data)    → replace entire issue
                            // axios.patch("/api/issues/"+id, data)  → update part of an issue
                            // axios.delete("/api/issues/"+id)       → delete an issue  ← we are here
                            //
                            // the URL "/api/issues/"+issueId resolves to e.g. "/api/issues/5"
                            // which maps to our DELETE handler in app/api/issues/[id]/route.ts
                            await axios.delete("/api/issues/" + issueId)

                            // after deletion, redirect user back to the issues list
                            router.push("/Issues")

                            // refresh the page data so the deleted issue disappears from the list
                            // without this, Next.js cache would still show the old data
                            router.refresh();

                        }}> Delete Issue </Button>
                    </AlertDialog.Action>

                </Flex>

            </AlertDialog.Content>

        </AlertDialog.Root>

    )
}

export default DeleteButton;