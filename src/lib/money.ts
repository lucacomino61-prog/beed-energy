// Prices are whole lekë with VAT included. Formatted by hand: Chrome ships no Albanian Intl data,
// so a client-side Intl.NumberFormat('sq') silently falls back to English separators.
import type { Lang } from './i18n';

const NBSP = ' ';
const THIN = ' ';

export const VAT_RATE = 0.2;

export function groupDigits(n: number, sep = THIN): string {
  const neg = n < 0;
  const s = Math.round(Math.abs(n)).toString();
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += sep;
    out += s[i];
  }
  return (neg ? '−' : '') + out;
}

/** 124 900 L — the short form Albanian price tags use. */
export function lek(n: number, lang: Lang = 'sq'): string {
  return `${groupDigits(n, lang === 'sq' ? THIN : ',')}${NBSP}${lang === 'sq' ? 'L' : 'ALL'}`;
}

/** 124 900 lekë — the long form for sentences and totals. */
export function lekLong(n: number, lang: Lang = 'sq'): string {
  return `${groupDigits(n, lang === 'sq' ? THIN : ',')}${NBSP}${lang === 'sq' ? 'lekë' : 'ALL'}`;
}

export function eur(n: number, decimals = 0): string {
  const fixed = n.toFixed(decimals);
  const [int, dec] = fixed.split('.');
  return `€${groupDigits(Number(int))}${dec ? ',' + dec : ''}`;
}

/** Decimal number with a comma in Albanian and a point in English. */
export function num(n: number | null | undefined, decimals = 0, lang: Lang = 'sq'): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const fixed = Math.abs(n).toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const grouped = groupDigits(Number(int), lang === 'sq' ? THIN : ',');
  return (n < 0 ? '−' : '') + grouped + (dec ? (lang === 'sq' ? ',' : '.') + dec : '');
}

/** VAT contained in a VAT-inclusive amount. */
export function vatOf(gross: number, rate = VAT_RATE): number {
  return Math.round(gross - gross / (1 + rate));
}

export function toEur(all: number, rate: number): number {
  return all / rate;
}
