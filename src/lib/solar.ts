// Solar sizing and payback, from a city's PVGIS yield (kWh per kWp per year, 14% system losses)
// and the regulated tariff in settings. Every assumption is a named parameter so the page can show it.
import { all, get, setting } from './db';
import { unitPriceFor, type Offer } from './catalog';
import { compatPair, isCompatible, type CompatPair } from '../content/battery-compat';

// ERE 2026 (Decision 322): households pay 8.5 lekë/kWh up to 700 kWh a month, and 9.5 lekë/kWh on the
// WHOLE month once they pass 700 kWh — a cliff, not a band. Prices exclude VAT; households pay VAT on top.
export type Tariffs = {
  household: { thresholdKwh: number; lowLekPerKwh: number; highLekPerKwh: number; wholeMonth: boolean } | null;
  business: number | null; // lekë per kWh at 0.4 kV, excl. VAT (businesses recover VAT)
  exportLekPerKwh: number | null; // what surplus fed to the grid earns; not published yet, so 0 by default
  pricesExclVat: boolean;
  vatRate: number;
  source: string | null;
  url?: string;
};

export type SolarAssumptions = {
  selfUseNoBattery: number; // share of production used on site without a battery
  selfUseWithBattery: number;
  degradationPerYear: number;
  years: number;
  panelWp: number; // panel size used to count modules
  batteryKwhPerKwp: number; // battery sized from the array
};

export const DEFAULT_ASSUMPTIONS: SolarAssumptions = {
  selfUseNoBattery: 0.45,
  selfUseWithBattery: 0.8,
  degradationPerYear: 0.005,
  years: 25,
  panelWp: 500,
  batteryKwhPerKwp: 1,
};

// The ranges a `solarAssumptions` setting may move each value within. Outside them (or not a number) the default
// stays, so a typo in the settings row cannot size a 0 Wp module or a 300-year payback.
const ASSUMPTION_RANGES: Record<keyof SolarAssumptions, [number, number]> = {
  selfUseNoBattery: [0.05, 1],
  selfUseWithBattery: [0.05, 1],
  degradationPerYear: [0, 0.03],
  years: [5, 40],
  panelWp: [200, 900],
  batteryKwhPerKwp: [0.2, 4],
};

/** DEFAULT_ASSUMPTIONS with the admin's `solarAssumptions` setting applied key by key, each value checked against its range. */
export async function solarAssumptions(): Promise<SolarAssumptions> {
  const raw = await setting<Record<string, unknown> | null>('solarAssumptions', {});
  const a: SolarAssumptions = { ...DEFAULT_ASSUMPTIONS };
  if (!raw || typeof raw !== 'object') return a;
  for (const k of Object.keys(ASSUMPTION_RANGES) as (keyof SolarAssumptions)[]) {
    const v = raw[k];
    const [lo, hi] = ASSUMPTION_RANGES[k];
    if (typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi) a[k] = k === 'years' ? Math.round(v) : v;
  }
  return a;
}

export async function tariffs(): Promise<Tariffs> {
  return await setting<Tariffs>('tariffs', { household: null, business: null, exportLekPerKwh: null, pricesExclVat: true, vatRate: 0.2, source: null });
}

/** Energy part of a monthly bill in lekë (households with VAT, businesses without). */
export function billFor(kwhMonth: number, t: Tariffs, kind: 'household' | 'business'): number | null {
  if (kind === 'business') return t.business ? kwhMonth * t.business : null;
  const h = t.household;
  if (!h) return null;
  const vat = t.pricesExclVat ? 1 + t.vatRate : 1;
  if (h.wholeMonth) return kwhMonth * (kwhMonth > h.thresholdKwh ? h.highLekPerKwh : h.lowLekPerKwh) * vat;
  const low = Math.min(kwhMonth, h.thresholdKwh);
  return (low * h.lowLekPerKwh + Math.max(0, kwhMonth - h.thresholdKwh) * h.highLekPerKwh) * vat;
}

/** Inverse of billFor: the monthly kWh behind a given bill (the cliff makes 7 140–7 980 lekë unreachable; it returns the edge). */
export function kwhForBill(bill: number, t: Tariffs, kind: 'household' | 'business'): number | null {
  if (billFor(1, t, kind) === null) return null;
  let lo = 0;
  let hi = 100000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((billFor(mid, t, kind) ?? 0) < bill) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export type Kit = { role: 'panel' | 'inverter' | 'battery' | 'mounting'; offerId: number; productSlug: string; name: string; qty: number; unitPrice: number; lineTotal: number };

/** For every product in a category whose spec fits, its cheapest in-stock offer at `qty` from a seller who delivers to
 *  the buyer's zone: one Kit per product, cheapest first. sizeSystem() uses it to try inverter × battery pairs; the role
 *  it returns is a placeholder (callers set their own). */
export async function fittingOffers(categorySlugEn: string, fits: (specs: Record<string, number | string | null>) => boolean, qty: number, zone: number): Promise<Kit[]> {
  // Three reads per call, whatever the number of offers (the packages page calls this about 20 times): the offers, then
  // the category's specs and volume tiers in one query each. An offer whose minimum order is above `qty` cannot be
  // bought at that quantity (the basket would flag it), so it is left out.
  const [rows, specRows, tierRows] = await Promise.all([
    all<any>(
      `SELECT o.id AS offer_id, o.price_all, o.stock_qty, p.id AS pid, p.slug, p.brand, p.model
         FROM offers o JOIN products p ON p.id = o.product_id JOIN categories c ON c.id = p.category_id JOIN sellers s ON s.id = o.seller_id
        WHERE c.slug_en = ? AND p.status = 'published' AND o.active = 1 AND s.status = 'active' AND o.stock_qty >= ? AND o.min_qty <= ?
          AND (',' || REPLACE(s.delivery_zones, ' ', '') || ',') LIKE ?`,
      categorySlugEn,
      qty,
      qty,
      `%,${zone},%`,
    ),
    all<{ pid: number; key: string; value_num: number | null; value_text: string | null }>(
      `SELECT ps.product_id AS pid, a.key, ps.value_num, ps.value_text
         FROM product_specs ps JOIN spec_attributes a ON a.id = ps.attribute_id JOIN products p ON p.id = ps.product_id JOIN categories c ON c.id = p.category_id
        WHERE c.slug_en = ?`,
      categorySlugEn,
    ),
    all<{ offer_id: number; min_qty: number; price_all: number }>(
      `SELECT t.offer_id, t.min_qty, t.price_all
         FROM offer_tiers t JOIN offers o ON o.id = t.offer_id JOIN products p ON p.id = o.product_id JOIN categories c ON c.id = p.category_id
        WHERE c.slug_en = ?`,
      categorySlugEn,
    ),
  ]);
  const specsOf = new Map<number, Record<string, number | string | null>>();
  for (const s of specRows) {
    const m = specsOf.get(s.pid) ?? {};
    m[s.key] = s.value_num ?? s.value_text;
    specsOf.set(s.pid, m);
  }
  // Per product, the first offer at its lowest line total; `at` (that offer's row index) breaks ties between products,
  // so fittingOffers()[0] is exactly the offer the old single-pass cheapest() returned.
  const byProduct = new Map<number, { kit: Kit; at: number }>();
  rows.forEach((r, at) => {
    if (!fits(specsOf.get(r.pid) ?? {})) return;
    const tiers = tierRows.filter((t) => t.offer_id === r.offer_id);
    const unit = unitPriceFor({ price_all: r.price_all, tiers } as Pick<Offer, 'price_all' | 'tiers'>, qty);
    const seen = byProduct.get(r.pid);
    if (!seen || unit * qty < seen.kit.lineTotal) {
      byProduct.set(r.pid, { kit: { role: 'panel', offerId: r.offer_id, productSlug: r.slug, name: `${r.brand} ${r.model}`, qty, unitPrice: unit, lineTotal: unit * qty }, at });
    }
  });
  return [...byProduct.values()].sort((a, b) => a.kit.lineTotal - b.kit.lineTotal || a.at - b.at).map((x) => x.kit);
}

/** Cheapest in-stock offer in a category whose spec fits, from a seller who delivers to the buyer's zone: the first of
 *  fittingOffers(). Also used by src/lib/packages.ts for a package's extras (the role it returns is a placeholder). */
export async function cheapest(categorySlugEn: string, fits: (specs: Record<string, number | string | null>) => boolean, qty: number, zone: number): Promise<Kit | null> {
  return (await fittingOffers(categorySlugEn, fits, qty, zone))[0] ?? null;
}

export type SolarResult = {
  city: { slug: string; name_sq: string; name_en: string; yieldKwhPerKwp: number; monthly: number[] };
  kwhMonth: number;
  kwp: number;
  panels: number;
  annualKwh: number;
  monthlyKwh: number[];
  selfUse: number;
  annualSaving: number | null;
  kit: Kit[];
  kitTotal: number | null;
  paybackYears: number | null;
  lifetimeSaving: number | null;
  assumptions: SolarAssumptions;
  /** The inverter + battery pair in the kit (src/content/battery-compat.ts, always verdict 'compatible'); null without a battery line. */
  pair: CompatPair | null;
  /** Why a wanted battery is not in the kit: no inverter that takes a battery fits the array in stock for this zone
   *  ('no-inverter', so there was nothing to pair), no battery of the right size in stock ('no-battery-offer'), or none
   *  of them is listed as working with a fitting inverter ('no-compatible-pair'). null when no battery was asked for or
   *  the kit has one. */
  batteryIssue: BatteryIssue;
};

export type BatteryIssue = null | 'no-inverter' | 'no-battery-offer' | 'no-compatible-pair';

export async function sizeSystem(input: {
  citySlug: string;
  kwhMonth: number;
  kind: 'household' | 'business';
  battery: boolean;
  phases: 1 | 3;
  coverage?: number; // share of yearly use to cover, default 0.9
}): Promise<SolarResult | null> {
  const c = await get<any>('SELECT * FROM cities WHERE slug = ? AND pv_yield IS NOT NULL', input.citySlug);
  if (!c) return null;
  const a = await solarAssumptions();
  const zone = Number(c.zone) || 1;
  const t = await tariffs();
  const yearly = input.kwhMonth * 12;
  const target = yearly * (input.coverage ?? 0.9);
  // Pick the module first (cheapest per Wp in stock near the planned size), then size the array from its real wattage.
  const estimate = Math.max(4, Math.ceil(((target / c.pv_yield) * 1000) / a.panelWp));
  const probe = await cheapest('solar-panels', (s) => typeof s.power_wp === 'number' && s.power_wp >= a.panelWp - 60 && s.power_wp <= a.panelWp + 160, estimate, zone);
  const moduleWp = probe ? Number((await get<{ v: number }>(
    `SELECT ps.value_num AS v FROM product_specs ps JOIN spec_attributes sa ON sa.id = ps.attribute_id JOIN products p ON p.id = ps.product_id
      WHERE p.slug = ? AND sa.key = 'power_wp'`, probe.productSlug))?.v ?? a.panelWp) : a.panelWp;
  const panels = Math.max(4, Math.ceil(((target / c.pv_yield) * 1000) / moduleWp));
  const kwp = (panels * moduleWp) / 1000;
  const annualKwh = kwp * c.pv_yield;
  const monthly: number[] = JSON.parse(c.pv_monthly_json ?? '[]');

  const kit: Kit[] = [];
  const panel = probe ? ((await cheapest('solar-panels', (s) => s.power_wp === moduleWp, panels, zone)) ?? probe) : null;
  if (panel && panel.qty !== panels) Object.assign(panel, { qty: panels, lineTotal: panel.unitPrice * panels });
  if (panel) kit.push({ ...panel, role: 'panel' });
  // AC power at least 70% of the array; oversizing is fine within reason (the smallest three-phase hybrids are 10 kW).
  const invFits = (s: Record<string, number | string | null>) =>
    typeof s.rated_ac_power_kw === 'number' &&
    s.rated_ac_power_kw >= kwp * 0.7 &&
    s.rated_ac_power_kw <= Math.max(kwp * 2.2, 10) &&
    (typeof s.max_pv_power_kwp !== 'number' || s.max_pv_power_kwp >= kwp) &&
    Number(s.phases) === input.phases &&
    (!input.battery || s.hybrid === 1 || s.battery_ready === 1);
  let pair: CompatPair | null = null;
  let batteryIssue: BatteryIssue = null;
  if (!input.battery) {
    const inv = await cheapest('inverters', invFits, 1, zone);
    if (inv) kit.push({ ...inv, role: 'inverter' });
  } else {
    // Every fitting hybrid × every battery of the right size, kept only when the makers list the pair as working together
    // (isCompatible: verdict 'compatible'; 'unknown' never pairs). The cheapest pair by inverter + battery wins. With no
    // such pair the kit keeps the cheapest fitting hybrid and no battery, so kitTotal is null and the page says why.
    const want = kwp * a.batteryKwhPerKwp;
    const [invs, bats] = await Promise.all([
      fittingOffers('inverters', invFits, 1, zone),
      fittingOffers('batteries', (s) => typeof s.usable_capacity_kwh === 'number' && s.usable_capacity_kwh >= want * 0.6 && s.usable_capacity_kwh <= want * 1.8, 1, zone),
    ]);
    let best: { inv: Kit; bat: Kit } | null = null;
    for (const i of invs) {
      for (const b of bats) {
        if (!isCompatible(i.productSlug, b.productSlug)) continue;
        if (!best || i.lineTotal + b.lineTotal < best.inv.lineTotal + best.bat.lineTotal) best = { inv: i, bat: b };
      }
    }
    if (best) {
      kit.push({ ...best.inv, role: 'inverter' }, { ...best.bat, role: 'battery' });
      pair = compatPair(best.inv.productSlug, best.bat.productSlug);
    } else {
      if (invs[0]) kit.push({ ...invs[0], role: 'inverter' });
      // Blame the pairing only when there was something to pair: with no fitting inverter the gap is the inverter.
      batteryIssue = !invs.length ? 'no-inverter' : bats.length ? 'no-compatible-pair' : 'no-battery-offer';
    }
  }
  // The self-use share follows the kit, not the wish: with a battery only when the kit has one, so a wanted battery with no
  // offer or no listed pair in stock leaves the saving at the no-battery share (the page says why the battery is missing).
  const hasBattery = kit.some((k) => k.role === 'battery');
  const selfUse = hasBattery ? a.selfUseWithBattery : a.selfUseNoBattery;
  const used = Math.min(annualKwh * selfUse, yearly);
  const exported = Math.max(0, annualKwh - used);
  // Saving = this year's bill minus the bill on what is still bought from the grid. Works across the 700 kWh cliff.
  const before = billFor(input.kwhMonth, t, input.kind);
  const after = billFor(Math.max(0, input.kwhMonth - used / 12), t, input.kind);
  const annualSaving = before === null || after === null ? null : (before - after) * 12 + exported * (t.exportLekPerKwh ?? 0);

  const inv = kit.find((k) => k.role === 'inverter');
  const complete = !!panel && !!inv && (!input.battery || kit.some((k) => k.role === 'battery'));
  const kitTotal = complete ? kit.reduce((s, k) => s + k.lineTotal, 0) : null;

  let lifetimeSaving: number | null = null;
  if (annualSaving !== null) {
    lifetimeSaving = 0;
    for (let y = 0; y < a.years; y++) lifetimeSaving += annualSaving * Math.pow(1 - a.degradationPerYear, y);
  }
  return {
    city: { slug: c.slug, name_sq: c.name_sq, name_en: c.name_en, yieldKwhPerKwp: c.pv_yield, monthly },
    kwhMonth: input.kwhMonth,
    kwp,
    panels,
    annualKwh,
    monthlyKwh: monthly.map((m) => m * kwp),
    selfUse,
    annualSaving,
    kit,
    kitTotal,
    paybackYears: kitTotal && annualSaving ? kitTotal / annualSaving : null,
    lifetimeSaving,
    assumptions: { ...a, panelWp: moduleWp },
    pair,
    batteryIssue,
  };
}
