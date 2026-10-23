// Compare toggles on cards and the product page follow the compare list (site.ts posts the form and fires beed:compare).
// On the compare page: "show differences only" without a reload, and remove a column without a reload.
// No motion here: these are form controls.
import { setCount } from './counts';

let synced = false;
export function syncCompareToggles() {
  if (synced) return;
  synced = true;
  document.addEventListener('beed:compare', (e) => {
    const ids: number[] = (e as CustomEvent).detail?.ids ?? [];
    document.querySelectorAll<HTMLButtonElement>('[data-compare-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(ids.includes(Number(b.dataset.compareToggle))));
    });
  });
}

const page = document.querySelector<HTMLElement>('[data-compare-page]');
if (page) {
  const table = page.querySelector<HTMLTableElement>('[data-compare-table]');
  const diff = page.querySelector<HTMLInputElement>('[data-diff-toggle]');
  const diffParam = page.dataset.diffParam ?? 'ndryshime';

  const applyDiff = (on: boolean) => {
    page.toggleAttribute('data-diff', on);
    const url = new URL(location.href);
    if (on) url.searchParams.set(diffParam, '1');
    else url.searchParams.delete(diffParam);
    history.replaceState(history.state, '', url);
  };
  if (diff) {
    // The GET form still works without scripts; with scripts the checkbox applies at once.
    diff.closest('form')?.querySelector('[data-diff-submit]')?.setAttribute('hidden', '');
    diff.addEventListener('change', () => applyDiff(diff.checked));
  }

  page.addEventListener('submit', async (e) => {
    const form = e.target as HTMLFormElement;
    if (!form.matches('[data-cmp-remove]')) return;
    e.preventDefault();
    const id = Number(new FormData(form).get('productId'));
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ action: 'remove', productId: id }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const left = [...page.querySelectorAll<HTMLElement>('thead th[data-col]')].map((c) => Number(c.dataset.col)).filter((x) => x !== id);
      if (left.length < 2) {
        // Below two products the page shows its own empty or "add one more" state: render it from the server.
        location.assign(form.action);
        return;
      }
      table?.querySelectorAll(`[data-col="${id}"]`).forEach((el) => el.remove());
      table?.style.setProperty('--cols', String(left.length));
      // Rows whose values are now all equal become "same" rows.
      table?.querySelectorAll<HTMLTableRowElement>('tbody tr[data-row]').forEach((tr) => {
        const vals = [...tr.querySelectorAll<HTMLElement>('[data-v]')].map((c) => c.dataset.v);
        tr.toggleAttribute('data-same', new Set(vals).size <= 1);
      });
      // The title block follows: product count and the lowest price left.
      const n = page.querySelector<HTMLElement>('[data-cmp-n]');
      if (n) n.textContent = `${left.length} / ${n.dataset.cmpN}`;
      const low = page.querySelector<HTMLElement>('[data-cmp-low]');
      const cells = [...(table?.querySelectorAll<HTMLElement>('tr[data-row="price"] td[data-v]') ?? [])].filter((c) => Number.isFinite(Number(c.dataset.v)));
      if (low && cells.length) {
        const min = cells.reduce((a, c) => (Number(c.dataset.v) < Number(a.dataset.v) ? c : a));
        const text = [...min.childNodes].find((x) => x.nodeType === Node.TEXT_NODE && x.textContent!.trim())?.textContent?.trim();
        if (text) low.textContent = text;
      }
      const url = new URL(location.href);
      url.searchParams.set('p', left.join(','));
      history.replaceState(history.state, '', url);
      page.querySelectorAll<HTMLFormElement>('[data-cmp-remove]').forEach((f) => {
        const u = new URL(f.action, location.href);
        const fid = Number(new FormData(f).get('productId'));
        u.searchParams.set('p', left.filter((x) => x !== fid).join(','));
        f.action = u.pathname + u.search;
      });
      setCount('compare', data.ids.length, false); // number + screen-reader sentence; no stamp over a form
      page.querySelector<HTMLElement>('[data-compare-status]')!.textContent = page.dataset.removed ?? '';
      page.querySelector<HTMLElement>('h1')?.focus();
    } catch {
      form.submit();
    }
  });
}
