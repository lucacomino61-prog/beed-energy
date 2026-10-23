// Dashboard charts: one tooltip for every mark that has [data-tip] (pointer, tap or keyboard focus), and
// arrow-key movement between the columns of a ColumnChart, which is a single tab stop. The tooltip only
// repeats what the aria-label and the table already say, so nothing depends on it.
const marks = document.querySelectorAll<HTMLElement>('[data-tip]');
if (marks.length) {
  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.setAttribute('aria-hidden', 'true');
  tip.hidden = true;
  document.body.append(tip);
  let current: HTMLElement | null = null;

  const show = (el: HTMLElement) => {
    current = el;
    // textContent only: names and figures come from the database.
    const value = document.createElement('strong');
    value.textContent = el.dataset.tipValue ?? '';
    const label = document.createElement('span');
    label.textContent = el.dataset.tipLabel ?? '';
    tip.replaceChildren(value, label);
    if (el.dataset.tipExtra) {
      const extra = document.createElement('span');
      extra.textContent = el.dataset.tipExtra;
      tip.append(extra);
    }
    tip.hidden = false;
    // The hit area is the whole column (easier to land on than the bar), but the tooltip points at the bar;
    // a day with no bar gets it just above the baseline.
    const bar = el.querySelector<HTMLElement>('[data-tip-anchor]');
    const box = el.getBoundingClientRect();
    const r = bar ? bar.getBoundingClientRect() : { top: box.bottom - 2, bottom: box.bottom, left: box.left, width: box.width };
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
    const above = r.top - h - 8;
    tip.style.left = `${left}px`;
    tip.style.top = `${above >= 8 ? above : r.bottom + 8}px`;
  };
  const hide = (el?: HTMLElement) => {
    if (el && el !== current) return;
    current = null;
    tip.hidden = true;
  };

  marks.forEach((el) => {
    el.addEventListener('pointerenter', () => show(el));
    el.addEventListener('pointerleave', (e) => {
      if ((e as PointerEvent).pointerType === 'mouse') hide(el);
    });
    el.addEventListener('focus', () => show(el));
    el.addEventListener('blur', () => hide(el));
  });
  // A tap elsewhere, a scroll or Escape puts the tooltip away (touch has no pointerleave to rely on).
  document.addEventListener('pointerdown', (e) => {
    if (current && !(e.target as Element).closest('[data-tip]')) hide();
  });
  addEventListener('scroll', () => hide(), { passive: true });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
}

// Roving focus inside a column chart: Tab enters once, arrows walk the days.
document.querySelectorAll<HTMLElement>('[data-chart-cols]').forEach((list) => {
  const cols = [...list.querySelectorAll<HTMLElement>('[data-tip]')];
  list.addEventListener('keydown', (e) => {
    const i = cols.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? cols.length - 1 : -1;
    if (next < 0 || next >= cols.length) return;
    e.preventDefault();
    cols[i].tabIndex = -1;
    cols[next].tabIndex = 0;
    cols[next].focus();
  });
});
