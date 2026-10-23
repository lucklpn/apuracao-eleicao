import type { TSEConfigElection, TSEResultsResponse } from '../types/tse';
import { configUrl, resultsUrl } from './endpoints';
import { parseTseResponse } from '../utils/tseParser';

export class TSEApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'TSEApiError';
    this.status = status;
  }
  /** 404/503: apuração ainda não iniciada ou CDN sobrecarregada. */
  get isUnavailable() {
    return this.status === 404 || this.status === 503;
  }
}

async function fetchRawText(url: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(url, { signal, cache: 'no-cache' });
  if (!res.ok) {
    const msg =
      res.status === 404
        ? 'Dados ainda não disponíveis: a apuração desta combinação pode não ter começado.'
        : res.status === 503
          ? 'Serviço do TSE temporariamente indisponível (alto tráfego). Tentaremos novamente.'
          : `Erro ${res.status} ao consultar o TSE.`;
    throw new TSEApiError(res.status, msg);
  }
  return res.text();
}

export const fetchResults = async (
  cycle: string,
  electionCode: string,
  uf: string,
  cargo: number,
  signal?: AbortSignal,
): Promise<TSEResultsResponse> => {
  const url = resultsUrl(cycle, electionCode, uf, cargo);
  const rawText = await fetchRawText(url, signal);
  try {
    return parseTseResponse(rawText, cargo);
  } catch (e) {
    throw new TSEApiError(502, (e as Error).message || 'Resposta inválida recebida do TSE.');
  }
};

export const fetchElectionConfig = async (
  signal?: AbortSignal,
): Promise<{ pl?: TSEConfigElection[] }> => {
  const rawText = await fetchRawText(configUrl(), signal);
  try {
    const clean = rawText.replace(/^\uFEFF/, '').trim();
    return JSON.parse(clean);
  } catch {
    throw new TSEApiError(502, 'Falha ao ler configuração de eleições do TSE.');
  }
};
