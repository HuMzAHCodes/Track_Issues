import { Button, Table } from "@radix-ui/themes";
import Link from "../components/Link";
import prisma from '@/prisma/client';
import IssueStatusBadge from "../components/IssueStatusBadge";
import IssueActions from "./issueactions";
import { Issue, Status } from "@prisma/client";
import Pagination from "../components/Pagination";
import IssueTable, { columnNames, issueQuery } from "./IssueTable";


interface props {
  searchParams: Promise<issueQuery>  //  Promise<issueQuery> not Promise<{issueQuery}>
}

const IssuesPage = async ({ searchParams }: props) => {

  const params = await searchParams;
  const { status, orderBy } = params;

  
  const validatedStatus = Object.values(Status).includes(status)
    ? status
    : undefined;



  const orderby = columnNames.includes(orderBy)
    ? { [orderBy]: "asc" }
    : undefined;

  


  const page = parseInt(params.page || '1');
  const pagesize = 10;

  
  const issues = await prisma.issue.findMany({
    where: { status: validatedStatus },
    orderBy: orderby,
    skip: (page - 1) * pagesize,
    take: pagesize
  });

  
  const issueCount = await prisma.issue.count({
    where: { status: validatedStatus }  // ✅ validatedStatus not raw status
  });

  return (
    <div>
      <IssueActions />

      {/* ── IssueTable ─────────────────────────────────────────────────────────
          Receives the RESOLVED params object (not the Promise) because
          IssueTable is not async and cannot await anything.
          Also receives the issues array fetched above.
      ──────────────────────────────────────────────────────────────────────── */}
      <IssueTable searchParams={params} issues={issues} />

      {/* ── Pagination ─────────────────────────────────────────────────────────
          itemCount → total matching issues (for calculating pageCount)
          pageSize  → how many per page
          currentPage → which page we're on right now
          
          When user clicks a page button, Pagination updates ?page= in the URL
          → this component re-renders → Prisma skip/take recalculates → new slice
      ──────────────────────────────────────────────────────────────────────── */}
      <Pagination
        pageSize={pagesize}
        currentPage={page}
        itemCount={issueCount}
      />
    </div>
  )
}

export default IssuesPage;

// Tells Next.js to always render this page fresh on every request.
// Required because issues change frequently (create/edit/delete),
// so cached/static HTML would show stale data.
export const dynamic = "force-dynamic"








// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
// searchParams is a Promise in Next.js 15+ — must be awaited before use.
// We use the issueQuery interface imported from IssueTable so both files
// share one definition of what the URL params look like.
// ─────────────────────────────────────────────────────────────────────────────






  // ── STEP 1: AWAIT searchParams ─────────────────────────────────────────────
  // Must await before accessing any property (Next.js 15 requirement).
  // We await ONCE and store in `params` — then use params everywhere below
  // instead of calling await searchParams multiple times.







  // ── STEP 2: VALIDATE STATUS ────────────────────────────────────────────────
  // The URL status could be anything a user types manually.
  // Object.values(Status) = ["OPEN", "IN_PROGRESS", "CLOSED"]
  // If status matches a real enum value → use it in the Prisma query.
  // If not (e.g. "ALL", "random", undefined) → use undefined → no filter applied.




  
  // ── STEP 3: VALIDATE ORDERBY ───────────────────────────────────────────────
  // columnNames = ["title", "status", "createdAt"] (from IssueTable.tsx)
  // If the URL's orderBy is one of these → build a Prisma orderBy object.
  // If not → undefined → Prisma returns results in default insertion order.
  //
  // WHY a separate const and not directly inside the query?
  // → Safety: prevents unknown field names reaching Prisma (would throw or crash)
  // → Clarity: validation logic is readable and separate from the query






  // ── STEP 4: PAGINATION MATH ────────────────────────────────────────────────
  // page  → read from URL (?page=2), default to 1 if missing
  // pagesize → how many issues to show per page (fixed constant)
  // skip  → how many records to skip in Prisma (e.g. page 3 skips 20)
  // take  → how many records to fetch (always pagesize)





  // ── STEP 5: FETCH ISSUES (paginated, filtered, sorted) ────────────────────
  // All three features work together in one Prisma query:
  //   where    → status filter (undefined = no filter = all issues)
  //   orderBy  → sort by column (undefined = no sort = insertion order)
  //   skip     → skip records from previous pages
  //   take     → return only this page's records







  // ── STEP 6: COUNT TOTAL ISSUES ────────────────────────────────────────────
  // Pagination needs to know the TOTAL number of matching issues
  // (not just this page's slice) to calculate how many pages exist.
  // Uses validatedStatus so the count matches the filter applied above.