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
        'flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm dark:bg-slate-900',
        status === 'E'
          ? 'border-green-600 ring-1 ring-green-600'
          : status === '2T'
            ? 'border-amber-600 ring-1 ring-amber-600'
            : 'border-slate-200 dark:border-slate-800',
      )}
    >
      <span className="w-6 text-center text-sm font-semibold tabular-nums text-slate-600 dark:text-slate-300">
        {rank}º
      </span>
      {imgError ? (
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100"
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
          className="h-14 w-14 shrink-0 rounded-full bg-slate-200 object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold">{name}</h3>
          {status === 'E' && (
            <span className="rounded bg-green-700 px-1.5 py-0.5 text-xs font-bold text-white">Eleito</span>
          )}
          {status === '2T' && (
            <span className="rounded bg-amber-700 px-1.5 py-0.5 text-xs font-bold text-white">2º turno</span>
          )}
        </div>
        <p className="truncate text-xs text-slate-600 dark:text-slate-300">
          Nº {c.n} · {c.cc}
          {c.nv ? ` · Vice: ${c.nv}` : ''}
        </p>
        <div
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="presentation"
        >
          <div
            className={cn('h-full', status === 'E' ? 'bg-green-700' : 'bg-blue-700 dark:bg-blue-500')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold tabular-nums">{formatPercent(c.pvap)}</p>
        <p className="text-xs tabular-nums text-slate-600 dark:text-slate-300">{formatInt(c.vap)} votos</p>
      </div>
    </li>
  );
}
