'use client';

import { Card } from '@radix-ui/themes';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import React from 'react';

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: 'Open', value: open },
    { label: 'In Progress', value: inProgress },
    { label: 'Closed', value: closed },
  ];

  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Bar
            dataKey="value"
            barSize={60}
            style={{ fill: 'var(--accent-9)' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueChart;


// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS COMPONENT DOES
// ─────────────────────────────────────────────────────────────────────────────
// IssueChart renders a bar chart on the dashboard showing the distribution
// of issues across the three statuses — Open, In Progress, and Closed.
// It is a pure display component — it receives counts as props and
// renders them visually. No data fetching happens here.
//
// ─────────────────────────────────────────────────────────────────────────────
// HOW DATA FLOWS INTO THIS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// Same pattern as IssueSummary — the parent (dashboard page.tsx) fetches
// issue counts from the database using prisma.issue.count() and passes
// them down as props:
//
// <IssueChart open={open} inProgress={inProgress} closed={closed} />
//
// ─────────────────────────────────────────────────────────────────────────────
// DATA ARRAY
// ─────────────────────────────────────────────────────────────────────────────
// Recharts expects data as an array of objects — each object represents
// one bar in the chart:
//
// { label: "Open",        value: open }        → first bar
// { label: "In Progress", value: inProgress }  → second bar
// { label: "Closed",      value: closed }      → third bar
//
// label → shown on the X axis below each bar
// value → the height of the bar (the actual issue count)
//
// ─────────────────────────────────────────────────────────────────────────────
// RECHARTS COMPONENTS — WHAT EACH ONE DOES
// ─────────────────────────────────────────────────────────────────────────────
//
// ResponsiveContainer
//   → wrapper that makes the chart fill its parent's width automatically
//   → width="100%" means it stretches to fill the Card
//   → height={300} sets a fixed pixel height for the chart area
//   → without this, Recharts charts have a fixed width and don't resize
//
// BarChart
//   → the root chart component from Recharts
//   → receives data={data} — the array defined above
//   → all child components (XAxis, YAxis, Bar) read from this data
//
// XAxis
//   → renders the horizontal axis at the bottom of the chart
//   → dataKey="label" tells Recharts to use the "label" field from
//     each data object as the text shown below each bar
//   → shows: "Open", "In Progress", "Closed"
//
// YAxis
//   → renders the vertical axis on the left side
//   → automatically scales based on the highest value in the data
//   → no dataKey needed — it reads the bar values automatically
//
// Bar
//   → renders the actual bars in the chart
//   → dataKey="value" tells Recharts to use the "value" field from
//     each data object to determine the height of each bar
//   → barSize={60} sets the width of each bar in pixels
//   → style={{ fill: 'var(--accent-9)' }} colors the bars using
//     Radix UI's CSS variable for the accent color — this means
//     the chart automatically matches the app's theme color
//     without hardcoding a hex value
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY "use client"
// ─────────────────────────────────────────────────────────────────────────────
// Recharts uses browser APIs and React hooks internally — it cannot
// run on the server. "use client" marks this component as a client
// component so Next.js bundles and runs it in the browser only.
// The parent page can still be a server component — it just passes
// the pre-fetched counts as props into this client component.
//
// ─────────────────────────────────────────────────────────────────────────────
// var(--accent-9) — WHY A CSS VARIABLE INSTEAD OF A COLOR
// ─────────────────────────────────────────────────────────────────────────────
// Radix UI Themes exposes its color palette as CSS variables on the
// root element. --accent-9 is the primary accent color token defined
// in layout.tsx via <Theme accentColor="sky">.
// Using the variable instead of a hardcoded hex means:
// → if the theme accent color changes in layout.tsx, the chart
//   automatically updates without touching this file
// → the chart always stays visually consistent with the rest of the app
// ─────────────────────────────────────────────────────────────────────────────