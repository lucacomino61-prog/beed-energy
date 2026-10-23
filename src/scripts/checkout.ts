// Checkout: when the city or the delivery method changes, the summary is re-priced from
// GET /api/cart?city= (pickup makes every parcel free), cash on delivery is switched on or off
// against the limit, and zone warnings follow. The order itself is always priced again on the server.
// On phones the order summary starts folded at the top. No motion on this page.
import { lek, vatOf } from '../lib/money';

type Line = { offerId: number; problem: null | 'gone' | 'stock' | 'min' | 'zone' };
type Parcel = { sellerId: number; fee: number; free: boolean };
type Summary = { subtotal: number; delivery: number; lines: Line[]; parcels: Parcel[] };

const form = document.querySelector<HTMLFormElement>('[data-checkout-form]');
const wordsEl = document.getElementById('checkout-words');
if (form && wordsEl) init(form, JSON.parse(wordsEl.textContent ?? '{}'));

function init(form: HTMLFormElement, w: { free: string; zone: string; noCity: string; limit: number; lang: 'sq' | 'en' }) {
  const money = (n: number) => lek(n, w.lang);
  const citySel = form.querySelector<HTMLSelectElement>('[data-co-city]');
  const cod = form.querySelector<HTMLInputElement>('[data-cod]');
  const codOff = form.querySelector<HTMLElement>('[data-cod-off]');
  let seq = 0;

  // ---------- phone: summary folded at the top, always open on wide screens ----------
  const details = document.querySelector<HTMLDetailsElement>('[data-sum-details]');
  const wide = matchMedia('(min-width: 961px)');
  const fold = () => {
    if (details) details.open = wide.matches;
  };
  if (details && !document.querySelector('.co-alert')) fold();
  wide.addEventListener('change', fold);

  const pickup = () => form.querySelector<HTMLInputElement>('input[name="delivery"]:checked')?.value === 'pickup';

  async function reprice() {
    const my = ++seq;
    const opt = citySel?.selectedOptions[0];
    const id = opt?.dataset.id ?? '';
    const res = await fetch(`/api/cart?city=${encodeURIComponent(id)}`, { headers: { accept: 'application/json' } });
    if (!res.ok || my !== seq) return;
    const d: Summary = await res.json();
    const isPickup = pickup();
    const fees = new Map(d.parcels.map((p) => [p.sellerId, isPickup ? 0 : p.fee]));
    const delivery = isPickup ? 0 : d.delivery;
    const total = d.subtotal + delivery;
    const set = (k: string, v: string) => document.querySelectorAll(`[data-co="${k}"]`).forEach((n) => (n.textContent = v));
    set('subtotal', money(d.subtotal));
    set('delivery', delivery === 0 ? w.free : money(delivery));
    set('total', money(total));
    set('total-toggle', money(total));
    set('vat', money(vatOf(total)));
    // The server places the order only at the total the buyer saw: this is now that total.
    const seenTotal = form.querySelector<HTMLInputElement>('[data-seen-total]');
    if (seenTotal) seenTotal.value = String(total);
    document.querySelectorAll<HTMLElement>('.cosum__parcel[data-seller]').forEach((el) => {
      const f = fees.get(Number(el.dataset.seller));
      const out = el.querySelector('[data-pfee]');
      if (out && f !== undefined) out.textContent = f === 0 ? w.free : money(f);
    });
    // Zone warnings: only for courier delivery; other problems stay as the server drew them.
    const cityName = opt && opt.value ? opt.textContent!.trim() : w.noCity;
    let problems = false;
    document.querySelectorAll<HTMLElement>('.cosum__lines [data-line]').forEach((li) => {
      const l = d.lines.find((x) => x.offerId === Number(li.dataset.line));
      const warn = li.querySelector<HTMLElement>('[data-warn]');
      if (!l || !warn) return;
      if (l.problem === 'zone') {
        warn.textContent = w.zone.replace('{city}', cityName);
        warn.hidden = isPickup;
      } else if (li.dataset.problem === 'zone') {
        warn.hidden = true;
      }
      if (l.problem && !(l.problem === 'zone' && isPickup)) problems = true;
    });
    const prob = form.querySelector<HTMLElement>('[data-co-problem]');
    if (prob) prob.hidden = !problems;
    // Cash on delivery only up to the limit.
    if (cod) {
      const allowed = total <= w.limit;
      cod.disabled = !allowed;
      if (codOff) codOff.hidden = allowed;
      if (!allowed && cod.checked) {
        cod.checked = false;
        form.querySelector<HTMLInputElement>('input[name="payment"][value="bank"]')!.checked = true;
      }
    }
  }

  citySel?.addEventListener('change', () => void reprice());
  form.querySelectorAll<HTMLInputElement>('[data-delivery]').forEach((r) => r.addEventListener('change', () => void reprice()));

  // A second click on the submit button while the first post is on its way does nothing.
  let sending = false;
  form.addEventListener('submit', (e) => {
    if (sending) {
      e.preventDefault();
      return;
    }
    sending = true;
    form.querySelector('.co-submit')?.setAttribute('aria-busy', 'true');
  });
  window.addEventListener('pageshow', () => {
    sending = false;
    form.querySelector('.co-submit')?.removeAttribute('aria-busy');
  });
}
