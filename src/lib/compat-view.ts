// How a checked inverter + battery pair (src/content/battery-compat.ts) reads on the package cards, in the calculator and
// on product pages. Pure and browser-safe: it imports only types from the matrix (the calculator's script gets the pair
// itself from /api/solar), so the 36-pair matrix never ships to the browser.
import type { CompatPair, CompatSource } from '../content/battery-compat';
import { COMPAT_CHECKED } from '../content/compat-checked';
import { MONTHS, type Lang } from './i18n';
import { num } from './money';
import { tc } from '../i18n/compat';

/** The maker of every inverter and battery in the matrix, by products.slug, as the catalogue writes the brand. */
const MAKER: Record<string, string> = {
  'deye-sun-10k-sg04lp3-eu': 'Deye',
  'fronius-symo-gen24-10-plus': 'Fronius',
  'fronius-primo-gen24-5-plus': 'Fronius',
  'goodwe-gw10k-et-plus': 'GoodWe',
  'growatt-mod-10ktl3-xh': 'Growatt',
  'huawei-sun2000-10ktl-m1': 'Huawei',
  'byd-battery-box-premium-hvs-10-2': 'BYD',
  'byd-battery-box-premium-hvm-11-0': 'BYD',
  'dyness-powerbox-g3': 'Dyness',
  'fronius-reserva-6-3': 'Fronius',
  'huawei-luna2000-7-s1': 'Huawei',
  'pylontech-us5000': 'Pylontech',
};

/** Who lists the pair, in words, with the makers' names. */
export function listedByText(pair: Pick<CompatPair, 'inverter' | 'battery' | 'listedBy'>, lang: Lang): string {
  return tc(lang).listedBy[pair.listedBy](MAKER[pair.inverter] ?? '', MAKER[pair.battery] ?? '');
}

/** Two to four short conditions for the views: the pair's `key` picks from its conditions (the first three when it has
 *  no `key`), then the battery power when a maker states it. */
export function keyConditions(pair: Pick<CompatPair, 'conditions' | 'key' | 'batteryPowerKw'>, lang: Lang): string[] {
  const picked = (pair.key ?? [0, 1, 2]).map((i) => pair.conditions[i]?.[lang]).filter((s): s is string => !!s).slice(0, 3);
  if (typeof pair.batteryPowerKw === 'number') {
    const kw = pair.batteryPowerKw;
    picked.push(tc(lang).power(num(kw, Number.isInteger(kw * 10) ? 1 : 2, lang)));
  }
  return picked;
}

/** A maker document's own date (YYYY, YYYY-MM or YYYY-MM-DD) in words: "10 tetor 2026", "maj 2026", "2026". */
export function docDate(d: string | null | undefined, lang: Lang): string {
  if (!d) return '';
  const [y, m, day] = d.split('-').map(Number);
  if (!m) return String(y);
  const month = MONTHS[lang][m - 1] ?? '';
  return day ? `${day} ${month} ${y}` : `${month} ${y}`;
}

/** The day the lists were read, for a <time> element. */
export function checkedOn(lang: Lang): { iso: string; text: string } {
  return { iso: COMPAT_CHECKED, text: docDate(COMPAT_CHECKED, lang) };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** A maker document as an external link (new tab, said to screen readers), for HTML strings (the calculator). */
export function sourceLinkHtml(s: Pick<CompatSource, 'url' | 'title'>, lang: Lang): string {
  return `<a class="cp-ext" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span class="cp-ext__t">${esc(s.title)}</span><span class="visually-hidden">${esc(tc(lang).newTab)}</span><span class="cp-ext__arrow" aria-hidden="true">↗</span></a>`;
}
