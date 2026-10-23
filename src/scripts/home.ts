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

/** Where the label goes: the empty corner of the sheet that the layer's exploded parts cover least, nearest the key. */
function pickCorner(n: number): Corner {
  if (!house || !sheet || !hudLabel) return 'tl';
  const sr = sheet.getBoundingClientRect();
  const m = house.getScreenCTM();
  if (!m) return 'tl';
  const toSheet = (x: number, y: number) => ({ x: m.a * x + m.c * y + m.e - sr.left, y: m.b * x + m.d * y + m.f - sr.top });
  const rects: { r: R; w: number }[] = parts.map((p) => {
    const b = p.el.getBBox();
    const live = p.layer === n;
    const o = live ? { x: p.dx, y: p.dy } : { x: 0, y: 0 };
    const a = toSheet(b.x + o.x, b.y + o.y);
    const c = toSheet(b.x + b.width + o.x, b.y + b.height + o.y);
    return { r: { x0: a.x, y0: a.y, x1: c.x, y1: c.y }, w: live ? 4 : 1 };
  });
  const k = hudKey ? hudKey.getBBox() : null;
  const kPart = hudKey ? parts.find((p) => p.el === hudKey!.closest('.part')) : undefined;
  const kp = k ? toSheet(k.x + k.width / 2 + (kPart?.dx ?? 0), k.y + k.height / 2 + (kPart?.dy ?? 0)) : { x: sr.width / 2, y: sr.height / 2 };
  const lw = hudLabel.offsetWidth;
  const lh = hudLabel.offsetHeight;
  const inset = 12;
  let best: Corner = 'tl';
  let bestScore = Infinity;
  for (const c of ['tl', 'tr', 'bl', 'br'] as Corner[]) {
    const x0 = c[1] === 'l' ? inset : sr.width - inset - lw;
    const y0 = c[0] === 't' ? inset : sr.height - inset - lh;
    const box = { x0, y0, x1: x0 + lw, y1: y0 + lh };
    const cover = rects.reduce((s, { r, w }) => s + overlap(box, r) * w, 0);
    const dist = Math.hypot((x0 + lw / 2) - kp.x, (y0 + lh / 2) - kp.y);
    const score = cover + dist * 4;
    if (score < bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
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
    hudCorner = pickCorner(n);
    hud.dataset.corner = hudCorner;
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
    caption.textContent = ch ? `${String(Math.min(n, 7)).padStart(2, '0')} · ${ch.querySelector('h2')?.textContent ?? ''}` : '';
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
      hudCorner = pickCorner(current);
      hud.dataset.corner = hudCorner;
      placeLeader();
    }
  }).observe(house);
}
document.addEventListener('beed:loaded', () => ScrollTrigger.refresh());
build();
onMotionChange(() => build());
