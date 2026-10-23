// The calculator's result block as an HTML string, so the server page and the browser script
// (which re-renders after /api/solar answers) draw exactly the same thing. Pure: no database, no Node APIs.
import { href, MONTHS, MONTHS_SHORT, type Lang } from './i18n';
import { lek, lekLong, num } from './money';
import type { CalcOutput } from './pages-solar';
import { tp } from '../i18n/pages';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function chart(o: CalcOutput, lang: Lang): string {
  const t = tp(lang).calc;
  const W = 720, H = 300, L = 66, R = 12, T = 18, B = 34;
  const use = o.kwhMonth ?? 0;
  const max = Math.max(...o.monthlyKwh, use, 1) * 1.08;
  const step = niceStep(max / 3);
  const bw = (W - L - R) / 12;
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  let grid = '';
  for (let v = 0; v <= max; v += step) {
    grid += `<line x1="${L}" x2="${W - R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${num(v, 0, lang)}</text>`;
  }
  const bars = o.monthlyKwh
    .map((v, i) => {
      const x = L + i * bw + bw * 0.18;
      const h = y(0) - y(v);
      return `<rect x="${x.toFixed(1)}" y="${y(v).toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" height="${Math.max(0, h).toFixed(1)}"><title>${MONTHS[lang][i]}: ${num(v, 0, lang)} kWh</title></rect><text class="m" x="${(L + i * bw + bw / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle">${MONTHS_SHORT[lang][i]}</text>`;
    })
    .join('');
  const useLine = use
    ? `<line class="use" x1="${L}" x2="${W - R}" y1="${y(use).toFixed(1)}" y2="${y(use).toFixed(1)}"/><text class="use-t" x="${W - R}" y="${(y(use) - 7).toFixed(1)}" text-anchor="end">${esc(t.useLine)} · ${num(use, 0, lang)} kWh</text>`
    : '';
  const cityName = o.city ? (lang === 'sq' ? o.city.name_sq : o.city.name_en) : '';
  return `<svg class="calc-chart__svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="chart-t chart-d"><title id="chart-t">${esc(t.chart)}</title><desc id="chart-d">${esc(t.chartDesc(num(o.kwp, 1, lang), cityName))}</desc><g class="grid" aria-hidden="true">${grid}</g><g class="bars">${bars}</g>${useLine}</svg>`;
}

function niceStep(raw: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

export function calcResultsHtml(o: CalcOutput, lang: Lang): string {
  const w = tp(lang);
  const t = w.calc;
  if (!o.ok || !o.city || o.kwhMonth === null) return '';
  const cityName = lang === 'sq' ? o.city.name_sq : o.city.name_en;
  const pct = Math.round(o.selfUse * 100);
  const tr = o.tariff;
  const quoteHref = href(lang, 'quote', {}, { projekt: 'solar' });

  const figs = [
    { k: t.kwp, v: `${num(o.kwp, 1, lang)} kWp`, n: t.panels(o.panels, o.panelWp) },
    { k: t.yearly, v: `${num(o.annualKwh, 0, lang)} kWh`, n: t.perKwp(num(o.city.yield, 0, lang)) },
    { k: t.selfUse, v: `${pct}%`, n: t.selfUseNote(o.input.battery) },
    { k: t.saving, v: o.annualSaving === null ? '—' : lekLong(o.annualSaving, lang), n: o.annualSaving === null ? t.noSaving : t.savingNote, hot: true },
    { k: t.payback, v: o.paybackYears === null ? '—' : t.years(num(o.paybackYears, 1, lang)), n: t.paybackNote },
    { k: t.lifetime, v: o.lifetimeSaving === null ? '—' : lekLong(o.lifetimeSaving, lang), n: t.lifetimeNote },
  ];

  let notes = '';
  if (o.fromBill) notes += `<p>${esc(t.fromBill(num(o.kwhMonth, 0, lang)))}</p>`;
  if (o.billClamped && tr) notes += `<p>${esc(t.billGap(num(tr.gapLo, 0, lang), num(tr.gapHi, 0, lang)))}</p>`;
  if (o.input.kind === 'household' && tr) {
    notes += `<p>${esc(t.cliff(num(tr.threshold, 0, lang), num(tr.low, 1, lang), num(tr.high, 1, lang)))}${o.crossesCliff ? ' <strong>' + esc(t.cliffCross(num(tr.threshold, 0, lang))) + '</strong>' : ''}</p>`;
  } else if (tr?.business) {
    notes += `<p>${esc(t.bizTariff(num(tr.business, 0, lang)))}</p>`;
  }

  const rows = o.monthlyKwh
    .map((v, i) => `<tr><th scope="row">${MONTHS[lang][i]}</th><td class="num">${num(v, 0, lang)}</td><td class="num">${num(o.kwhMonth ?? 0, 0, lang)}</td></tr>`)
    .join('');

  let kit = '';
  if (!o.kit.length) {
    kit = `<div class="empty calc-kit__empty"><p>${esc(t.kitEmpty)}</p><a class="btn btn--ghost" href="${quoteHref}">${esc(t.quote)}</a></div>`;
  } else {
    const lines = o.kit
      .map((k) => {
        const p = href(lang, 'product', { slug: k.productSlug });
        return `<tr><th scope="row"><span class="eyebrow">${esc(t.roles[k.role])}</span><a href="${p}">${esc(k.name)}</a></th><td class="num">${k.qty}</td><td class="num price">${lek(k.unitPrice, lang)}</td><td class="num price">${lek(k.lineTotal, lang)}</td><td class="calc-kit__act"><form method="post" action="/api/cart" data-kit-line><input type="hidden" name="action" value="add"/><input type="hidden" name="offerId" value="${k.offerId}"/><input type="hidden" name="qty" value="${k.qty}"/><button class="btn btn--s btn--ghost" type="submit">${esc(t.addLine)}<span class="visually-hidden"> ${esc(k.name)}</span></button></form></td></tr>`;
      })
      .join('');
    const total = o.kitTotal !== null ? `<tr class="calc-kit__total"><th scope="row" colspan="3">${esc(t.kitTotal)}</th><td class="num price">${lekLong(o.kitTotal, lang)}</td><td></td></tr>` : '';
    kit = `<div class="table-scroll"><table class="table calc-kit__table"><caption class="visually-hidden">${esc(t.kit)}</caption><thead><tr><th scope="col">${esc(t.product)}</th><th scope="col" class="num">${esc(t.qty)}</th><th scope="col" class="num">${esc(t.unit)}</th><th scope="col" class="num">${esc(t.line)}</th><th scope="col"><span class="visually-hidden">${esc(t.addLine)}</span></th></tr></thead><tbody>${lines}${total}</tbody></table></div>${o.kitTotal === null ? `<p class="notice">${esc(t.kitIncomplete)}</p>` : ''}<div class="row calc-kit__all"><button class="btn btn--copper" type="button" data-kit-all hidden>${esc(t.addAll)} <span class="arrow" aria-hidden="true">→</span></button><a class="btn btn--ghost" href="${quoteHref}">${esc(t.quote)}</a></div>`;
  }

  return `
  <div class="calc-res__head"><h2 class="title" id="res-h">${esc(t.result)}</h2><p class="eyebrow">${esc(t.forCity(cityName))} · ${num(o.kwhMonth, 0, lang)} kWh / ${lang === 'sq' ? 'muaj' : 'month'}</p></div>
  <dl class="calc-figs">${figs.map((f) => `<div class="calc-fig${f.hot ? ' is-hot' : ''}"><dt class="eyebrow">${esc(f.k)}</dt><dd class="calc-fig__v">${f.v}</dd><dd class="calc-fig__n">${esc(f.n)}</dd></div>`).join('')}</dl>
  <div class="calc-notes">${notes}</div>
  <section class="calc-chart" aria-labelledby="chart-h"><h3 class="eyebrow" id="chart-h">${esc(t.chart)}</h3>${chart(o, lang)}
    <details class="calc-chart__table"><summary>${esc(t.table)}</summary><div class="table-scroll"><table class="table"><thead><tr><th scope="col">${esc(t.month)}</th><th scope="col" class="num">${esc(t.produced)}</th><th scope="col" class="num">${esc(t.consumption)}</th></tr></thead><tbody>${rows}</tbody></table></div></details>
  </section>
  <section class="calc-kit" aria-labelledby="kit-h"><h3 class="title calc-kit__h" id="kit-h">${esc(t.kit)}</h3><p class="muted small">${esc(t.kitLede)}</p>${kit}</section>`;
}
