'use client';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = Math.ceil(itemCount / pageSize);
  if (pageCount <= 1) return null;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push('?' + params.toString());
  }

  return (
    <Flex align="center" gap="2">
      <Text size="2">
        Page {currentPage} of {pageCount}
      </Text>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
      >
        <ChevronRightIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === pageCount}
        onClick={() => changePage(pageCount)}
      >
        <DoubleArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;

/*
  =============================================================
  WHAT IS THIS COMPONENT?
  =============================================================

  A reusable pagination bar. It renders four navigation buttons
  and a "Page X of Y" label. It does NOT fetch data itself —
  it just updates the URL, which causes the parent server
  component (IssuesPage) to re-render with the correct page.

  =============================================================
  PROPS — WHAT THE PARENT MUST PASS IN
  =============================================================

  itemCount   → total number of items in the database
                e.g. 53 issues total
                used to calculate how many pages exist

  pageSize    → how many items to show per page
                e.g. 10 items per page
                defined as a constant in the parent, not by the user

  currentPage → which page the user is currently on
                read from the URL's ?page= param in the parent
                and passed down here for display and button logic

  =============================================================
  pageCount — THE CORE CALCULATION
  =============================================================

    const pageCount = Math.ceil(itemCount / pageSize);

  Divides total items by items-per-page to get number of pages.
  Math.ceil() rounds UP because a partial page still counts as a page.

  Examples:
    50 items / 10 per page = 5.0  → Math.ceil(5.0)  = 5 pages
    53 items / 10 per page = 5.3  → Math.ceil(5.3)  = 6 pages  ← rounds up
    10 items / 10 per page = 1.0  → Math.ceil(1.0)  = 1 page

  =============================================================
  EARLY RETURN — if (pageCount <= 1) return null
  =============================================================

  If all items fit on one page, there's nothing to paginate.
  Returning null means the component renders nothing at all.
  No empty pagination bar, no broken UI — just invisible.

  =============================================================
  useRouter and useSearchParams
  =============================================================

  useRouter       → gives us router.push() to navigate to a new
                    URL without a full browser reload

  useSearchParams → reads ALL current query params from the URL
                    so we can PRESERVE them when changing the page

                    This is the same pattern as IssueStatusFilter:
                    when the user is on ?status=OPEN&orderBy=createdAt
                    and clicks page 2, we don't want to lose the
                    filter and sort — we carry them forward.

  =============================================================
  changePage — THE NAVIGATION FUNCTION
  =============================================================

    const changePage = (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push('?' + params.toString());
    }

  STEP 1 — new URLSearchParams(searchParams)
    Creates a COPY of all current URL params.
    e.g. if URL is ?status=OPEN&orderBy=createdAt
    params now contains { status: "OPEN", orderBy: "createdAt" }

    Why copy instead of starting fresh?
    → Starting fresh (new URLSearchParams()) would wipe status and
      orderBy — the user's filter and sort would reset on every
      page change. Copying preserves everything.

  STEP 2 — params.set('page', page.toString())
    .set() adds the param if it doesn't exist, or OVERWRITES it
    if it already does. So clicking page 3 when on page 2 just
    updates page from 2 to 3 — doesn't duplicate it.

    page is a number so .toString() converts it to a string
    because URL params are always strings.

  STEP 3 — router.push('?' + params.toString())
    params.toString() serializes the object back to a query string:
    e.g. { status: "OPEN", orderBy: "createdAt", page: "3" }
         → "status=OPEN&orderBy=createdAt&page=3"

    Prepending '?' gives: ?status=OPEN&orderBy=createdAt&page=3

    router.push() navigates to that URL → Next.js re-renders
    IssuesPage on the server with the new page number → Prisma
    queries with SKIP and TAKE to return the correct slice of data.

  =============================================================
  THE FOUR BUTTONS — WHAT EACH ONE DOES
  =============================================================

  DoubleArrowLeft  ⏮  → jump to page 1 (first page)
                         disabled when already on page 1

  ChevronLeft      ◀  → go to currentPage - 1 (previous page)
                         disabled when already on page 1

  ChevronRight     ▶  → go to currentPage + 1 (next page)
                         disabled when already on the last page

  DoubleArrowRight ⏭  → jump to pageCount (last page)
                         disabled when already on the last page

  disabled={currentPage === 1}         → prevents going before page 1
  disabled={currentPage === pageCount} → prevents going past last page

  When disabled, Radix UI grays out the button and blocks clicks
  automatically — no extra logic needed.

  =============================================================
  HOW IT CONNECTS TO IssuesPage (the parent)
  =============================================================

  IssuesPage reads ?page= from the URL and passes it down:

    const currentPage = parseInt(searchParams.get('page') || '1')
    const issues = await prisma.issue.findMany({
      skip: (currentPage - 1) * pageSize,   ← skip previous pages
      take: pageSize,                         ← take only this page's items
    })

    <Pagination
      itemCount={issueCount}
      pageSize={PAGE_SIZE}
      currentPage={currentPage}
    />

  Pagination changes the URL → IssuesPage re-renders → Prisma
  returns a different slice of data → table updates.
  The component itself never touches the database directly.

  =============================================================
  FULL FLOW EXAMPLE
  =============================================================

  Setup: 53 issues, 10 per page, user is on page 1

  pageCount = Math.ceil(53 / 10) = 6
  Display: "Page 1 of 6"
  ⏮ disabled, ◀ disabled, ▶ enabled, ⏭ enabled

  User clicks ▶ (next page):
    changePage(2) is called
    params = { page: "2" }  (+ any existing status/orderBy)
    router.push(?page=2)
    IssuesPage re-renders
    Prisma: skip=10, take=10 → issues 11 through 20
    Display: "Page 2 of 6"
    ⏮ enabled, ◀ enabled, ▶ enabled, ⏭ enabled

  User clicks ⏭ (last page):
    changePage(6) is called
    router.push(?page=6)
    Prisma: skip=50, take=10 → issues 51 through 53 (only 3)
    Display: "Page 6 of 6"
    ⏮ enabled, ◀ enabled, ▶ disabled, ⏭ disabled
  =============================================================
*/