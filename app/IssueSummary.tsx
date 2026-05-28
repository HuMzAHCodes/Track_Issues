import { Status } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { FaCircleExclamation, FaSpinner, FaCircleCheck } from 'react-icons/fa6';

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
    icon: React.ReactNode;
    colorClass: string;
    borderHoverClass: string;
  }[] = [
    { 
      label: 'Open Issues', 
      value: open, 
      status: 'OPEN',
      icon: <FaCircleExclamation className="text-lg text-cherry animate-pulse" />,
      colorClass: 'text-cherry bg-cherry/10 dark:bg-cherry/20',
      borderHoverClass: 'hover:border-cherry/50 hover:shadow-cherry/10'
    },
    {
      label: 'In Progress',
      value: inProgress,
      status: 'IN_PROGRESS',
      icon: <FaSpinner className="text-lg text-amber-600 dark:text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />,
      colorClass: 'text-amber-600 bg-amber-500/10 dark:bg-amber-500/20',
      borderHoverClass: 'hover:border-amber-500/50 hover:shadow-amber-500/10'
    },
    { 
      label: 'Closed Issues', 
      value: closed, 
      status: 'CLOSED',
      icon: <FaCircleCheck className="text-lg text-stone-500 dark:text-stone-400" />,
      colorClass: 'text-stone-600 bg-stone-500/10 dark:bg-stone-500/20',
      borderHoverClass: 'hover:border-stone-500/50 hover:shadow-stone-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {containers.map((container) => (
        <Link
          key={container.label}
          href={`/Issues/?status=${container.status}`}
          className={`glass-card p-5 flex flex-col justify-between h-32 cursor-pointer no-underline ${container.borderHoverClass}`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              {container.label}
            </span>
            <div className={`p-2 rounded-xl flex items-center justify-center ${container.colorClass}`}>
              {container.icon}
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {container.value}
            </span>
            {container.status === 'IN_PROGRESS' && (
              <span className="relative flex h-2 w-2 mb-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
            {container.status === 'OPEN' && (
              <span className="relative flex h-2 w-2 mb-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cherry opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cherry"></span>
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default IssueSummary;
