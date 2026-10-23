import type { Cargo, ElectionOption } from '../types/tse';

/** Base da API. Em dev usa o proxy do Vite; em produção, um rewrite/edge function. */
export const TSE_BASE_URL: string = import.meta.env.VITE_TSE_BASE_URL ?? '/api-tse';

export const CARGOS: Record<number, Cargo> = {
  1: { code: 1, label: 'Presidente', scope: 'br' },
  3: { code: 3, label: 'Governador', scope: 'uf' },
  5: { code: 5, label: 'Senador', scope: 'uf' },
  6: { code: 6, label: 'Deputado Federal', scope: 'uf' },
  7: { code: 7, label: 'Deputado Estadual', scope: 'uf' },
  8: { code: 8, label: 'Deputado Distrital', scope: 'uf' },
};

/**
 * Catálogo de eleições, conforme {base}/oficial/comum/config/ele-c.json (ver fetchElectionConfig).
 * 2026: 6257 = Federal (apenas Presidente), 6259 = Estadual (Governador, Senador, Deputados).
 * 2º turno: 6258 (Presidente) e 6260 (Governador) – campo "cdt2" no arquivo de configuração.
 * Ciclos anteriores não constam no ele-c.json atual (apenas ele2024 e ele2026).
 */
export const ELECTIONS: ElectionOption[] = [
  { cycle: 'ele2026', code: '6257', label: '2026 – 1º turno (Presidente)', cargos: [1] },
  { cycle: 'ele2026', code: '6259', label: '2026 – 1º turno (Estadual)', cargos: [3, 5, 6, 7, 8] },
  { cycle: 'ele2026', code: '6258', label: '2026 – 2º turno (Presidente)', cargos: [1] },
  { cycle: 'ele2026', code: '6260', label: '2026 – 2º turno (Governador)', cargos: [3] },
];

export const UFS = [
  'BR', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

/** A configuração geral não inclui o ciclo no caminho. */
export const configUrl = () => `${TSE_BASE_URL}/oficial/comum/config/ele-c.json`;

const pad = (v: string | number, n: number) => String(v).padStart(n, '0');

export function resultsUrl(cycle: string, electionCode: string, uf: string, cargo: number) {
  const u = uf.toLowerCase();
  const e = pad(electionCode, 6);
  return `${TSE_BASE_URL}/oficial/${cycle}/${electionCode}/dados/${u}/${u}-c${pad(cargo, 4)}-e${e}-u.jws`;
}

export function photoUrl(cycle: string, electionCode: string, uf: string, sqcand: string) {
  return `${TSE_BASE_URL}/oficial/${cycle}/${electionCode}/fotos/${uf.toLowerCase()}/${sqcand}.jpeg`;
}
