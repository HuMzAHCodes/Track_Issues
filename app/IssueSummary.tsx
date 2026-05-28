import { Status } from '@prisma/client';
import { Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const containers: {
    label: string;
    value: number;
    status: Status;
  }[] = [
    { label: 'Open Issues', value: open, status: 'OPEN' },
    {
      label: 'In-progress Issues',
      value: inProgress,
      status: 'IN_PROGRESS',
    },
    { label: 'Closed Issues', value: closed, status: 'CLOSED' },
  ];

  return (
    <Flex gap="4">
      {containers.map((container) => (
        <Card key={container.label}>
          <Flex direction="column" gap="1">
            <Link
              className='text-sm font-medium'
              href={`/Issues/?status=${container.status}`}
            >
              {container.label}
            </Link>
            <Text size="5" className='font-bold'>{container.value}</Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;


// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS COMPONENT DOES
// ─────────────────────────────────────────────────────────────────────────────
// IssueSummary is a dashboard widget that displays three stat cards —
// one per issue status — showing how many issues exist in each category.
// Each card is clickable and navigates to the issues list filtered by
// that specific status.
//
// ─────────────────────────────────────────────────────────────────────────────
// HOW DATA FLOWS INTO THIS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// This component is purely a display component — it does NOT fetch data itself.
// The parent (dashboard page.tsx) fetches the counts from the database:
//
// const open       = await prisma.issue.count({ where: { status: "OPEN" } })
// const inProgress = await prisma.issue.count({ where: { status: "IN_PROGRESS" } })
// const closed     = await prisma.issue.count({ where: { status: "CLOSED" } })
//
// then passes them down as props:
// <IssueSummary open={open} inProgress={inProgress} closed={closed} />
//
// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────
// open       → number — count of OPEN issues from the database
// inProgress → number — count of IN_PROGRESS issues from the database
// closed     → number — count of CLOSED issues from the database
//
// ─────────────────────────────────────────────────────────────────────────────
// CONTAINERS ARRAY — WHY AN ARRAY INSTEAD OF THREE HARDCODED CARDS
// ─────────────────────────────────────────────────────────────────────────────
// instead of writing three separate <Card> blocks manually, we define one
// array of objects and .map() over it — this is cleaner and easier to maintain
// adding a new status card only requires adding one object to the array
//
// each object has three properties:
//
// label  → string shown as the card heading e.g. "Open Issues"
//          purely for display — not connected to the database
//
// value  → the actual count number displayed on the card
//          comes directly from the props (open, inProgress, closed)
//
// status → typed as Status (Prisma enum from @prisma/client)
//          Status can only be "OPEN" | "IN_PROGRESS" | "CLOSED"
//          TypeScript enforces this — you cannot put a random string here
//          used to build the filter URL for the Link
//
// ─────────────────────────────────────────────────────────────────────────────
// CLICK-TO-FILTER BEHAVIOUR
// ─────────────────────────────────────────────────────────────────────────────
// each card label is wrapped in a Next.js Link:
// href={`/Issues/?status=${container.status}`}
//
// clicking "Open Issues"       → navigates to /Issues/?status=OPEN
// clicking "In-progress Issues"→ navigates to /Issues/?status=IN_PROGRESS
// clicking "Closed Issues"     → navigates to /Issues/?status=CLOSED
//
// the IssuesPage reads this status query param from searchParams,
// validates it against the Prisma Status enum, and passes it to
// prisma.issue.findMany({ where: { status: validatedStatus } })
// so the issues list immediately shows only issues of that status
//
// this creates a direct connection between the dashboard summary
// and the filtered issues list — one click from count to details
//
