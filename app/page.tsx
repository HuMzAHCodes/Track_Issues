import prisma from '@/prisma/client';
import IssueSummary from './IssueSummary';
import HeroSection from './HeroSection';
import IssueChart from './IssueChart';
import LatestIssues from './LatestIssues';
import { Flex, Grid } from '@radix-ui/themes';
import { Metadata } from 'next';

export default async function Home() {

  const open = await prisma.issue.count({
    where: { status: 'OPEN' },
  });
  const inProgress = await prisma.issue.count({
    where: { status: 'IN_PROGRESS' },
  });
  const closed = await prisma.issue.count({
    where: { status: 'CLOSED' },
  });

  // single object containing all three counts
  // passed to both IssueSummary and IssueChart using spread operator
  // so we don't repeat the same three props twice
  const issueCounts = { open, inProgress, closed };

  return (
    <Flex direction="column" gap="5">
      <Grid columns={{ initial: '1', md: '2' }} gap="5">
        <Flex direction="column" gap="5">
          <IssueSummary {...issueCounts} />
          <IssueChart {...issueCounts} />
        </Flex>
        <HeroSection />
      </Grid>
      <LatestIssues />
    </Flex>
  );
}

export const dynamic = 'force-dynamic';





export const metadata: Metadata = {
  title: 'Issue Tracker - Dashboard',
  description: 'View a summary of project issues',

  // Open Graph — controls preview when shared on Facebook, LinkedIn, WhatsApp etc.
  openGraph: {
    title: 'Issue Tracker - Dashboard',
    description: 'View a summary of project issues',
  },

  // Twitter Card — controls preview when shared on Twitter/X
  twitter: {
    card: 'summary',
    title: 'Issue Tracker - Dashboard',
    description: 'View a summary of project issues',
  }
};




// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
// This is the dashboard home page — the first thing users see after logging in.
// It is an async Server Component — data is fetched on the server before
// the page is sent to the browser. No loading states needed for the counts.
//
// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────
// Three separate prisma.issue.count() calls run in sequence:
// open       → counts all issues with status OPEN
// inProgress → counts all issues with status IN_PROGRESS
// closed     → counts all issues with status CLOSED
//
// these are intentionally separate calls (not one findMany + manual count)
// because count() is more efficient — it runs a single SQL COUNT query
// per status rather than fetching all issue records into memory
//
// ─────────────────────────────────────────────────────────────────────────────
// issueCounts — THE SHARED PROPS OBJECT
// ─────────────────────────────────────────────────────────────────────────────
// both IssueSummary and IssueChart accept the same three props:
// { open, inProgress, closed }
//
// instead of writing them out twice:
//  <IssueSummary open={open} inProgress={inProgress} closed={closed} />
// <IssueChart   open={open} inProgress={inProgress} closed={closed} />
//
// we collect them into one object and spread it into both components:
//  const issueCounts = { open, inProgress, closed }
//  <IssueSummary {...issueCounts} />
//  <IssueChart   {...issueCounts} />
//
// the spread operator {...issueCounts} is equivalent to writing each
// prop individually — TypeScript still type-checks everything correctly
//
// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
// Grid columns={{ initial:"1", md:"2" }}
//   → single column on mobile, two columns on desktop
//
// Left column (Flex direction="column" gap="5"):
//   → IssueSummary — three stat cards (open / in-progress / closed counts)
//   → IssueChart   — bar chart visualizing the same counts
//
// Right column:
//   → LatestIssues — list of the most recently created issues
//
// ─────────────────────────────────────────────────────────────────────────────
// dynamic = "force-dynamic"
// ─────────────────────────────────────────────────────────────────────────────
// forces Next.js to always fetch fresh data on every request
// without this, Next.js might cache the page and show stale counts
// after issues are created, updated, or deleted
//
