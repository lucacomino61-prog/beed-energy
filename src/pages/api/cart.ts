import type { APIRoute } from 'astro';
import { applyCartAction, backTo, cartCount, readCart, wantsJson, writeCart } from '../../lib/basket';
import { quote } from '../../lib/cart';
import { href, langFromPath } from '../../lib/i18n';
import { secureCookies } from '../../lib/origin';

const summary = (lines: ReturnType<typeof readCart>, cityId: number | null) => {
  const q = quote(lines, { cityId });
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

export const GET: APIRoute = ({ cookies, url }) => {
  const cityId = Number(url.searchParams.get('city')) || null;
  return Response.json(summary(readCart(cookies), cityId), { headers: { 'cache-control': 'no-store' } });
};

export const POST: APIRoute = async ({ request, cookies, url, redirect }) => {
  const ct = request.headers.get('content-type') ?? '';
  let action = 'add';
  let offerId = 0;
  let qty = 1;
  if (ct.includes('application/json')) {
    const b = await request.json().catch(() => ({}));
    action = String(b.action ?? 'add');
    offerId = Number(b.offerId);
    qty = Math.floor(Number(b.qty ?? 1));
  } else {
    const f = await request.formData();
    action = String(f.get('action') ?? 'add');
    offerId = Number(f.get('offerId'));
    qty = Math.floor(Number(f.get('qty') ?? 1));
  }
  if (action !== 'clear' && (!Number.isInteger(offerId) || offerId <= 0)) {
    return wantsJson(request) ? Response.json({ error: 'offer' }, { status: 400 }) : redirect(backTo(request, url, '/'), 303);
  }
  if (!Number.isFinite(qty)) qty = 1;
  const next = applyCartAction(readCart(cookies), action, offerId, Math.min(9999, qty));
  writeCart(cookies, next, secureCookies(url));
  if (wantsJson(request)) return Response.json(summary(next, null));
  // Without scripts: an add goes to the basket, other changes go back where they came from.
  const lang = langFromPath(new URL(request.headers.get('referer') ?? url.href, url).pathname);
  return redirect(action === 'add' ? href(lang, 'cart', {}, { shtuar: offerId }) : backTo(request, url, href(lang, 'cart')), 303);
};
