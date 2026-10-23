// Keeps the remembered delivery city (cookie beed_city, see src/lib/city-pref.ts) in step when a page changes
// the city without a reload (basket, calculator) or before it reloads (product). Only a city slug; Lax; 30 days.
export function rememberCity(slug: string) {
  const secure = location.protocol === 'https:' ? '; secure' : '';
  try {
    document.cookie = slug
      ? `beed_city=${encodeURIComponent(slug)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${secure}`
      : `beed_city=; path=/; max-age=0; samesite=lax${secure}`;
  } catch {
    /* cookies blocked: the query string still carries the city */
  }
}
