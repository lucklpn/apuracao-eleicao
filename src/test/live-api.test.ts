import { describe, it, expect } from 'vitest';
import { parseTseResponse } from '../utils/tseParser';

describe('TSE Live Endpoints Integration', () => {
  it('consulta e decodifica a apuração de Presidente 2026 ao vivo do TSE', async () => {
    const url = 'https://resultados.tse.jus.br/oficial/ele2026/6257/dados/br/br-c0001-e006257-u.jws';
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    expect(res.status).toBe(200);

    const rawText = await res.text();
    const parsed = parseTseResponse(rawText, 1);

    expect(parsed.ele).toBe('6257');
    expect(parsed.cdabr).toBe('br');
    expect(Number(parsed.s)).toBeGreaterThan(0);
    expect(Number(parsed.st)).toBeGreaterThan(0);
    expect(parsed.cand.length).toBeGreaterThan(0);

    // Candidatos oficiais principais presentes na eleição de 2026
    const numbers = parsed.cand.map((c) => c.n);
    expect(numbers).toContain('22'); // Flavio Bolsonaro
    expect(numbers).toContain('13'); // Lula
  }, 15000);

  it('consulta e decodifica a apuração de Governador SP 2026 ao vivo do TSE', async () => {
    const url = 'https://resultados.tse.jus.br/oficial/ele2026/6259/dados/sp/sp-c0003-e006259-u.jws';
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    expect(res.status).toBe(200);

    const rawText = await res.text();
    const parsed = parseTseResponse(rawText, 3);

    expect(parsed.ele).toBe('6259');
    expect(parsed.cdabr).toBe('sp');
    expect(parsed.cand.length).toBeGreaterThan(0);
  }, 15000);
});
