import type { APIRoute } from 'astro';
import { backTo, COMPARE_MAX, readCompare, wantsJson, writeCompare } from '../../lib/basket';
import { productCardsByIds } from '../../lib/catalog';
import { get } from '../../lib/db';

const payload = (ids: number[]) => ({
  ids,
  max: COMPARE_MAX,
  items: productCardsByIds(ids).map((p) => ({ id: p.id, slug: p.slug, brand: p.brand, model: p.model, name_sq: p.name_sq, name_en: p.name_en, category_id: p.category_id, min_price: p.min_price, w: p.width_mm, h: p.height_mm, d: p.depth_mm })),
});

export const GET: APIRoute = ({ cookies }) => Response.json(payload(readCompare(cookies)), { headers: { 'cache-control': 'no-store' } });

// Only products of one category compare; adding from another category starts a new list.
export const POST: APIRoute = async ({ request, cookies, url, redirect }) => {
  const ct = request.headers.get('content-type') ?? '';
  const b: any = ct.includes('application/json') ? await request.json().catch(() => ({})) : Object.fromEntries(await request.formData());
  const action = String(b.action ?? 'toggle');
  const id = Number(b.productId);
  let ids = readCompare(cookies);
  let note: 'full' | 'reset' | null = null;
  if (action === 'clear') ids = [];
  else if (Number.isInteger(id) && id > 0) {
    if (ids.includes(id)) ids = ids.filter((x) => x !== id);
    else if (action !== 'remove') {
      const cat = get<{ category_id: number }>('SELECT category_id FROM products WHERE id = ?', id)?.category_id;
      const first = ids.length ? get<{ category_id: number }>('SELECT category_id FROM products WHERE id = ?', ids[0])?.category_id : cat;
      if (cat !== first) {
        ids = [id];
        note = 'reset';
      } else if (ids.length >= COMPARE_MAX) note = 'full';
      else ids = [...ids, id];
    }
  }
  writeCompare(cookies, ids, url.protocol === 'https:');
  if (wantsJson(request)) return Response.json({ ...payload(ids), note });
  return redirect(backTo(request, url, '/'), 303);
};
