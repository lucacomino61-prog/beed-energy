// The energy line on a product card (docs/renewable-focus-plan.md §5): one Geist Mono line under the spec chips.
//   solar panels  ≈ round(power_wp × the city's PVGIS yield ÷ 1000) kWh a year in the remembered city (else Tirana)
//   batteries     usable_capacity_kwh, as the datasheet gives it
//   heat pumps    COP at A7/W35 (cop_a7w35)
// No line when the spec is missing. The specs come with the cards (catalog.ts reads them for a whole listing in one
// query); the city is one read per request, shared by every card through `scope` (Astro.locals).
import type { AstroCookies } from 'astro';
import { all } from './db';
import { chosenCitySlug } from './city-pref';
import { num } from './money';
import type { Lang } from './i18n';
import type { SpecValue } from './catalog';
import { panelYearKwh, tr } from '../i18n/renewables';

export type EnergyCity = { slug: string; name_sq: string; name_en: string; pv_yield: number };
/** `key`: the spec the line repeats, so the card leaves that chip out. */
export type EnergyLine = { text: string; title: string; key?: string };

const FALLBACK_CITY = 'tirane';
const perRequest = new WeakMap<object, Promise<EnergyCity | null>>();

/** The city panel lines are worked out for: the chosen city (query, else remembered) when it has a PVGIS yield, else
 *  Tirana. Pass Astro.locals as `scope` and every caller in one request shares a single database read. */
export function energyCity(url: URL, cookies: AstroCookies, scope?: object): Promise<EnergyCity | null> {
  const hit = scope && perRequest.get(scope);
  if (hit) return hit;
  const p = (async () => {
    const want = (await chosenCitySlug(url, cookies)) || FALLBACK_CITY;
    const rows = await all<EnergyCity>(
      'SELECT slug, name_sq, name_en, pv_yield FROM cities WHERE pv_yield IS NOT NULL AND slug IN (?, ?)',
      want,
      FALLBACK_CITY,
    );
    return rows.find((r) => r.slug === want) ?? rows.find((r) => r.slug === FALLBACK_CITY) ?? null;
  })().catch(() => null);
  if (scope) perRequest.set(scope, p);
  return p;
}

const positive = (v: SpecValue | undefined): number | null => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);
/** Up to two decimals, trailing zeros dropped: 5,12 · 9,6 · 10 (num() adds the language's separators). */
const short = (v: number, lang: Lang) => num(v, 2, lang).replace(/([.,]\d*?)0+$/, '$1').replace(/[.,]$/, '');

/** The line for one product of a category (categories.slug_en), or null. */
export function energyLine(specs: Record<string, SpecValue>, categorySlugEn: string | null | undefined, city: EnergyCity | null, lang: Lang): EnergyLine | null {
  const c = tr(lang).card;
  if (categorySlugEn === 'solar-panels') {
    const wp = positive(specs.power_wp);
    if (wp === null || !city) return null;
    return { text: c.panelYear(num(panelYearKwh(wp, city.pv_yield), 0, lang), lang === 'sq' ? city.name_sq : city.name_en), title: c.panelYearTitle };
  }
  if (categorySlugEn === 'batteries') {
    const kwh = positive(specs.usable_capacity_kwh);
    return kwh === null ? null : { text: c.batteryUsable(short(kwh, lang)), title: c.batteryUsableTitle, key: 'usable_capacity_kwh' };
  }
  if (categorySlugEn === 'heat-pumps') {
    const cop = positive(specs.cop_a7w35);
    return cop === null ? null : { text: c.heatPumpCop(short(cop, lang)), title: c.heatPumpCopTitle, key: 'cop_a7w35' };
  }
  return null;
}

/** Lines for a list of cards, keyed by product id: one city read, no per-card queries. */
export async function energyLines(
  cards: { id: number; category_id: number; specs: Record<string, SpecValue> }[],
  slugOf: (categoryId: number) => string | null | undefined,
  ctx: { url: URL; cookies: AstroCookies; locals: object },
  lang: Lang,
): Promise<Map<number, EnergyLine | null>> {
  const needsCity = cards.some((p) => slugOf(p.category_id) === 'solar-panels');
  const city = needsCity ? await energyCity(ctx.url, ctx.cookies, ctx.locals) : null;
  return new Map(cards.map((p) => [p.id, energyLine(p.specs, slugOf(p.category_id), city, lang)]));
}
