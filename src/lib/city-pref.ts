// The buyer's delivery city travels between pages: a city chosen on a product page (?qyteti=vlore) is the
// basket's and the checkout's default. A small first-party cookie, SameSite=Lax, 30 days, readable by the
// page scripts (src/scripts/city.ts keeps it in step when the city changes without a reload). It holds only
// a city slug. An explicit query always wins, and an explicit empty one ("no city") forgets it.
import type { AstroCookies } from 'astro';
import { get } from './db';
import { secureCookies } from './origin';

export const CITY_COOKIE = 'beed_city';
const MAX_AGE = 60 * 60 * 24 * 30;
const SLUG = /^[a-z0-9-]{1,40}$/;

function isCity(slug: string): boolean {
  return SLUG.test(slug) && !!get<{ x: number }>('SELECT 1 AS x FROM cities WHERE slug = ?', slug);
}

/** ?qyteti= (sq) or ?city= (en): undefined when the URL has neither, '' for an explicit "no city", else the slug sent. */
export function queryCitySlug(url: URL): string | undefined {
  const v = url.searchParams.get('qyteti') ?? url.searchParams.get('city');
  return v === null ? undefined : v.trim();
}

/** The remembered city's slug, when it is still a city. */
export function rememberedCity(cookies: AstroCookies): string | null {
  const v = cookies.get(CITY_COOKIE)?.value ?? '';
  return v && isCity(v) ? v : null;
}

/** The city slug a page should use: the query when there is one (even an empty one), else the remembered city. */
export function chosenCitySlug(url: URL, cookies: AstroCookies): string {
  const q = queryCitySlug(url);
  return q !== undefined ? q : (rememberedCity(cookies) ?? '');
}

/** Product, basket and calculator pages (middleware.ts, GET) remember a valid query city; "no city" forgets it. */
export function rememberQueryCity(url: URL, cookies: AstroCookies): void {
  const q = queryCitySlug(url);
  if (q === undefined) return;
  if (q === '') {
    if (cookies.has(CITY_COOKIE)) cookies.delete(CITY_COOKIE, { path: '/' });
    return;
  }
  if (isCity(q) && cookies.get(CITY_COOKIE)?.value !== q) {
    cookies.set(CITY_COOKIE, q, { path: '/', sameSite: 'lax', secure: secureCookies(url), maxAge: MAX_AGE });
  }
}
