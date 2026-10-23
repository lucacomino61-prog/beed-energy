// The compare page reads ids from ?p=1,2,3 (shareable) or, without it, from the compare cookie.
// Removing a column without scripts posts to the page itself, which updates the cookie and redirects (PRG).
import type { AstroCookies } from 'astro';
import { COMPARE_MAX, readCompare, writeCompare } from './basket';

export function compareIds(url: URL, cookies: AstroCookies): number[] {
  const p = url.searchParams.get('p');
  const ids = p !== null ? p.split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0) : readCompare(cookies);
  return [...new Set(ids)].slice(0, COMPARE_MAX);
}

export async function removeFromCompare(request: Request, cookies: AstroCookies, url: URL) {
  const form = await request.formData().catch(() => null);
  const id = Number(form?.get('productId'));
  if (Number.isInteger(id) && id > 0) writeCompare(cookies, readCompare(cookies).filter((x) => x !== id), url.protocol === 'https:');
}
