import { chromium } from 'playwright';

// Simula tela de celular (iPhone 12 / Galaxy: 375x812)
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(2000);

await page.screenshot({ path: 'scripts/mobile-test.png', fullPage: true });
console.log('Screenshot mobile salva em scripts/mobile-test.png');

await browser.close();
