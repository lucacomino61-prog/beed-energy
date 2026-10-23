// POK calls this after a card payment. The body is not trusted: it only names a POK order id. We look
// that id up among our own payment attempts, ask POK directly whether it is paid, and check that POK's
// order carries our order code and the order's amount before marking anything. Retries are harmless:
// await markPaid() changes an order once, and a payment on a cancelled order becomes a refund note.
import type { APIRoute } from 'astro';
import { get } from '../../../lib/db';
import { markPaid, paymentByProviderId } from '../../../lib/orders';
import { isPaidAtProvider, paymentMode } from '../../../lib/payments';

function providerIdOf(body: any): string {
  const id = body?.data?.id ?? body?.data?.sdkOrder?.id ?? body?.sdkOrder?.id ?? body?.id ?? '';
  return typeof id === 'string' || typeof id === 'number' ? String(id).slice(0, 120) : '';
}

export const POST: APIRoute = async ({ request }) => {
  if (paymentMode() !== 'pok') return new Response(null, { status: 404 });
  const body: any = await request.json().catch(() => ({}));
  const providerId = providerIdOf(body);
  const p = providerId ? await paymentByProviderId(providerId) : undefined;
  if (!p) return new Response(null, { status: 204 });
  const o = await get<{ id: number; code: string; total_all: number; payment_status: string }>('SELECT id, code, total_all, payment_status FROM orders WHERE id = ?', p.order_id);
  if (!o || o.payment_status === 'paid') return new Response(null, { status: 204 });
  if (await isPaidAtProvider(p.provider_id, { code: o.code, amount: o.total_all })) await markPaid(o.id, p.provider_id, 'pok');
  return new Response(null, { status: 204 });
};
