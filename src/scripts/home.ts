// Home choreography. The stage is the realistic house (AI illustration, public/house/) on a drafting sheet.
// Each chapter that reaches the middle of the screen becomes live: the house steps back and dims, a copper ring
// marks the chapter's equipment on it, and the matching part image flies out of that point to a free area of the
// sheet (exploded-parts style), with a copper leader line and the HUD label beside it. The previous part flies
// back in. The finale brings every part home and crossfades the house to dusk on a night sheet.
// Transform and opacity only, all through motion.ts (one GSAP ticker); every tween can be interrupted.
import { gsap, ScrollTrigger, motionOn, onMotionChange } from './motion';
import { BASE, PARTS, type PartId } from '../lib/house-render';

const stage = document.querySelector<HTMLElement>('[data-stage]');
const sheet = document.querySelector<HTMLElement>('[data-sheet]');
const rh = sheet?.querySelector<HTMLElement>('[data-rh]') ?? null;
const day = sheet?.querySelector<HTMLImageElement>('[data-rh-day]') ?? null;
const dusk = sheet?.querySelector<HTMLImageElement>('[data-rh-dusk]') ?? null;
const night = sheet?.querySelector<HTMLElement>('[data-night]') ?? null;
const stamp = sheet?.querySelector<HTMLElement>('[data-stamp]') ?? null;
const partEls = new Map<PartId, HTMLElement>(
  [...(sheet?.querySelectorAll<HTMLElement>('[data-part]') ?? [])].map((el) => [el.dataset.part as PartId, el]),
);
const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
const keys = [...document.querySelectorAll<HTMLAnchorElement>('[data-key-link]')];
const caption = document.querySelector<HTMLElement>('[data-caption-layer]');
const FINALE = Number(sheet?.dataset.finale ?? chapters.length);
/** The parts each chapter lifts out (rendered from story.ts into data-parts). */
const partsByChapter = new Map(
  chapters.map((c) => [Number(c.dataset.chapter), (c.dataset.parts ?? '').split(' ').filter((p): p is PartId => p in PARTS && partEls.has(p as PartId))]),
);
const isLive = (n: number) => n >= 1 && n < FINALE && (partsByChapter.get(n)?.length ?? 0) > 0;
let current = 0;
let triggers: ScrollTrigger[] = [];

// ---------- HUD: rings and leaders per part, one label (and an invisible twin to measure it) ----------
const hud = sheet?.querySelector<HTMLElement>('[data-hud]') ?? null;
const marks = hud?.querySelector<HTMLElement>('[data-hud-marks]') ?? null;
const label = hud?.querySelector<HTMLAnchorElement>('[data-hud-label]') ?? null;
const measure = label ? (label.cloneNode(true) as HTMLAnchorElement) : null;
if (measure && hud) {
  measure.classList.add('hud__label--measure');
  measure.removeAttribute('data-hud-label');
  measure.removeAttribute('href');
  hud.append(measure);
}
const rings = new Map<PartId, HTMLElement>();
const leaders = new Map<PartId, HTMLElement>();
for (const id of partEls.keys()) {
  const ring = document.createElement('span');
  ring.className = 'hud__ring';
  const lead = document.createElement('span');
  lead.className = 'hud__leader';
  marks?.append(lead, ring);
  rings.set(id, ring);
  leaders.set(id, lead);
}

function fillLabel(el: HTMLElement, n: number) {
  const ch = chapters.find((c) => Number(c.dataset.chapter) === n);
  const set = (sel: string, text: string) => {
    const t = el.querySelector<HTMLElement>(sel);
    if (t) t.textContent = text;
  };
  set('[data-hud-n]', String(n).padStart(2, '0'));
  set('[data-hud-name]', ch?.querySelector('h2')?.textContent?.trim() ?? '');
  set('[data-hud-cat]', ch?.dataset.hudCat ?? '');
  set('[data-hud-meta]', ch?.dataset.hudMeta ?? '');
  if (el instanceof HTMLAnchorElement && el === label && ch?.dataset.hudHref) el.href = ch.dataset.hudHref;
}

// ---------- geometry: where the house sits, where it steps back to, where the house is solid ----------
type Box = { x: number; y: number; w: number; h: number };
type Placed = { id: PartId; box: Box; hot: [number, number]; from: [number, number] };
type Plan = { parts: Placed[]; label: Box | null };
type Layout = { sw: number; sh: number; m: number; narrow: boolean; home: Box; back: Box; cell: number; cols: number; rows: number; sat: Int32Array; keep: Box[]; plans: Map<number, Plan> };
let L: Layout | null = null;

// The house's own pixels (not its soft shadow), decoded once from the run list in house-render.ts.
const OCC: boolean[][] = BASE.occ.split(' ').map((row) => {
  const r = new Array<boolean>(Math.ceil(BASE.w / BASE.occCell)).fill(false);
  for (const run of row.split(',').filter(Boolean)) {
    const [a, b] = run.split('-').map(Number);
    for (let i = a; i < b; i++) r[i] = true;
  }
  return r;
});

const hotIn = (b: Box, id: PartId): [number, number] => {
  const [x, y] = BASE.hotspots[PARTS[id].hotspot];
  return [b.x + (x / BASE.w) * b.w, b.y + (y / BASE.h) * b.h];
};

function layout(): Layout | null {
  if (!sheet || !rh) return null;
  const sw = sheet.clientWidth;
  const sh = sheet.clientHeight;
  if (!sw || !sh) return null;
  const narrow = matchMedia('(max-width: 900px)').matches; // the phone sheet (home.css), a band above the chapters
  const m = narrow ? 8 : 14;
  // offset* ignore transforms: the box CSS gives the house (centred, as large as the sheet allows)
  const home = { x: rh.offsetLeft, y: rh.offsetTop, w: rh.offsetWidth, h: rh.offsetHeight };
  const ar = BASE.w / BASE.h;
  let back: Box;
  if (sw / sh < 1.1) {
    // a tall sheet (desktop): the house steps back to the bottom left, the parts get the band above and the right
    const w = Math.min(home.w * 0.7, (sh - 2 * m) * 0.62 * ar);
    back = { x: m, y: sh - m - w / ar, w, h: w / ar };
  } else {
    // a wide sheet (phone, short desktop): the house steps back to the left, the parts get the right and the top
    const h = Math.min((sh - 2 * m) * (narrow ? 0.74 : 0.7), (sw * 0.58) / ar);
    back = { x: m, y: sh - m - h, w: h * ar, h };
  }
  // solid house on an 8 px grid of the sheet, as a summed-area table: covered area of any box in O(1)
  const cell = 8;
  const cols = Math.ceil(sw / cell);
  const rows = Math.ceil(sh / cell);
  const sat = new Int32Array((cols + 1) * (rows + 1));
  for (let r = 0; r < rows; r++) {
    let run = 0;
    for (let c = 0; c < cols; c++) {
      const u = ((c + 0.5) * cell - back.x) / back.w;
      const v = ((r + 0.5) * cell - back.y) / back.h;
      const on = u >= 0 && u < 1 && v >= 0 && v < 1 && OCC[Math.floor(v * OCC.length)]?.[Math.floor(u * OCC[0].length)];
      run += on ? 1 : 0;
      sat[(r + 1) * (cols + 1) + c + 1] = sat[r * (cols + 1) + c + 1] + run;
    }
  }
  // the stamp in the corner is not free space
  const keep: Box[] = [];
  if (stamp) keep.push({ x: stamp.offsetLeft - 4, y: stamp.offsetTop - 4, w: stamp.offsetWidth + 8, h: stamp.offsetHeight + 8 });
  return { sw, sh, m, narrow, home, back, cell, cols, rows, sat, keep, plans: new Map() };
}

/** Area (px²) of a box that covers the solid house in its stepped-back place. */
function houseCover(l: Layout, b: Box): number {
  const c0 = Math.max(0, Math.floor(b.x / l.cell));
  const r0 = Math.max(0, Math.floor(b.y / l.cell));
  const c1 = Math.min(l.cols, Math.ceil((b.x + b.w) / l.cell));
  const r1 = Math.min(l.rows, Math.ceil((b.y + b.h) / l.cell));
  if (c1 <= c0 || r1 <= r0) return 0;
  const W = l.cols + 1;
  const n = l.sat[r1 * W + c1] - l.sat[r0 * W + c1] - l.sat[r1 * W + c0] + l.sat[r0 * W + c0];
  return n * l.cell * l.cell;
}
const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
const inside = (l: Layout, b: Box) => b.x >= l.m && b.y >= l.m && b.x + b.w <= l.sw - l.m && b.y + b.h <= l.sh - l.m;

/** The part's size on this sheet: its image fitted into a box that leaves the house most of the room. */
function partSize(l: Layout, id: PartId, count: number): { w: number; h: number } {
  const f = PARTS[id].files[1];
  const k = count > 1 ? 0.82 : 1;
  const maxW = (l.narrow ? l.sw * 0.38 : Math.min(l.sw * 0.38, 290)) * k;
  const maxH = (l.narrow ? l.sh * 0.46 : Math.min(l.sh * 0.32, 250)) * k;
  const s = Math.min(maxW / f.w, maxH / f.h);
  return { w: Math.round(f.w * s), h: Math.round(f.h * s) };
}

/** The object inside a placed part image (its shadow left out): where the leader line ends. */
function objectBox(id: PartId, b: Box): Box {
  const f = PARTS[id].files[1];
  const o = PARTS[id].object800;
  const s = b.w / f.w;
  return { x: b.x + o.x * s, y: b.y + o.y * s, w: o.w * s, h: o.h * s };
}

/** Where a chapter's parts go: for each part, the free spot of the sheet (off the house, off the other rings,
 *  parts and label, off the stamp) nearest its hotspot; the label goes beside the first part. Cached per sheet size. */
function plan(l: Layout, n: number): Plan {
  const cached = l.plans.get(n);
  if (cached) return cached;
  const ids = partsByChapter.get(n) ?? [];
  const hots = ids.map((id) => hotIn(l.back, id));
  const R = l.narrow ? 16 : 22;
  const rings: Box[] = hots.map(([x, y]) => ({ x: x - R, y: y - R, w: 2 * R, h: 2 * R }));
  const taken: Box[] = [...l.keep];
  let lw = 0;
  let lh = 0;
  if (measure) {
    fillLabel(measure, n);
    lw = measure.offsetWidth;
    lh = measure.offsetHeight;
  }
  const parts: Placed[] = [];
  let labelBox: Box | null = null;
  const STEP = 8;
  const G = 10; // gap between a part and its label
  ids.forEach((id, i) => {
    const { w, h } = partSize(l, id, ids.length);
    const [hx, hy] = hots[i];
    const ringCost = (b: Box) => rings.reduce((s, r) => s + overlap(b, r), 0) * 60;
    const takenCost = (b: Box) => taken.reduce((s, t) => s + overlap(b, t), 0) * 12;
    const cands: { b: Box; score: number }[] = [];
    for (let y = l.m; y + h <= l.sh - l.m; y += STEP) {
      for (let x = l.m; x + w <= l.sw - l.m; x += STEP) {
        const b = { x, y, w, h };
        const cover = houseCover(l, b);
        const dist = Math.hypot(x + w / 2 - hx, y + h / 2 - hy);
        cands.push({ b, score: cover * 1.2 + ringCost(b) + takenCost(b) + dist * 1.5 });
      }
    }
    if (!cands.length) cands.push({ b: { x: l.sw - l.m - w, y: l.m, w, h }, score: 0 });
    cands.sort((a, b) => a.score - b.score);
    let best = cands[0];
    let bestLabel: Box | null = null;
    if (i === 0 && lw && lh) {
      // the first part carries the label: choose the pair (part, label beside it) that covers least
      let bestTotal = Infinity;
      for (const c of cands.slice(0, 80)) {
        const b = c.b;
        const opts: Box[] = [
          { x: b.x + b.w + G, y: b.y, w: lw, h: lh },
          { x: b.x + b.w + G, y: b.y + (b.h - lh) / 2, w: lw, h: lh },
          { x: b.x + b.w + G, y: b.y + b.h - lh, w: lw, h: lh },
          { x: b.x - G - lw, y: b.y, w: lw, h: lh },
          { x: b.x - G - lw, y: b.y + (b.h - lh) / 2, w: lw, h: lh },
          { x: b.x - G - lw, y: b.y + b.h - lh, w: lw, h: lh },
          { x: b.x, y: b.y + b.h + G, w: lw, h: lh },
          { x: b.x + b.w - lw, y: b.y + b.h + G, w: lw, h: lh },
          { x: b.x, y: b.y - G - lh, w: lw, h: lh },
          { x: b.x + b.w - lw, y: b.y - G - lh, w: lw, h: lh },
        ];
        for (const o of opts) {
          if (!inside(l, o)) continue;
          // the leader (hotspot → part) must not run under the label
          const ob = objectBox(id, b);
          const ex = Math.min(Math.max(hx, ob.x), ob.x + ob.w);
          const ey = Math.min(Math.max(hy, ob.y), ob.y + ob.h);
          let cross = 0;
          for (let k = 1; k < 10; k++) {
            const px = hx + ((ex - hx) * k) / 10;
            const py = hy + ((ey - hy) * k) / 10;
            if (px > o.x && px < o.x + o.w && py > o.y && py < o.y + o.h) cross++;
          }
          const total = c.score + houseCover(l, o) * 1.2 + ringCost(o) + takenCost(o) + cross * 4000;
          if (total < bestTotal) {
            bestTotal = total;
            best = c;
            bestLabel = o;
          }
        }
      }
    }
    taken.push(best.b);
    if (bestLabel) {
      taken.push(bestLabel);
      labelBox = bestLabel;
    }
    parts.push({ id, box: best.b, hot: [hx, hy], from: [hx, hy] });
  });
  const p: Plan = { parts, label: labelBox };
  l.plans.set(n, p);
  return p;
}

// ---------- the choreography ----------
let hudTl: gsap.core.Timeline | null = null;
const DUR = { house: 0.7, out: 0.62, back: 0.42 };

function houseTo(l: Layout, b: Box, instant: boolean) {
  if (!rh) return;
  const vars = { x: b.x - l.home.x, y: b.y - l.home.y, scale: b.w / l.home.w };
  if (instant) gsap.set(rh, vars);
  else gsap.to(rh, { ...vars, duration: DUR.house, ease: 'power3.inOut', overwrite: 'auto' });
}

function flyOut(p: Placed, delay: number, instant: boolean) {
  const el = partEls.get(p.id);
  if (!el) return;
  el.style.width = `${p.box.w}px`;
  const to = { x: p.box.x, y: p.box.y, scale: 1, opacity: 1 };
  if (instant) {
    gsap.set(el, to);
    return;
  }
  // from the hotspot, small: only when the part is not already (partly) out — otherwise carry on from where it is
  if (Number(gsap.getProperty(el, 'opacity')) < 0.03) gsap.set(el, { x: p.from[0] - p.box.w / 2, y: p.from[1] - p.box.h / 2, scale: 0.18, opacity: 0 });
  gsap.to(el, { ...to, duration: DUR.out, delay, ease: 'power3.out', overwrite: 'auto' });
}

function flyBack(l: Layout, id: PartId, house: Box, instant: boolean) {
  const el = partEls.get(id);
  if (!el) return;
  // barely out (a fly-out that has only just started): stop it where it is, unseen
  if (Number(gsap.getProperty(el, 'opacity')) < 0.03 && !instant) {
    gsap.killTweensOf(el);
    gsap.set(el, { opacity: 0 });
    return;
  }
  const [hx, hy] = hotIn(house, id);
  const w = el.offsetWidth || partSize(l, id, 1).w;
  const h = el.offsetHeight || w;
  const to = { x: hx - w / 2, y: hy - h / 2, scale: 0.18, opacity: 0 };
  if (instant) gsap.set(el, to);
  else gsap.to(el, { ...to, duration: DUR.back, ease: 'power2.in', overwrite: 'auto' });
}

function showHud(pl: Plan | null, n: number, houseMoves: boolean, instant: boolean) {
  hudTl?.kill();
  // autoAlpha: a hidden mark is also visibility:hidden, so the invisible label cannot take a click
  const all = [...rings.values(), ...leaders.values(), ...(label ? [label] : [])];
  if (!pl) {
    if (instant) gsap.set(all, { autoAlpha: 0 });
    else hudTl = gsap.timeline().to(all, { autoAlpha: 0, duration: 0.15, ease: 'power1.out', overwrite: 'auto' });
    return;
  }
  // geometry of the marks for this chapter
  const geo = pl.parts.map((p) => {
    const ob = objectBox(p.id, p.box);
    const [hx, hy] = p.hot;
    const ex = Math.min(Math.max(hx, ob.x + 4), ob.x + ob.w - 4);
    const ey = Math.min(Math.max(hy, ob.y + 4), ob.y + ob.h - 4);
    const len = Math.hypot(ex - hx, ey - hy);
    const r = (rings.get(p.id)?.offsetWidth ?? 24) / 2 + 2;
    const a = Math.atan2(ey - hy, ex - hx);
    return { id: p.id, hx, hy, sx: hx + Math.cos(a) * r, sy: hy + Math.sin(a) * r, len: Math.max(0, len - r), deg: (a * 180) / Math.PI };
  });
  const place = () => {
    for (const g of geo) {
      gsap.set(rings.get(g.id)!, { x: g.hx, y: g.hy });
      const lead = leaders.get(g.id)!;
      lead.style.width = `${g.len.toFixed(1)}px`;
      gsap.set(lead, { x: g.sx, y: g.sy, rotation: g.deg });
    }
    if (label) {
      fillLabel(label, n);
      if (pl.label) gsap.set(label, { x: pl.label.x, y: pl.label.y });
    }
  };
  const liveRings = geo.map((g) => rings.get(g.id)!);
  const liveLeads = geo.map((g) => leaders.get(g.id)!);
  if (instant) {
    gsap.set(all, { autoAlpha: 0 });
    place();
    gsap.set(liveRings, { autoAlpha: 1, scale: 1 });
    gsap.set(liveLeads, { autoAlpha: 1, scaleX: 1 });
    if (label && pl.label) gsap.set(label, { autoAlpha: 1 });
    return;
  }
  // ≤ 0.8 s in all: marks wait for the house when it is stepping back
  const t0 = houseMoves ? 0.42 : 0.12;
  const tl = gsap.timeline();
  hudTl = tl;
  tl.to(all, { autoAlpha: 0, duration: 0.12, ease: 'power1.out' }, 0);
  tl.call(place, [], 0.13);
  tl.fromTo(liveRings, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'back.out(2)' }, t0);
  tl.fromTo(liveLeads, { autoAlpha: 1, scaleX: 0 }, { scaleX: 1, duration: 0.28, ease: 'power2.inOut', immediateRender: false }, t0 + 0.08);
  if (label && pl.label) tl.fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: 'power1.out', immediateRender: false }, t0 + 0.14);
}

function apply(n: number, instant = false) {
  if (!L) L = layout();
  const l = L;
  if (!l || !rh) return;
  const live = isLive(n);
  const fin = n === FINALE;
  const house = live ? l.back : l.home;
  const moved = Math.abs(Number(gsap.getProperty(rh, 'scale')) - house.w / l.home.w) > 0.01;
  houseTo(l, house, instant);
  // dimmed while a part is out; at the finale the day render gives way to dusk (the two are cross-faded, so the
  // day picture never shows round the dusk one where the two cut-outs differ by a few pixels)
  const dim = { opacity: live ? 0.58 : fin ? 0 : 1 };
  const lit = { opacity: fin ? 1 : 0 };
  if (instant) {
    if (day) gsap.set(day, dim);
    gsap.set([dusk, night].filter(Boolean), lit);
  } else {
    if (day) gsap.to(day, { ...dim, duration: fin || Number(gsap.getProperty(day, 'opacity')) < 0.5 ? 0.8 : 0.5, ease: 'power1.inOut', overwrite: 'auto' });
    gsap.to([dusk, night].filter(Boolean), { ...lit, duration: 0.8, ease: 'power1.inOut', overwrite: 'auto' });
  }
  sheet?.toggleAttribute('data-dusk', fin);
  const pl = live ? plan(l, n) : null;
  const out = new Set(pl?.parts.map((p) => p.id));
  for (const id of partEls.keys()) if (!out.has(id)) flyBack(l, id, house, instant);
  pl?.parts.forEach((p, i) => flyOut(p, (moved ? 0.14 : 0.06) + i * 0.06, instant));
  showHud(pl, n, moved, instant);
}

function setLayer(n: number) {
  if (n === current) return;
  current = n;
  stage?.setAttribute('data-active', String(n));
  if (n === 0) stage?.removeAttribute('data-active');
  chapters.forEach((c) => c.classList.toggle('is-active', Number(c.dataset.chapter) === n));
  keys.forEach((k) => (Number(k.dataset.keyLink) === n ? k.setAttribute('aria-current', 'step') : k.removeAttribute('aria-current')));
  // On narrow phones the key row scrolls sideways: bring the live key into view (scrollLeft only, no page scroll).
  const liveKey = keys.find((k) => Number(k.dataset.keyLink) === n);
  const row = liveKey?.parentElement;
  if (liveKey && row && row.scrollWidth > row.clientWidth) row.scrollLeft = liveKey.offsetLeft - (row.clientWidth - liveKey.offsetWidth) / 2;
  if (caption) {
    const ch = chapters.find((c) => Number(c.dataset.chapter) === n);
    const title = ch?.querySelector('h2')?.textContent ?? '';
    // chapters carry their key; the finale (the whole house switched on) is the title alone
    caption.textContent = !ch ? '' : n >= FINALE ? title : `${String(n).padStart(2, '0')} · ${title}`;
  }
  apply(n);
}

// ---------- "Pse tani": each number is a dimension line drawn from the left ----------
const dims = [...document.querySelectorAll<HTMLElement>('[data-dim]')];

/** Motion off: hand the sheet back to CSS (the static exploded diagram). */
function clearStage() {
  hudTl?.kill();
  const els = [rh, day, dusk, night, label, ...partEls.values(), ...rings.values(), ...leaders.values()].filter((e): e is HTMLElement => !!e);
  gsap.killTweensOf(els);
  gsap.set(els, { clearProps: 'transform,opacity,visibility' });
  partEls.forEach((el) => el.style.removeProperty('width'));
  leaders.forEach((el) => el.style.removeProperty('width'));
  sheet?.removeAttribute('data-dusk');
  // no live chapter in the static view
  stage?.removeAttribute('data-active');
  chapters.forEach((c) => c.classList.remove('is-active'));
  keys.forEach((k) => k.removeAttribute('aria-current'));
  if (caption) caption.textContent = '';
}

function build() {
  triggers.forEach((t) => t.kill());
  triggers = [];
  const dimEls = dims.flatMap((d) => [...d.querySelectorAll<HTMLElement>('[data-dim-rule], [data-dim-end], [data-dim-value], [data-dim-text]')]);
  if (!motionOn() || !sheet) {
    // Static: every part laid out around the house by CSS, every chapter readable.
    clearStage();
    L = null;
    gsap.killTweensOf(dimEls);
    gsap.set(dimEls, { clearProps: 'transform,opacity' });
    current = -1;
    return;
  }
  L = layout();
  current = -1;
  setLayer(0);
  let first: ScrollTrigger | null = null;
  for (const c of chapters) {
    const n = Number(c.dataset.chapter);
    const st = ScrollTrigger.create({
      trigger: c,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) setLayer(n);
        // back above the first chapter (also after a jump straight to the top): the whole house again
        else if (self.direction < 0 && first && self.scroll() < first.start) setLayer(0);
      },
    });
    first ??= st;
    triggers.push(st);
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
  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sq ? ' ' : ',');
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

// A new sheet size (resize, rotation, the phone's toolbar): measure again and put everything in place at once.
if (sheet && 'ResizeObserver' in window) {
  let last = '';
  new ResizeObserver(() => {
    const size = `${sheet.clientWidth}x${sheet.clientHeight}`;
    const first = !last;
    if (size === last) return;
    last = size;
    if (first || !L || !motionOn()) return;
    gsap.set(rh, { clearProps: 'transform' });
    L = layout();
    if (current >= 0) apply(current, true);
  }).observe(sheet);
}
document.addEventListener('beed:loaded', () => ScrollTrigger.refresh());
build();
onMotionChange(() => build());
