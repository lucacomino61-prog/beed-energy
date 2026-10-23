// "Shtëpia në shtresa": a two-storey Albanian house drawn in isometric line work, built from parts.
// Every part belongs to one of seven layers and carries an explode vector (metres in world space).
// Faces are filled with paper and drawn back to front, so hidden lines disappear without a 3D engine.
// World axes: x along the long facade (10 m), y across (8 m), z up. The viewer stands at +x, +y, +z,
// so the visible faces are the tops, the x = max face (right) and the y = max face (front-left).

const C = Math.cos(Math.PI / 6);
const S = 34; // px per metre in the viewBox
/** Key radius in viewBox units. The home script scales keys so they read 21 px across with 11 px text on any screen. */
export const KEY_R = 20;

type V3 = [number, number, number];
const P = ([x, y, z]: V3): [number, number] => [(x - y) * C * S, (x + y) * 0.5 * S - z * S];
const f = (n: number) => Math.round(n * 10) / 10;
const path = (pts: V3[], close = true) => 'M' + pts.map((p) => P(p).map(f).join(' ')).join(' L') + (close ? ' Z' : '');
const seg = (a: V3, b: V3) => `M${P(a).map(f).join(' ')} L${P(b).map(f).join(' ')}`;

export type HousePart = { id: string; layer: number; d: V3; svg: string };

const W = 10;
const D = 8;
const H = 6.2; // eaves height (two floors + slab)
const R = 2.3; // roof rise
const O = 0.45; // roof overhang

function box(x0: number, y0: number, z0: number, w: number, d: number, h: number, cls = 'face') {
  const x1 = x0 + w, y1 = y0 + d, z1 = z0 + h;
  return [
    `<path class="${cls} ${cls}--top" d="${path([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])}"/>`,
    `<path class="${cls} ${cls}--x" d="${path([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])}"/>`,
    `<path class="${cls} ${cls}--y" d="${path([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])}"/>`,
  ].join('');
}

/** A rectangle on the y = yc plane (front facade), x from a to b, z from c to e. */
const rectY = (yc: number, a: number, b: number, c: number, e: number) => path([[a, yc, c], [b, yc, c], [b, yc, e], [a, yc, e]]);
/** A rectangle on the x = xc plane (right facade), y from a to b, z from c to e. */
const rectX = (xc: number, a: number, b: number, c: number, e: number) => path([[xc, a, c], [xc, b, c], [xc, b, e], [xc, a, e]]);

function windowY(yc: number, x: number, z: number, w: number, h: number, door = false) {
  const fr = 0.07;
  const parts = [
    `<path class="face" d="${rectY(yc, x, x + w, z, z + h)}"/>`,
    `<path class="glass" d="${rectY(yc, x + fr, x + w - fr, z + fr, z + h - fr)}"/>`,
  ];
  if (!door) parts.push(`<path class="thin" d="${seg([x + w / 2, yc, z + fr], [x + w / 2, yc, z + h - fr])}"/>`);
  else parts.push(`<path class="thin" d="${seg([x + w * 0.8, yc, z + h * 0.48], [x + w * 0.8, yc, z + h * 0.52])}"/>`);
  return parts.join('');
}

function windowX(xc: number, y: number, z: number, w: number, h: number) {
  const fr = 0.07;
  return [
    `<path class="face" d="${rectX(xc, y, y + w, z, z + h)}"/>`,
    `<path class="glass" d="${rectX(xc, y + fr, y + w - fr, z + fr, z + h - fr)}"/>`,
    `<path class="thin" d="${seg([xc, y + w / 2, z + fr], [xc, y + w / 2, z + h - fr])}"/>`,
  ].join('');
}

function key(n: number, at: V3) {
  const [x, y] = P(at).map(f);
  return `<g class="key" data-key="${n}"><circle cx="${x}" cy="${y}" r="${KEY_R}"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${String(n).padStart(2, '0')}</text></g>`;
}

export function houseParts(): HousePart[] {
  const parts: HousePart[] = [];
  const add = (id: string, layer: number, d: V3, svg: string) => parts.push({ id, layer, d, svg });

  // 01 — foundation slab and masonry walls (blocks, cement, rebar)
  {
    let s = box(-0.35, -0.35, -0.55, W + 0.7, D + 0.7, 0.55);
    // rebar hint: dashed bars inside the slab edge on the two visible faces
    for (let i = 1; i < 3; i++) {
      const z = -0.55 + (0.55 / 3) * i;
      s += `<path class="dash" d="${seg([W + 0.35, -0.2, z], [W + 0.35, D + 0.2, z])}"/><path class="dash" d="${seg([-0.2, D + 0.35, z], [W + 0.2, D + 0.35, z])}"/>`;
    }
    s += key(1, [W + 0.35, D + 0.35, -0.3]);
    add('foundation', 1, [0, 0, -2.6], s);
  }
  {
    let s = box(0, 0, 0, W, D, H);
    // block coursing on the two visible faces
    for (let z = 0.5; z < H; z += 0.5) {
      s += `<path class="hair" d="${seg([0, D, z], [W, D, z])}"/><path class="hair" d="${seg([W, 0, z], [W, D, z])}"/>`;
    }
    for (let x = 0.5; x < W; x += 1) for (let z = 0; z < H; z += 1) s += `<path class="hair" d="${seg([x + ((z / 0.5) % 2 ? 0.5 : 0), D, z], [x + ((z / 0.5) % 2 ? 0.5 : 0), D, z + 0.5])}"/>`;
    // first-floor slab band
    s += `<path class="thin" d="${seg([0, D, 3.05], [W, D, 3.05])} ${seg([W, 0, 3.05], [W, D, 3.05])}"/>`;
    add('walls', 1, [0, 0, 0], s);
  }

  // 02 — insulation boards (stone wool / EPS / ETICS) on the two visible facades
  {
    let s = box(0, D, 0.25, W, 0.12, H - 0.25, 'board');
    for (let x = 1.2; x < W; x += 1.2) s += `<path class="hair" d="${seg([x, D + 0.12, 0.25], [x, D + 0.12, H])}"/>`;
    for (let z = 0.85; z < H; z += 0.6) s += `<path class="hair" d="${seg([0, D + 0.12, z], [W, D + 0.12, z])}"/>`;
    s += key(2, [0.45, D + 0.12, 5.55]);
    add('insulation-front', 2, [0, 2.6, 0], s);
  }
  {
    let s = box(W, 0, 0.25, 0.12, D, H - 0.25, 'board');
    for (let y = 1.2; y < D; y += 1.2) s += `<path class="hair" d="${seg([W + 0.12, y, 0.25], [W + 0.12, y, H])}"/>`;
    for (let z = 0.85; z < H; z += 0.6) s += `<path class="hair" d="${seg([W + 0.12, 0, z], [W + 0.12, D, z])}"/>`;
    add('insulation-right', 2, [2.6, 0, 0], s);
  }

  // 03 — PVC windows and the front door
  {
    const y = D + 0.13;
    let s = windowY(y, 3.4, 0.9, 1.3, 1.4) + windowY(y, 6.4, 0, 1.0, 2.3, true) + windowY(y, 8.1, 0.9, 1.3, 1.4);
    s += windowY(y, 1.3, 4.0, 1.3, 1.45) + windowY(y, 4.35, 4.0, 1.3, 1.45) + windowY(y, 7.4, 4.0, 1.3, 1.45);
    s += key(3, [4.35, y, 5.6]);
    add('windows-front', 3, [0, 4.6, 0], s);
  }
  {
    const x = W + 0.13;
    const s = windowX(x, 3.2, 0.9, 1.3, 1.4) + windowX(x, 1.5, 4.0, 1.3, 1.45) + windowX(x, 4.6, 4.0, 1.3, 1.45);
    add('windows-right', 3, [4.6, 0, 0], s);
  }

  // 04 — roof with tiles, then mounting rails and the PV array on the visible (south) slope
  {
    const ridge: V3[] = [[-O, D / 2, H + R], [W + O, D / 2, H + R]];
    let s = `<path class="face face--top" d="${path([[-O, -O, H], [W + O, -O, H], ridge[1], ridge[0]])}"/>`;
    s += `<path class="face face--x" d="${path([[W + O, -O, H], [W + O, D + O, H], [W + O, D / 2, H + R]])}"/>`;
    s += `<path class="face face--roof" d="${path([ridge[0], ridge[1], [W + O, D + O, H], [-O, D + O, H]])}"/>`;
    const L = Math.hypot(D / 2 + O, R);
    for (let v = 0.35; v < L; v += 0.35) {
      const t = v / L;
      const yy = D + O - t * (D / 2 + O);
      const zz = H + t * R;
      s += `<path class="hair" d="${seg([-O, yy, zz], [W + O, yy, zz])}"/>`;
    }
    s += key(4, [W + O, D / 2 + 1.2, H + R * 0.55]);
    add('roof', 4, [0, 0, 3.4], s);
  }
  {
    const L = Math.hypot(D / 2 + O, R);
    const on = (x: number, v: number, lift = 0.08): V3 => {
      const t = v / L;
      return [x, D + O - t * (D / 2 + O), H + t * R + lift];
    };
    let s = '';
    // two rails per row
    for (const v0 of [0.55, 2.35]) {
      for (const dv of [0.35, 1.35]) s += `<path class="thin" d="${seg(on(1.0, v0 + dv, 0.04), on(1.0 + 5 * 1.154, v0 + dv, 0.04))}"/>`;
    }
    // 2 rows × 5 portrait modules, 1134 × 1722 mm each (a real 108-cell module)
    for (const v0 of [0.55, 2.35]) {
      for (let i = 0; i < 5; i++) {
        const x0 = 1.0 + i * 1.154;
        const x1 = x0 + 1.134;
        const v1 = v0 + 1.722;
        s += `<path class="panel" d="${path([on(x0, v0), on(x1, v0), on(x1, v1), on(x0, v1)])}"/>`;
        for (let k = 1; k < 3; k++) s += `<path class="hair" d="${seg(on(x0 + (1.134 / 3) * k, v0), on(x0 + (1.134 / 3) * k, v1))}"/>`;
        s += `<path class="hair" d="${seg(on(x0, v0 + 0.861), on(x1, v0 + 0.861))}"/>`;
      }
    }
    s += key(4, on(1.0 + 5 * 1.154, 4.1));
    add('panels', 4, [0, 0, 5.6], s);
  }

  // 05 — inverter and battery on the front wall, left end (they slide out along the wall)
  {
    const y = D + 0.13;
    let s = box(0.35, y, 1.25, 0.525, 0.18, 0.47, 'unit');
    s += `<path class="thin" d="${rectY(y + 0.18, 0.5, 0.75, 1.55, 1.62)}"/>`;
    s += box(1.15, y, 0.12, 0.67, 0.15, 1.31, 'unit');
    for (let z = 0.45; z < 1.4; z += 0.33) s += `<path class="hair" d="${seg([1.15, y + 0.15, z], [1.82, y + 0.15, z])}"/>`;
    s += `<path class="thin" d="${seg([0.61, y + 0.09, 1.25], [0.61, y + 0.09, 0.9])} ${seg([0.61, y + 0.09, 0.9], [1.15, y + 0.09, 0.9])}"/>`;
    s += key(5, [1.5, y + 0.15, 1.75]);
    add('storage', 5, [-1.0, 3.0, 2.2], s);
  }

  // 06 — heating and cooling: heat pump on the ground by the right wall, AC unit on a bracket above
  {
    const x = W + 0.25;
    let s = box(x, 0.55, 0, 0.46, 1.1, 0.87, 'unit');
    const cy = 1.05;
    const cz = 0.45;
    const ring = (rad: number) => {
      const pts: V3[] = [];
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        pts.push([x + 0.46, cy + Math.cos(a) * rad, cz + Math.sin(a) * rad]);
      }
      return path(pts, false);
    };
    s += `<path class="thin" d="${ring(0.32)}"/><path class="hair" d="${ring(0.2)}"/>`;
    s += box(x, 6.65, 3.65, 0.3, 0.8, 0.55, 'unit');
    s += `<path class="hair" d="${seg([x + 0.3, 6.75, 3.92], [x + 0.3, 7.35, 3.92])}"/>`;
    s += key(6, [x + 0.15, 7.05, 4.55]);
    add('climate', 6, [4.4, 0, 2.0], s);
  }

  // 07 — energy meter and EV charger on the right wall, the grid pole beside the house, the service drop
  {
    const x = W + 0.13;
    let s = box(x, 2.15, 1.0, 0.16, 0.45, 0.62, 'unit');
    s += `<path class="thin" d="${rectX(x + 0.16, 2.22, 2.52, 1.32, 1.5)}"/>`;
    s += box(x, 5.7, 1.1, 0.09, 0.17, 0.17, 'unit');
    s += `<path class="thin" d="M${P([x + 0.09, 5.79, 1.1]).map(f).join(' ')} Q${P([x + 0.9, 6.2, 0.2]).map(f).join(' ')} ${P([x + 1.4, 5.4, 0.05]).map(f).join(' ')}"/>`;
    const pole: V3 = [W + 3.8, -1.2, -0.55];
    s += `<path class="thin" d="${seg(pole, [pole[0], pole[1], 7.6])} ${seg([pole[0] - 0.55, pole[1] + 0.55, 7.15], [pole[0] + 0.55, pole[1] - 0.55, 7.15])}"/>`;
    s += `<path class="wire" d="M${P([pole[0], pole[1], 7.15]).map(f).join(' ')} Q${P([W + 2, 1.0, 3.6]).map(f).join(' ')} ${P([x + 0.16, 2.37, 1.62]).map(f).join(' ')}"/>`;
    s += key(7, [x + 0.16, 2.37, 2.05]);
    add('grid', 7, [3.0, -1.0, 2.6], s);
  }
  return parts;
}

/** The ground: site outline, dimension lines in millimetres, a north arrow. Never moves. */
function site() {
  const g: V3[] = [[-2.5, -2.5, -0.55], [W + 6, -2.5, -0.55], [W + 6, D + 5, -0.55], [-2.5, D + 5, -0.55]];
  let s = `<path class="site" d="${path(g)}"/>`;
  const dimY = D + 4.2;
  s += `<path class="dimline" d="${seg([0, dimY, -0.55], [W, dimY, -0.55])} ${seg([0, dimY - 0.3, -0.55], [0, dimY + 0.3, -0.55])} ${seg([W, dimY - 0.3, -0.55], [W, dimY + 0.3, -0.55])}"/>`;
  const [tx, ty] = P([W / 2, dimY + 0.7, -0.55]);
  s += `<text class="dimtext" x="${f(tx)}" y="${f(ty)}" text-anchor="middle" transform="rotate(30 ${f(tx)} ${f(ty)})">10 000</text>`;
  const dimX = W + 5.2;
  s += `<path class="dimline" d="${seg([dimX, 0, -0.55], [dimX, D, -0.55])} ${seg([dimX - 0.3, 0, -0.55], [dimX + 0.3, 0, -0.55])} ${seg([dimX - 0.3, D, -0.55], [dimX + 0.3, D, -0.55])}"/>`;
  const [ux, uy] = P([dimX + 0.7, D / 2, -0.55]);
  s += `<text class="dimtext" x="${f(ux)}" y="${f(uy)}" text-anchor="middle" transform="rotate(-30 ${f(ux)} ${f(uy)})">8 000</text>`;
  const n0 = P([-1.6, D + 3.6, -0.55]);
  const n1 = P([-1.6, D + 1.6, -0.55]);
  s += `<path class="thin" d="M${n0.map(f).join(' ')} L${n1.map(f).join(' ')}"/><text class="dimtext" x="${f(n1[0] - 4)}" y="${f(n1[1] - 6)}">N</text>`;
  return s;
}

type Box = { x0: number; y0: number; x1: number; y1: number };
/** Extent of an SVG fragment: every coordinate pair in its path data, circles with their radius, text anchors with a margin. */
function extent(svg: string): Box {
  const b: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const add = (x: number, y: number, r = 0) => {
    b.x0 = Math.min(b.x0, x - r);
    b.y0 = Math.min(b.y0, y - r);
    b.x1 = Math.max(b.x1, x + r);
    b.y1 = Math.max(b.y1, y + r);
  };
  for (const m of svg.matchAll(/ d="([^"]+)"/g)) {
    const n = (m[1].match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) add(n[i], n[i + 1]);
  }
  for (const m of svg.matchAll(/<circle cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="([\d.]+)"/g)) add(Number(m[1]), Number(m[2]), Number(m[3]));
  for (const m of svg.matchAll(/<text[^>]* x="(-?[\d.]+)" y="(-?[\d.]+)"/g)) add(Number(m[1]), Number(m[2]), 28);
  return b;
}

export type HouseSvg = { svg: string; viewBox: string; parts: { id: string; layer: number; dx: number; dy: number }[] };

/** The whole drawing. Each part is a <g data-part data-layer> carrying its exploded screen offset in --dx/--dy. */
export function houseSvg(opts: { title?: string } = {}): HouseSvg {
  const parts = houseParts();
  const drawn = parts.map((p) => {
    const [dx, dy] = (() => {
      const a = P([0, 0, 0]);
      const b = P(p.d);
      return [f(b[0] - a[0]), f(b[1] - a[1])];
    })();
    return { ...p, dx, dy };
  });
  // Bounds over the assembled and the exploded position of every part (measured from the drawn
  // geometry), so nothing leaves the viewBox while it moves and the house fills its frame.
  const site0 = site();
  const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const grow = (box: Box, dx = 0, dy = 0) => {
    b.x0 = Math.min(b.x0, box.x0 + dx);
    b.y0 = Math.min(b.y0, box.y0 + dy);
    b.x1 = Math.max(b.x1, box.x1 + dx);
    b.y1 = Math.max(b.y1, box.y1 + dy);
  };
  grow(extent(site0));
  for (const p of drawn) {
    const e = extent(p.svg);
    grow(e);
    grow(e, p.dx, p.dy);
  }
  const pad = 24;
  const minX = b.x0 - pad;
  const minY = b.y0 - pad;
  const maxX = b.x1 + pad;
  const maxY = b.y1 + pad;
  const viewBox = `${f(minX)} ${f(minY)} ${f(maxX - minX)} ${f(maxY - minY)}`;
  // Keys are drawn last, above every face, in their own group that travels with the part (same layer, same offset).
  const keyRe = /<g class="key"[^>]*>.*?<\/g>/g;
  const keysOf = (svg: string) => svg.match(keyRe) ?? [];
  const body =
    drawn.map((p) => `<g class="part" data-part="${p.id}" data-layer="${p.layer}" style="--dx:${p.dx}px;--dy:${p.dy}px">${p.svg.replace(keyRe, '')}</g>`).join('') +
    drawn
      .filter((p) => keysOf(p.svg).length > 0)
      .map((p) => `<g class="part part--keys" data-part="${p.id}-keys" data-layer="${p.layer}" style="--dx:${p.dx}px;--dy:${p.dy}px">${keysOf(p.svg).join('')}</g>`)
      .join('');
  const title = opts.title ? `<title>${opts.title.replace(/[<&>]/g, '')}</title>` : '';
  const svg = `<svg class="house" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${(opts.title ?? '').replace(/"/g, '')}">${title}<g class="house__site">${site0}</g>${body}</svg>`;
  return { svg, viewBox, parts: drawn.map(({ id, layer, dx, dy }) => ({ id, layer, dx, dy })) };
}
