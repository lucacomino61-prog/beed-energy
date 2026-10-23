// POST /api/admin/offers/quick — the offers grid's quick price/stock save when scripts run.
// JSON { id, price, stock, _csrf }. Same rules as the form post: CSRF token of the session, sellers only their own offers.
import type { APIRoute } from 'astro';
import { csrfOk } from '../../../../lib/auth';
import { Forbidden, quickOffer } from '../../../../lib/admin';
import { adminLang } from '../../../../lib/admin-panel';
import { ta } from '../../../../i18n/admin';
import { date } from '../../../../lib/i18n';
import { get } from '../../../../lib/db';
import { lek } from '../../../../lib/money';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const toNum = (v: unknown) => {
  const s = String(v ?? '').replace(/[\s  ]/g, '').replace(',', '.');
  return s === '' ? NaN : Number(s);
};

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const user = locals.user;
  if (!user) return json({ error: 'auth' }, 401);
  const t = ta(adminLang(cookies));
  const lang = adminLang(cookies);
  const b = await request.json().catch(() => null);
  if (!b || typeof b !== 'object') return json({ error: 'body', message: t.err.generic }, 400);
  const fd = new FormData();
  fd.set('_csrf', String((b as any)._csrf ?? ''));
  if (!csrfOk(user, fd)) return json({ error: 'csrf', message: t.err.csrf }, 403);
  const id = Number((b as any).id);
  const price = toNum((b as any).price);
  const stock = toNum((b as any).stock);
  if (!Number.isInteger(id) || !Number.isFinite(price) || !Number.isInteger(stock)) return json({ error: 'invalid', message: t.offers.quickErr }, 422);
  try {
    if (!quickOffer(user, id, Math.round(price), stock)) return json({ error: 'invalid', message: t.offers.quickErr }, 422);
  } catch (e) {
    if (e instanceof Forbidden) return json({ error: 'forbidden', message: t.forbidden.title }, 403);
    throw e;
  }
  const row = get<{ price_all: number; stock_qty: number; updated_at: string }>('SELECT price_all, stock_qty, updated_at FROM offers WHERE id = ?', id)!;
  return json({ ok: true, price: row.price_all, stock: row.stock_qty, price_label: lek(row.price_all, lang), updated_label: date(row.updated_at, lang, true) });
};
