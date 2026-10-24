import { Ban, FileX2, UserX, Users } from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import type { TSEResultsResponse } from '../../types/tse';
import { formatInt, formatPercent, parseNumber } from '../../utils/formatters';

export function ProgressOverview({ data }: { data: TSEResultsResponse }) {
  const pct = Math.min(100, Math.max(0, parseNumber(data.pst)));
  const validos = parseNumber(data.vnom);
  return (
    <section aria-label="Resumo da apuração" className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-300">Seções apuradas</h2>
          <span className="text-xl font-bold tabular-nums sm:text-2xl">{formatPercent(data.pst)}</span>
        </div>
        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Percentual de seções apuradas"
        >
          <div className="h-full bg-blue-700 transition-all dark:bg-blue-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
          {formatInt(data.st)} de {formatInt(data.s)} seções · gerado em {data.dt} {data.hg}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <MetricCard title="Votos válidos" value={formatInt(validos)} icon={<Users className="h-4 w-4" aria-hidden />} />
        <MetricCard
          title="Brancos"
          value={formatInt(data.vb)}
          hint={formatPercent(data.pvb)}
          icon={<FileX2 className="h-4 w-4" aria-hidden />}
        />
        <MetricCard
          title="Nulos"
          value={formatInt(data.vn)}
          hint={formatPercent(data.pvn)}
          icon={<Ban className="h-4 w-4" aria-hidden />}
        />
        <MetricCard
          title="Abstenções"
          value={formatInt(data.a)}
          hint={formatPercent(data.pa)}
          icon={<UserX className="h-4 w-4" aria-hidden />}
        />
      </div>
    </section>
  );
}
