"use client"

import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const DeleteButton = ({ issueId }: { issueId: number }) => {

    const router = useRouter();
    const [error, seterror] = useState(false);
    const deleteissue = async () => {
        try {
            // simulating an error to test the error dialog
            // throw new Error() forces execution to jump to catch block immediately
            // comment this out when testing real deletion
            throw new Error();

            await axios.delete("/api/issues/" + issueId)
            router.push("/Issues")
            router.refresh();

        } catch (error) {
            seterror(true)
        }
    }  
    return (
        <>
            {/* ── CONFIRMATION DIALOG ── */}
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
                            <Button color="red" onClick={deleteissue}> Delete Issue </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>


        
            {/* and open={error} immediately makes this dialog visible               */}
            <AlertDialog.Root open={error}>
                <AlertDialog.Content>
                    <AlertDialog.Title> Error </AlertDialog.Title>
                    <AlertDialog.Description>This Could Not be Deleted</AlertDialog.Description>

                    {/* clicking OK resets error to false, which closes this dialog */}
                    <Button color="gray" mt="2" variant='soft' onClick={() => { seterror(false) }}> OK </Button>
                </AlertDialog.Content>
            </AlertDialog.Root>

        </>
    )
}

export default DeleteButton;


// ─────────────────────────────────────────────────────────────────────────────
// ALERTDIALOG — HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
// AlertDialog is a Radix UI component for confirmation/alert popups
// It has two modes:
//
// 1. UNCONTROLLED (no open prop) — Radix manages open/close state internally
//    <AlertDialog.Root>                        → root wrapper, holds state
//      <AlertDialog.Trigger>                   → clicking this opens the dialog
//      <AlertDialog.Content>                   → the popup content
//        <AlertDialog.Title>                   → heading inside the popup
//        <AlertDialog.Description>             → body text inside the popup
//        <AlertDialog.Cancel>                  → wraps a button that closes dialog without action
//        <AlertDialog.Action>                  → wraps a button that confirms the action
//
// 2. CONTROLLED (with open prop) — you manage open/close state yourself via useState
//    <AlertDialog.Root open={error}>           → open is tied to a state variable
//    dialog opens when error=true              → triggered by seterror(true) in catch
//    dialog closes when error=false            → triggered by seterror(false) on OK click
//    no Trigger needed in controlled mode      → you control it programmatically
//
// ─────────────────────────────────────────────────────────────────────────────
// AXIOS — AVAILABLE METHODS
// ─────────────────────────────────────────────────────────────────────────────
// axios.get("/api/issues")              → fetch all issues
// axios.post("/api/issues", data)       → create a new issue
// axios.put("/api/issues/"+id, data)    → replace entire issue
// axios.patch("/api/issues/"+id, data)  → update part of an issue
// axios.delete("/api/issues/"+id)       → delete an issue  ← used here
//
// the URL "/api/issues/"+issueId resolves to e.g. "/api/issues/5"
// which maps to the DELETE handler in app/api/issues/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────