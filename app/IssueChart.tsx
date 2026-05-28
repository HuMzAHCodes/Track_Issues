'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Tooltip,
  CartesianGrid,
} from 'recharts';

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
    <div className="glass-card p-6 shadow-xl w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="color-Open" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e01216" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#9a0002" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="color-InProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="color-Closed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8a29e" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#57534e" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="rgba(154, 0, 2, 0.3)" />
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
            className="text-stone-500 dark:text-stone-400"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
            className="text-stone-500 dark:text-stone-400"
          />
          <Tooltip
            cursor={{ fill: 'rgba(154, 0, 2, 0.04)', radius: 12 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card px-4 py-2 border shadow-lg border-cherry/20">
                    <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">{payload[0].payload.label}</p>
                    <p className="text-base font-extrabold text-cherry dark:text-cherry-glow">{payload[0].value} Issues</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            barSize={60}
            radius={[12, 12, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#color-${entry.label.replace(/\s+/g, '')})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssueChart;