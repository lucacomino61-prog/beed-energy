// The basket and the compare list live in HttpOnly cookies that only the server writes,
// so the header count, the basket page and the compare tray render in the HTML,
// and adding to the basket works as a plain form post when scripts are off.
import type { AstroCookies } from 'astro';
import { cleanLines, type CartLineInput } from './cart';

export const CART_COOKIE = 'beed_cart';
export const COMPARE_COOKIE = 'beed_cmp';
export const COMPARE_MAX = 4;
const MAX_AGE = 60 * 60 * 24 * 30;

export function readCart(cookies: AstroCookies): CartLineInput[] {
  const raw = cookies.get(CART_COOKIE)?.value ?? '';
  return cleanLines(
    raw
      .split('.')
      .map((p) => p.split('-').map(Number))
      .map(([offerId, qty]) => ({ offerId, qty })),
  );
}

export function writeCart(cookies: AstroCookies, lines: CartLineInput[], secure: boolean) {
  const clean = cleanLines(lines);
  if (!clean.length) {
    cookies.delete(CART_COOKIE, { path: '/' });
    return;
  }
  cookies.set(CART_COOKIE, clean.map((l) => `${l.offerId}-${l.qty}`).join('.'), { path: '/', httpOnly: true, sameSite: 'lax', secure, maxAge: MAX_AGE });
}

export function cartCount(lines: CartLineInput[]): number {
  return lines.reduce((s, l) => s + l.qty, 0);
}

export function applyCartAction(lines: CartLineInput[], action: string, offerId: number, qty: number): CartLineInput[] {
  const next = lines.map((l) => ({ ...l }));
  const i = next.findIndex((l) => l.offerId === offerId);
  switch (action) {
    case 'add':
      if (i >= 0) next[i].qty += Math.max(1, qty);
      else next.push({ offerId, qty: Math.max(1, qty) });
      return next;
    case 'set':
      if (qty <= 0) return next.filter((l) => l.offerId !== offerId);
      if (i >= 0) next[i].qty = qty;
      else next.push({ offerId, qty });
      return next;
    case 'remove':
      return next.filter((l) => l.offerId !== offerId);
    case 'clear':
      return [];
    default:
      return next;
  }
}

export function readCompare(cookies: AstroCookies): number[] {
  return (cookies.get(COMPARE_COOKIE)?.value ?? '')
    .split('.')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, COMPARE_MAX);
}

export function writeCompare(cookies: AstroCookies, ids: number[], secure: boolean) {
  const clean = [...new Set(ids)].filter((n) => Number.isInteger(n) && n > 0).slice(0, COMPARE_MAX);
  if (!clean.length) cookies.delete(COMPARE_COOKIE, { path: '/' });
  else cookies.set(COMPARE_COOKIE, clean.join('.'), { path: '/', httpOnly: true, sameSite: 'lax', secure, maxAge: MAX_AGE });
}

/** Where to send a form post back to: the same-origin Referer, else the given fallback. */
export function backTo(request: Request, url: URL, fallback: string): string {
  const ref = request.headers.get('referer');
  if (ref) {
    try {
      const r = new URL(ref);
      // A path like //evil.example or /\evil.example is same-origin here but a new host in a Location header.
      if (r.origin === url.origin && !/^\/[/\\]/.test(r.pathname)) return r.pathname + r.search + r.hash;
    } catch {
      /* fall through */
    }
  }
  return fallback;
}

export function wantsJson(request: Request): boolean {
  return (request.headers.get('accept') ?? '').includes('application/json');
}
