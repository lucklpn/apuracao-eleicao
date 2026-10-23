import type { TSECandidateResult, TSEResultsResponse } from '../types/tse';

/**
 * Decodifica uma string codificada em base64url de forma universal (compatível com Browser e Node.js).
 */
export function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface RawTseCandidate {
  n: string;
  sqcand: string;
  nm: string;
  nmu: string;
  seq?: string;
  e?: string;
  st?: string;
  vap?: string;
  pvap?: string;
  vs?: Array<{
    tp?: string;
    sqcand?: string;
    nm?: string;
    nmu?: string;
    sgp?: string;
  }>;
}

interface RawTseParty {
  n?: string;
  sg?: string;
  nm?: string;
  cand?: RawTseCandidate[];
}

interface RawTseAgrupamento {
  n?: string;
  nm?: string;
  tp?: string;
  com?: string;
  par?: RawTseParty[];
}

interface RawTseCargo {
  cd: string;
  nmn?: string;
  nmm?: string;
  nmf?: string;
  nv?: string;
  agr?: RawTseAgrupamento[];
}

interface RawTseJwsPayload {
  ele?: string;
  cdabr?: string;
  dg?: string;
  hg?: string;
  dt?: string;
  ht?: string;
  s?: {
    ts?: string;
    st?: string;
    pst?: string;
  };
  e?: {
    a?: string;
    pa?: string;
  };
  v?: {
    vnom?: string;
    vv?: string;
    vvc?: string;
    vb?: string;
    pvb?: string;
    vn?: string;
    tvn?: string;
    pvn?: string;
    ptvn?: string;
  };
  carg?: RawTseCargo[];
  cand?: TSECandidateResult[];
}

/**
 * Transforma o conteúdo de resposta do TSE (seja JWS .jws ou JSON simplificado)
 * no modelo estrito TSEResultsResponse.
 */
export function parseTseResponse(rawText: string, cargoCode?: number): TSEResultsResponse {
  const clean = rawText.replace(/^\uFEFF/, '').trim();

  let parsed: RawTseJwsPayload;

  // Verifica se é formato JWS (token com 3 segmentos separados por ponto)
  const parts = clean.split('.');
  if (parts.length === 3 && (clean.startsWith('eyJ') || clean.includes('JOSE') || parts[0].length > 0)) {
    try {
      const decodedJson = decodeBase64Url(parts[1]);
      parsed = JSON.parse(decodedJson) as RawTseJwsPayload;
    } catch (e) {
      throw new Error(`Falha ao decodificar payload JWS do TSE: ${(e as Error).message}`);
    }
  } else {
    try {
      parsed = JSON.parse(clean) as RawTseJwsPayload;
    } catch (e) {
      throw new Error(`Resposta do TSE em formato JSON inválido: ${(e as Error).message}`);
    }
  }

  // Se já estiver no formato plano de dados simplificados (com array 'cand' na raiz e strings diretas)
  const rawAny = parsed as Record<string, unknown>;
  if (Array.isArray(rawAny.cand) && typeof rawAny.st === 'string') {
    return parsed as unknown as TSEResultsResponse;
  }

  // Se for o formato oficial estruturado em 'carg'
  const cargos = parsed.carg ?? [];
  const targetCargo =
    cargoCode !== undefined
      ? cargos.find((c) => Number(c.cd) === cargoCode) ?? cargos[0]
      : cargos[0];

  const candidates: TSECandidateResult[] = [];
  if (targetCargo?.agr) {
    for (const agr of targetCargo.agr) {
      const coligacao = agr.com || agr.nm || '';
      for (const par of agr.par ?? []) {
        const partido = par.sg || '';
        const legenda = coligacao || partido;
        for (const c of par.cand ?? []) {
          const isEleito = c.e?.toUpperCase() === 'S';
          candidates.push({
            seq: c.seq ?? '',
            sqcand: c.sqcand ?? '',
            n: c.n,
            nm: c.nm,
            nmu: c.nmu || c.nm,
            cc: legenda,
            nv: c.vs?.[0]?.nmu || c.vs?.[0]?.nm || '',
            e: isEleito ? 'S' : 'N',
            st: c.st || (isEleito ? 'Eleito' : ''),
            vap: c.vap ?? '0',
            pvap: c.pvap ?? '0,00',
          });
        }
      }
    }
  }

  const s = parsed.s ?? {};
  const e = parsed.e ?? {};
  const v = parsed.v ?? {};

  return {
    ele: parsed.ele ?? '',
    cdabr: parsed.cdabr ?? '',
    hg: parsed.hg || parsed.ht || '',
    dt: parsed.dt || parsed.dg || '',
    s: s.ts ?? '0',
    st: s.st ?? '0',
    pst: s.pst ?? '0,00',
    vnom: (v.vnom || v.vv || v.vvc) ?? '0',
    vb: v.vb ?? '0',
    pvb: v.pvb ?? '0,00',
    vn: (v.tvn || v.vn) ?? '0',
    pvn: (v.ptvn || v.pvn) ?? '0,00',
    a: e.a ?? '0',
    pa: e.pa ?? '0,00',
    cand: candidates,
  };
}
