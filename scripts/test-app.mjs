import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ locale: 'pt-BR' });

page.on('console', (msg) => console.log('BROWSER LOG:', msg.type(), msg.text()));
page.on('pageerror', (err) => console.log('BROWSER ERR:', err.message));

console.log('Navegando para http://localhost:5173...');
try {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);
  const title = await page.title();
  console.log('Título:', title);

  const text = await page.innerText('body');
  console.log('Contém FLAVIO BOLSONARO?', text.includes('FLAVIO BOLSONARO') || text.includes('BOLSONARO'));
  console.log('Contém LULA?', text.includes('LULA'));
  console.log('Contém seções apuradas?', text.includes('Seções apuradas'));

  await page.screenshot({ path: 'scripts/app-live.png', fullPage: true });
  console.log('Screenshot salva em scripts/app-live.png');
} catch (e) {
  console.log('Erro no teste:', e.message);
} finally {
  await browser.close();
}
