// The compare page reads ids from ?p=1,2,3 (shareable) or, without it, from the compare cookie.
// Removing a column without scripts posts to the page itself, which updates the cookie and redirects (PRG).
import type { AstroCookies } from 'astro';
import { COMPARE_MAX, readCompare, writeCompare } from './basket';
import { productCardsByIds } from './catalog';
import { secureCookies } from './origin';

export function compareIds(url: URL, cookies: AstroCookies): number[] {
  const p = url.searchParams.get('p');
  const ids = p !== null ? p.split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0) : readCompare(cookies);
  return [...new Set(ids)].slice(0, COMPARE_MAX);
}

/**
 * A shared ?p= link becomes the visitor's compare list when its ids are real products of one category (at most
 * COMPARE_MAX) and differ from the cookie, so the header count, the dock and the tray agree with the page.
 * Call it in the page frontmatter, before the layout reads the cookie.
 */
export async function syncCompareCookie(url: URL, cookies: AstroCookies) {
  const p = url.searchParams.get('p');
  if (p === null) return;
  const ids = [...new Set(p.split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0))];
  if (!ids.length || ids.length > COMPARE_MAX) return;
  const cards = await productCardsByIds(ids);
  if (cards.length !== ids.length || new Set(cards.map((c) => c.category_id)).size !== 1) return;
  const cur = readCompare(cookies);
  if (cur.length === ids.length && cur.every((x, i) => x === ids[i])) return;
  writeCompare(cookies, ids, secureCookies(url));
}

export async function removeFromCompare(request: Request, cookies: AstroCookies, url: URL) {
  const form = await request.formData().catch(() => null);
  const id = Number(form?.get('productId'));
  if (Number.isInteger(id) && id > 0) writeCompare(cookies, readCompare(cookies).filter((x) => x !== id), secureCookies(url));
}
