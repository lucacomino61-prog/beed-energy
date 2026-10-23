// POK calls this after a card payment. The body is not trusted: we look the order up by our own
// reference and ask POK directly whether it is paid before marking anything.
import type { APIRoute } from 'astro';
import { get } from '../../../lib/db';
import { markPaid } from '../../../lib/orders';
import { isPaidAtProvider, paymentMode } from '../../../lib/payments';

export const POST: APIRoute = async ({ request }) => {
  if (paymentMode() !== 'pok') return new Response(null, { status: 404 });
  const body: any = await request.json().catch(() => ({}));
  const ref = String(body?.merchantCustomReference ?? body?.data?.merchantCustomReference ?? '');
  const o = ref ? get<any>('SELECT id, payment_ref, payment_status FROM orders WHERE code = ?', ref) : null;
  if (!o || !o.payment_ref) return new Response(null, { status: 204 });
  if (o.payment_status !== 'paid' && (await isPaidAtProvider(o.payment_ref))) markPaid(o.id, o.payment_ref, 'pok');
  return new Response(null, { status: 204 });
};
