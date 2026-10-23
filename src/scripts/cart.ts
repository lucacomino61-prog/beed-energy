// Basket page: quantity steppers, remove, clear and the delivery city update the page in place.
// The server stays the only source of prices: every change posts to /api/cart, then the summary is
// read back with GET /api/cart?city= so delivery and zone problems match the chosen city.
// No motion here: numbers change, nothing moves (DESIGN.md: no motion over number entry).
import { lek } from '../lib/money';

type Line = { offerId: number; slug: string; qty: number; unitPrice: number; listPrice: number; lineTotal: number; stock: number; minQty: number; problem: null | 'gone' | 'stock' | 'min' | 'zone' };
type Parcel = { sellerId: number; subtotal: number; fee: number; free: boolean };
type Summary = { count: number; subtotal: number; delivery: number; total: number; vat: number; ok: boolean; lines: Line[]; parcels: Parcel[] };

const root = document.querySelector<HTMLElement>('[data-basket-root]');
const wordsEl = document.getElementById('basket-words');
if (root && wordsEl) init(root, JSON.parse(wordsEl.textContent ?? '{}'));

function init(root: HTMLElement, w: Record<string, string>) {
  const lang = (w.lang === 'en' ? 'en' : 'sq') as 'sq' | 'en';
  const S = w.sentinel;
  const money = (n: number) => lek(n, lang);
  const fee = (n: number) => (n === 0 ? w.free : money(n));
  const status = root.querySelector<HTMLElement>('[data-basket-status]');
  const citySel = document.querySelector<HTMLSelectElement>('[data-city]');
  let cityName = w.city;
  let seq = 0;
  const timers = new Map<string, number>();

  const cityId = () => citySel?.selectedOptions[0]?.dataset.id ?? '';

  async function refresh(announce = true) {
    const my = ++seq;
    const res = await fetch(`/api/cart?city=${encodeURIComponent(cityId())}`, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    const data: Summary = await res.json();
    if (my !== seq) return; // a newer change is on its way
    render(data);
    if (announce && status) status.textContent = w.updated;
  }

  async function post(body: Record<string, unknown>) {
    const res = await fetch('/api/cart', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }

  function fail() {
    if (status) status.textContent = w.error;
  }

  // ---------- forms ----------
  root.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (!form.matches('[data-basket-form]')) return;
    e.preventDefault();
    const fd = new FormData(form);
    const action = String(fd.get('action') ?? 'set');
    const offerId = Number(fd.get('offerId'));
    const qty = Math.max(0, Math.min(9999, Math.floor(Number(fd.get('qty') ?? 0)) || 0));
    if (action === 'set' && offerId) {
      // Optimistic: the stepper shows the new number at once; the request waits for the taps to settle.
      const li = root.querySelector<HTMLElement>(`[data-line="${offerId}"]`);
      if (li) setQty(li, qty);
      const key = String(offerId);
      clearTimeout(timers.get(key));
      timers.set(
        key,
        window.setTimeout(() => {
          timers.delete(key);
          post({ action: 'set', offerId, qty }).then(() => refresh()).catch(fail);
        }, form.hasAttribute('data-step') ? 280 : 0),
      );
      return;
    }
    post({ action, offerId: offerId || undefined, qty }).then(() => refresh()).catch(fail);
  });

  // Typing a number and leaving the field saves it (Enter submits the same form).
  root.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.matches('[data-qty]')) input.form?.requestSubmit();
  });

  // ---------- city ----------
  citySel?.addEventListener('change', () => {
    const opt = citySel.selectedOptions[0];
    cityName = opt && opt.value ? opt.textContent!.trim() : w.noCity;
    const url = new URL(location.href);
    if (opt?.value) url.searchParams.set(w.param, opt.value);
    else url.searchParams.delete(w.param);
    url.searchParams.delete('shtuar');
    history.replaceState(history.state, '', url);
    for (const go of document.querySelectorAll<HTMLAnchorElement>('[data-go]')) {
      const g = new URL(go.href);
      if (opt?.value) g.searchParams.set(w.param, opt.value);
      else g.searchParams.delete(w.param);
      go.href = g.pathname + g.search;
    }
    const tbCity = document.querySelector('[data-tb="city"]');
    if (tbCity) tbCity.textContent = opt?.value ? cityName : w.noCity;
    refresh().catch(fail);
  });

  // ---------- render ----------
  function setQty(li: HTMLElement, qty: number) {
    const input = li.querySelector<HTMLInputElement>('[data-qty]');
    if (input && document.activeElement !== input) input.value = String(qty);
    const dec = li.querySelector<HTMLInputElement>('[data-dec]');
    const inc = li.querySelector<HTMLInputElement>('[data-inc]');
    if (dec) dec.value = String(Math.max(0, qty - 1));
    if (inc) inc.value = String(Math.min(9999, qty + 1));
  }

  function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, text?: string) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function problemBox(li: HTMLElement, l: Line) {
    const box = li.querySelector<HTMLElement>('[data-problem-box]');
    const input = li.querySelector<HTMLInputElement>('[data-qty]');
    li.dataset.problem = l.problem ?? '';
    if (!box) return;
    if (!l.problem) {
      box.hidden = true;
      box.replaceChildren();
      input?.removeAttribute('aria-invalid');
      input?.removeAttribute('aria-describedby');
      return;
    }
    const text =
      l.problem === 'stock' ? (l.stock > 0 ? w.stockN.replace(S, String(l.stock)) : w.stock0)
      : l.problem === 'min' ? w.min.replace(S, String(l.minQty))
      : l.problem === 'zone' ? w.zone.replace('{city}', cityName)
      : w.gone;
    const p = el('p');
    p.append(el('span', { 'aria-hidden': 'true' }, '⚠ '), text);
    const row = el('div', { class: 'row' });
    const fixTo = l.problem === 'stock' && l.stock > 0 ? l.stock : l.problem === 'min' ? l.minQty : 0;
    if (fixTo) {
      const f = el('form', { method: 'post', action: '/api/cart', 'data-basket-form': '' });
      f.append(el('input', { type: 'hidden', name: 'action', value: 'set' }), el('input', { type: 'hidden', name: 'offerId', value: String(l.offerId) }), el('input', { type: 'hidden', name: 'qty', value: String(fixTo) }));
      f.append(el('button', { class: 'btn btn--s', type: 'submit' }, w.setTo.replace(S, String(fixTo))));
      row.append(f);
    } else {
      const a = li.querySelector<HTMLAnchorElement>('.bline__name a');
      const link = el('a', { class: 'link-arrow small', href: a?.getAttribute('href') ?? '#' });
      link.append(el('span', {}, w.others), ' ', el('span', { class: 'arrow', 'aria-hidden': 'true' }, '→'));
      row.append(link);
    }
    box.replaceChildren(p, row);
    box.hidden = false;
    if (input) {
      input.setAttribute('aria-describedby', box.id);
      if (l.problem === 'stock' || l.problem === 'min') input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function render(d: Summary) {
    if (d.count === 0 || d.lines.length === 0) {
      const tpl = document.querySelector<HTMLTemplateElement>('[data-basket-empty]');
      const keep = status;
      root.replaceChildren(tpl ? tpl.content.cloneNode(true) : '');
      if (keep) root.append(keep);
      document.querySelector('[data-basket-tb]')?.remove();
      setHeaderCount(0);
      return;
    }
    // lines
    root.querySelectorAll<HTMLElement>('[data-line]').forEach((li) => {
      const l = d.lines.find((x) => x.offerId === Number(li.dataset.line));
      if (!l) {
        const sec = li.closest<HTMLElement>('[data-seller]');
        li.remove();
        if (sec && !sec.querySelector('[data-line]')) sec.remove();
        return;
      }
      setQty(li, l.qty);
      const unit = li.querySelector('[data-unit]');
      if (unit) unit.textContent = money(l.unitPrice);
      const tier = l.unitPrice < l.listPrice;
      const list = li.querySelector<HTMLElement>('[data-list]');
      if (list) {
        list.hidden = !tier;
        list.lastChild!.textContent = money(l.listPrice);
      }
      const tierTag = li.querySelector<HTMLElement>('[data-tier]');
      if (tierTag) tierTag.hidden = !tier;
      const total = li.querySelector('[data-total]');
      if (total) total.textContent = money(l.lineTotal);
      problemBox(li, l);
    });
    // parcels
    const sections = [...root.querySelectorAll<HTMLElement>('[data-seller]')];
    sections.forEach((sec, i) => {
      const key = sec.querySelector('[data-parcel-key]');
      if (key) key.textContent = w.parcelOf.replace('{i}', String(i + 1).padStart(2, '0')).replace('{n}', String(sections.length).padStart(2, '0'));
      const p = d.parcels.find((x) => x.sellerId === Number(sec.dataset.seller));
      const foot = sec.querySelector<HTMLElement>('.parcel__foot');
      if (!p || !foot) {
        if (foot) foot.hidden = true;
        return;
      }
      foot.hidden = false;
      const sub = sec.querySelector('[data-parcel-sub]');
      if (sub) sub.textContent = money(p.subtotal);
      const f = sec.querySelector('[data-parcel-fee]');
      if (f) f.textContent = fee(p.fee);
      const freeEl = sec.querySelector<HTMLElement>('[data-parcel-free]');
      const over = Number(sec.dataset.freeOver);
      const missing = !p.free && over ? over - p.subtotal : 0;
      if (freeEl) {
        freeEl.hidden = !(missing > 0);
        freeEl.textContent = missing > 0 ? w.toFree.replace('{amount}', money(missing)) : '';
      }
    });
    // summary + title block
    const set = (sel: string, v: string) => document.querySelectorAll(sel).forEach((n) => (n.textContent = v));
    set('[data-sum="subtotal"]', money(d.subtotal));
    set('[data-sum="delivery"]', d.parcels.length ? fee(d.delivery) : money(0));
    set('[data-sum="total"]', money(d.total));
    set('[data-sum="vat"]', money(d.vat));
    set('[data-tb="items"]', String(d.count));
    set('[data-tb="parcels"]', String(d.parcels.length));
    set('[data-tb="total"]', money(d.total));
    const fix = document.querySelector<HTMLElement>('[data-fix]');
    if (fix) fix.hidden = d.ok;
    setHeaderCount(d.count);
  }

  function setHeaderCount(n: number) {
    document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((c) => {
      c.dataset.zero = n === 0 ? 'true' : 'false';
      const v = c.querySelector('[data-n]');
      if (v) v.textContent = String(n);
      const sr = c.querySelector('.visually-hidden');
      if (sr) sr.textContent = n === 1 ? w.count1 : w.countN.replace(S, String(n));
    });
  }

  // A basket change made elsewhere on the page (shared forms in site.ts) refreshes this one too.
  document.addEventListener('beed:cart', () => refresh(false).catch(fail));
}
