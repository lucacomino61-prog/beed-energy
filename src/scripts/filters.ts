// Category filters: the GET form works on its own; this submits it on change with a clean URL (no empty fields),
// keeps focus on the control the visitor used across the reload, and turns the filters into a sheet on phones.
// No motion: these are form controls.
const form = document.querySelector<HTMLFormElement>('[data-filters]');
const FOCUS_KEY = 'beed-filter-focus';

function cleanUrl(f: HTMLFormElement): string {
  const fd = new FormData(f);
  const groups = new Map<string, string[]>();
  for (const [k, v] of fd) {
    const s = String(v).trim();
    if (!s) continue;
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
  // The sort select lives outside the form (form="filters") and is included by FormData; default sort is dropped.
  if (groups.get('sort')?.[0] === 'recommended') groups.delete('sort');
  const q = new URLSearchParams();
  for (const [k, vs] of groups) q.set(k, vs.join(','));
  const s = q.toString().replace(/%2C/g, ',');
  return f.getAttribute('action')! + (s ? `?${s}` : '');
}

if (form) {
  const go = (control?: Element | null) => {
    const name = control?.getAttribute('name');
    if (name) {
      const value = (control as HTMLInputElement).type === 'checkbox' ? (control as HTMLInputElement).value : '';
      try { sessionStorage.setItem(FOCUS_KEY, JSON.stringify({ name, value })); } catch { /* private mode */ }
    }
    location.assign(cleanUrl(form));
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    go((e as SubmitEvent).submitter);
  });
  // Checkboxes and selects apply at once; typed numbers apply when the field is left or Enter is pressed (change event).
  // In the phone sheet the visitor picks several and presses "Apply", so changes wait there.
  form.addEventListener('change', (e) => {
    if (document.querySelector('[data-facets-panel][data-open]')) return;
    go(e.target as Element);
  });
  document.querySelectorAll<HTMLSelectElement>('select[data-autosubmit]').forEach((s) => s.addEventListener('change', () => go(s)));

  // Put focus back where it was before the reload.
  try {
    const saved = JSON.parse(sessionStorage.getItem(FOCUS_KEY) ?? 'null');
    sessionStorage.removeItem(FOCUS_KEY);
    if (saved?.name) {
      const sel = saved.value ? `[name="${CSS.escape(saved.name)}"][value="${CSS.escape(saved.value)}"]` : `[name="${CSS.escape(saved.name)}"]`;
      const el = document.querySelector<HTMLElement>(sel);
      if (el && el.offsetParent !== null) el.focus({ preventScroll: true });
    }
  } catch { /* ignore */ }

  // Phone: the filters open as a full-screen sheet.
  const panel = document.querySelector<HTMLElement>('[data-facets-panel]');
  const opener = document.querySelector<HTMLButtonElement>('[data-facets-open]');
  const closer = form.querySelector<HTMLButtonElement>('[data-facets-close]');
  const setOpen = (open: boolean) => {
    panel?.toggleAttribute('data-open', open);
    opener?.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) form.querySelector<HTMLElement>('input, select, button')?.focus();
    else opener?.focus();
  };
  opener?.addEventListener('click', () => setOpen(true));
  closer?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel?.hasAttribute('data-open')) setOpen(false);
  });
}
