// Solar calculator enhancement: re-renders the result block from /api/solar as the inputs change
// (debounced, no motion over the form), keeps the state in the URL, hides the unused kWh/bill field,
// moves the map highlight, and adds the whole kit to the basket one POST per line.
import { calcResultsHtml } from '../lib/pages-calc-html';
import type { CalcOutput } from '../lib/pages-solar';
import type { Lang } from '../lib/i18n';
import { rememberCity } from './city';

const root = document.querySelector<HTMLElement>('[data-calc]');
if (root) init(root);

function init(root: HTMLElement) {
  const lang = (root.dataset.lang === 'en' ? 'en' : 'sq') as Lang;
  const words = JSON.parse(root.dataset.words ?? '{}') as { updating: string; updated: string; adding: string; addFail: string; cart: string };
  const form = root.querySelector<HTMLFormElement>('[data-calc-form]')!;
  const results = root.querySelector<HTMLElement>('[data-calc-results]')!;
  const status = root.querySelector<HTMLElement>('[data-calc-status]');
  let timer = 0;
  let ctrl: AbortController | null = null;

  const mode = () => (new FormData(form).get('mode') === 'bill' ? 'bill' : 'kwh');
  const syncMode = () => {
    const m = mode();
    form.querySelectorAll<HTMLElement>('[data-mode-field]').forEach((el) => (el.hidden = el.dataset.modeField !== m));
  };

  const query = () => {
    const fd = new FormData(form);
    const p = new URLSearchParams();
    const m = mode();
    p.set('qyteti', String(fd.get('qyteti') ?? ''));
    p.set('mode', m);
    if (m === 'kwh') p.set('kwh', String(fd.get('kwh') ?? ''));
    else p.set('fatura', String(fd.get('fatura') ?? ''));
    p.set('lidhja', String(fd.get('lidhja') ?? 'household'));
    p.set('bateri', String(fd.get('bateri') ?? '0'));
    p.set('faza', String(fd.get('faza') ?? '1'));
    return p;
  };

  const highlight = (slug: string) => {
    document.querySelectorAll<SVGGElement>('#calc-map [data-city]').forEach((g) => g.classList.toggle('is-hot', g.dataset.city === slug));
  };

  const clearErrors = () => {
    form.querySelector('.form-errors')?.remove();
    form.querySelectorAll('.field .error').forEach((e) => e.remove());
    form.querySelectorAll('[aria-invalid]').forEach((e) => {
      e.removeAttribute('aria-invalid');
      const d = (e.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => !id.endsWith('-err')).join(' ');
      e.setAttribute('aria-describedby', d);
    });
  };

  const showError = (key: string, msg: string) => {
    const input = form.querySelector<HTMLElement>(`#c-${key}`);
    if (!input) return;
    const p = document.createElement('p');
    p.className = 'error';
    p.id = `c-${key}-err`;
    p.textContent = msg;
    input.closest('.field')?.append(p);
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${input.getAttribute('aria-describedby') ?? ''} c-${key}-err`.trim());
  };

  const update = async () => {
    const p = query();
    history.replaceState(null, '', `${location.pathname}?${p}`);
    rememberCity(p.get('qyteti') ?? '');
    syncAlternate(p);
    highlight(p.get('qyteti') ?? '');
    ctrl?.abort();
    ctrl = new AbortController();
    if (status) status.textContent = words.updating;
    try {
      const res = await fetch(`/api/solar?${p}`, { signal: ctrl.signal, headers: { accept: 'application/json' } });
      const out = (await res.json()) as CalcOutput;
      clearErrors();
      if (!out.ok) {
        const msgs = JSON.parse(form.dataset.errs ?? '{}') as Record<string, string>;
        for (const k of Object.keys(out.errors)) showError(k, msgs[k] ?? '');
        if (status) status.textContent = '';
        return;
      }
      results.innerHTML = calcResultsHtml(out, lang);
      wireKit();
      if (status) status.textContent = words.updated;
    } catch (err) {
      if ((err as Error).name !== 'AbortError' && status) status.textContent = '';
    }
  };

  const syncAlternate = (p: URLSearchParams) => {
    const alt = document.querySelector<HTMLAnchorElement>('.lang a[hreflang]');
    if (alt) alt.href = `${alt.pathname}?${p}`;
  };

  const schedule = (delay: number) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(update, delay);
  };

  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.name === 'mode') syncMode();
    schedule(el.type === 'radio' || el.tagName === 'SELECT' ? 0 : 350);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.clearTimeout(timer);
    update();
  });

  // The whole kit: post each line to /api/cart in sequence, then go to the basket.
  const wireKit = () => {
    const btn = results.querySelector<HTMLButtonElement>('[data-kit-all]');
    if (!btn) return;
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      const label = btn.innerHTML;
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = words.adding;
      const forms = [...results.querySelectorAll<HTMLFormElement>('[data-kit-line]')];
      try {
        for (const f of forms) {
          const fd = new FormData(f);
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify({ action: 'add', offerId: Number(fd.get('offerId')), qty: Number(fd.get('qty')) }),
          });
          if (!res.ok) throw new Error('cart');
        }
        location.href = words.cart;
      } catch {
        btn.removeAttribute('aria-busy');
        btn.innerHTML = label;
        if (status) status.textContent = words.addFail;
      }
    });
  };

  syncMode();
  wireKit();
}
