// Home choreography. Each chapter that reaches the middle of the screen becomes the live layer:
// its parts slide out along their explode vector and turn copper, the rest settle back and recede.
// A HUD label (Igloo-style) hangs off the live layer's key on a leader line: key, layer, live count, lowest price.
// After the seventh layer the house reassembles and its windows light up. All through motion.ts.
import { gsap, ScrollTrigger, motionOn, onMotionChange } from './motion';

const stage = document.querySelector<HTMLElement>('[data-stage]');
const house = document.querySelector<SVGSVGElement>('[data-house]');
const sheet = document.querySelector<HTMLElement>('[data-sheet]');

type Part = { el: SVGGElement; layer: number; dx: number; dy: number };
const parts: Part[] = house
  ? [...house.querySelectorAll<SVGGElement>('.part')].map((el) => {
      const s = el.getAttribute('style') ?? '';
      const dx = Number(/--dx:\s*(-?[\d.]+)px/.exec(s)?.[1] ?? 0);
      const dy = Number(/--dy:\s*(-?[\d.]+)px/.exec(s)?.[1] ?? 0);
      return { el, layer: Number(el.dataset.layer), dx, dy };
    })
  : [];
const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
const keys = [...document.querySelectorAll<HTMLAnchorElement>('[data-key-link]')];
const caption = document.querySelector<HTMLElement>('[data-caption-layer]');
let current = 0;
let triggers: ScrollTrigger[] = [];

// ---------- keys: a constant 21 px on screen with 11 px numbers, whatever the drawing's scale ----------
const KEY_PX = 10.5; // on-screen radius
const keyR = Number(house?.querySelector('.key circle')?.getAttribute('r') ?? 20);
function drawingScale(): number {
  if (!house) return 1;
  const vb = house.viewBox.baseVal;
  const r = house.getBoundingClientRect();
  if (!vb || !vb.width || !r.width) return 1;
  return Math.min(r.width / vb.width, r.height / vb.height);
}
function scaleKeys() {
  if (!house) return;
  house.style.setProperty('--ks', (KEY_PX / (keyR * drawingScale())).toFixed(3));
}

// ---------- HUD label with its leader line ----------
const hud = document.querySelector<HTMLElement>('[data-hud]');
const hudLabel = hud?.querySelector<HTMLElement>('[data-hud-label]') ?? null;
const hudLeader = hud?.querySelector<SVGPathElement>('[data-hud-leader]') ?? null;
const hudDot = hud?.querySelector<SVGCircleElement>('[data-hud-dot]') ?? null;
const hudSlots = {
  n: hud?.querySelector<HTMLElement>('[data-hud-n]'),
  name: hud?.querySelector<HTMLElement>('[data-hud-name]'),
  cat: hud?.querySelector<HTMLElement>('[data-hud-cat]'),
  meta: hud?.querySelector<HTMLElement>('[data-hud-meta]'),
};
type Corner = 'tl' | 'tr' | 'bl' | 'br';
let hudKey: SVGCircleElement | null = null;
let hudCorner: Corner = 'tl';
let follow: gsap.core.Tween | null = null;

/** The key of the part that travels furthest in a layer (the foundation for 01, the panels for 04). */
function keyOf(n: number): SVGCircleElement | null {
  const ps = parts.filter((p) => p.layer === n).sort((a, b) => Math.hypot(b.dx, b.dy) - Math.hypot(a.dx, a.dy));
  for (const p of ps) {
    const c = p.el.querySelector<SVGCircleElement>('.key circle');
    if (c) return c;
  }
  return null;
}

type R = { x0: number; y0: number; x1: number; y1: number };
const overlap = (a: R, b: R) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

type Place = { corner: Corner; dx: number; dy: number };

/** Where the label goes: the empty corner of the sheet (or a slot slid along an edge from it) that the layer's
 *  exploded parts cover least, never on a key or a dimension, nearest the key. dx/dy: the slide in px. */
function pickCorner(n: number): Place {
  if (!house || !sheet || !hudLabel) return { corner: 'tl', dx: 0, dy: 0 };
  const sr = sheet.getBoundingClientRect();
  const m = house.getScreenCTM();
  if (!m) return { corner: 'tl', dx: 0, dy: 0 };
  const toSheet = (x: number, y: number) => ({ x: m.a * x + m.c * y + m.e - sr.left, y: m.b * x + m.d * y + m.f - sr.top });
  const rects: { r: R; w: number }[] = parts.map((p) => {
    const b = p.el.getBBox();
    const live = p.layer === n;
    const o = live ? { x: p.dx, y: p.dy } : { x: 0, y: 0 };
    const a = toSheet(b.x + o.x, b.y + o.y);
    const c = toSheet(b.x + b.width + o.x, b.y + b.height + o.y);
    return { r: { x0: a.x, y0: a.y, x1: c.x, y1: c.y }, w: live ? 4 : 1 };
  });
  // The label must never sit on a key (01–07) or on the 10 000 / 8 000 dimensions: they count heavily.
  // Keys: their on-screen disc (KEY_PX, set by scaleKeys) + 4 px, moved with the live layer's offset.
  const HEAVY = 400; // one px² of a key outweighs a label-sized patch of house
  for (const p of parts) {
    const live = p.layer === n;
    for (const c of p.el.querySelectorAll<SVGCircleElement>('.key circle')) {
      const b = c.getBBox();
      const ctr = toSheet(b.x + b.width / 2 + (live ? p.dx : 0), b.y + b.height / 2 + (live ? p.dy : 0));
      const r = KEY_PX + 4;
      rects.push({ r: { x0: ctr.x - r, y0: ctr.y - r, x1: ctr.x + r, y1: ctr.y + r }, w: HEAVY });
    }
  }
  for (const t of house.querySelectorAll<SVGTextElement>('.dimtext')) {
    const b = t.getBoundingClientRect();
    if (!b.width) continue;
    rects.push({ r: { x0: b.left - sr.left - 4, y0: b.top - sr.top - 4, x1: b.right - sr.left + 4, y1: b.bottom - sr.top + 4 }, w: HEAVY });
  }
  const k = hudKey ? hudKey.getBBox() : null;
  const kPart = hudKey ? parts.find((p) => p.el === hudKey!.closest('.part')) : undefined;
  const kp = k ? toSheet(k.x + k.width / 2 + (kPart?.dx ?? 0), k.y + k.height / 2 + (kPart?.dy ?? 0)) : { x: sr.width / 2, y: sr.height / 2 };
  const lw = hudLabel.offsetWidth;
  const lh = hudLabel.offsetHeight;
  const inset = 12;
  let best: Place = { corner: 'tl', dx: 0, dy: 0 };
  let bestScore = Infinity;
  // Each corner, and the label slid from it along its top/bottom or left/right edge in 8 px steps (or 8 px closer
  // to the sheet's edge): on a phone sheet every bare corner covers a key, but a slot between them is usually free.
  const STEP = 8;
  for (const c of ['tl', 'tr', 'bl', 'br'] as Corner[]) {
    const cx = c[1] === 'l' ? inset : sr.width - inset - lw;
    const cy = c[0] === 't' ? inset : sr.height - inset - lh;
    const roomX = Math.max(0, sr.width - 2 * inset - lw);
    const roomY = Math.max(0, sr.height - 2 * inset - lh);
    const along = (room: number) => { const a = [-STEP, 0]; for (let s = STEP; s <= room; s += STEP) a.push(s); return a; };
    const slides: [number, number][] = [];
    // inward steps along one edge while the other axis stays in the edge band (-8 or 0)
    for (const xs of along(roomX)) for (const ys of along(roomY)) if (xs <= 0 || ys <= 0) slides.push([c[1] === 'l' ? xs : -xs, c[0] === 't' ? ys : -ys]);
    for (const [dx, dy] of slides) {
      const x0 = cx + dx;
      const y0 = cy + dy;
      const box = { x0, y0, x1: x0 + lw, y1: y0 + lh };
      const cover = rects.reduce((s, { r, w }) => s + overlap(box, r) * w, 0);
      const dist = Math.hypot((x0 + lw / 2) - kp.x, (y0 + lh / 2) - kp.y);
      // a small price for leaving the corner keeps the label in one when a corner is free
      const score = cover + dist * 4 + (dx || dy ? 60 : 0);
      if (score < bestScore) {
        bestScore = score;
        best = { corner: c, dx, dy };
      }
    }
  }
  return best;
}

/** Put the label in its corner (slid along the edge when that keeps it off the keys and dimensions). */
function placeHud(n: number) {
  if (!hud) return;
  const place = pickCorner(n);
  hudCorner = place.corner;
  hud.dataset.corner = hudCorner;
  hud.style.setProperty('--hud-dx', `${place.dx}px`);
  hud.style.setProperty('--hud-dy', `${place.dy}px`);
}

/** Draw the leader: from the label's corner along its edge, then 45° to the key's rim. */
function placeLeader() {
  if (!hud || !sheet || !hudKey || !hudLabel || !hudLeader) return;
  const sr = sheet.getBoundingClientRect();
  const kr = hudKey.getBoundingClientRect();
  const lr = hudLabel.getBoundingClientRect();
  const kx = kr.left + kr.width / 2 - sr.left;
  const ky = kr.top + kr.height / 2 - sr.top;
  const rad = kr.width / 2;
  const left = hudCorner[1] === 'l';
  const top = hudCorner[0] === 't';
  const ex = (left ? lr.right : lr.left) - sr.left;
  const ey = (top ? lr.bottom : lr.top) - sr.top;
  const dx = kx - ex;
  const dy = ky - ey;
  let path: string;
  let from: { x: number; y: number };
  if (Math.abs(dx) > Math.abs(dy)) {
    const bend = { x: kx - Math.sign(dx) * Math.abs(dy), y: ey };
    path = `M${ex.toFixed(1)} ${ey.toFixed(1)} L${bend.x.toFixed(1)} ${bend.y.toFixed(1)}`;
    from = bend;
  } else {
    path = `M${ex.toFixed(1)} ${ey.toFixed(1)}`;
    from = { x: ex, y: ey };
  }
  // stop at the key's rim
  const len = Math.hypot(kx - from.x, ky - from.y) || 1;
  const tx = kx - ((kx - from.x) / len) * (rad + 3);
  const ty = ky - ((ky - from.y) / len) * (rad + 3);
  path += ` L${tx.toFixed(1)} ${ty.toFixed(1)}`;
  hudLeader.setAttribute('d', path);
  hudDot?.setAttribute('cx', ex.toFixed(1));
  hudDot?.setAttribute('cy', ey.toFixed(1));
}

function showHud(n: number) {
  if (!hud || !hudLabel) return;
  const ch = chapters.find((c) => Number(c.dataset.chapter) === n);
  const live = n >= 1 && n <= 7 && !!ch;
  follow?.kill();
  if (!live) {
    gsap.to(hud, { opacity: 0, duration: 0.2, ease: 'power1.out', overwrite: 'auto', onComplete: () => { hud.hidden = true; } });
    hudKey = null;
    return;
  }
  const fill = () => {
    if (hudSlots.n) hudSlots.n.textContent = String(n).padStart(2, '0');
    if (hudSlots.name) hudSlots.name.textContent = ch!.querySelector('h2')?.textContent ?? '';
    if (hudSlots.cat) hudSlots.cat.textContent = ch!.dataset.hudCat ?? '';
    if (hudSlots.meta) hudSlots.meta.textContent = ch!.dataset.hudMeta ?? '';
    hud.hidden = false;
    hudKey = keyOf(n);
    placeHud(n);
    placeLeader();
  };
  const wasOn = !hud.hidden && Number(gsap.getProperty(hud, 'opacity')) > 0.05;
  gsap.killTweensOf(hud);
  if (!wasOn) gsap.set(hud, { opacity: 0 });
  const tl = gsap.timeline();
  if (wasOn) tl.to(hud, { opacity: 0, duration: 0.15, ease: 'power1.in' });
  tl.call(fill);
  tl.to(hud, { opacity: 1, duration: 0.25, ease: 'power1.out' }, '+=0.25');
  // the key travels with its part for ~0.9 s: keep the leader on it, on GSAP's clock
  follow = gsap.to({}, { duration: 1.4, onUpdate: placeLeader });
}

function setLayer(n: number) {
  if (!house || n === current) return;
  current = n;
  const live = n >= 1 && n <= 7;
  stage?.setAttribute('data-active', String(n));
  if (n === 0) stage?.removeAttribute('data-active');
  chapters.forEach((c) => c.classList.toggle('is-active', Number(c.dataset.chapter) === n));
  keys.forEach((k) => (Number(k.dataset.keyLink) === n ? k.setAttribute('aria-current', 'step') : k.removeAttribute('aria-current')));
  // On narrow phones the key row scrolls sideways: bring the live key into view (scrollLeft only, no page scroll).
  const liveKey = keys.find((k) => Number(k.dataset.keyLink) === n);
  const row = liveKey?.parentElement;
  if (liveKey && row && row.scrollWidth > row.clientWidth) row.scrollLeft = liveKey.offsetLeft - (row.clientWidth - liveKey.offsetWidth) / 2;
  if (live) house.setAttribute('data-dim', '');
  else house.removeAttribute('data-dim');
  if (n === 8) house.setAttribute('data-lit', '');
  else house.removeAttribute('data-lit');
  for (const p of parts) {
    const on = p.layer === n;
    p.el.classList.toggle('is-live', on);
    gsap.to(p.el, { x: on ? p.dx : 0, y: on ? p.dy : 0, duration: on ? 0.9 : 0.6, ease: on ? 'power3.out' : 'power2.inOut', overwrite: 'auto' });
  }
  if (caption) {
    const ch = chapters.find((c) => Number(c.dataset.chapter) === n);
    const title = ch?.querySelector('h2')?.textContent ?? '';
    // 01–07 carry their key; "Ndize" (n = 8) is the whole house switched on: the title alone, never "07 · …"
    caption.textContent = !ch ? '' : n > 7 ? title : `${String(n).padStart(2, '0')} · ${title}`;
  }
  showHud(n);
}

// ---------- "Pse tani": each number is a dimension line drawn from the left ----------
const dims = [...document.querySelectorAll<HTMLElement>('[data-dim]')];

function build() {
  triggers.forEach((t) => t.kill());
  triggers = [];
  const dimEls = dims.flatMap((d) => [...d.querySelectorAll<HTMLElement>('[data-dim-rule], [data-dim-end], [data-dim-value], [data-dim-text]')]);
  if (!motionOn() || !house) {
    // Static: every part shown at its exploded offset by CSS, every chapter readable. Tweens still
    // running from the last layer change would write their transform back after clearProps: kill first.
    const els = parts.map((p) => p.el);
    gsap.killTweensOf(els);
    els.forEach((el) => el.classList.remove('is-live'));
    parts.forEach((p) => gsap.set(p.el, { clearProps: 'transform' }));
    house?.removeAttribute('data-dim');
    follow?.kill();
    if (hud) {
      gsap.killTweensOf(hud);
      gsap.set(hud, { clearProps: 'opacity' });
      hud.hidden = true;
    }
    gsap.killTweensOf(dimEls);
    gsap.set(dimEls, { clearProps: 'transform,opacity' });
    current = -1;
    return;
  }
  parts.forEach((p) => gsap.set(p.el, { x: 0, y: 0 }));
  current = -1;
  setLayer(0);
  for (const c of chapters) {
    const n = Number(c.dataset.chapter);
    triggers.push(
      ScrollTrigger.create({
        trigger: c,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setLayer(n);
          else if (n === 1 && self.direction < 0) setLayer(0);
        },
      }),
    );
  }
  // Poster lines step in on arrival (opacity + small rise; the CTAs below never move).
  const lines = document.querySelectorAll('.stage__line');
  gsap.fromTo(lines, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: document.querySelector('[data-loader]:not([hidden])') ? 1.7 : 0.1 });
  // Manifesto: words ink in as the paragraph crosses the screen.
  const words = gsap.utils.toArray<HTMLElement>('[data-manifesto] .w');
  if (words.length) {
    triggers.push(
      ScrollTrigger.create({
        trigger: '[data-manifesto]',
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: true,
        onUpdate: (self) => {
          const lit = self.progress * words.length;
          words.forEach((w, i) => w.style.setProperty('--o', String(Math.min(1, Math.max(0.16, lit - i + 0.16)))));
        },
      }),
    );
  }
  // Dimension lines: the rule is drawn from its left tick, then the end tick, the value and the note appear.
  for (const d of dims) {
    const rule = d.querySelector('[data-dim-rule]');
    const end = d.querySelector('[data-dim-end]');
    const value = d.querySelector('[data-dim-value]');
    const text = d.querySelectorAll('[data-dim-text]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: d, start: 'top 82%', once: true } });
    tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut', immediateRender: true })
      .fromTo(end, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none', immediateRender: true }, '>-0.05')
      .fromTo(value, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out', immediateRender: true }, 0.35)
      .fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out', immediateRender: true }, 0.6);
    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
  }
}

// The yearly production counter in the last chapter follows the chosen city.
const final = document.querySelector<HTMLElement>('[data-final]');
if (final) {
  const data: { s: string; y: number }[] = JSON.parse(final.dataset.cities ?? '[]');
  const sel = final.querySelector<HTMLSelectElement>('[data-final-city]');
  const out = final.querySelector<HTMLElement>('[data-final-num]');
  const sq = document.documentElement.lang === 'sq';
  // same grouping as the server render in Home.astro: a no-break space in Albanian (the narrow one all but
  // disappears between Archivo's display figures), a comma in English
  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sq ? ' ' : ',');
  sel?.addEventListener('change', () => {
    const y = data.find((d) => d.s === sel.value)?.y ?? 0;
    if (!out) return;
    if (!motionOn()) {
      out.textContent = fmt(y);
      return;
    }
    const from = { v: Number(out.textContent?.replace(/\D/g, '') || 0) };
    gsap.to(from, { v: y, duration: 0.6, ease: 'power2.out', onUpdate: () => (out.textContent = fmt(from.v)) });
  });
}

scaleKeys();
if (house && 'ResizeObserver' in window) {
  new ResizeObserver(() => {
    scaleKeys();
    if (hudKey && hud && !hud.hidden) {
      placeHud(current);
      placeLeader();
    }
  }).observe(house);
}
document.addEventListener('beed:loaded', () => ScrollTrigger.refresh());
build();
onMotionChange(() => build());
