// Baixa um .jws do TSE, decodifica e salva o payload JSON em um arquivo (fixture).
// Uso: node scripts/inspect-jws.mjs <url> [saida.json]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [url, out] = process.argv.slice(2);
const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
console.log('status', res.status, res.headers.get('content-type'));
const text = (await res.text()).trim();
const parts = text.split('.');
if (parts.length !== 3) {
  console.log('Formato inesperado:', text.slice(0, 300));
  process.exit(1);
}
const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
if (out) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 1));
}

const { carg, ...rest } = payload;
console.log('campos de topo:', JSON.stringify(rest));
for (const c of carg ?? []) {
  const { agr, fed, ...cr } = c;
  console.log('cargo:', JSON.stringify(cr));
  console.log('agr[0] keys:', Object.keys(agr?.[0] ?? {}));
}
