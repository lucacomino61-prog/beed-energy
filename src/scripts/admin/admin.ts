// Admin panel enhancements. Every form works without this file; it only adds:
// focus on the error summary, confirm prompts, auto-refresh of the spec form when the category changes,
// photo resizing before upload, quick price/stock saves without a reload, print.
// No animation library and no requestAnimationFrame here: forms and number entry stay still.
import './photos';
import './charts';

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

// ---------- page help: remember per page whether the guide is open ----------
document.querySelectorAll<HTMLDetailsElement>('details[data-help]').forEach((d) => {
  const key = `adm-help:${d.dataset.help}`;
  try {
    if (localStorage.getItem(key) === 'open') d.open = true;
  } catch { /* storage blocked: it simply starts closed */ }
  d.addEventListener('toggle', () => {
    try {
      localStorage.setItem(key, d.open ? 'open' : 'closed');
    } catch { /* ignore */ }
  });
});
