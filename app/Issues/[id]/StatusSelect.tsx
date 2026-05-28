"use client"

import { Issue, Status } from '@prisma/client';
import { Select } from '@radix-ui/themes'
import axios from 'axios';
import React from 'react'
import { useSession } from 'next-auth/react';
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const changeStatus = async (newStatus: Status) => {
    try {
      await axios.patch("/api/issues/" + issue.id, {
        status: newStatus
      });
      toast.success("Status updated successfully");
      router.refresh();
    } catch {
      toast.error("Changes could not be made");
    }
  }

  const statuses: { label: string; value: Status }[] = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  return (
    <>
      <Select.Root
        disabled={!isAdmin}
        defaultValue={issue.status}
        onValueChange={changeStatus}
      >
        <Select.Trigger placeholder="Change status..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Status</Select.Label>
            {statuses.map(status => (
              <Select.Item key={status.value} value={status.value}>
                {status.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  )
}

export default StatusSelect;
