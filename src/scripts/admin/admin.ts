// Admin panel enhancements. Every form works without this file; it only adds:
// focus on the error summary, confirm prompts, auto-refresh of the spec form when the category changes,
// a live product drawing while dimensions are typed, quick price/stock saves without a reload, print.
// No animation library and no requestAnimationFrame here: forms and number entry stay still.
import { drawProduct } from '../../lib/drawing';

// ---------- first error gets focus ----------
const summary = document.querySelector<HTMLElement>('[data-errors]');
if (summary) summary.focus();
else document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();

// ---------- confirm before destructive submits ----------
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-confirm]');
  if (b && !window.confirm(b.dataset.confirm ?? '')) e.preventDefault();
});

// ---------- selects that refresh their form (e.g. product category → spec fields) ----------
document.querySelectorAll<HTMLSelectElement>('select[data-autosubmit]').forEach((sel) => {
  sel.addEventListener('change', () => {
    const btn = document.getElementById(sel.dataset.autosubmit ?? '') as HTMLButtonElement | null;
    if (btn && sel.form) sel.form.requestSubmit(btn);
  });
});

// ---------- live drawing preview ----------
const box = document.querySelector<HTMLElement>('[data-drawing]');
if (box) {
  const dims = [...document.querySelectorAll<HTMLInputElement>('[data-dim]')];
  const read = (k: string) => {
    const el = dims.find((d) => d.dataset.dim === k);
    const n = Number((el?.value ?? '').replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  let timer = 0;
  const paint = () => {
    box.innerHTML = drawProduct({ category: box.dataset.cat ?? '', w: read('w'), h: read('h'), d: read('d'), dims: true, title: box.dataset.title ?? '' });
  };
  dims.forEach((d) => d.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(paint, 120);
  }));
}

// ---------- quick price / stock edit in the offers grid ----------
document.querySelectorAll<HTMLFormElement>('form[data-quick]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = form.dataset.quick;
    // getAttribute, not form.id: the form holds an input named "id", which shadows the property.
    const fields = [...document.querySelectorAll<HTMLInputElement>(`[form="${form.getAttribute('id')}"]`)];
    const price = fields.find((f) => f.name === 'price')?.value ?? '';
    const stock = fields.find((f) => f.name === 'stock')?.value ?? '';
    const status = form.querySelector<HTMLElement>('[data-quick-status]');
    const csrf = (form.querySelector<HTMLInputElement>('input[name="_csrf"]')?.value) ?? '';
    const btn = form.querySelector<HTMLButtonElement>('button');
    btn?.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch('/api/admin/offers/quick', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ id: Number(id), price, stock, _csrf: csrf }),
      });
      const j = await res.json().catch(() => ({}));
      if (status) {
        status.dataset.state = res.ok ? 'ok' : 'bad';
        status.textContent = res.ok ? (form.dataset.ok ?? 'OK') : (j.message ?? form.dataset.bad ?? 'Error');
      }
      if (res.ok && j.price_label) {
        const cell = document.querySelector<HTMLElement>(`[data-updated="${id}"]`);
        if (cell && j.updated_label) cell.textContent = j.updated_label;
      }
    } catch {
      if (status) {
        status.dataset.state = 'bad';
        status.textContent = form.dataset.bad ?? 'Error';
      }
    } finally {
      btn?.removeAttribute('aria-busy');
    }
  });
});

// ---------- print ----------
document.querySelectorAll<HTMLButtonElement>('[data-print]').forEach((b) => {
  b.hidden = false;
  b.addEventListener('click', () => window.print());
});
