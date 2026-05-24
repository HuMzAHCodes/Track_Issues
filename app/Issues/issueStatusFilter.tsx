"use client"

import { Status } from '@prisma/client'
import { Select } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import React from 'react'

const IssueStatusFilter = () => {

  const router = useRouter();

  const statuses: { label: string; value?: Status }[] = [
    { label: 'All' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  return (
    <Select.Root onValueChange={(Status) => {
      const query = Status ? `?status=${Status}` : "";
      router.push("/Issues/" + query)
    }}>
      <Select.Trigger placeholder='filter by status ...' />
      <Select.Content>
        {statuses.map((status) => (
          //  key={status.value} — undefined for "All" item, React throws warning
          //  key={status.label} — always defined, unique for each item
          <Select.Item key={status.label} value={status.value || "ALL"}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

export default IssueStatusFilter