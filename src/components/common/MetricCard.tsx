import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}

export function MetricCard({ title, value, hint, icon }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>{title}</span>
        {icon}
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-slate-600 dark:text-slate-400">{hint}</p>}
    </div>
  );
}
