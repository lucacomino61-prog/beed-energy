// Checkout: when the city or the delivery method changes, the summary is re-priced from
// GET /api/cart?city= (pickup makes every parcel free), cash on delivery is switched on or off
// against the limit, and zone warnings follow. The order itself is always priced again on the server.
// On phones the order summary starts folded at the top. No motion on this page.
import { lekLong, vatOf } from '../lib/money';

type Line = { offerId: number; problem: null | 'gone' | 'stock' | 'min' | 'zone' };
type Parcel = { sellerId: number; fee: number; free: boolean };
type Summary = { subtotal: number; delivery: number; lines: Line[]; parcels: Parcel[] };

const form = document.querySelector<HTMLFormElement>('[data-checkout-form]');
const wordsEl = document.getElementById('checkout-words');
if (form && wordsEl) init(form, JSON.parse(wordsEl.textContent ?? '{}'));

function init(form: HTMLFormElement, w: { free: string; zone: string; noCity: string; limit: number; lang: 'sq' | 'en' }) {
  const money = (n: number) => lekLong(n, w.lang); // every amount this script writes is a sum or a total: long form
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

  // The re-price in flight, if any: a submit waits for it (see below).
  let pending: Promise<void> | null = null;
  const repriceNow = () => {
    const p: Promise<void> = reprice()
      .catch(() => undefined)
      .finally(() => {
        if (pending === p) pending = null;
      });
    pending = p;
  };
  citySel?.addEventListener('change', repriceNow);
  form.querySelectorAll<HTMLInputElement>('[data-delivery]').forEach((r) => r.addEventListener('change', repriceNow));

  // A second click on the submit button while the first post is on its way does nothing (the server's one-time
  // nonce makes a double post land on the same order anyway). If the post never leaves the page (stopped, offline),
  // the button works again after 8 s instead of staying dead.
  let sending = false;
  let unlock = 0;
  const release = () => {
    sending = false;
    clearTimeout(unlock);
    form.querySelector('.co-submit')?.removeAttribute('aria-busy');
  };
  form.addEventListener('submit', (e) => {
    if (sending) {
      e.preventDefault();
      return;
    }
    if (pending) {
      // The summary is being re-priced for a new city or delivery method: post once seen_total holds the total
      // the buyer now sees, or the server would answer "the total changed" instead of placing the order.
      e.preventDefault();
      const by = (e as SubmitEvent).submitter;
      void pending.then(() => form.requestSubmit(by instanceof HTMLButtonElement ? by : undefined));
      return;
    }
    sending = true;
    form.querySelector('.co-submit')?.setAttribute('aria-busy', 'true');
    unlock = window.setTimeout(release, 8000);
  });
  window.addEventListener('pageshow', release);
}
