// Solar sizing and payback, from a city's PVGIS yield (kWh per kWp per year, 14% system losses)
// and the regulated tariff in settings. Every assumption is a named parameter so the page can show it.
import { all, get, setting } from './db';
import { unitPriceFor, type Offer } from './catalog';

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
  degradationPerYear: 0.004,
  years: 25,
  panelWp: 500,
  batteryKwhPerKwp: 1,
};

export function tariffs(): Tariffs {
  return setting<Tariffs>('tariffs', { household: null, business: null, exportLekPerKwh: null, pricesExclVat: true, vatRate: 0.2, source: null });
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

/** Cheapest in-stock offer in a category whose spec fits, for a priced starter kit. */
function cheapest(categorySlugEn: string, fits: (specs: Record<string, number | string | null>) => boolean, qty: number): Kit | null {
  const rows = all<any>(
    `SELECT o.id AS offer_id, o.price_all, o.stock_qty, p.id AS pid, p.slug, p.brand, p.model
       FROM offers o JOIN products p ON p.id = o.product_id JOIN categories c ON c.id = p.category_id JOIN sellers s ON s.id = o.seller_id
      WHERE c.slug_en = ? AND p.status = 'published' AND o.active = 1 AND s.status = 'active' AND o.stock_qty >= ?`,
    categorySlugEn,
    qty,
  );
  let best: Kit | null = null;
  for (const r of rows) {
    const specs = Object.fromEntries(
      all<{ key: string; value_num: number | null; value_text: string | null }>(
        'SELECT a.key, ps.value_num, ps.value_text FROM product_specs ps JOIN spec_attributes a ON a.id = ps.attribute_id WHERE ps.product_id = ?',
        r.pid,
      ).map((s) => [s.key, s.value_num ?? s.value_text]),
    );
    if (!fits(specs)) continue;
    const tiers = all<{ min_qty: number; price_all: number }>('SELECT min_qty, price_all FROM offer_tiers WHERE offer_id = ?', r.offer_id);
    const unit = unitPriceFor({ price_all: r.price_all, tiers } as Pick<Offer, 'price_all' | 'tiers'>, qty);
    if (!best || unit * qty < best.lineTotal) {
      best = { role: 'panel', offerId: r.offer_id, productSlug: r.slug, name: `${r.brand} ${r.model}`, qty, unitPrice: unit, lineTotal: unit * qty };
    }
  }
  return best;
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
};

export function sizeSystem(input: {
  citySlug: string;
  kwhMonth: number;
  kind: 'household' | 'business';
  battery: boolean;
  phases: 1 | 3;
  coverage?: number; // share of yearly use to cover, default 0.9
}): SolarResult | null {
  const c = get<any>('SELECT * FROM cities WHERE slug = ? AND pv_yield IS NOT NULL', input.citySlug);
  if (!c) return null;
  const a = { ...DEFAULT_ASSUMPTIONS, ...setting<Partial<SolarAssumptions>>('solarAssumptions', {}) };
  const t = tariffs();
  const yearly = input.kwhMonth * 12;
  const target = yearly * (input.coverage ?? 0.9);
  const panels = Math.max(4, Math.ceil((target / c.pv_yield) * 1000 / a.panelWp));
  const kwp = (panels * a.panelWp) / 1000;
  const annualKwh = kwp * c.pv_yield;
  const monthly: number[] = JSON.parse(c.pv_monthly_json ?? '[]');
  const selfUse = input.battery ? a.selfUseWithBattery : a.selfUseNoBattery;
  const used = Math.min(annualKwh * selfUse, yearly);
  const exported = Math.max(0, annualKwh - used);
  // Saving = this year's bill minus the bill on what is still bought from the grid. Works across the 700 kWh cliff.
  const before = billFor(input.kwhMonth, t, input.kind);
  const after = billFor(Math.max(0, input.kwhMonth - used / 12), t, input.kind);
  const annualSaving = before === null || after === null ? null : (before - after) * 12 + exported * (t.exportLekPerKwh ?? 0);

  const kit: Kit[] = [];
  const panel = cheapest('solar-panels', (s) => typeof s.power_wp === 'number' && s.power_wp >= a.panelWp - 60 && s.power_wp <= a.panelWp + 160, panels);
  if (panel) kit.push({ ...panel, role: 'panel' });
  const inv = cheapest(
    'inverters',
    (s) => typeof s.rated_ac_power_kw === 'number' && s.rated_ac_power_kw >= kwp * 0.75 && s.rated_ac_power_kw <= kwp * 1.3 && Number(s.phases) === input.phases && (!input.battery || s.hybrid === 1 || s.battery_ready === 1),
    1,
  );
  if (inv) kit.push({ ...inv, role: 'inverter' });
  if (input.battery) {
    const want = kwp * a.batteryKwhPerKwp;
    const bat = cheapest('batteries', (s) => typeof s.usable_capacity_kwh === 'number' && s.usable_capacity_kwh >= want * 0.6 && s.usable_capacity_kwh <= want * 1.8, 1);
    if (bat) kit.push({ ...bat, role: 'battery' });
  }
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
    assumptions: a,
  };
}
