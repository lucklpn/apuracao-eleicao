import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { TSECandidateResult } from '../../types/tse';
import { normalize, parseNumber } from '../../utils/formatters';
import { photoUrl } from '../../services/endpoints';
import type { ElectionContext } from '../../hooks/useElectionData';
import { CandidateCard } from './CandidateCard';

interface Props {
  candidates: TSECandidateResult[];
  ctx: ElectionContext;
}

export function CandidateList({ candidates, ctx }: Props) {
  const [query, setQuery] = useState('');

  const sorted = useMemo(
    () => [...candidates].sort((a, b) => parseNumber(b.vap) - parseNumber(a.vap)),
    [candidates],
  );

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return sorted;
    return sorted.filter((c) => normalize(`${c.nmu} ${c.nm}`).includes(q) || c.n.startsWith(q));
  }, [sorted, query]);

  return (
    <section aria-label="Candidatos" className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou número"
          aria-label="Buscar candidato por nome ou número"
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Nenhum candidato encontrado.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <CandidateCard
              key={c.seq || c.sqcand}
              candidate={c}
              rank={sorted.indexOf(c) + 1}
              photo={photoUrl(ctx.cycle, ctx.electionCode, ctx.uf, c.sqcand)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
