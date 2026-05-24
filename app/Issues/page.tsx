import { Button, Table } from "@radix-ui/themes";
import Link from "../components/Link";
import prisma from '@/prisma/client';
import IssueStatusBadge from "../components/IssueStatusBadge";
import delay from "delay"
import IssueActions from "./issueactions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";


const columns: {
  label: string;
  value: keyof Issue;
  className?: string
}[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "CreatedAt", value: "createdAt", className: "hidden md:table-cell" }
]


interface props {
  searchParams: Promise<{ status: Status, orderBy: keyof Issue }>
}


const IssuesPage = async ({ searchParams }: props) => {

  const { status, orderBy } = await searchParams;

  const validatedStatus = Object.values(Status).includes(status)
    ? status
    : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      status: validatedStatus
    }
  });


  return (
    <div>

      <IssueActions />

      <Table.Root variant="surface">

        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value} className={column.className}>
                <NextLink href={{ query: { status, orderBy: column.value } }}>
                  {column.label}
                </NextLink>
                {column.value === orderBy && <ArrowUpIcon className="inline" />}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>

              <Table.Cell>
                <Link href={`/Issues/${issue.id}`}>{issue.title}</Link>

                {/* On mobile, show status badge below the title */}
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>

              {/* On desktop, show status and date in separate columns */}
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

    </div>
  )
}

export const dynamic = "force-dynamic"
export default IssuesPage;


// =====================================================
// 📌 What does dynamic = "force-dynamic" do?
// =====================================================
// This tells Next.js to ALWAYS render this page dynamically
// on every request (like traditional server-side rendering).

// =====================================================
//  Why is this needed?
// =====================================================
// By default, Next.js tries to optimize pages by caching them
// (Static Rendering) if it thinks the data doesn't change often.

// But in this page:
// → We are fetching data from the database (prisma.issue.findMany())
// → Issues can change anytime (new issues, updates, deletes)

// So we FORCE Next.js to:
//  NOT cache the page
//  NOT use static generation
//  ALWAYS fetch fresh data from the database

// =====================================================
//  In simple words:
// =====================================================
// "Always show the latest data from the database,
//  don't cache this page."

// =====================================================
// ⚡ Alternative (for understanding)
// =====================================================
// dynamic = "auto"          → Next.js decides (default)
// dynamic = "force-static"  → Always cached/static
// dynamic = "force-dynamic" → Always fresh (no caching)


// ─────────────────────────────────────────────────────────────────────────────
// STATUS FILTERING LOGIC
// ─────────────────────────────────────────────────────────────────────────────
// The filter UI passes status as a URL query param e.g. /Issues?status=OPEN
// searchParams reads that value from the URL
//
// Three possible cases:
// 1. status = "OPEN" / "IN_PROGRESS" / "CLOSED"
//    → valid enum value → passed directly to Prisma → filtered results returned
//
// 2. status = "ALL"
//    → not a valid Prisma enum value → would throw PrismaClientValidationError
//    → validatedStatus converts it to undefined → Prisma returns all issues
//
// 3. status = undefined (no query param in URL)
//    → Object.values(Status).includes(undefined) = false
//    → validatedStatus = undefined → Prisma returns all issues
//
// Object.values(Status) → ["OPEN", "IN_PROGRESS", "CLOSED"]
// .includes(status)     → checks if the URL value is a real enum member
// ─────────────────────────────────────────────────────────────────────────────


// ask why we set query as OBJECT , not string
// => something like the filter gets replaced by the column filter


// ─────────────────────────────────────────────────────────────────────────────
// COLUMNS ARRAY — { label, value, className? }
// ─────────────────────────────────────────────────────────────────────────────
// columns is an array of objects that drives BOTH the table headers AND the sorting
// instead of hardcoding three separate <Table.ColumnHeaderCell> blocks,
// we define the data once and map over it — cleaner and easier to maintain
//
// each object has three properties:
//
// label  → the TEXT shown to the user in the column header
//          e.g. "Issue", "Status", "CreatedAt"
//          this is purely for display — has no connection to the database
//
// value  → the ACTUAL field name on the Issue model in the database
//          typed as keyof Issue — so TypeScript only allows real Issue fields
//          e.g. "title", "status", "createdAt"
//          this is used in TWO ways:
//          1. as the orderBy query param in the URL when the column is clicked
//             → clicking "Status" header → URL becomes ?orderBy=status
//             → Prisma uses this to sort results by that field
//          2. as the key prop in .map() to uniquely identify each column
//
// className? → optional Tailwind classes for responsive visibility
//              "hidden md:table-cell" → hide on mobile, show on desktop
//              the first column (Issue/title) has no className
//              so it always shows on all screen sizes
//
// keyof Issue — WHY THIS TYPE?
// keyof Issue is a TypeScript utility that produces a union of all
// field names on the Prisma Issue model:
// "id" | "title" | "description" | "createdAt" | "updatedAt" | "status" |
// "userId" | "assignedToUserId"
// this means if you type value: "titlee" (typo), TypeScript throws an error
// it guarantees the value is always a real database field — not a random string
//
// ─────────────────────────────────────────────────────────────────────────────
// SORTING FLOW — HOW THE ARROW AND ORDERBY WORK TOGETHER
// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — user clicks a column header link
//           <NextLink href={{ query: { status, orderBy: column.value } }}>
//           → URL becomes e.g. /Issues?status=OPEN&orderBy=status
//           status is preserved so the filter doesn't reset when sorting
//
// Step 2 — page re-renders, searchParams reads orderBy from the URL
//           const { status, orderBy } = await searchParams;
//
// Step 3 — ArrowUpIcon appears on the active column
//           {column.value === orderBy && <ArrowUpIcon className="inline" />}
//           → checks if THIS column's value matches the orderBy in the URL
//           → only the active sort column shows the arrow
//
// Step 4 — (to be implemented) Prisma uses orderBy to sort results
//           prisma.issue.findMany({ orderBy: { [orderBy]: "asc" } })
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY QUERY IS AN OBJECT NOT A STRING
// ─────────────────────────────────────────────────────────────────────────────
// <NextLink href={{ query: { status, orderBy: column.value } }}>
//
// query must be an OBJECT because we need to preserve MULTIPLE params at once
// if we used a plain string like href={`?orderBy=${column.value}`}:
//   → clicking a column when status=OPEN is active would produce ?orderBy=title
//   → the status filter would be LOST from the URL entirely
//
// using an object:
//   → { status: "OPEN", orderBy: "title" } → ?status=OPEN&orderBy=title
//   → both params are preserved together in the URL
//   → Next.js automatically serializes the object into a query string
// ─────────────────────────────────────────────────────────────────────────────