import { useState } from 'react';
import type { TSECandidateResult } from '../../types/tse';
import { formatInt, formatPercent, initials, parseNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface Props {
  candidate: TSECandidateResult;
  rank: number;
  photo: string;
}

export function candidateStatus(c: TSECandidateResult): 'E' | '2T' | null {
  if (c.e === 'S') return 'E';
  if (/2[ºo°]?\s*turno/i.test(c.st)) return '2T';
  return null;
}

export function CandidateCard({ candidate: c, rank, photo }: Props) {
  const [imgError, setImgError] = useState(false);
  const status = candidateStatus(c);
  const pct = Math.min(100, parseNumber(c.pvap));
  const name = c.nmu || c.nm;

  return (
    <li
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-white p-2.5 shadow-sm sm:gap-3 sm:p-3 dark:bg-slate-900',
        status === 'E'
          ? 'border-green-600 ring-1 ring-green-600'
          : status === '2T'
            ? 'border-amber-600 ring-1 ring-amber-600'
            : 'border-slate-200 dark:border-slate-800',
      )}
    >
      <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-slate-600 sm:w-6 sm:text-sm dark:text-slate-300">
        {rank}º
      </span>
      {imgError ? (
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 sm:h-14 sm:w-14 sm:text-sm dark:bg-slate-700 dark:text-slate-100"
          aria-hidden
        >
          {initials(name)}
        </div>
      ) : (
        <img
          src={photo}
          alt={`Foto de ${name}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-11 w-11 shrink-0 rounded-full bg-slate-200 object-cover sm:h-14 sm:w-14"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <h3 className="truncate text-xs font-semibold sm:text-base">{name}</h3>
          {status === 'E' && (
            <span className="rounded bg-green-700 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">Eleito</span>
          )}
          {status === '2T' && (
            <span className="rounded bg-amber-700 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">2º turno</span>
          )}
        </div>
        <p className="truncate text-[11px] text-slate-600 sm:text-xs dark:text-slate-300">
          Nº {c.n} · {c.cc}
          {c.nv ? ` · Vice: ${c.nv}` : ''}
        </p>
        <div
          className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 sm:h-2 dark:bg-slate-700"
          role="presentation"
        >
          <div
            className={cn('h-full', status === 'E' ? 'bg-green-700' : 'bg-blue-700 dark:bg-blue-500')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold tabular-nums sm:text-lg">{formatPercent(c.pvap)}</p>
        <p className="text-[10px] tabular-nums text-slate-600 sm:text-xs dark:text-slate-300">{formatInt(c.vap)} votos</p>
      </div>
    </li>
  );
}
