import { describe, it, expect } from 'vitest';
import { resultsUrl, photoUrl, configUrl } from '../services/endpoints';

describe('endpoints', () => {
  it('gera URL correta de resultados em formato .jws', () => {
    const url = resultsUrl('ele2026', '6257', 'BR', 1);
    expect(url).toContain('/oficial/ele2026/6257/dados/br/br-c0001-e006257-u.jws');
  });

  it('gera URL correta para eleição estadual', () => {
    const url = resultsUrl('ele2026', '6259', 'SP', 3);
    expect(url).toContain('/oficial/ele2026/6259/dados/sp/sp-c0003-e006259-u.jws');
  });

  it('gera URL correta de fotos de candidatos', () => {
    const photo = photoUrl('ele2026', '6257', 'BR', '280002551544');
    expect(photo).toContain('/oficial/ele2026/6257/fotos/br/280002551544.jpeg');
  });

  it('gera URL da configuração geral sem ciclo no path', () => {
    expect(configUrl()).toContain('/oficial/comum/config/ele-c.json');
  });
});
