// Order creation: re-quote from the database, lock stock in one transaction, write the order,
// its lines (with the platform commission per seller), its parcels and the first timeline event.
import { timingSafeEqual } from 'node:crypto';
import { all, get, run, tx } from './db';
import { quote, type CartLineInput, type Quote } from './cart';
import { randomToken } from './auth';
import { isPaidAtProvider } from './payments';

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
  /** The total the buyer saw on the form; the order is refused inside the transaction if it moved. */
  expectedTotal?: number;
  /** One-time token of the drawn form (double submits). */
  nonce?: string;
};

export const ORDER_STATUSES = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class OrderError extends Error {
  constructor(
    public code: 'empty' | 'changed' | 'payment' | 'duplicate',
    public quote?: Quote,
    public orderId?: number,
  ) {
    super(code);
  }
}

/** BD-2610-00042: year+month and a running number, readable over the phone. */
function nextCode(): string {
  const d = new Date();
  const ym = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  // MAX, not COUNT: a deleted order in the middle must not hand out a code that is still in use.
  const last = get<{ n: number | null }>(`SELECT MAX(CAST(substr(code, 9) AS INTEGER)) AS n FROM orders WHERE code LIKE ?`, `BD-${ym}-%`)?.n ?? 0;
  return `BD-${ym}-${String(last + 1).padStart(5, '0')}`;
}

/** The order an already used checkout form created, if any. */
export function orderForNonce(nonce: string): { id: number; code: string; token: string; lang: string } | undefined {
  if (!nonce) return undefined;
  return get('SELECT o.id, o.code, o.token, o.lang FROM checkout_nonces n JOIN orders o ON o.id = n.order_id WHERE n.nonce = ?', nonce);
}

export function createOrder(input: OrderInput) {
  return tx(() => {
    if (input.nonce) {
      const used = get<{ order_id: number }>('SELECT order_id FROM checkout_nonces WHERE nonce = ?', input.nonce);
      if (used) throw new OrderError('duplicate', undefined, used.order_id);
    }
    const q = quote(input.lines, { cityId: input.cityId, pickup: input.delivery === 'pickup' });
    if (!q.lines.length) throw new OrderError('empty');
    if (!q.ok) throw new OrderError('changed', q);
    if (input.expectedTotal !== undefined && input.expectedTotal !== q.total) throw new OrderError('changed', q);
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
    // The fee each parcel was charged, as quoted: slips and order pages read it back instead of recomputing.
    for (const p of q.parcels) {
      run('INSERT INTO order_parcels (order_id, seller_id, seller_name, subtotal_all, fee_all, free) VALUES (?, ?, ?, ?, ?, ?)', id, p.sellerId, p.sellerName, p.subtotal, p.fee, p.free ? 1 : 0);
    }
    if (input.nonce) run('INSERT INTO checkout_nonces (nonce, order_id) VALUES (?, ?)', input.nonce, id);
    run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', id, 'new', null, 'buyer');
    return { id, code, token, quote: q };
  });
}

/** Constant-time comparison of an order or thread token. */
export function tokenMatches(stored: string, sent: string): boolean {
  const a = Buffer.from(String(stored));
  const b = Buffer.from(String(sent));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function orderByCode(code: string, token: string) {
  const o = get<any>('SELECT o.*, c.name_sq AS city_sq, c.name_en AS city_en FROM orders o LEFT JOIN cities c ON c.id = o.city_id WHERE code = ?', code);
  if (!o || !tokenMatches(o.token, token)) return null;
  return { ...o, items: all<any>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', o.id), events: orderEvents(o.id) };
}

export function orderEvents(orderId: number) {
  return all<any>('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at, id', orderId);
}

export type StatusResult = 'ok' | 'same' | 'missing' | 'cancelled';

/**
 * Staff status change; cancelling returns the stock. A cancelled order stays cancelled: its stock is
 * already back on sale, so reopening it would sell the same units twice.
 */
export function setOrderStatus(orderId: number, status: OrderStatus, actor: string, note?: string): StatusResult {
  return tx(() => {
    const o = get<{ status: string }>('SELECT status FROM orders WHERE id = ?', orderId);
    if (!o) return 'missing';
    if (o.status === status) return 'same';
    if (o.status === 'cancelled') return 'cancelled';
    if (status === 'cancelled') {
      for (const it of all<{ offer_id: number | null; qty: number }>('SELECT offer_id, qty FROM order_items WHERE order_id = ?', orderId)) {
        if (it.offer_id) run('UPDATE offers SET stock_qty = stock_qty + ? WHERE id = ?', it.qty, it.offer_id);
      }
    }
    run("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?", status, orderId);
    run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', orderId, status, note ?? null, actor);
    return 'ok';
  });
}

export const PAID_AFTER_CANCEL = 'paid after cancellation: refund';

/**
 * Marks an order paid once. Repeated calls (webhook retries, a second click) change nothing.
 * A cancelled order is never marked paid: the money still arrived, so the timeline gets a note that
 * it has to be refunded.
 */
export function markPaid(orderId: number, ref: string, actor = 'gateway'): 'paid' | 'already' | 'cancelled' | 'missing' {
  return tx(() => {
    const o = get<{ status: string; payment_status: string }>('SELECT status, payment_status FROM orders WHERE id = ?', orderId);
    if (!o) return 'missing';
    run("UPDATE payments SET status = 'paid' WHERE order_id = ? AND provider_id = ?", orderId, ref);
    if (o.status === 'cancelled') {
      const note = `${PAID_AFTER_CANCEL} · ${ref}`;
      if (!get('SELECT 1 AS x FROM order_events WHERE order_id = ? AND status = ? AND note = ?', orderId, 'note', note)) {
        run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', orderId, 'note', note, actor);
      }
      return 'cancelled';
    }
    const r = run("UPDATE orders SET payment_status = 'paid', payment_ref = ?, updated_at = datetime('now') WHERE id = ? AND payment_status != 'paid'", ref, orderId);
    if (r.changes !== 1) return 'already';
    run('INSERT INTO order_events (order_id, status, note, actor) VALUES (?, ?, ?, ?)', orderId, 'paid', ref, actor);
    return 'paid';
  });
}

// ---------- card payment attempts ----------

/** Records a new attempt at the provider and shows it as the order's latest reference. */
export function recordPayment(orderId: number, providerId: string, amount: number) {
  tx(() => {
    run('INSERT INTO payments (order_id, provider_id, amount_all) VALUES (?, ?, ?)', orderId, providerId, amount);
    run("UPDATE orders SET payment_ref = ?, updated_at = datetime('now') WHERE id = ?", providerId, orderId);
  });
}

export function paymentByProviderId(providerId: string) {
  return get<{ id: number; order_id: number; provider_id: string; status: string; amount_all: number }>('SELECT * FROM payments WHERE provider_id = ?', providerId);
}

export function latestOpenPayment(orderId: number) {
  return get<{ provider_id: string; amount_all: number }>("SELECT provider_id, amount_all FROM payments WHERE order_id = ? AND status = 'created' ORDER BY id DESC LIMIT 1", orderId);
}

export function failPayment(orderId: number, providerId: string) {
  run("UPDATE payments SET status = 'failed' WHERE order_id = ? AND provider_id = ? AND status = 'created'", orderId, providerId);
}

/**
 * Before a retry (or a timeout cancel): asks the provider about every earlier attempt of this order.
 * A buyer whose first payment went through but whose webhook never arrived must not be charged twice.
 * Returns true when one of them turned out paid (the order is then marked paid).
 */
export async function settleEarlierPayments(orderId: number): Promise<boolean> {
  const o = get<{ code: string; total_all: number }>('SELECT code, total_all FROM orders WHERE id = ?', orderId);
  if (!o) return false;
  for (const p of all<{ provider_id: string }>("SELECT provider_id FROM payments WHERE order_id = ? AND status = 'created' ORDER BY id", orderId)) {
    if (await isPaidAtProvider(p.provider_id, { code: o.code, amount: o.total_all })) {
      markPaid(orderId, p.provider_id, 'pok');
      return true;
    }
  }
  return false;
}

// ---------- unpaid card orders ----------

const UNPAID_MINUTES = 45; // POK's card form expires after 30 minutes; 15 more for a late webhook
let lastSweep = 0;

/**
 * Card orders still unpaid after 45 minutes hold stock nobody will buy: cancel them (which returns the
 * stock), after one last look at the provider. Only orders still 'new': staff who touched an order own it.
 */
export async function sweepUnpaidCardOrders(): Promise<number> {
  const stale = all<{ id: number }>(
    `SELECT id FROM orders WHERE payment_method = 'card' AND payment_status != 'paid' AND status = 'new'
        AND created_at <= datetime('now', ?)`,
    `-${UNPAID_MINUTES} minutes`,
  );
  let n = 0;
  for (const o of stale) {
    if (await settleEarlierPayments(o.id)) continue;
    if (setOrderStatus(o.id, 'cancelled', 'system', 'payment timeout') === 'ok') n++;
  }
  return n;
}

/** Runs the sweep at most once every 5 minutes; callers do not wait for it. */
export function maybeSweepUnpaidCardOrders() {
  const now = Date.now();
  if (now - lastSweep < 5 * 60 * 1000) return;
  lastSweep = now;
  sweepUnpaidCardOrders().catch((e) => console.error('[orders] sweep failed', e));
}

/** Albanian tax ID: one letter, eight digits, one letter (e.g. L12345678A). */
export function validNipt(s: string): boolean {
  return /^[A-M]\d{8}[A-Z]$/.test(s.trim().toUpperCase()); // first letter A–M per the tax office format (research/albania-construction-commerce.md §D)
}

/** Albanian phone numbers: mobiles 06x xxx xxxx, landlines, or +355 forms. */
export function normalisePhone(s: string): string | null {
  const d = s.replace(/[\s().-]/g, '');
  const m = d.match(/^(?:\+355|00355|0)(\d{8,9})$/);
  return m ? `+355${m[1]}` : null;
}
