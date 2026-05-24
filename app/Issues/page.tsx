import { Button, Table } from "@radix-ui/themes";
import Link from "../components/Link";
import prisma from '@/prisma/client';
import IssueStatusBadge from "../components/IssueStatusBadge";
import delay from "delay"
import IssueActions from "./issueactions";
import { Status } from "@prisma/client";


// searchParams must be typed as a Promise in Next.js 15
interface props {
  searchParams: Promise<{ status: Status }>
}


const IssuesPage = async ({ searchParams }: props) => {

  // must await searchParams before accessing its properties
  const { status } = await searchParams;

  // Object.values(Status) gives ["OPEN", "IN_PROGRESS", "CLOSED"]
  // if the status from URL is not one of these valid enum values (e.g. "ALL" or undefined),
  // we set it to undefined — which tells Prisma to skip the filter and fetch ALL issues
  const validatedStatus = Object.values(Status).includes(status)
    ? status       // valid enum value → use it as a filter
    : undefined;   // invalid or missing → fetch all issues


  const issues = await prisma.issue.findMany({
    where: {
    
      status: validatedStatus
    }
  });
  //  await delay(1200)

  return (
    <div>

      <IssueActions />

      <Table.Root variant="surface">

        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issues</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Created</Table.ColumnHeaderCell>
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
// 🧠 Why is this needed?
// =====================================================
// By default, Next.js tries to optimize pages by caching them
// (Static Rendering) if it thinks the data doesn't change often.

// But in this page:
// → We are fetching data from the database (prisma.issue.findMany())
// → Issues can change anytime (new issues, updates, deletes)

// So we FORCE Next.js to:
// ❌ NOT cache the page
// ❌ NOT use static generation
// ✅ ALWAYS fetch fresh data from the database

// =====================================================
// 🎯 In simple words:
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