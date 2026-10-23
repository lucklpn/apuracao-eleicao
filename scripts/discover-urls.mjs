// Descobre as URLs JSON reais que o site oficial do TSE consome.
// Uso: node scripts/discover-urls.mjs
import { chromium } from 'playwright';

const START = 'https://resultados.tse.jus.br/oficial/app/index.html#/eleicao;e=e6257;uf=br/resultados';
const seen = new Map();

const browser = await chromium.launch();
const page = await browser.newPage({ locale: 'pt-BR' });

page.on('response', (res) => {
  const url = res.url();
  const type = res.request().resourceType();
  if (type !== 'xhr' && type !== 'fetch') return;
  if (!seen.has(url)) {
    seen.set(url, res.status());
    console.log(res.status(), type, url);
  }
});

await page.goto(START, { waitUntil: 'networkidle', timeout: 60_000 }).catch((e) => console.log('goto:', e.message));
await page.waitForTimeout(8000);
console.log('\nTotal de JSONs:', seen.size);
console.log('Título:', await page.title());
await page.screenshot({ path: 'scripts/discover.png', fullPage: false });
await browser.close();
