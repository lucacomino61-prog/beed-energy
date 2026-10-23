// Product page: city select applies at once, the price-alert form focuses its first error (or the success note),
// and the signature moment (DESIGN.md technique #4): one product becomes many sellers — small offer cards leave
// the best-offer box and land on their rows in the offers table.
import { gsap, motionOn, onMotionChange, ScrollTrigger } from './motion';
import { syncCompareToggles } from './compare';
import { rememberCity } from './city';

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
    rememberCity(citySelect.value); // "choose a city" (empty) forgets the remembered one, so the reload shows none
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

// ---------- signature: one product → many sellers ----------
// Small row-height cards (as wide as the box they leave, never the table) leave the best-offer box — or the drawing,
// or the phone action bar, whichever is on screen — and travel to the left edge of their rows: transform only,
// 600 ms at most, then they fade. The table keeps full opacity; only the rows that get a card come in from 0.6.
// The cards sit on an aria-hidden, pointer-events:none layer inside the offers section, under its heading and city
// picker (they slide beneath them), and come to rest on the seller cell, never on a quantity field or a button. Once per product per session, never with motion off, and any pointer, touch or key
// input finishes it at once.
const host = document.getElementById('ofertat');
const table = document.querySelector<HTMLElement>('[data-offers-table]');
const rows = [...document.querySelectorAll<HTMLElement>('[data-offer-row]')];
const bar = document.querySelector<HTMLElement>('[data-actionbar]');
const slug = document.querySelector<HTMLElement>('[data-product]')?.dataset.slug ?? '';
const KEY = `beed-fan-${slug}`;
const CARD_H = 48;
const STOP = ['pointerdown', 'keydown'] as const;
let seen = false;
try { seen = sessionStorage.getItem(KEY) === '1'; } catch { /* ignore */ }

let tl: gsap.core.Timeline | null = null;
let layer: HTMLElement | null = null;
let lit: HTMLElement[] = [];

/** The element's box when at least 40% of it (or of the screen) is visible, else null. */
function onScreen(el: Element | null): DOMRect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  const shown = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
  return shown >= Math.min(r.height, innerHeight) * 0.4 ? r : null;
}

function finish() {
  for (const t of STOP) window.removeEventListener(t, finish, true);
  tl?.kill();
  tl = null;
  layer?.remove();
  layer = null;
  if (lit.length) gsap.set(lit, { clearProps: 'opacity' });
  lit = [];
}

function card(row: HTMLElement, w: number, left: number, top: number) {
  const g = document.createElement('div');
  g.className = 'fan-card';
  const who = document.createElement('span');
  who.textContent = row.dataset.seller ?? '';
  const what = document.createElement('b');
  what.textContent = row.dataset.price ?? '';
  g.append(who, what);
  g.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${CARD_H}px`;
  return g;
}

/** Plays the fan-out; false when it could not run now, so the trigger stays armed for the next pass. */
function fan(): boolean {
  if (tl) return true; // already playing
  if (!host || !table || !rows.length || !motionOn()) return false;
  const src =
    onScreen(document.querySelector('.buybox')) ??
    onScreen(document.querySelector('[data-fan-source] .sheet__paper')) ??
    onScreen(bar);
  if (!src) return false; // nothing on screen to leave from: the rows are simply there
  // Rows whose top is on screen (above the phone action bar) get a card; at most six.
  const floor = (bar?.getBoundingClientRect().top || innerHeight) - CARD_H;
  const targets = rows.map((row) => ({ row, r: row.getBoundingClientRect() })).filter(({ r }) => r.top >= 0 && r.top <= floor).slice(0, 6);
  if (!targets.length) return false;
  try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }

  const h = host.getBoundingClientRect();
  layer = document.createElement('div');
  layer.className = 'fan-layer';
  layer.setAttribute('aria-hidden', 'true');
  const n = targets.length;
  const stagger = Math.min(0.04, 0.12 / n);
  const cards = targets.map(({ row, r }, i) => {
    const w = Math.min(src.width, r.width);
    const g = card(row, w, r.left - h.left, r.top - h.top);
    layer!.append(g);
    // Start stacked on the source box, each a few pixels lower, like a short deck.
    gsap.set(g, { x: src.left - r.left, y: src.top + src.height / 2 - CARD_H / 2 + i * 6 - r.top, opacity: 0 });
    return g;
  });
  host.append(layer);
  lit = targets.map((x) => x.row);
  gsap.set(lit, { opacity: 0.6 });

  tl = gsap.timeline({ onComplete: finish });
  cards.forEach((g, i) => {
    const t0 = i * stagger;
    tl!.to(g, { opacity: 1, duration: 0.08, ease: 'none' }, t0);
    tl!.to(g, { x: 0, y: 0, duration: 0.34, ease: 'power2.inOut' }, t0 + 0.02);
    tl!.to(lit[i], { opacity: 1, duration: 0.2, ease: 'none' }, t0 + 0.2);
    tl!.to(g, { opacity: 0, duration: 0.12, ease: 'none' }, t0 + 0.36);
  });
  for (const t of STOP) window.addEventListener(t, finish, { capture: true, passive: true });
  return true;
}

if (table && rows.length && !seen && motionOn() && !location.hash) {
  // When the table is well into view; the cards leave from wherever the best offer is shown at that moment.
  // On phones the start line sits 140 px above the fixed action bar's top edge, so the first rows are above the bar
  // when it fires (with 'top 80%' they were still under it and the run was skipped). The trigger is spent only
  // after a real run: fan() is false on its early exits and the next pass tries again.
  ScrollTrigger.create({
    trigger: table,
    start: () => {
      const b = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      return `top ${Math.round(Math.min(innerHeight * 0.8, b - 140))}px`;
    },
    invalidateOnRefresh: true,
    onEnter: (self) => { if (fan()) self.kill(); },
    onEnterBack: (self) => { if (fan()) self.kill(); },
  });
}
onMotionChange((on) => { if (!on) finish(); });

// ---------- photo gallery: a thumbnail swaps the main photo (without the script it opens the photo) ----------
const mainPhoto = document.querySelector<HTMLImageElement>('.gallery__main img.ph');
document.querySelectorAll<HTMLAnchorElement>('[data-gallery-thumb]').forEach((a) => {
  a.addEventListener('click', (e) => {
    if (!mainPhoto || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    mainPhoto.src = a.href;
    mainPhoto.alt = a.dataset.alt ?? '';
    if (a.dataset.w && a.dataset.h) {
      mainPhoto.width = Number(a.dataset.w);
      mainPhoto.height = Number(a.dataset.h);
    } else {
      mainPhoto.removeAttribute('width');
      mainPhoto.removeAttribute('height');
    }
    document.querySelectorAll('[data-gallery-thumb][aria-current]').forEach((x) => x.removeAttribute('aria-current'));
    a.setAttribute('aria-current', 'true');
  });
});
