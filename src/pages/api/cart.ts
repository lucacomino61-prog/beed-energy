import type { APIRoute } from 'astro';
import { applyCartAction, backTo, cartCount, readCart, wantsJson, writeCart } from '../../lib/basket';
import { quote, type CartLineInput } from '../../lib/cart';
import { href, langFromPath } from '../../lib/i18n';
import { secureCookies } from '../../lib/origin';

const summary = async (lines: Awaited<ReturnType<typeof readCart>>, cityId: number | null) => {
  const q = await quote(lines, { cityId });
  return {
    count: cartCount(lines),
    subtotal: q.subtotal,
    delivery: q.delivery,
    total: q.total,
    vat: q.vat,
    ok: q.ok,
    lines: q.lines.map((l) => ({
      offerId: l.offerId,
      slug: l.slug,
      brand: l.brand,
      model: l.model,
      name_sq: l.name_sq,
      name_en: l.name_en,
      seller: l.sellerName,
      qty: l.qty,
      unitPrice: l.unitPrice,
      listPrice: l.listPrice,
      lineTotal: l.lineTotal,
      stock: l.stock,
      minQty: l.minQty,
      problem: l.problem,
      w: l.width_mm,
      h: l.height_mm,
      d: l.depth_mm,
    })),
    parcels: q.parcels,
  };
};

export const GET: APIRoute = async ({ cookies, url }) => {
  const cityId = Number(url.searchParams.get('city')) || null;
  return Response.json(await summary(readCart(cookies), cityId), { headers: { 'cache-control': 'no-store' } });
};

/** add-many (a whole solar package in one click): at most this many lines per request. */
const MANY_MAX = 12;
const isId = (n: number) => Number.isInteger(n) && n > 0;
const isQty = (n: number) => Number.isInteger(n) && n >= 1 && n <= 9999;

/** add-many lines, or null when the list is empty, too long or any line is not a positive whole offer id with qty 1–9999. */
function manyLines(ids: unknown[], qtys: unknown[]): CartLineInput[] | null {
  if (!ids.length || ids.length > MANY_MAX) return null;
  // The form sends one qty per offerId; with no qty fields at all every line is 1.
  if (qtys.length && qtys.length !== ids.length) return null;
  const lines = ids.map((id, i) => ({ offerId: Number(id), qty: qtys.length ? Number(qtys[i]) : 1 }));
  return lines.every((l) => isId(l.offerId) && isQty(l.qty)) ? lines : null;
}

export const POST: APIRoute = async ({ request, cookies, url, redirect }) => {
  const ct = request.headers.get('content-type') ?? '';
  let action = 'add';
  let offerId = 0;
  let qty = 1;
  let many: CartLineInput[] | null = null;
  if (ct.includes('application/json')) {
    const b = await request.json().catch(() => ({}));
    action = String(b?.action ?? 'add');
    if (action === 'add-many') {
      const raw: unknown[] = Array.isArray(b?.lines) ? b.lines : [];
      many = manyLines(raw.map((l: any) => l?.offerId), raw.map((l: any) => l?.qty ?? 1));
    } else {
      offerId = Number(b?.offerId);
      qty = Math.floor(Number(b?.qty ?? 1));
    }
  } else {
    const f = await request.formData();
    action = String(f.get('action') ?? 'add');
    if (action === 'add-many') many = manyLines(f.getAll('offerId'), f.getAll('qty'));
    else {
      offerId = Number(f.get('offerId'));
      qty = Math.floor(Number(f.get('qty') ?? 1));
    }
  }
  const lang = langFromPath(new URL(request.headers.get('referer') ?? url.href, url).pathname);

  if (action === 'add-many') {
    if (!many) return wantsJson(request) ? Response.json({ error: 'lines' }, { status: 400 }) : redirect(backTo(request, url, '/'), 303);
    const next = many.reduce((acc, l) => applyCartAction(acc, 'add', l.offerId, l.qty), readCart(cookies));
    writeCart(cookies, next, secureCookies(url));
    if (wantsJson(request)) return Response.json(await summary(next, null));
    return redirect(href(lang, 'cart', {}, { shtuar: [...new Set(many.map((l) => l.offerId))].join(',') }), 303);
  }

  if (action !== 'clear' && (!Number.isInteger(offerId) || offerId <= 0)) {
    return wantsJson(request) ? Response.json({ error: 'offer' }, { status: 400 }) : redirect(backTo(request, url, '/'), 303);
  }
  if (!Number.isFinite(qty)) qty = 1;
  const next = applyCartAction(readCart(cookies), action, offerId, Math.min(9999, qty));
  writeCart(cookies, next, secureCookies(url));
  if (wantsJson(request)) return Response.json(await summary(next, null));
  // Without scripts: an add goes to the basket, other changes go back where they came from.
  return redirect(action === 'add' ? href(lang, 'cart', {}, { shtuar: offerId }) : backTo(request, url, href(lang, 'cart')), 303);
};
