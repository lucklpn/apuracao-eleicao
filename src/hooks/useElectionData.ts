import { useQuery } from '@tanstack/react-query';
import { fetchResults, TSEApiError } from '../services/tseApi';

export interface ElectionContext {
  cycle: string;
  electionCode: string;
  uf: string;
  cargo: number;
}

export function useElectionData(ctx: ElectionContext, refetchInterval: number | false) {
  return useQuery({
    queryKey: ['results', ctx.cycle, ctx.electionCode, ctx.uf, ctx.cargo],
    queryFn: ({ signal }) => fetchResults(ctx.cycle, ctx.electionCode, ctx.uf, ctx.cargo, signal),
    refetchInterval,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
    // Não insistir em 404 (apuração não iniciada); tentar de novo em 503/rede.
    retry: (count, err) => !(err instanceof TSEApiError && err.status === 404) && count < 3,
    retryDelay: (n) => Math.min(1000 * 2 ** n, 15_000),
  });
}
