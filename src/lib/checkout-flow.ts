// Server side of the checkout and order pages (T4). Route files call these from their frontmatter,
// because only a page can redirect or set cookies before the HTML streams.
// Checkout: readCheckout → validateCheckout → price check against what the buyer saw → createOrder
// (one transaction) → card hand-off or the order page. Order page: token check, card retry.
import type { AstroGlobal } from 'astro';
import { readCart, writeCart } from './basket';
import { quote, type CartLineInput, type Quote } from './cart';
import { emptyCheckout, readCheckout, validateCheckout, type CheckoutErrors, type CheckoutValues } from './checkout';
import { all, get } from './db';
import { clientKey, isBot, rateLimited } from './forms';
import { href, type Lang } from './i18n';
import { lek } from './money';
import { randomToken } from './auth';
import { publicOrigin, secureCookies } from './origin';
import { createOrder, orderByCode, orderForNonce, OrderError, recordPayment, settleEarlierPayments } from './orders';
import { createCardPayment, paymentMode } from './payments';
import { tco } from '../i18n/checkout';
import { cities, cityName, codLimit, parseSeen, parseSeenTotal, productName, readCity } from './checkout-view';

export type CheckoutState = {
  values: CheckoutValues;
  errors: CheckoutErrors;
  formError: null | 'rate' | 'stale';
  changes: string[];
  lines: CartLineInput[];
  quote: Quote;
  nonce: string;
};

type Ctx = Pick<AstroGlobal, 'request' | 'cookies' | 'url' | 'redirect' | 'clientAddress'>;

// One-time token of the drawn checkout form, also kept in an HttpOnly cookie: a post must carry the
// same value, and createOrder records it, so a double submit (no scripts, or a slow network) finds it
// used and lands on the order the first post created.
const NONCE_COOKIE = 'beed_co';

function formNonce(ctx: Ctx, fresh = false): string {
  const have = ctx.cookies.get(NONCE_COOKIE)?.value ?? '';
  if (!fresh && /^[\w-]{16,40}$/.test(have) && !orderForNonce(have)) return have;
  const n = randomToken(18);
  ctx.cookies.set(NONCE_COOKIE, n, { path: '/', httpOnly: true, sameSite: 'lax', secure: secureCookies(ctx.url), maxAge: 60 * 60 * 6 });
  return n;
}

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

/** Albanian buyers see one total; the order goes through only at the prices and the total they saw. */
function priceChanges(seenRaw: string, seenTotal: number | null, q: Quote, lang: Lang): string[] {
  const t = tco(lang).co.changed;
  const out: string[] = [];
  if (seenRaw) {
    const seen = parseSeen(seenRaw);
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
  }
  // Same lines, different total: a delivery fee, zone surcharge or free-delivery threshold moved.
  if (seenTotal !== null && seenTotal !== q.total) out.push(t.total(lek(seenTotal, lang), lek(q.total, lang)));
  return out;
}

const orderLink = (lang: Lang, o: { code: string; token: string }, extra?: Record<string, string>) => href(lang, 'order', { code: o.code }, { k: o.token, ...extra });

export async function checkoutPage(ctx: Ctx, lang: Lang): Promise<Response | CheckoutState> {
  const { request, cookies, url, redirect } = ctx;
  const lines = readCart(cookies);
  const cartUrl = href(lang, 'cart');

  if (request.method !== 'POST') {
    if (!lines.length) return redirect(cartUrl, 303);
    const values = emptyCheckout();
    const c = readCity(url, cities());
    if (c) values.city = c.slug;
    const q = quoteFor(lines, values);
    if (!q.codAllowed) values.payment = 'bank';
    return { values, errors: {}, formError: null, changes: [], lines, quote: q, nonce: formNonce(ctx) };
  }

  const form = await request.formData();
  // A second post of a form that already made an order goes to that order (the first post emptied the basket).
  const sentNonce = String(form.get('nonce') ?? '');
  const done = orderForNonce(sentNonce);
  if (done) return redirect(orderLink(lang, done), 303);
  if (!lines.length) return redirect(cartUrl, 303);
  if (isBot(form)) return redirect(cartUrl, 303);
  const values = readCheckout(form);
  let q = quoteFor(lines, values);
  const state: CheckoutState = { values, errors: {}, formError: null, changes: [], lines, quote: q, nonce: '' };
  if (rateLimited(`checkout:${clientKey(request, ctx.clientAddress)}`, 12)) {
    state.formError = 'rate';
    state.nonce = formNonce(ctx);
    return state;
  }
  const cookieNonce = cookies.get(NONCE_COOKIE)?.value ?? '';
  if (!sentNonce || sentNonce !== cookieNonce) {
    // An old tab, or a form from before the cookie expired: draw it again with a fresh token.
    state.formError = 'stale';
    state.nonce = formNonce(ctx, true);
    return state;
  }
  state.nonce = sentNonce;

  const source = String(form.get('source') ?? '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'web';
  const { input, errors } = validateCheckout(values, lines, lang, source);
  state.errors = errors;
  const t = tco(lang).co;
  const seenTotal = parseSeenTotal(String(form.get('seen_total') ?? ''));
  state.changes = priceChanges(String(form.get('seen') ?? ''), seenTotal, q, lang);
  if (!q.ok && q.lines.length) {
    const c = cities().find((x) => x.slug === values.city);
    const city = c ? cityName(c, lang) : '';
    for (const l of q.lines) if (l.problem) state.changes.push(problemText(l, lang, city));
  }
  if (values.payment === 'cod' && !q.codAllowed) state.errors.payment = t.codError(lek(codLimit(), lang));
  if (!input || Object.keys(state.errors).length || state.changes.length) return state;

  let order: ReturnType<typeof createOrder>;
  try {
    order = createOrder({ ...input, expectedTotal: seenTotal ?? undefined, nonce: sentNonce });
  } catch (e) {
    if (e instanceof OrderError) {
      if (e.code === 'duplicate') {
        const o = orderForNonce(sentNonce);
        return redirect(o ? orderLink(lang, o) : cartUrl, 303);
      }
      if (e.code === 'empty') return redirect(cartUrl, 303);
      q = e.quote ?? quoteFor(lines, values);
      state.quote = q;
      if (e.code === 'payment') state.errors.payment = t.codError(lek(codLimit(), lang));
      else {
        const c = cities().find((x) => x.slug === values.city);
        const city = c ? cityName(c, lang) : '';
        const probs = q.lines.filter((l) => l.problem).map((l) => problemText(l, lang, city));
        if (!probs.length && seenTotal !== null && seenTotal !== q.total) probs.push(t.changed.total(lek(seenTotal, lang), lek(q.total, lang)));
        state.changes = probs.length ? probs : [t.changed.removed];
      }
      return state;
    }
    throw e;
  }

  writeCart(cookies, [], secureCookies(url));
  cookies.delete(NONCE_COOKIE, { path: '/' });
  const orderPath = (extra?: Record<string, string>) => orderLink(lang, order, extra);
  if (values.payment !== 'card') return redirect(orderPath(), 303);
  return startCard(ctx, order.id, order.code, order.token, orderPath);
}

async function startCard(ctx: Ctx, orderId: number, code: string, token: string, orderPath: (extra?: Record<string, string>) => string) {
  // A retry first asks the provider about earlier attempts: a paid one whose webhook was lost must
  // settle the order, not start a second charge.
  if (await settleEarlierPayments(orderId)) return ctx.redirect(orderPath({ pagesa: 'ok' }), 303);
  const o = get<any>('SELECT total_all, delivery_all FROM orders WHERE id = ?', orderId)!;
  const items = all<any>('SELECT product_name, qty, unit_price_all FROM order_items WHERE order_id = ? ORDER BY id', orderId);
  const origin = publicOrigin(ctx.url);
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
  recordPayment(orderId, pay.providerId, o.total_all);
  return ctx.redirect(pay.redirect, 303);
}

export type OrderState = { order: NonNullable<ReturnType<typeof orderByCode>> | null; mode: ReturnType<typeof paymentMode> };

export async function orderPage(ctx: Ctx & Pick<AstroGlobal, 'params' | 'response'>, lang: Lang): Promise<Response | OrderState> {
  // The page shows a name, a phone and an address behind a token link: never cached, never indexed.
  ctx.response.headers.set('Cache-Control', 'no-store');
  ctx.response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  const code = String(ctx.params.code ?? '');
  const k = ctx.url.searchParams.get('k') ?? '';
  const order = code && k ? orderByCode(code, k) : null;
  if (!order) {
    ctx.response.status = 404;
    return { order: null, mode: paymentMode() };
  }
  if (ctx.request.method === 'POST') {
    const form = await ctx.request.formData();
    const canRetry = order.payment_method === 'card' && order.payment_status !== 'paid' && order.status !== 'cancelled' && paymentMode() !== 'off';
    if (form.get('action') === 'retry' && canRetry) {
      if (rateLimited(`retry:${clientKey(ctx.request, ctx.clientAddress)}`, 10)) return ctx.redirect(href(lang, 'order', { code }, { k, pagesa: 'nisja' }), 303);
      return startCard(ctx, order.id, order.code, order.token, (extra) => orderLink(lang, order, extra));
    }
    return ctx.redirect(href(lang, 'order', { code }, { k }), 303);
  }
  return { order, mode: paymentMode() };
}
