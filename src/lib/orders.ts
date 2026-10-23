// Order creation: re-quote from the database, then write the stock decrements, the order, its lines
// (with the platform commission per seller), its parcels and the first timeline event as one D1 batch.
//
// D1 has no interactive transaction, so nothing can branch once the batch starts. Two SQL devices
// stand in for the branching the old node:sqlite version did:
//   - Stock is held by `stock_qty = stock_qty - n` against the CHECK (stock_qty >= 0) on offers. A
//     line that would oversell raises SQLITE_CONSTRAINT, which rolls the whole batch back — the same
//     outcome the old `if (r.changes !== 1) throw` produced, and still atomic.
//   - Child rows find their parent with (SELECT id FROM orders WHERE code = ?) rather than
//     last_insert_rowid(), which would move on to the previous child after the first insert.
import { timingSafeEqual } from 'node:crypto';
import { all, batch, get, isConstraintError, run, stmt, type Stmt } from './db';
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
async function nextCode(): Promise<string> {
  const d = new Date();
  const ym = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  // MAX, not COUNT: a deleted order in the middle must not hand out a code that is still in use.
  const row = await get<{ n: number | null }>(`SELECT MAX(CAST(substr(code, 9) AS INTEGER)) AS n FROM orders WHERE code LIKE ?`, `BD-${ym}-%`);
  return `BD-${ym}-${String((row?.n ?? 0) + 1).padStart(5, '0')}`;
}

/** The order an already used checkout form created, if any. */
export async function orderForNonce(nonce: string): Promise<{ id: number; code: string; token: string; lang: string } | undefined> {
  if (!nonce) return undefined;
  return await get('SELECT o.id, o.code, o.token, o.lang FROM checkout_nonces n JOIN orders o ON o.id = n.order_id WHERE n.nonce = ?', nonce);
}

/**
 * Two orders quoted in the same second compute the same next code, and only one of them can have it
 * (orders.code is UNIQUE). The loser's batch is rolled back whole, so a retry is safe: it re-reads the
 * code and re-checks the stock it never took.
 */
const CODE_RETRIES = 4;

export async function createOrder(input: OrderInput): Promise<{ id: number; code: string; token: string; quote: Quote }> {
  if (input.nonce) {
    const used = await get<{ order_id: number }>('SELECT order_id FROM checkout_nonces WHERE nonce = ?', input.nonce);
    if (used) throw new OrderError('duplicate', undefined, used.order_id);
  }
  const q = await quote(input.lines, { cityId: input.cityId, pickup: input.delivery === 'pickup' });
  if (!q.lines.length) throw new OrderError('empty');
  if (!q.ok) throw new OrderError('changed', q);
  if (input.expectedTotal !== undefined && input.expectedTotal !== q.total) throw new OrderError('changed', q);
  if (input.payment === 'cod' && !q.codAllowed) throw new OrderError('payment', q);

  for (let attempt = 0; ; attempt++) {
    const code = await nextCode();
    const token = randomToken(12);
    const writes: Stmt[] = [];

    // Stock first: CHECK (stock_qty >= 0) on offers turns an oversold line into a constraint error,
    // which aborts the batch before the order row is written.
    for (const l of q.lines) {
      writes.push(stmt('UPDATE offers SET stock_qty = stock_qty - ? WHERE id = ?', l.qty, l.offerId));
    }
    writes.push(
      stmt(
        `INSERT INTO orders (code, token, customer_type, name, phone, email, company, nipt, city_id, address, notes,
                             delivery_method, payment_method, subtotal_all, delivery_all, total_all, vat_all, commission_all, lang, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        code, token, input.customerType, input.name, input.phone, input.email, input.company, input.nipt, input.cityId,
        input.address, input.notes, input.delivery, input.payment, q.subtotal, q.delivery, q.total, q.vat, q.commission,
        input.lang, input.source ?? null,
      ),
    );
    const orderIdx = writes.length - 1;
    const parent = '(SELECT id FROM orders WHERE code = ?)';

    for (const l of q.lines) {
      const commission = Math.round((l.lineTotal * l.commissionPct) / 100);
      writes.push(
        stmt(
          `INSERT INTO order_items (order_id, offer_id, product_id, seller_id, product_name, seller_name, unit_price_all, qty, line_total_all, commission_pct, commission_all)
           VALUES (${parent}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          code, l.offerId, l.productId, l.sellerId, `${l.brand} ${l.model}`, l.sellerName, l.unitPrice, l.qty, l.lineTotal, l.commissionPct, commission,
        ),
      );
    }
    // The fee each parcel was charged, as quoted: slips and order pages read it back instead of recomputing.
    for (const p of q.parcels) {
      writes.push(
        stmt(
          `INSERT INTO order_parcels (order_id, seller_id, seller_name, subtotal_all, fee_all, free) VALUES (${parent}, ?, ?, ?, ?, ?)`,
          code, p.sellerId, p.sellerName, p.subtotal, p.fee, p.free ? 1 : 0,
        ),
      );
    }
    if (input.nonce) writes.push(stmt(`INSERT INTO checkout_nonces (nonce, order_id) VALUES (?, ${parent})`, input.nonce, code));
    writes.push(stmt(`INSERT INTO order_events (order_id, status, note, actor) VALUES (${parent}, ?, ?, ?)`, code, 'new', null, 'buyer'));

    try {
      const results = await batch(writes);
      return { id: results[orderIdx].id, code, token, quote: q };
    } catch (err) {
      if (!isConstraintError(err)) throw err;
      // A clash on orders.code means another order took this number: retry with the next one. Any
      // other constraint failure is stock that went while the buyer was on the form, so re-quote and
      // let them see the current price and availability.
      const clash = /orders\.code/i.test(String((err as Error).message));
      if (!clash || attempt >= CODE_RETRIES) {
        throw new OrderError('changed', await quote(input.lines, { cityId: input.cityId, pickup: input.delivery === 'pickup' }));
      }
    }
  }
}

/** Constant-time comparison of an order or thread token. */
export function tokenMatches(stored: string, sent: string): boolean {
  const a = Buffer.from(String(stored));
  const b = Buffer.from(String(sent));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function orderByCode(code: string, token: string) {
  const o = await get<any>('SELECT o.*, c.name_sq AS city_sq, c.name_en AS city_en FROM orders o LEFT JOIN cities c ON c.id = o.city_id WHERE code = ?', code);
  if (!o || !tokenMatches(o.token, token)) return null;
  const [items, events] = await Promise.all([
    await all<any>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', o.id),
    await orderEvents(o.id),
  ]);
  return { ...o, items, events };
}

export async function orderEvents(orderId: number) {
  return await all<any>('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at, id', orderId);
}

export type StatusResult = 'ok' | 'same' | 'missing' | 'cancelled';

/**
 * Staff status change; cancelling returns the stock. A cancelled order stays cancelled: its stock is
 * already back on sale, so reopening it would sell the same units twice.
 */
export async function setOrderStatus(orderId: number, status: OrderStatus, actor: string, note?: string): Promise<StatusResult> {
  const o = await get<{ status: string }>('SELECT status FROM orders WHERE id = ?', orderId);
  if (!o) return 'missing';
  if (o.status === status) return 'same';
  if (o.status === 'cancelled') return 'cancelled';

  // Every write below is gated on the order still being in the status we just read, so a second
  // request that cancels the same order first turns this whole batch into no-ops rather than
  // returning the stock twice. The gate has to be the same on the restores and on the status
  // change, and the restores have to come first, while the status still reads as `o.status`.
  const writes: Stmt[] = [];
  const unchanged = '(SELECT status FROM orders WHERE id = ?) = ?';
  if (status === 'cancelled') {
    const items = await all<{ offer_id: number | null; qty: number }>('SELECT offer_id, qty FROM order_items WHERE order_id = ?', orderId);
    for (const it of items) {
      if (it.offer_id) {
        writes.push(stmt(`UPDATE offers SET stock_qty = stock_qty + ? WHERE id = ? AND ${unchanged}`, it.qty, it.offer_id, orderId, o.status));
      }
    }
  }
  writes.push(stmt("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ? AND status = ?", status, orderId, o.status));
  const statusIdx = writes.length - 1;
  writes.push(
    stmt(
      `INSERT INTO order_events (order_id, status, note, actor)
       SELECT ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM orders WHERE id = ? AND status = ?)`,
      orderId, status, note ?? null, actor, orderId, status,
    ),
  );

  const results = await batch(writes);
  if (results[statusIdx].changes !== 1) {
    // Someone moved the order between the read and the batch; report what it is now.
    const now = await get<{ status: string }>('SELECT status FROM orders WHERE id = ?', orderId);
    if (!now) return 'missing';
    if (now.status === status) return 'same';
    return now.status === 'cancelled' ? 'cancelled' : 'same';
  }
  return 'ok';
}

export const PAID_AFTER_CANCEL = 'paid after cancellation: refund';

/**
 * Marks an order paid once. Repeated calls (webhook retries, a second click) change nothing.
 * A cancelled order is never marked paid: the money still arrived, so the timeline gets a note that
 * it has to be refunded.
 */
export async function markPaid(orderId: number, ref: string, actor = 'gateway'): Promise<'paid' | 'already' | 'cancelled' | 'missing'> {
  const o = await get<{ status: string; payment_status: string }>('SELECT status, payment_status FROM orders WHERE id = ?', orderId);
  if (!o) return 'missing';

  if (o.status === 'cancelled') {
    const note = `${PAID_AFTER_CANCEL} · ${ref}`;
    // NOT EXISTS rather than a read-then-write: a retried webhook must not add the note twice.
    await batch([
      stmt("UPDATE payments SET status = 'paid' WHERE order_id = ? AND provider_id = ?", orderId, ref),
      stmt(
        `INSERT INTO order_events (order_id, status, note, actor)
         SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM order_events WHERE order_id = ? AND status = ? AND note = ?)`,
        orderId, 'note', note, actor, orderId, 'note', note,
      ),
    ]);
    return 'cancelled';
  }

  const writes: Stmt[] = [
    stmt("UPDATE payments SET status = 'paid' WHERE order_id = ? AND provider_id = ?", orderId, ref),
    stmt("UPDATE orders SET payment_status = 'paid', payment_ref = ?, updated_at = datetime('now') WHERE id = ? AND payment_status != 'paid'", ref, orderId),
    // Runs only if the line above moved the order to paid, so a second webhook adds no second event.
    stmt(
      `INSERT INTO order_events (order_id, status, note, actor)
       SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM order_events WHERE order_id = ? AND status = ?)`,
      orderId, 'paid', ref, actor, orderId, 'paid',
    ),
  ];
  const results = await batch(writes);
  return results[1].changes === 1 ? 'paid' : 'already';
}

// ---------- card payment attempts ----------

/** Records a new attempt at the provider and shows it as the order's latest reference. */
export async function recordPayment(orderId: number, providerId: string, amount: number) {
  await batch([
    stmt('INSERT INTO payments (order_id, provider_id, amount_all) VALUES (?, ?, ?)', orderId, providerId, amount),
    stmt("UPDATE orders SET payment_ref = ?, updated_at = datetime('now') WHERE id = ?", providerId, orderId),
  ]);
}

export async function paymentByProviderId(providerId: string) {
  return await get<{ id: number; order_id: number; provider_id: string; status: string; amount_all: number }>('SELECT * FROM payments WHERE provider_id = ?', providerId);
}

export async function latestOpenPayment(orderId: number) {
  return await get<{ provider_id: string; amount_all: number }>("SELECT provider_id, amount_all FROM payments WHERE order_id = ? AND status = 'created' ORDER BY id DESC LIMIT 1", orderId);
}

export async function failPayment(orderId: number, providerId: string) {
  await run("UPDATE payments SET status = 'failed' WHERE order_id = ? AND provider_id = ? AND status = 'created'", orderId, providerId);
}

/**
 * Before a retry (or a timeout cancel): asks the provider about every earlier attempt of this order.
 * A buyer whose first payment went through but whose webhook never arrived must not be charged twice.
 * Returns true when one of them turned out paid (the order is then marked paid).
 */
export async function settleEarlierPayments(orderId: number): Promise<boolean> {
  const o = await get<{ code: string; total_all: number }>('SELECT code, total_all FROM orders WHERE id = ?', orderId);
  if (!o) return false;
  const attempts = await all<{ provider_id: string }>("SELECT provider_id FROM payments WHERE order_id = ? AND status = 'created' ORDER BY id", orderId);
  for (const p of attempts) {
    if (await isPaidAtProvider(p.provider_id, { code: o.code, amount: o.total_all })) {
      await markPaid(orderId, p.provider_id, 'pok');
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
  const stale = await all<{ id: number }>(
    `SELECT id FROM orders WHERE payment_method = 'card' AND payment_status != 'paid' AND status = 'new'
        AND created_at <= datetime('now', ?)`,
    `-${UNPAID_MINUTES} minutes`,
  );
  let n = 0;
  for (const o of stale) {
    if (await settleEarlierPayments(o.id)) continue;
    if ((await setOrderStatus(o.id, 'cancelled', 'system', 'payment timeout')) === 'ok') n++;
  }
  return n;
}

/**
 * Runs the sweep at most once every 5 minutes. Returns the promise so the caller can hand it to
 * waitUntil: on Workers a promise nobody holds is cancelled as soon as the response is sent.
 * `lastSweep` is per isolate, which is all the throttle needs to be.
 */
export function maybeSweepUnpaidCardOrders(): Promise<number> | null {
  const now = Date.now();
  if (now - lastSweep < 5 * 60 * 1000) return null;
  lastSweep = now;
  // Deliberately not awaited: the caller hands this promise to waitUntil so the sweep outlives the
  // response instead of holding it up.
  return sweepUnpaidCardOrders().catch((e) => {
    console.error('[orders] sweep failed', e);
    return 0;
  });
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
