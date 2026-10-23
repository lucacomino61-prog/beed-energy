// Product technical drawings: front view + side view at the product's real datasheet dimensions,
// with dimension lines in millimetres. They stand in for product photos, which belong to the makers.
// Strokes use currentColor and never scale, so the drawing reads the same in a card or full screen.

export type DrawingInput = {
  category: string; // categories.slug_en
  w: number | null;
  h: number | null;
  d: number | null;
  specs?: Record<string, unknown>;
  dims?: boolean; // dimension lines and labels (off for tiny thumbnails)
  title?: string;
};

const fmt = (n: number) => {
  const s = Math.round(n).toString();
  return s.length > 3 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
};

// Typical outer sizes when a datasheet gives none (shown without dimension labels).
const FALLBACK: Record<string, [number, number, number]> = {
  'solar-panels': [1134, 1722, 30],
  inverters: [520, 450, 180],
  batteries: [600, 800, 200],
  'ev-chargers': [200, 350, 110],
  'mounting-systems': [2000, 40, 40],
  'pv-accessories': [120, 40, 30],
  'heat-pumps': [1000, 750, 400],
  'air-conditioners': [800, 300, 220],
  'solar-water-heaters': [1200, 2000, 600],
  insulation: [1200, 600, 100],
  windows: [1230, 1480, 82],
  'cement-and-masonry': [400, 600, 120],
  'energy-monitoring': [72, 90, 66],
  'led-lighting': [1200, 60, 60],
};

export function drawProduct(input: DrawingInput): string {
  const fb = FALLBACK[input.category] ?? [600, 600, 200];
  const real = !!(input.w && input.h);
  let W = input.w ?? fb[0];
  let H = input.h ?? fb[1];
  let D = input.d ?? fb[2];
  // Long thin things (rails, cables, battens) are drawn lying down.
  const lying = ['mounting-systems', 'led-lighting', 'pv-accessories'].includes(input.category);
  if (lying && H > W) [W, H] = [H, W];
  D = Math.max(D, Math.min(W, H) * 0.02);

  const unit = Math.max(W, H);
  const gap = unit * 0.12;
  const pad = unit * 0.14;
  const showSide = D / Math.max(W, H) > 0.004 && !lying;
  const totalW = W + (showSide ? gap + D : 0);
  const vbX = -pad;
  const vbY = -pad;
  const vbW = totalW + pad * 2;
  const vbH = H + pad * 2;
  const fs = unit * 0.045;
  const dims = input.dims !== false && real;
  const parts: string[] = [];

  parts.push(front(input.category, W, H, unit, input.specs ?? {}));
  if (showSide) parts.push(`<g transform="translate(${W + gap} 0)">${side(input.category, D, H, unit)}</g>`);

  if (dims) {
    const off = pad * 0.45;
    parts.push(dimLine(0, H + off, W, H + off, `${fmt(input.w!)}`, fs, 'h'));
    parts.push(dimLine(-off, 0, -off, H, `${fmt(input.h!)}`, fs, 'v'));
    if (showSide && input.d) parts.push(dimLine(W + gap, H + off, W + gap + D, H + off, `${fmt(input.d)}`, fs, 'h', true));
  }

  const label = input.title ? `<title>${input.title.replace(/[<&>"]/g, '')}</title>` : '';
  return `<svg class="drawing" viewBox="${r(vbX)} ${r(vbY)} ${r(vbW)} ${r(vbH)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${(input.title ?? '').replace(/"/g, '')}" fill="none" stroke="currentColor" stroke-linejoin="round">${label}<g vector-effect="non-scaling-stroke">${parts.join('')}</g></svg>`;
}

const r = (n: number) => Math.round(n * 10) / 10;
const rect = (x: number, y: number, w: number, h: number, extra = '') =>
  `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" vector-effect="non-scaling-stroke" ${extra}/>`;
const line = (x1: number, y1: number, x2: number, y2: number, extra = '') =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" vector-effect="non-scaling-stroke" ${extra}/>`;
const circle = (cx: number, cy: number, rad: number, extra = '') => `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rad)}" vector-effect="non-scaling-stroke" ${extra}/>`;
const THIN = 'stroke-width="0.6" opacity="0.55"';
const HAIR = 'stroke-width="0.5" opacity="0.35"';

function dimLine(x1: number, y1: number, x2: number, y2: number, text: string, fs: number, dir: 'h' | 'v', small = false): string {
  const t = fs * 0.5;
  const ticks =
    dir === 'h'
      ? line(x1, y1 - t, x1, y1 + t) + line(x2, y2 - t, x2, y2 + t)
      : line(x1 - t, y1, x1 + t, y1) + line(x2 - t, y2, x2 + t, y2);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const size = small ? fs * 0.8 : fs;
  const label =
    dir === 'h'
      ? `<text x="${r(mx)}" y="${r(my + size * 1.35)}" font-size="${r(size)}" text-anchor="middle" fill="currentColor" stroke="none" class="drawing__dim">${text}</text>`
      : `<text x="${r(mx - size * 0.6)}" y="${r(my)}" font-size="${r(size)}" text-anchor="middle" fill="currentColor" stroke="none" class="drawing__dim" transform="rotate(-90 ${r(mx - size * 0.6)} ${r(my)})">${text}</text>`;
  return `<g class="drawing__dims" stroke-width="0.6">${line(x1, y1, x2, y2)}${ticks}${label}</g>`;
}

function front(cat: string, W: number, H: number, u: number, specs: Record<string, unknown>): string {
  const out: string[] = [];
  switch (cat) {
    case 'solar-panels': {
      const frame = Math.min(W, H) * 0.025;
      out.push(rect(0, 0, W, H, 'stroke-width="1.4"'));
      out.push(rect(frame, frame, W - frame * 2, H - frame * 2, THIN));
      const cells = Number(specs.cell_count) || 108;
      const cols = 6;
      const half = cells >= 100; // half-cut modules show two cell fields
      const rows = Math.round(cells / cols);
      const ix = frame * 1.6;
      const iy = frame * 1.6;
      const iw = W - ix * 2;
      const ih = H - iy * 2;
      const cw = iw / cols;
      const ch = (ih - (half ? cw * 0.15 : 0)) / rows;
      for (let i = 1; i < cols; i++) out.push(line(ix + cw * i, iy, ix + cw * i, iy + ih, HAIR));
      for (let j = 1; j < rows; j++) {
        const y = iy + ch * j + (half && j >= rows / 2 ? cw * 0.15 : 0);
        out.push(line(ix, y, ix + iw, y, HAIR));
      }
      if (half) {
        const y = iy + ih / 2;
        out.push(line(ix, y - cw * 0.075, ix + iw, y - cw * 0.075, THIN), line(ix, y + cw * 0.075, ix + iw, y + cw * 0.075, THIN));
      }
      out.push(rect(ix, iy, iw, ih, THIN));
      break;
    }
    case 'inverters':
    case 'energy-monitoring': {
      const rr = Math.min(W, H) * 0.06;
      out.push(rect(0, 0, W, H, `rx="${r(rr)}" stroke-width="1.4"`));
      if (cat === 'energy-monitoring') {
        for (let i = 0; i < 4; i++) out.push(circle(W * (0.2 + i * 0.2), H * 0.12, W * 0.06, THIN), circle(W * (0.2 + i * 0.2), H * 0.88, W * 0.06, THIN));
        out.push(rect(W * 0.18, H * 0.32, W * 0.64, H * 0.2, THIN));
      } else {
        out.push(rect(W * 0.3, H * 0.22, W * 0.4, H * 0.08, `rx="${r(rr * 0.4)}" ${THIN}`));
        out.push(circle(W * 0.5, H * 0.42, Math.min(W, H) * 0.02, THIN));
        for (let i = 0; i < 5; i++) out.push(circle(W * (0.25 + i * 0.125), H * 0.93, Math.min(W, H) * 0.025, THIN));
        out.push(line(W * 0.08, H * 0.82, W * 0.92, H * 0.82, HAIR));
      }
      break;
    }
    case 'batteries': {
      const n = H > W * 1.4 ? Math.max(2, Math.min(6, Math.round(H / (W * 0.45)))) : 1;
      const base = H * 0.06;
      const mh = (H - base) / n;
      for (let i = 0; i < n; i++) {
        out.push(rect(0, i * mh, W, mh - u * 0.004, `rx="${r(W * 0.03)}" stroke-width="1.4"`));
        out.push(line(W * 0.08, i * mh + mh * 0.5, W * 0.3, i * mh + mh * 0.5, THIN));
      }
      if (n > 1) out.push(rect(W * 0.04, H - base, W * 0.92, base, THIN));
      break;
    }
    case 'ev-chargers': {
      out.push(rect(0, 0, W, H, `rx="${r(W * 0.18)}" stroke-width="1.4"`));
      out.push(circle(W * 0.5, H * 0.3, W * 0.16, THIN));
      out.push(rect(W * 0.32, H * 0.58, W * 0.36, H * 0.22, `rx="${r(W * 0.08)}" ${THIN}`));
      out.push(`<path d="M ${r(W * 0.5)} ${r(H)} C ${r(W * 0.5)} ${r(H * 1.12)}, ${r(W * 1.1)} ${r(H * 1.05)}, ${r(W * 1.05)} ${r(H * 0.7)}" vector-effect="non-scaling-stroke" ${THIN}/>`);
      break;
    }
    case 'heat-pumps': {
      out.push(rect(0, 0, W, H, `rx="${r(Math.min(W, H) * 0.03)}" stroke-width="1.4"`));
      const fr = Math.min(W * 0.32, H * 0.4);
      out.push(circle(W * 0.38, H * 0.5, fr, THIN));
      for (let i = 1; i < 6; i++) out.push(circle(W * 0.38, H * 0.5, (fr * i) / 6, HAIR));
      for (let i = 0; i < 9; i++) out.push(line(W * 0.78, H * (0.15 + i * 0.08), W * 0.94, H * (0.15 + i * 0.08), HAIR));
      break;
    }
    case 'air-conditioners': {
      out.push(rect(0, 0, W, H, `rx="${r(H * 0.25)}" stroke-width="1.4"`));
      out.push(line(W * 0.05, H * 0.78, W * 0.95, H * 0.78, THIN));
      out.push(line(W * 0.1, H * 0.88, W * 0.9, H * 0.88, HAIR));
      out.push(circle(W * 0.88, H * 0.3, H * 0.04, THIN));
      break;
    }
    case 'solar-water-heaters': {
      const tankH = H * 0.22;
      out.push(rect(W * 0.02, 0, W * 0.96, tankH, `rx="${r(tankH / 2)}" stroke-width="1.4"`));
      const cy = tankH * 1.15;
      out.push(rect(0, cy, W, H - cy, 'stroke-width="1.4"'));
      const risers = 12;
      for (let i = 1; i < risers; i++) out.push(line((W / risers) * i, cy + (H - cy) * 0.06, (W / risers) * i, H - (H - cy) * 0.06, HAIR));
      out.push(line(0, cy + (H - cy) * 0.06, W, cy + (H - cy) * 0.06, THIN), line(0, H - (H - cy) * 0.06, W, H - (H - cy) * 0.06, THIN));
      break;
    }
    case 'insulation': {
      out.push(rect(0, 0, W, H, 'stroke-width="1.4"'));
      const n = 7;
      for (let i = 1; i <= n; i++) {
        const y = (H / (n + 1)) * i;
        out.push(`<path d="M 0 ${r(y)} ${Array.from({ length: 12 }, (_, k) => `Q ${r((W / 12) * (k + 0.5))} ${r(y + (k % 2 ? 1 : -1) * H * 0.03)} ${r((W / 12) * (k + 1))} ${r(y)}`).join(' ')}" vector-effect="non-scaling-stroke" ${HAIR}/>`);
      }
      break;
    }
    case 'windows': {
      const f = Math.min(W, H) * 0.07;
      out.push(rect(0, 0, W, H, 'stroke-width="1.4"'));
      out.push(rect(f, f, W - f * 2, H - f * 2, THIN));
      out.push(rect(f * 1.7, f * 1.7, W - f * 3.4, H - f * 3.4, HAIR));
      out.push(line(f * 1.7, f * 1.7, W / 2, H - f * 1.7, HAIR), line(W / 2, H - f * 1.7, W - f * 1.7, f * 1.7, HAIR));
      out.push(rect(W - f * 1.5, H * 0.45, f * 0.5, H * 0.1, THIN));
      break;
    }
    case 'cement-and-masonry': {
      const s = String(specs.strength_class ?? specs.standard ?? '');
      const isBag = Number(specs.bag_kg) > 0;
      if (isBag) {
        out.push(`<path d="M ${r(W * 0.06)} 0 L ${r(W * 0.94)} 0 L ${r(W)} ${r(H * 0.06)} L ${r(W)} ${r(H * 0.94)} L ${r(W * 0.94)} ${r(H)} L ${r(W * 0.06)} ${r(H)} L 0 ${r(H * 0.94)} L 0 ${r(H * 0.06)} Z" vector-effect="non-scaling-stroke" stroke-width="1.4"/>`);
        out.push(rect(W * 0.1, H * 0.38, W * 0.8, H * 0.22, THIN));
        if (s) out.push(`<text x="${r(W / 2)}" y="${r(H * 0.52)}" font-size="${r(H * 0.07)}" text-anchor="middle" fill="currentColor" stroke="none" class="drawing__dim">${s.replace(/[<&>]/g, '').slice(0, 16)}</text>`);
      } else {
        out.push(rect(0, 0, W, H, 'stroke-width="1.4"'));
        for (let i = 1; i < 4; i++) out.push(line(0, (H / 4) * i, W, (H / 4) * i, HAIR));
      }
      break;
    }
    case 'mounting-systems': {
      out.push(rect(0, H * 0.2, W, H * 0.6, 'stroke-width="1.4"'));
      out.push(line(0, H * 0.5, W, H * 0.5, HAIR));
      for (let i = 0; i < 4; i++) out.push(rect(W * (0.1 + i * 0.26) - H * 0.4, 0, H * 0.8, H, THIN));
      break;
    }
    case 'led-lighting': {
      out.push(rect(0, 0, W, H, `rx="${r(H * 0.3)}" stroke-width="1.4"`));
      out.push(line(H * 0.5, H * 0.5, W - H * 0.5, H * 0.5, THIN));
      break;
    }
    default:
      out.push(rect(0, 0, W, H, `rx="${r(Math.min(W, H) * 0.04)}" stroke-width="1.4"`));
  }
  return out.join('');
}

function side(cat: string, D: number, H: number, _u: number): string {
  const out: string[] = [rect(0, 0, D, H, 'stroke-width="1.2"')];
  if (cat === 'solar-panels') out.push(rect(D * 0.15, H * 0.12, D * 0.7, H * 0.05, HAIR));
  if (cat === 'inverters' || cat === 'heat-pumps') for (let i = 1; i < 8; i++) out.push(line(D * 0.15, (H / 8) * i, D * 0.85, (H / 8) * i, HAIR));
  if (cat === 'solar-water-heaters') out.push(line(0, H * 0.2, D, H * 0.2, THIN));
  return out.join('');
}
