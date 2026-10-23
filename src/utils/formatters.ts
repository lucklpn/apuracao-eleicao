/** Converte strings numéricas do TSE ("1.234", "50,15", "12345") em number. */
export function parseNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return value;
  const s = value.trim();
  const n = s.includes(',') ? Number(s.replace(/\./g, '').replace(',', '.')) : Number(s);
  return Number.isFinite(n) ? n : 0;
}

const intFmt = new Intl.NumberFormat('pt-BR');

export const formatInt = (v: string | number | undefined | null) => intFmt.format(parseNumber(v));

export function formatPercent(v: string | number | undefined | null, digits = 2) {
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(parseNumber(v)) + '%'
  );
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function normalize(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
