import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Header } from './components/common/Header';
import { PollingIndicator } from './components/common/PollingIndicator';
import { ElectionSelectors } from './components/election/ElectionSelectors';
import { ProgressOverview } from './components/election/ProgressOverview';
import { CandidateList } from './components/election/CandidateList';
import type { Snapshot } from './components/election/HistoryChart';
import { useElectionData, type ElectionContext } from './hooks/useElectionData';
import { usePolling } from './hooks/usePolling';
import { TSEApiError } from './services/tseApi';
import { parseNumber } from './utils/formatters';

const HistoryChart = lazy(() => import('./components/election/HistoryChart'));

const INITIAL: ElectionContext = { cycle: 'ele2026', electionCode: '6257', uf: 'BR', cargo: 1 };

export default function App() {
  const [ctx, setCtx] = useState<ElectionContext>(INITIAL);
  const { interval, setIntervalMs, refetchInterval } = usePolling(30_000);
  const q = useElectionData(ctx, refetchInterval);
  const [history, setHistory] = useState<Snapshot[]>([]);

  const ctxKey = `${ctx.cycle}|${ctx.electionCode}|${ctx.uf}|${ctx.cargo}`;
  useEffect(() => setHistory([]), [ctxKey]);

  const top = useMemo(
    () =>
      q.data
        ? [...q.data.cand].sort((a, b) => parseNumber(b.vap) - parseNumber(a.vap)).slice(0, 4)
        : [],
    [q.data],
  );

  // Registra um snapshot a cada lote sincronizado na sessão.
  useEffect(() => {
    if (!q.data || !q.dataUpdatedAt) return;
    const values: Record<string, number> = {};
    for (const c of q.data.cand) values[c.nmu || c.nm] = parseNumber(c.pvap);
    setHistory((h) =>
      h.length && h[h.length - 1].at === q.dataUpdatedAt
        ? h
        : [...h, { at: q.dataUpdatedAt, pst: parseNumber(q.data.pst), values }].slice(-60),
    );
  }, [q.data, q.dataUpdatedAt]);

  const err = q.error instanceof TSEApiError ? q.error : null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ElectionSelectors value={ctx} onChange={setCtx} />
          <PollingIndicator
            isFetching={q.isFetching}
            isError={q.isError}
            dataUpdatedAt={q.dataUpdatedAt}
            interval={interval}
            onIntervalChange={setIntervalMs}
            onRefresh={() => q.refetch()}
          />
        </div>

        {q.isError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-amber-600 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">
                {err?.isUnavailable ? 'Dados indisponíveis no momento' : 'Não foi possível carregar os dados'}
              </p>
              <p>{err?.message ?? 'Verifique sua conexão e tente novamente.'}</p>
              {q.data && <p className="mt-1">Exibindo os últimos dados obtidos com sucesso.</p>}
            </div>
          </div>
        )}

        {q.isPending && !q.isError && (
          <div className="flex items-center justify-center gap-2 py-16" role="status">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Carregando apuração…
          </div>
        )}

        {q.data && (
          <>
            <ProgressOverview data={q.data} />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CandidateList candidates={q.data.cand} ctx={ctx} />
              </div>
              <section
                aria-label="Histórico de evolução"
                className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="mb-2 text-sm font-semibold">Evolução na sessão (% de votos)</h2>
                {history.length < 2 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    O gráfico aparece após a segunda sincronização.
                  </p>
                ) : (
                  <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" aria-label="Carregando gráfico" />}>
                    <HistoryChart history={history} top={top} />
                  </Suspense>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
