import { Status } from '@prisma/client'
import React from 'react'

interface props {
    status: Status
}

const statusMap: Record<
  Status, 
  { label: string, bgClass: string, textClass: string, dotClass: string }> = {
  OPEN: { 
    label: 'Open', 
    bgClass: 'bg-cherry/10 dark:bg-cherry/20 border border-cherry/20', 
    textClass: 'text-cherry dark:text-cherry-glow font-bold',
    dotClass: 'bg-cherry'
  },
  IN_PROGRESS: { 
    label: 'In Progress', 
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20', 
    textClass: 'text-amber-700 dark:text-amber-400 font-bold',
    dotClass: 'bg-amber-500 animate-pulse'
  },
  CLOSED: { 
    label: 'Closed', 
    bgClass: 'bg-stone-500/10 dark:bg-stone-500/20 border border-stone-500/20', 
    textClass: 'text-stone-600 dark:text-stone-300 font-bold',
    dotClass: 'bg-stone-500'
  }
};

const IssueStatusBadge = ({ status }: props) => {
  const config = statusMap[status];
  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm ${config.bgClass} ${config.textClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  )
}

export default IssueStatusBadge;
