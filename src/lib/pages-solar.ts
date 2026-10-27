// Reads the calculator's query string, runs await sizeSystem() and returns one plain object that the
// server view and /api/solar (and so the browser script) render from. State lives in the URL.
import { billFor, kwhForBill, sizeSystem, tariffs, type BatteryIssue, type Kit } from './solar';
import type { CompatPair } from '../content/battery-compat';
import { pvCities } from './pages-db';

export type CalcInput = {
  city: string;
  mode: 'kwh' | 'bill';
  kwh: string;
  bill: string;
  kind: 'household' | 'business';
  battery: boolean;
  phases: 1 | 3;
};

export type CalcOutput = {
  ok: boolean;
  errors: Record<string, 'kwh' | 'bill' | 'city'>;
  input: CalcInput;
  kwhMonth: number | null;
  fromBill: boolean;
  billClamped: boolean;
  city: { slug: string; name_sq: string; name_en: string; yield: number } | null;
  kwp: number;
  panels: number;
  panelWp: number;
  annualKwh: number;
  monthlyKwh: number[];
  selfUse: number;
  annualSaving: number | null;
  crossesCliff: boolean;
  kit: Kit[];
  kitTotal: number | null;
  paybackYears: number | null;
  lifetimeSaving: number | null;
  tariff: { threshold: number; low: number; high: number; business: number | null; vatRate: number; gapLo: number; gapHi: number } | null;
  /** SolarResult.pair: the kit's inverter + battery pair (listed as compatible), null without a battery line. */
  pair: CompatPair | null;
  /** SolarResult.batteryIssue: why a wanted battery is not in the kit. */
  batteryIssue: BatteryIssue;
};

const num = (s: string) => {
  const v = Number(String(s).replace(/[\s  ]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
  return Number.isFinite(v) ? v : NaN;
};

export function readCalcInput(params: URLSearchParams): CalcInput {
  const city = (params.get('qyteti') ?? params.get('city') ?? 'tirane').slice(0, 40);
  return {
    city,
    mode: params.get('mode') === 'bill' ? 'bill' : 'kwh',
    kwh: (params.get('kwh') ?? '400').slice(0, 12),
    bill: (params.get('fatura') ?? params.get('bill') ?? '').slice(0, 14),
    kind: params.get('lidhja') === 'business' || params.get('kind') === 'business' ? 'business' : 'household',
    battery: params.get('bateri') === '1' || params.get('battery') === '1',
    phases: params.get('faza') === '3' || params.get('phases') === '3' ? 3 : 1,
  };
}

export function calcQuery(i: CalcInput): Record<string, string> {
  return {
    qyteti: i.city,
    mode: i.mode,
    ...(i.mode === 'kwh' ? { kwh: i.kwh } : { fatura: i.bill }),
    lidhja: i.kind,
    bateri: i.battery ? '1' : '0',
    faza: String(i.phases),
  };
}

export async function runCalc(input: CalcInput): Promise<CalcOutput> {
  const t = await tariffs();
  const h = t.household;
  const vat = t.pricesExclVat ? 1 + t.vatRate : 1;
  const tariff = h
    ? {
        threshold: h.thresholdKwh,
        low: h.lowLekPerKwh,
        high: h.highLekPerKwh,
        business: t.business,
        vatRate: t.vatRate,
        gapLo: Math.round(h.thresholdKwh * h.lowLekPerKwh * vat),
        gapHi: Math.round(h.thresholdKwh * h.highLekPerKwh * vat),
      }
    : null;
  const base: CalcOutput = {
    ok: false, errors: {}, input, kwhMonth: null, fromBill: input.mode === 'bill', billClamped: false, city: null,
    kwp: 0, panels: 0, panelWp: 500, annualKwh: 0, monthlyKwh: [], selfUse: 0, annualSaving: null, crossesCliff: false,
    kit: [], kitTotal: null, paybackYears: null, lifetimeSaving: null, tariff, pair: null, batteryIssue: null,
  };
  const city = (await pvCities()).find((c) => c.slug === input.city);
  if (!city) base.errors.city = 'city';
  let kwhMonth: number | null = null;
  if (input.mode === 'kwh') {
    const k = num(input.kwh);
    if (!(k >= 30 && k <= 50000)) base.errors.kwh = 'kwh';
    else kwhMonth = k;
  } else {
    const b = num(input.bill);
    if (!(b >= 300 && b <= 2_000_000)) base.errors.bill = 'bill';
    else {
      const k = kwhForBill(b, t, input.kind);
      if (k === null) base.errors.bill = 'bill';
      else {
        kwhMonth = Math.round(k);
        base.billClamped = input.kind === 'household' && !!tariff && b > tariff.gapLo && b < tariff.gapHi;
        if (kwhMonth < 30) base.errors.bill = 'bill';
      }
    }
  }
  if (Object.keys(base.errors).length || !city || kwhMonth === null) return base;

  const r = await sizeSystem({ citySlug: city.slug, kwhMonth, kind: input.kind, battery: input.battery, phases: input.phases });
  if (!r) return { ...base, errors: { city: 'city' } };
  const used = Math.min(r.annualKwh * r.selfUse, kwhMonth * 12) / 12;
  const crossesCliff = input.kind === 'household' && !!h && kwhMonth > h.thresholdKwh && kwhMonth - used <= h.thresholdKwh && billFor(1, t, 'household') !== null;
  return {
    ...base,
    ok: true,
    kwhMonth,
    city: { slug: city.slug, name_sq: city.name_sq, name_en: city.name_en, yield: r.city.yieldKwhPerKwp },
    kwp: r.kwp,
    panels: r.panels,
    panelWp: r.assumptions.panelWp,
    annualKwh: r.annualKwh,
    monthlyKwh: r.monthlyKwh,
    selfUse: r.selfUse,
    annualSaving: r.annualSaving,
    crossesCliff,
    kit: r.kit,
    kitTotal: r.kitTotal,
    paybackYears: r.paybackYears,
    lifetimeSaving: r.lifetimeSaving,
    pair: r.pair,
    batteryIssue: r.batteryIssue,
  };
}
