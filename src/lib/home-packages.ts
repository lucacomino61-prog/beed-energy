// What the home page's packages teaser needs from pricePackages(): the lowest total among the complete packages
// and each package's array size, for one city. Pricing six packages is about thirty database reads (≈ 460 ms on the
// local D1 against ≈ 135 ms for the whole home page before), so the summary is kept per isolate, per city, for five
// minutes. Keyed by city, so a summary for Fier is never shown for Tirana; prices still come only from live offers,
// at most five minutes old. The packages page itself is never cached (src/lib/packages.ts).
import { pricePackages } from './packages';

export type TeaserData = {
  /** Lowest total (lekë incl. VAT) among the complete packages; null when none is complete. */
  from: number | null;
  /** In PACKAGES order: nominal kWp and the panel count the sizing came to. */
  sizes: { kwp: number; n: number }[];
};

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; data: Promise<TeaserData> }>();

async function compute(citySlug: string): Promise<TeaserData> {
  const priced = await pricePackages(citySlug);
  // pricePackage() never throws, so a failed read has to be raised here for teaserData() to drop it from the cache.
  if (priced.some((p) => p.failed)) throw new Error('pricePackages: a database read failed');
  const totals = priced.filter((p) => p.complete && p.total !== null).map((p) => p.total as number);
  return {
    from: totals.length ? Math.min(...totals) : null,
    sizes: priced.filter((p) => p.result && p.result.panels > 0).map((p) => ({ kwp: p.pkg.nominalKwp, n: p.result!.panels })),
  };
}

export function teaserData(citySlug: string): Promise<TeaserData> {
  const now = Date.now();
  const hit = cache.get(citySlug);
  if (hit && now - hit.at < TTL_MS) return hit.data;
  const data = compute(citySlug).catch((): TeaserData => {
    cache.delete(citySlug); // a failed read is not kept: the next request tries again
    return { from: null, sizes: [] };
  });
  cache.set(citySlug, { at: now, data });
  return data;
}
