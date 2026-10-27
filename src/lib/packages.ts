// Prices the six solar packages (src/content/packages.ts) for one city, on the server, from live offers only:
// sizeSystem() for the panels, the inverter and the battery (only a pair listed as compatible in
// src/content/battery-compat.ts), then each extra (the heat pump) the same way, the
// cheapest in-stock offer that fits, from a seller who delivers to the city's zone. Nothing is cached: a package
// priced for Fier is never shown for Tirana. No price is stored in code or content.
import { all, get } from './db';
import { pvCities } from './pages-db';
import { cheapest, sizeSystem, type BatteryIssue, type Kit, type SolarResult } from './solar';
import type { CompatPair } from '../content/battery-compat';
import {
  DEFAULT_PACKAGE_CITY,
  PACKAGES,
  overRegulatorySize,
  sizeInputFor,
  type PackageExtra,
  type SolarPackage,
} from '../content/packages';

export type PackageRole = 'panel' | 'inverter' | 'battery' | 'extra';

export type PricedPackage = {
  pkg: SolarPackage;
  citySlug: string;
  /** null when the city has no PVGIS yield (sizeSystem() returns null) or the database read failed. */
  result: SolarResult | null;
  /** pkg.extras that were found, in pkg.extras order (each with the extra's own qty). */
  extras: Kit[];
  /** result.kitTotal + extras, in lekë incl. VAT; null when any line is missing. */
  total: number | null;
  /** result.kitTotal !== null and every extra found. */
  complete: boolean;
  /** result.kwp × 1 400 > kwhMonth × 12 (Instruction 3/2019 points 4, 6, 15). */
  overRegulatorySize: boolean;
  /** The parts with no in-stock offer for this city, for the "incomplete" note. */
  missing: PackageRole[];
  /** result.pair: the inverter + battery pair in the kit, listed as compatible (src/content/battery-compat.ts); null without a battery. */
  pair: CompatPair | null;
  /** result.batteryIssue: why a battery package has no battery line ('battery' is then in `missing` too); null otherwise. */
  batteryIssue: BatteryIssue;
  /** true when a database read threw (the package then looks like `empty`), so a cache does not keep the result. */
  failed?: boolean;
};

/** A spec value as a number: product_specs keeps numbers in value_num, but a value_text "1" still counts. */
const asNum = (v: number | string | null | undefined): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
};

/** The extra's spec filters: exact values (specEquals) and inclusive ranges (specRange); a missing spec never fits. */
export function extraFits(extra: PackageExtra, specs: Record<string, number | string | null>): boolean {
  for (const [k, want] of Object.entries(extra.specEquals ?? {})) if (asNum(specs[k]) !== want) return false;
  for (const [k, [lo, hi]] of Object.entries(extra.specRange ?? {})) {
    const v = asNum(specs[k]);
    if (v === null || v < lo || v > hi) return false;
  }
  return true;
}

/** The city the packages page prices for: one of the 14 PVGIS cities, else Tirana. */
export async function packageCity(slug: string | null | undefined): Promise<string> {
  const s = (slug ?? '').trim();
  if (s && (await pvCities()).some((c) => c.slug === s)) return s;
  return DEFAULT_PACKAGE_CITY;
}

/** sizeSystem(sizeInputFor(pkg, citySlug)), then the extras; never throws, never caches across cities. */
export async function pricePackage(pkg: SolarPackage, citySlug?: string): Promise<PricedPackage> {
  const input = sizeInputFor(pkg, citySlug);
  const empty: PricedPackage = {
    pkg,
    citySlug: input.citySlug,
    result: null,
    extras: [],
    total: null,
    complete: false,
    overRegulatorySize: false,
    missing: ['panel', 'inverter', ...(pkg.input.battery ? (['battery'] as const) : []), ...(pkg.extras?.length ? (['extra'] as const) : [])],
    pair: null,
    batteryIssue: null,
  };
  try {
    const result = await sizeSystem(input);
    if (!result) return empty;
    const zone = Number((await get<{ zone: number }>('SELECT zone FROM cities WHERE slug = ?', input.citySlug))?.zone) || 1;
    const found = await Promise.all((pkg.extras ?? []).map((x) => cheapest(x.categorySlugEn, (s) => extraFits(x, s), x.qty, zone)));
    const extras = found.filter((k): k is Kit => !!k);
    const has = (role: Kit['role']) => result.kit.some((k) => k.role === role);
    const missing: PackageRole[] = [];
    if (!has('panel')) missing.push('panel');
    if (!has('inverter')) missing.push('inverter');
    if (pkg.input.battery && !has('battery')) missing.push('battery');
    if (extras.length < found.length) missing.push('extra');
    const complete = result.kitTotal !== null && missing.length === 0;
    const total = complete ? (result.kitTotal ?? 0) + extras.reduce((s, k) => s + k.lineTotal, 0) : null;
    return {
      pkg,
      citySlug: input.citySlug,
      result,
      extras,
      total,
      complete,
      overRegulatorySize: overRegulatorySize(result.kwp, pkg.input.kwhMonth),
      missing,
      pair: result.pair,
      batteryIssue: result.batteryIssue,
    };
  } catch (err) {
    console.error('pricePackage', pkg.id, input.citySlug, err);
    return { ...empty, failed: true };
  }
}

/** Every package for one city, in PACKAGES order. */
export async function pricePackages(citySlug?: string): Promise<PricedPackage[]> {
  return await Promise.all(PACKAGES.map((p) => pricePackage(p, citySlug)));
}

/** The panel module's datasheet size (products.width_mm × height_mm) for each priced package's panel line, by slug. */
export async function panelSizes(priced: PricedPackage[]): Promise<Map<string, { w: number; h: number }>> {
  const slugs = [...new Set(priced.map((p) => p.result?.kit.find((k) => k.role === 'panel')?.productSlug).filter((s): s is string => !!s))];
  const out = new Map<string, { w: number; h: number }>();
  if (!slugs.length) return out;
  const rows = await all<{ slug: string; width_mm: number | null; height_mm: number | null }>(
    `SELECT slug, width_mm, height_mm FROM products WHERE slug IN (${slugs.map(() => '?').join(',')})`,
    ...slugs,
  );
  for (const r of rows) if (r.width_mm && r.height_mm) out.set(r.slug, { w: Math.min(r.width_mm, r.height_mm), h: Math.max(r.width_mm, r.height_mm) });
  return out;
}

export type ArrayLayout = { cols: number; rows: number; width: number; height: number; panels: { x: number; y: number }[]; w: number; h: number; gap: number };

/** N portrait modules (w × h mm) in rows on a roof-like rectangle about `aspect` times wider than tall; the last row
 *  may be short (a nearly empty last row costs extra). Pure geometry for the card drawings, not a roof plan: the
 *  installer lays out the real roof. */
export function arrayLayout(n: number, w: number, h: number, aspect = 2.2, gap = 20): ArrayLayout {
  const count = Math.max(1, Math.round(n));
  let cols = count;
  let best = Infinity;
  for (let c = 1; c <= count; c++) {
    const r = Math.ceil(count / c);
    const empty = r * c - count;
    const score = Math.abs(Math.log((c * (w + gap) - gap) / (r * (h + gap) - gap) / aspect)) + (0.5 * empty) / c;
    if (score < best - 1e-9) {
      best = score;
      cols = c;
    }
  }
  const rows = Math.ceil(count / cols);
  const panels = Array.from({ length: count }, (_, i) => ({ x: (i % cols) * (w + gap), y: Math.floor(i / cols) * (h + gap) }));
  return { cols, rows, width: cols * (w + gap) - gap, height: rows * (h + gap) - gap, panels, w, h, gap };
}

/** The offer lines of a complete package, for the basket's add-many action (kit first, extras after). */
export function packageLines(p: PricedPackage): { offerId: number; qty: number }[] {
  if (!p.complete || !p.result) return [];
  return [...p.result.kit, ...p.extras].map((k) => ({ offerId: k.offerId, qty: k.qty }));
}
