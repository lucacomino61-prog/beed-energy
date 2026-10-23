// Product page: city select applies at once, the price-alert form focuses its first error (or the success note),
// and the signature moment (DESIGN.md technique #4): on first view the drawing card fans out into the sellers'
// offer cards, which settle into the table rows sorted by price.
// The fan uses aria-hidden ghost cards on a pointer-events:none layer; the real rows only fade (opacity),
// so no tap target ever moves and nothing blocks interaction. Under 1.2 s, once per product per session, never with motion off.
import { gsap, motionOn, onMotionChange, ScrollTrigger } from './motion';
import { syncCompareToggles } from './compare';

syncCompareToggles();

// ---------- city select ----------
const cityForm = document.querySelector<HTMLFormElement>('[data-city-form]');
const citySelect = cityForm?.querySelector<HTMLSelectElement>('[data-city-select]');
if (cityForm && citySelect) {
  cityForm.querySelector('[data-city-submit]')?.classList.add('visually-hidden-focusable');
  citySelect.addEventListener('change', () => {
    const url = new URL(cityForm.action, location.href);
    const name = citySelect.name;
    const cur = new URL(location.href);
    cur.searchParams.delete('qyteti');
    cur.searchParams.delete('city');
    cur.searchParams.delete('njoftim');
    if (citySelect.value) cur.searchParams.set(name, citySelect.value);
    try { sessionStorage.setItem('beed-city-focus', '1'); } catch { /* ignore */ }
    location.assign(url.pathname + cur.search + '#ofertat');
  });
  try {
    if (sessionStorage.getItem('beed-city-focus')) {
      sessionStorage.removeItem('beed-city-focus');
      citySelect.focus({ preventScroll: true });
    }
  } catch { /* ignore */ }
}

// ---------- price alert: focus the first error or the success note after the redirect ----------
const alertForm = document.querySelector<HTMLFormElement>('.alert-form[data-first-error]');
if (alertForm) document.getElementById(alertForm.dataset.firstError!)?.focus();
else if (location.hash === '#njoftim') document.querySelector<HTMLElement>('#njoftim')?.focus({ preventScroll: true });

// ---------- signature: the drawing fans out into the offers ----------
const source = document.querySelector<HTMLElement>('[data-fan-source] .sheet__paper');
const table = document.querySelector<HTMLElement>('[data-offers-table]');
const rows = [...document.querySelectorAll<HTMLElement>('[data-offer-row]')];
const slug = document.querySelector<HTMLElement>('[data-product]')?.dataset.slug ?? '';
const KEY = `beed-fan-${slug}`;
let seen = false;
try { seen = sessionStorage.getItem(KEY) === '1'; } catch { /* ignore */ }

let tl: gsap.core.Timeline | null = null;
let layer: HTMLElement | null = null;

function cleanup() {
  tl?.kill();
  tl = null;
  layer?.remove();
  layer = null;
  gsap.set(rows, { clearProps: 'opacity' });
}

function fan() {
  if (!source || !table || !rows.length || !motionOn()) return;
  try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  const s = source.getBoundingClientRect();
  const sx = window.scrollX;
  const sy = window.scrollY;
  layer = document.createElement('div');
  layer.className = 'fan-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  // Read every rect first, then write.
  const rects = rows.map((r) => r.getBoundingClientRect());
  const n = rows.length;
  const stagger = Math.min(0.05, 0.24 / n);
  tl = gsap.timeline({ onComplete: cleanup });
  rows.forEach((row, i) => {
    const r = rects[i];
    const g = document.createElement('div');
    g.className = 'fan-card';
    const who = document.createElement('span');
    who.textContent = row.dataset.seller ?? '';
    const what = document.createElement('b');
    what.textContent = row.dataset.price ?? '';
    g.append(who, what);
    g.style.cssText = `left:${r.left + sx}px;top:${r.top + sy}px;width:${r.width}px;height:${r.height}px`;
    layer!.append(g);

    const scale = Math.min(1, Math.max(0.3, (s.width * 0.55) / r.width));
    const fromX = s.left + s.width / 2 - (r.left + r.width / 2);
    const fromY = s.top + s.height / 2 - (r.top + r.height / 2);
    const spread = i - (n - 1) / 2;
    const t0 = i * stagger;
    tl!.fromTo(g, { x: fromX, y: fromY, scale: scale * 0.94, rotation: 0, opacity: 0 }, { opacity: 1, scale, duration: 0.14, ease: 'power2.out' }, t0);
    // Fan out from the drawing like a hand of cards.
    tl!.to(g, { rotation: spread * 6, x: fromX + spread * 22 * scale, y: fromY - 26 - Math.abs(spread) * 5, duration: 0.3, ease: 'power2.out' }, 0.1 + t0);
    // Settle into the table row, in price order (the table is already sorted).
    tl!.to(g, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.4, ease: 'power3.inOut' }, 0.38 + t0);
    tl!.to(row, { opacity: 1, duration: 0.16, ease: 'none' }, 0.74 + t0);
    tl!.to(g, { opacity: 0, duration: 0.16, ease: 'none' }, 0.78 + t0);
  });
  gsap.set(rows, { opacity: 0.12 });
}

if (source && table && rows.length && !seen && motionOn() && !location.hash) {
  // Wait for the table to come into view: the cards travel from wherever the drawing is at that moment.
  ScrollTrigger.create({ trigger: table, start: 'top bottom-=60', once: true, onEnter: fan });
}
onMotionChange((on) => {
  if (!on && tl) {
    tl.progress(1);
    cleanup();
  }
});
// Any interaction with a row mid-flight finishes the moment at once.
table?.addEventListener('pointerdown', () => { if (tl) { tl.progress(1); cleanup(); } }, true);
table?.addEventListener('focusin', () => { if (tl) { tl.progress(1); cleanup(); } });
