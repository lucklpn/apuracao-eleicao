import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { decodeBase64Url, parseTseResponse } from '../utils/tseParser';

describe('tseParser', () => {
  it('decodifica base64url com suporte a UTF-8 e acentuação', () => {
    // "Eleição 2026 - Ação & Votação" em base64url
    const original = 'Eleição 2026 - Ação & Votação';
    const base64url = Buffer.from(original, 'utf8').toString('base64url');
    expect(decodeBase64Url(base64url)).toBe(original);
  });

  it('faz parse do fixture real JWS do TSE (Eleição 2026 - Presidente)', () => {
    const fixturePath = fileURLToPath(new URL('./fixtures/br-c0001-e006257-u.json', import.meta.url));
    const rawPayload = readFileSync(fixturePath, 'utf8');

    // Cria um token JWS válido (header.payload.signature)
    const header = Buffer.from(JSON.stringify({ alg: 'EdDSA', typ: 'JOSE' })).toString('base64url');
    const payload = Buffer.from(rawPayload, 'utf8').toString('base64url');
    const signature = 'dummy-sig';
    const jws = `${header}.${payload}.${signature}`;

    const res = parseTseResponse(jws, 1);

    expect(res.ele).toBe('6257');
    expect(res.cdabr).toBe('br');
    expect(res.s).toBe('499248');
    expect(res.st).toBe('62168');
    expect(res.pst).toBe('12,45');
    expect(res.vnom).toBe('14425046');
    expect(res.vb).toBe('234851');
    expect(res.a).toBe('4034093');

    expect(res.cand.length).toBe(12);

    const flavio = res.cand.find((c) => c.n === '22');
    expect(flavio).toBeDefined();
    expect(flavio?.nmu).toBe('FLAVIO BOLSONARO');
    expect(flavio?.nv).toBe('ALFREDO GASPAR');
    expect(flavio?.cc).toBe('PL');
    expect(flavio?.vap).toBe('7369884');
    expect(flavio?.pvap).toBe('51,09');

    const lula = res.cand.find((c) => c.n === '13');
    expect(lula).toBeDefined();
    expect(lula?.nmu).toBe('LULA');
    expect(lula?.nv).toBe('GERALDO ALCKMIN');
    expect(lula?.cc).toContain('PT');
    expect(lula?.vap).toBe('5872874');
    expect(lula?.pvap).toBe('40,71');
  });

  it('suporta JSON direto simplificado caso recebido', () => {
    const mockJson = JSON.stringify({
      ele: '6257',
      cdabr: 'br',
      hg: '18:00:00',
      dt: '04/10/2026',
      s: '1000',
      st: '500',
      pst: '50,00',
      vnom: '4000',
      vb: '100',
      pvb: '2,00',
      vn: '200',
      pvn: '4,00',
      a: '300',
      pa: '6,00',
      cand: [
        {
          seq: '1',
          sqcand: '1',
          n: '10',
          nm: 'CANDIDATO 1',
          nmu: 'CAND 1',
          cc: 'PARTIDO A',
          nv: 'VICE 1',
          e: 'N',
          st: '',
          vap: '2500',
          pvap: '62,50',
        },
      ],
    });

    const res = parseTseResponse(mockJson);
    expect(res.cand.length).toBe(1);
    expect(res.cand[0].nmu).toBe('CAND 1');
    expect(res.pst).toBe('50,00');
  });
});
