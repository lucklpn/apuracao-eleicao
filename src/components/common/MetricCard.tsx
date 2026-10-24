import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}

export function MetricCard({ title, value, hint, icon }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between text-xs text-slate-600 sm:text-sm dark:text-slate-300">
        <span className="truncate">{title}</span>
        <span className="shrink-0">{icon}</span>
      </div>
      <p className="mt-1 text-lg font-bold tabular-nums sm:text-2xl">{value}</p>
      {hint && <p className="text-[11px] text-slate-600 sm:text-xs dark:text-slate-400">{hint}</p>}
    </div>
  );
}
