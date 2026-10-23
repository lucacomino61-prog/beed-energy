// Local test gateway, used only while POK keys are not set. It never touches a card:
// "Pay" marks the order paid in the local database, "Decline" leaves it unpaid.
import type { APIRoute } from 'astro';
import { get, run } from '../../../lib/db';
import { markPaid } from '../../../lib/orders';
import { paymentMode } from '../../../lib/payments';
import { href } from '../../../lib/i18n';
import { lek } from '../../../lib/money';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function find(code: string, k: string) {
  const o = get<any>('SELECT * FROM orders WHERE code = ?', code);
  return o && o.token === k && o.payment_method === 'card' ? o : null;
}

export const GET: APIRoute = ({ url }) => {
  if (paymentMode() !== 'test') return new Response('Not found', { status: 404 });
  const code = url.searchParams.get('code') ?? '';
  const k = url.searchParams.get('k') ?? '';
  const o = find(code, k);
  if (!o) return new Response('Not found', { status: 404 });
  const sq = o.lang === 'sq';
  const html = `<!doctype html><html lang="${o.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${sq ? 'Pagesë provë' : 'Test payment'} · ${esc(o.code)}</title>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:0;min-height:100svh;display:grid;place-items:center;background:#f3f1ea;color:#191714}
main{max-width:28rem;padding:2rem;border:1px solid #191714;background:#fff}h1{font-size:1.25rem;margin:0 0 .5rem}
.tag{display:inline-block;font:600 12px/1 ui-monospace,monospace;letter-spacing:.06em;padding:.4rem .6rem;background:#191714;color:#fff;margin-bottom:1rem}
form{display:flex;gap:.75rem;margin-top:1.5rem}button{font:inherit;min-height:44px;padding:0 1.25rem;border:1px solid #191714;background:#fff;cursor:pointer}
button[value=pay]{background:#191714;color:#fff}</style></head><body><main>
<span class="tag">${sq ? 'PORTË PROVE · ASNJË PARA NUK LËVIZ' : 'TEST GATEWAY · NO MONEY MOVES'}</span>
<h1>${sq ? 'Porosia' : 'Order'} ${esc(o.code)}</h1>
<p>${sq ? 'Shuma' : 'Amount'}: <strong>${lek(o.total_all, o.lang)}</strong></p>
<p>${sq ? 'Kjo faqe zëvendëson formularin e kartës së POK derisa të vendosen çelësat e tregtarit.' : 'This page stands in for POK’s card form until the merchant keys are set.'}</p>
<form method="post"><input type="hidden" name="code" value="${esc(o.code)}"><input type="hidden" name="k" value="${esc(k)}">
<button name="r" value="pay">${sq ? 'Paguaj (provë)' : 'Pay (test)'}</button><button name="r" value="fail">${sq ? 'Refuzo' : 'Decline'}</button></form>
</main></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  if (paymentMode() !== 'test') return new Response('Not found', { status: 404 });
  const f = await request.formData();
  const code = String(f.get('code') ?? '');
  const k = String(f.get('k') ?? '');
  const o = find(code, k);
  if (!o) return new Response('Not found', { status: 404 });
  if (f.get('r') === 'pay' && o.payment_status !== 'paid') markPaid(o.id, `test-${Date.now()}`, 'test-gateway');
  else if (f.get('r') !== 'pay' && o.payment_status === 'pending') run("UPDATE orders SET payment_status = 'failed', updated_at = datetime('now') WHERE id = ?", o.id);
  return redirect(href(o.lang, 'order', { code: o.code }, { k, pagesa: f.get('r') === 'pay' ? 'ok' : 'deshtoi' }), 303);
};
