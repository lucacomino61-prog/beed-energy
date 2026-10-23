// Card payments through POK (pokpay.io), the Albanian PSP: no separate bank acquiring contract.
// Flow: create the order here → the buyer pays on POK's card form (3-D Secure) → POK calls the
// webhook → we re-read the order from POK, which is the only trusted proof of payment.
// Keys live only in environment variables (POK_KEY_ID, POK_KEY_SECRET, POK_MERCHANT_ID, POK_ENV).
// Without keys: in development (or with PAY_TEST=1) a local test gateway that is clearly labelled and
// never takes money; anywhere else card payment is simply off, so a missing key can never turn a live
// shop into one that marks orders paid for free.
// Amounts are whole lekë: 9000 means 9 000 L.
import { randomBytes } from 'node:crypto';

const BASE = { production: 'https://api.pokpay.io', staging: 'https://api-staging.pokpay.io' } as const;

export type PaymentMode = 'pok' | 'test' | 'off';

export function paymentMode(): PaymentMode {
  if (process.env.POK_KEY_ID && process.env.POK_KEY_SECRET && process.env.POK_MERCHANT_ID) return 'pok';
  if (import.meta.env.DEV || process.env.PAY_TEST?.trim() === '1') return 'test';
  return 'off';
}

const base = () => (String(process.env.POK_ENV ?? 'production').toLowerCase() === 'staging' ? BASE.staging : BASE.production);

let token: string | null = null;
let tokenUntil = 0;

async function call(url: string, init: RequestInit) {
  try {
    const res = await fetch(url, init);
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 503, data: { message: String((e as Error)?.message ?? e) } };
  }
}

async function login(force = false): Promise<string | null> {
  if (!force && token && Date.now() < tokenUntil) return token;
  const r = await call(`${base()}/auth/sdk/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyId: String(process.env.POK_KEY_ID ?? '').trim(), keySecret: String(process.env.POK_KEY_SECRET ?? '').trim() }),
  });
  const d = r.ok ? r.data?.data : null;
  if (!d?.accessToken) return null;
  token = d.accessToken;
  tokenUntil = Date.now() + Math.max(0, (Number(d.expiresIn) || 600000) - 60000);
  return token;
}

export type CreatedPayment = { ok: true; redirect: string; providerId: string } | { ok: false; reason: string };

export async function createCardPayment(order: {
  code: string;
  total: number;
  delivery: number;
  items: { name: string; qty: number; price: number }[];
  okUrl: string;
  failUrl: string;
  webhookUrl: string;
  testUrl: string;
}): Promise<CreatedPayment> {
  const mode = paymentMode();
  if (mode === 'off') return { ok: false, reason: 'off' };
  // Each attempt gets its own id, as a real retry does at POK.
  if (mode === 'test') return { ok: true, redirect: order.testUrl, providerId: `test-${order.code}-${randomBytes(4).toString('hex')}` };
  const t = await login();
  if (!t) return { ok: false, reason: 'login' };
  const r = await call(`${base()}/merchants/${encodeURIComponent(String(process.env.POK_MERCHANT_ID))}/sdk-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify({
      amount: String(Math.round(order.total)),
      currencyCode: 'ALL',
      autoCapture: true,
      shippingCost: order.delivery,
      merchantCustomReference: order.code,
      products: order.items.map((i) => ({ name: i.name.slice(0, 120), quantity: i.qty, price: i.price })),
      redirectUrl: order.okUrl,
      failRedirectUrl: order.failUrl,
      webhookUrl: order.webhookUrl,
      expiresAfterMinutes: 30,
    }),
  });
  const o = r.data?.data?.sdkOrder ?? r.data?.data ?? null;
  if (!r.ok || !o?.id) return { ok: false, reason: `create-${r.status}` };
  const redirect = o._self?.confirmUrl ?? o.confirmUrl ?? o.checkoutUrl ?? null;
  if (!redirect) return { ok: false, reason: 'no-redirect' };
  return { ok: true, redirect, providerId: String(o.id) };
}

/**
 * Re-reads a POK order. True only when POK itself says it is paid (captured or completed) AND it is the
 * order we expect: our order code as merchantCustomReference and the same amount in lekë. A webhook body
 * or a return URL is never proof on its own.
 */
export async function isPaidAtProvider(providerId: string, expect: { code: string; amount: number }): Promise<boolean> {
  if (paymentMode() !== 'pok') return false;
  const t = await login();
  if (!t) return false;
  const r = await call(`${base()}/sdk-orders/${encodeURIComponent(providerId)}`, { headers: { Authorization: `Bearer ${t}` } });
  const o = r.data?.data?.sdkOrder ?? r.data?.data ?? null;
  if (!r.ok || !o) return false;
  const s = String(o.status ?? '').toUpperCase();
  const paid = s === 'COMPLETED' || s === 'CAPTURED' || s === 'PAID' || o.isCompleted === true;
  const ref = String(o.merchantCustomReference ?? '');
  const amount = Math.round(Number(o.amount));
  return paid && ref === expect.code && amount === Math.round(expect.amount);
}
