import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ locale: 'pt-BR' });

console.log('Navegando para http://localhost:5173...');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

// Seleciona Estadual
const turnoSelect = page.locator('select').nth(1);
await turnoSelect.selectOption({ label: '2026 – 1º turno (Estadual)' });
await page.waitForTimeout(2000);

// Seleciona SP
const ufSelect = page.locator('select').nth(3);
await ufSelect.selectOption('SP');
await page.waitForTimeout(3000);

const text = await page.innerText('body');
console.log('Governador em SP carregou?');
console.log('Contém TARCÍSIO?', text.includes('TARCÍSIO') || text.includes('TARCISIO'));
console.log('Contém seções apuradas?', text.includes('Seções apuradas'));

await page.screenshot({ path: 'scripts/app-sp.png', fullPage: true });
console.log('Screenshot de SP salva em scripts/app-sp.png');

await browser.close();
