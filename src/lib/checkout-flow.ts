// Server side of the checkout and order pages (T4). Route files call these from their frontmatter,
// because only a page can redirect or set cookies before the HTML streams.
// Checkout: readCheckout → validateCheckout → price check against what the buyer saw → createOrder
// (one transaction) → card hand-off or the order page. Order page: token check, card retry.
import type { AstroGlobal } from 'astro';
import { readCart, writeCart } from './basket';
import { quote, type CartLineInput, type Quote } from './cart';
import { emptyCheckout, readCheckout, validateCheckout, type CheckoutErrors, type CheckoutValues } from './checkout';
import { all, get, run } from './db';
import { clientKey, isBot, rateLimited } from './forms';
import { href, type Lang } from './i18n';
import { lek } from './money';
import { createOrder, orderByCode, OrderError } from './orders';
import { createCardPayment, paymentMode } from './payments';
import { tco } from '../i18n/checkout';
import { cities, cityName, codLimit, parseSeen, productName, readCity } from './checkout-view';

export type CheckoutState = {
  values: CheckoutValues;
  errors: CheckoutErrors;
  formError: null | 'rate';
  changes: string[];
  lines: CartLineInput[];
  quote: Quote;
};

type Ctx = Pick<AstroGlobal, 'request' | 'cookies' | 'url' | 'redirect' | 'clientAddress'>;

const cityIdOf = (slug: string) => get<{ id: number }>('SELECT id FROM cities WHERE slug = ?', slug)?.id ?? null;

function quoteFor(lines: CartLineInput[], v: CheckoutValues) {
  return quote(lines, { cityId: cityIdOf(v.city), pickup: v.delivery === 'pickup' });
}

function problemText(l: Quote['lines'][number], lang: Lang, city: string): string {
  const t = tco(lang).cart.problem;
  const name = productName(l, lang);
  const why = l.problem === 'stock' ? t.stock(l.stock) : l.problem === 'min' ? t.min(l.minQty) : l.problem === 'zone' ? t.zone(city) : t.gone;
  return `${name}: ${why}`;
}

/** Albanian buyers see one total; the order goes through only at the prices they saw. */
function priceChanges(seenRaw: string, q: Quote, lang: Lang): string[] {
  if (!seenRaw) return [];
  const t = tco(lang).co.changed;
  const seen = parseSeen(seenRaw);
  const out: string[] = [];
  for (const l of q.lines) {
    const s = seen.get(l.offerId);
    const name = productName(l, lang);
    if (!s) out.push(t.added(name));
    else {
      if (s.qty !== l.qty) out.push(t.qty(name, s.qty, l.qty));
      else if (s.price !== l.unitPrice) out.push(t.price(name, lek(s.price, lang), lek(l.unitPrice, lang)));
    }
  }
  for (const id of seen.keys()) if (!q.lines.some((l) => l.offerId === id)) out.push(t.removed);
  return out;
}

export async function checkoutPage(ctx: Ctx, lang: Lang): Promise<Response | CheckoutState> {
  const { request, cookies, url, redirect } = ctx;
  const lines = readCart(cookies);
  const cartUrl = href(lang, 'cart');
  if (!lines.length) return redirect(cartUrl, 303);

  if (request.method !== 'POST') {
    const values = emptyCheckout();
    const c = readCity(url, cities());
    if (c) values.city = c.slug;
    const q = quoteFor(lines, values);
    if (!q.codAllowed) values.payment = 'bank';
    return { values, errors: {}, formError: null, changes: [], lines, quote: q };
  }

  const form = await request.formData();
  if (isBot(form)) return redirect(cartUrl, 303);
  const values = readCheckout(form);
  let q = quoteFor(lines, values);
  const state: CheckoutState = { values, errors: {}, formError: null, changes: [], lines, quote: q };
  if (rateLimited(`checkout:${clientKey(request, ctx.clientAddress)}`, 12)) {
    state.formError = 'rate';
    return state;
  }

  const source = String(form.get('source') ?? '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'web';
  const { input, errors } = validateCheckout(values, lines, lang, source);
  state.errors = errors;
  const t = tco(lang).co;
  state.changes = priceChanges(String(form.get('seen') ?? ''), q, lang);
  if (!q.ok && q.lines.length) {
    const c = cities().find((x) => x.slug === values.city);
    const city = c ? cityName(c, lang) : '';
    for (const l of q.lines) if (l.problem) state.changes.push(problemText(l, lang, city));
  }
  if (values.payment === 'cod' && !q.codAllowed) state.errors.payment = t.codError(lek(codLimit(), lang));
  if (!input || Object.keys(state.errors).length || state.changes.length) return state;

  let order: ReturnType<typeof createOrder>;
  try {
    order = createOrder(input);
  } catch (e) {
    if (e instanceof OrderError) {
      if (e.code === 'empty') return redirect(cartUrl, 303);
      q = e.quote ?? quoteFor(lines, values);
      state.quote = q;
      if (e.code === 'payment') state.errors.payment = t.codError(lek(codLimit(), lang));
      else {
        const c = cities().find((x) => x.slug === values.city);
        const city = c ? cityName(c, lang) : '';
        const probs = q.lines.filter((l) => l.problem).map((l) => problemText(l, lang, city));
        state.changes = probs.length ? probs : [t.changed.removed];
      }
      return state;
    }
    throw e;
  }

  const secure = url.protocol === 'https:';
  writeCart(cookies, [], secure);
  const orderPath = (extra?: Record<string, string>) => href(lang, 'order', { code: order.code }, { k: order.token, ...extra });
  if (values.payment !== 'card') return redirect(orderPath(), 303);
  return startCard(ctx, order.id, order.code, order.token, orderPath);
}

async function startCard(ctx: Ctx, orderId: number, code: string, token: string, orderPath: (extra?: Record<string, string>) => string) {
  const o = get<any>('SELECT total_all, delivery_all FROM orders WHERE id = ?', orderId)!;
  const items = all<any>('SELECT product_name, qty, unit_price_all FROM order_items WHERE order_id = ? ORDER BY id', orderId);
  const origin = ctx.url.origin;
  const pay = await createCardPayment({
    code,
    total: o.total_all,
    delivery: o.delivery_all,
    items: items.map((i) => ({ name: i.product_name, qty: i.qty, price: i.unit_price_all })),
    okUrl: origin + orderPath({ pagesa: 'ok' }),
    failUrl: origin + orderPath({ pagesa: 'deshtoi' }),
    webhookUrl: `${origin}/api/pay/pok-webhook`,
    testUrl: `/api/pay/test?code=${encodeURIComponent(code)}&k=${encodeURIComponent(token)}`,
  });
  if (!pay.ok) return ctx.redirect(orderPath({ pagesa: 'nisja' }), 303);
  run("UPDATE orders SET payment_ref = ?, updated_at = datetime('now') WHERE id = ?", pay.providerId, orderId);
  return ctx.redirect(pay.redirect, 303);
}

export type OrderState = { order: NonNullable<ReturnType<typeof orderByCode>> | null; mode: ReturnType<typeof paymentMode> };

export async function orderPage(ctx: Ctx & Pick<AstroGlobal, 'params' | 'response'>, lang: Lang): Promise<Response | OrderState> {
  const code = String(ctx.params.code ?? '');
  const k = ctx.url.searchParams.get('k') ?? '';
  const order = code && k ? orderByCode(code, k) : null;
  if (!order) {
    ctx.response.status = 404;
    return { order: null, mode: paymentMode() };
  }
  if (ctx.request.method === 'POST') {
    const form = await ctx.request.formData();
    if (form.get('action') === 'retry' && order.payment_method === 'card' && order.payment_status !== 'paid') {
      if (rateLimited(`retry:${clientKey(ctx.request, ctx.clientAddress)}`, 10)) return ctx.redirect(href(lang, 'order', { code }, { k, pagesa: 'nisja' }), 303);
      return startCard(ctx, order.id, order.code, order.token, (extra) => href(lang, 'order', { code: order.code }, { k: order.token, ...extra }));
    }
    return ctx.redirect(href(lang, 'order', { code }, { k }), 303);
  }
  return { order, mode: paymentMode() };
}
