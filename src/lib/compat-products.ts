// The product page's "Punon me / Works with" data: for an inverter in src/content/battery-compat.ts, the batteries the
// makers list as compatible; for a battery, the inverters; each only when it is a published product in the catalogue.
// Plus the gaps the page states on its own (CATALOGUE_NOTES). Inverters with no battery input and every other product
// get null, so the page shows nothing.
import { all } from './db';
import {
  BATTERY_SLUGS,
  INVERTER_SLUGS,
  catalogueNotes,
  compatibleBatteries,
  compatibleInverters,
  type CatalogueNote,
  type CompatPair,
} from '../content/battery-compat';

export type WorksWithProduct = { slug: string; brand: string; model: string };
export type WorksWith = {
  /** What the page's product is: an inverter lists batteries, a battery lists inverters. */
  role: 'inverter' | 'battery';
  entries: { pair: CompatPair; product: WorksWithProduct }[];
  notes: CatalogueNote[];
};

export async function worksWith(slug: string): Promise<WorksWith | null> {
  const role = (INVERTER_SLUGS as readonly string[]).includes(slug)
    ? 'inverter'
    : (BATTERY_SLUGS as readonly string[]).includes(slug)
      ? 'battery'
      : null;
  if (!role) return null;
  const pairs = role === 'inverter' ? compatibleBatteries(slug) : compatibleInverters(slug);
  const otherSlug = (p: CompatPair) => (role === 'inverter' ? p.battery : p.inverter);
  const slugs = pairs.map(otherSlug);
  const rows = slugs.length
    ? await all<WorksWithProduct>(
        `SELECT slug, brand, model FROM products WHERE status = 'published' AND slug IN (${slugs.map(() => '?').join(',')})`,
        ...slugs,
      )
    : [];
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const entries = pairs.flatMap((pair) => {
    const product = bySlug.get(otherSlug(pair));
    return product ? [{ pair, product }] : [];
  });
  return { role, entries, notes: catalogueNotes(slug) };
}
