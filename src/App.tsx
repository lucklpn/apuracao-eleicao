import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Header } from './components/common/Header';
import { PollingIndicator } from './components/common/PollingIndicator';
import { ElectionSelectors } from './components/election/ElectionSelectors';
import { ProgressOverview } from './components/election/ProgressOverview';
import { CandidateList } from './components/election/CandidateList';
import { useElectionData, type ElectionContext } from './hooks/useElectionData';
import { usePolling } from './hooks/usePolling';
import { TSEApiError } from './services/tseApi';

const DEFAULT_CONTEXT: ElectionContext = { cycle: 'ele2026', electionCode: '6257', uf: 'BR', cargo: 1 };
const CTX_STORAGE_KEY = 'tse_election_context';

function getInitialContext(): ElectionContext {
  try {
    const saved = localStorage.getItem(CTX_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.cycle && parsed.electionCode && parsed.uf && parsed.cargo) {
        return parsed as ElectionContext;
      }
    }
  } catch {
    // Ignora erro de parsing
  }
  return DEFAULT_CONTEXT;
}

export default function App() {
  const [ctx, setCtxState] = useState<ElectionContext>(getInitialContext);
  const { interval, setIntervalMs, refetchInterval } = usePolling(30_000);
  const q = useElectionData(ctx, refetchInterval);

  const setCtx = (nextCtx: ElectionContext) => {
    setCtxState(nextCtx);
    try {
      localStorage.setItem(CTX_STORAGE_KEY, JSON.stringify(nextCtx));
    } catch {
      // Ignora erro de localStorage
    }
  };

  const err = q.error instanceof TSEApiError ? q.error : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:space-y-4 sm:p-4 dark:border-slate-800 dark:bg-slate-900">
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
            className="flex items-start gap-2.5 rounded-lg border border-amber-600 bg-amber-50 p-3 text-xs sm:p-4 sm:text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
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
          <div className="flex items-center justify-center gap-2 py-16 text-sm" role="status">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Carregando apuração…
          </div>
        )}

        {q.data && (
          <div className="space-y-4 sm:space-y-6">
            <ProgressOverview data={q.data} />
            <CandidateList candidates={q.data.cand} ctx={ctx} />
          </div>
        )}
      </main>
    </div>
  );
}
