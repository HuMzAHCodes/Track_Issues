import { Table } from '@radix-ui/themes'
import React from 'react'
import NextLink from "next/link";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import IssueStatusBadge from '../components/IssueStatusBadge';
import Link from '../components/Link';


export interface issueQuery {
  status: Status;
  orderBy: keyof Issue;
  page?: string;
}


interface props {
  searchParams: issueQuery;  // already resolved object, not Promise<issueQuery>
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: props) => {

  // Destructure the two values we need from the resolved searchParams object
  // status  → to preserve the active filter when a column header is clicked
  // orderBy → to know which column header should show the ArrowUpIcon
  const { status, orderBy } = searchParams;

  return (
    <Table.Root variant="surface">

      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell key={column.value} className={column.className}>

              {/* ── COLUMN HEADER LINK ──────────────────────────────────────
                  Clicking a column header navigates to a new URL with
                  orderBy set to that column's field name.

                  query is an OBJECT (not a string) so that both params
                  are included together in the URL:
                    { status: "OPEN", orderBy: "title" }
                    → ?status=OPEN&orderBy=title

                  If we used a plain string like ?orderBy=title, the
                  status filter would be wiped from the URL on every click.
              ────────────────────────────────────────────────────────────── */}
              <NextLink href={{ query: { status, orderBy: column.value } }}>
                {column.label}
              </NextLink>

              {/* ── SORT ARROW ───────────────────────────────────────────────
                  Only shows on the column that is currently active.
                  Compares this column's field name against the orderBy
                  value from the URL — if they match, render the arrow.
              ────────────────────────────────────────────────────────────── */}
              {column.value === orderBy && <ArrowUpIcon className="inline" />}

            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id}>

            <Table.Cell>
              {/* Clickable title that navigates to the issue detail page */}
              <Link href={`/Issues/${issue.id}`}>{issue.title}</Link>

              {/* On mobile: status badge appears below the title in the same cell
                  because the Status column is hidden on small screens          */}
              <div className="block md:hidden">
                <IssueStatusBadge status={issue.status} />
              </div>
            </Table.Cell>

            {/* On desktop: status and date each get their own column */}
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>

            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>

          </Table.Row>
        ))}
      </Table.Body>

    </Table.Root>
  )
}

export default IssueTable;



const columns: {
  label: string;
  value: keyof Issue;
  className?: string;
}[] = [
  { label: 'Issue', value: 'title' },
  { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
  { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
];


export const columnNames = columns.map(column => column.value);















// ─────────────────────────────────────────────────────────────────────────────
// issueQuery — SHARED TYPE FOR URL QUERY PARAMS
// ─────────────────────────────────────────────────────────────────────────────
// This interface is exported so both IssueTable AND page.tsx
// can share the same type for what the URL query params look like.
// Instead of each file defining its own shape, one source of truth lives here.
//
// status   → which filter is active (OPEN / IN_PROGRESS / CLOSED)
// orderBy  → which column to sort by (title / status / createdAt)
// page     → which page of results to show (optional — defaults to "1")
// ─────────────────────────────────────────────────────────────────────────────




// ─────────────────────────────────────────────────────────────────────────────
// Props — WHAT PAGE.TSX MUST PASS INTO THIS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// searchParams → the ALREADY AWAITED query params object (NOT a Promise)
//               page.tsx awaits searchParams first, then passes the result here
//               IssueTable is not async so it can't await anything itself
//
// issues       → the array of Issue records fetched from the database
//               page.tsx runs the Prisma query and passes results down
//               IssueTable only DISPLAYS data, it never fetches it
// ─────────────────────────────────────────────────────────────────────────────





// ─────────────────────────────────────────────────────────────────────────────
// columns — THE TABLE COLUMN DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
// Defined here (not in page.tsx) because IssueTable owns the table UI.
// Drives both the rendered headers AND the sort/arrow logic.
//
// label     → display text shown to the user
// value     → actual Prisma field name on the Issue model
//             typed as keyof Issue so TypeScript catches any typos
// className → optional responsive visibility classes
//             "hidden md:table-cell" = hidden on mobile, visible on desktop
// ─────────────────────────────────────────────────────────────────────────────





// ─────────────────────────────────────────────────────────────────────────────
// columnNames — EXPORTED LIST OF VALID SORT FIELD NAMES
// ─────────────────────────────────────────────────────────────────────────────
// ["title", "status", "createdAt"]
//
// Exported and used in page.tsx as the VALIDATION GATE for orderBy:
//   columnNames.includes(orderBy) → is the URL's orderBy a real column?
//   If yes → safe to pass to Prisma. If no → use undefined (no sorting).
//
// This keeps validation in page.tsx while the column definitions
// stay here where they belong — no duplication.
// ─────────────────────────────────────────────────────────────────────────────