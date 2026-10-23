// Order creation: re-quote from the database, lock stock in one transaction, write the order,
// its lines (with the platform commission per seller) and the first timeline event.
import { all, get, run, tx } from './db';
import { quote, type CartLineInput, type Quote } from './cart';
import { randomToken } from './auth';

export type OrderInput = {
  lines: CartLineInput[];
  customerType: 'individual' | 'business';
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  nipt: string | null;
  cityId: number;
  address: string;
  notes: string | null;
  delivery: 'courier' | 'pickup';
  payment: 'cod' | 'bank' | 'card';
  lang: 'sq' | 'en';
  source?: string | null;
};

export const ORDER_STATUSES = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class OrderError extends Error {
  constructor(public code: 'empty' | 'changed' | 'payment', public quote?: Quote) {
    super(code);
  }
}

/** BD-2610-00042: year+month and a running number, readable over the phone. */
function nextCode(): string {
  const d = new Date();
  const ym = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  const last = get<{ n: number }>(`SELECT COUNT(*) AS n FROM orders WHERE code LIKE ?`, `BD-${ym}-%`)?.n ?? 0;
  return `BD-${ym}-${String(last + 1).padStart(5, '0')}`;
}

export function createOrder(input: OrderInput) {
  return tx(() => {
    const q = quote(input.lines, { cityId: input.cityId, pickup: input.delivery === 'pickup' });
    if (!q.lines.length) throw new OrderError('empty');
    if (!q.ok) throw new OrderError('changed', q);
    if (input.payment === 'cod' && !q.codAllowed) throw new OrderError('payment', q);

    for (const l of q.lines) {
      const r = run('UPDATE offers SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?', l.qty, l.offerId, l.qty);
      if (r.changes !== 1) throw new OrderError('changed', q);
    }

    const code = nextCode();
    const token = randomToken(12);
    const { id } = run(
      `INSERT INTO orders (code, token, customer_type, name, phone, email, company, nipt, city_id, address, notes,
                           delivery_method, payment_method, subtotal_all, delivery_all, total_all, vat_all, commission_all, lang, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      code, token, input.customerType, input.name, input.phone, input.email, input.company, input.nipt, input.cityId,
      input.address, input.notes, input.delivery, input.payment, q.subtotal, q.delivery, q.total, q.vat, q.commission,
      input.lang, input.source ?? null,
    );
    for (const l of q.lines) {
      const commission = Math.round((l.lineTotal * l.commissionPct) / 100);
      run(
        `INSERT INTO order_items (order_id, offer_id, product_id, seller_id, product_name, seller_name, unit_price_all, qty, line_total_all, commission_pct, commission_all)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id, l.offerId, l.productId, l.sellerId, `${l.brand} ${l.model}`, l.sellerName, l.unitPrice, l.qty, l.lineTotal, l.commissionPct, commission,
      );
    }
    run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', id, 'new', null, 'buyer');
    return { id, code, token, quote: q };
  });
}

export function orderByCode(code: string, token: string) {
  const o = get<any>('SELECT o.*, c.name_sq AS city_sq, c.name_en AS city_en FROM orders o LEFT JOIN cities c ON c.id = o.city_id WHERE code = ?', code);
  if (!o || o.token !== token) return null;
  return { ...o, items: all<any>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', o.id), events: orderEvents(o.id) };
}

export function orderEvents(orderId: number) {
  return all<any>('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at, id', orderId);
}

/** Staff status change; cancelling returns the stock. */
export function setOrderStatus(orderId: number, status: OrderStatus, actor: string, note?: string) {
  return tx(() => {
    const o = get<{ status: string }>('SELECT status FROM orders WHERE id = ?', orderId);
    if (!o || o.status === status) return false;
    if (status === 'cancelled' && o.status !== 'cancelled') {
      for (const it of all<{ offer_id: number | null; qty: number }>('SELECT offer_id, qty FROM order_items WHERE order_id = ?', orderId)) {
        if (it.offer_id) run('UPDATE offers SET stock_qty = stock_qty + ? WHERE id = ?', it.qty, it.offer_id);
      }
    }
    run("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?", status, orderId);
    run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', orderId, status, note ?? null, actor);
    return true;
  });
}

export function markPaid(orderId: number, ref: string, actor = 'gateway') {
  run("UPDATE orders SET payment_status = 'paid', payment_ref = ?, updated_at = datetime('now') WHERE id = ?", ref, orderId);
  run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', orderId, 'paid', ref, actor);
}

/** Albanian tax ID: one letter, eight digits, one letter (e.g. L12345678A). */
export function validNipt(s: string): boolean {
  return /^[A-Z]\d{8}[A-Z]$/.test(s.trim().toUpperCase());
}

/** Albanian phone numbers: mobiles 06x xxx xxxx, landlines, or +355 forms. */
export function normalisePhone(s: string): string | null {
  const d = s.replace(/[\s().-]/g, '');
  const m = d.match(/^(?:\+355|00355|0)(\d{8,9})$/);
  return m ? `+355${m[1]}` : null;
}
