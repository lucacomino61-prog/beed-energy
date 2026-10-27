// The realistic house on the home stage: AI-generated renders in public/house/ (FLUX.2 [klein] on Workers AI, see
// ASSETS.md). Numbers copied from public/house/manifest.json (files in public/ cannot be imported); if the
// images are re-cut, update both. Shared by Home.astro (markup) and scripts/home.ts (the exploded-parts motion).

export type PartId = 'pv' | 'inverter' | 'battery' | 'heatpump' | 'swh' | 'ev' | 'meter' | 'envelope';
type Box = { x: number; y: number; w: number; h: number };
type File = { file: string; w: number; h: number };

export const BASE = {
  w: 1600,
  h: 1392,
  day: [
    { file: 'base-900.webp', w: 900, h: 783 },
    { file: 'base-1600.webp', w: 1600, h: 1392 },
  ] as File[],
  dusk: [
    { file: 'base-dusk-900.webp', w: 900, h: 783 },
    { file: 'base-dusk-1600.webp', w: 1600, h: 1392 },
  ] as File[],
  /** Centre of each piece of equipment in the 1600-wide image. */
  hotspots: {
    pv: [658, 223],
    swh: [1162, 195],
    heatpump: [1356, 910],
    inverter: [1270, 888],
    battery: [1270, 918],
    ev: [855, 993],
    meter: [1251, 822],
    windows: [427, 511],
  } as Record<string, [number, number]>,
  /** Where the house itself is (alpha ≥ 200, the soft shadow left out), on a 32 px grid of the 1600 image:
   *  one entry per row, runs of occupied columns as "from-to" (to exclusive). 50 × 44 cells. */
  occCell: 32,
  occ: ' 18-23 16-25 15-28,37-39 13-31,36-41 11-40 10-39 8-40 6-43 5-46 7-45 7-45 7-45 7-45 7-45 7-45 6-45 7-45 7-45 6-45 6-45 6-45 6-45 6-45 6-45 6-45 6-45 6-45 6-45 6-45 6-45 7-44 8-39 5-37 3-35 2-33 4-31 6-29 8-28 10-25 12-22 14-20 16-18 ',
};

/** Each part image: files (the 400 and 800 sizes are the long side), the object without its shadow in the 800
 *  file, and the hotspot on the house it flies out of. */
export const PARTS: Record<PartId, { files: [File, File]; object800: Box; hotspot: string }> = {
  pv: { files: [{ file: 'part-pv-400.webp', w: 400, h: 286 }, { file: 'part-pv-800.webp', w: 800, h: 573 }], object800: { x: 14, y: 14, w: 737, h: 541 }, hotspot: 'pv' },
  inverter: { files: [{ file: 'part-inverter-400.webp', w: 274, h: 400 }, { file: 'part-inverter-800.webp', w: 547, h: 800 }], object800: { x: 19, y: 19, w: 448, h: 682 }, hotspot: 'inverter' },
  battery: { files: [{ file: 'part-battery-400.webp', w: 241, h: 400 }, { file: 'part-battery-800.webp', w: 481, h: 800 }], object800: { x: 63, y: 13, w: 362, h: 758 }, hotspot: 'battery' },
  heatpump: { files: [{ file: 'part-heatpump-400.webp', w: 345, h: 400 }, { file: 'part-heatpump-800.webp', w: 690, h: 800 }], object800: { x: 78, y: 17, w: 554, h: 744 }, hotspot: 'heatpump' },
  swh: { files: [{ file: 'part-swh-400.webp', w: 361, h: 400 }, { file: 'part-swh-800.webp', w: 723, h: 800 }], object800: { x: 26, y: 13, w: 663, h: 746 }, hotspot: 'swh' },
  ev: { files: [{ file: 'part-ev-400.webp', w: 321, h: 400 }, { file: 'part-ev-800.webp', w: 643, h: 800 }], object800: { x: 23, y: 23, w: 547, h: 703 }, hotspot: 'ev' },
  meter: { files: [{ file: 'part-meter-400.webp', w: 328, h: 400 }, { file: 'part-meter-800.webp', w: 656, h: 800 }], object800: { x: 94, y: 66, w: 543, h: 639 }, hotspot: 'meter' },
  envelope: { files: [{ file: 'part-envelope-400.webp', w: 400, h: 284 }, { file: 'part-envelope-800.webp', w: 800, h: 567 }], object800: { x: 43, y: 9, w: 712, h: 533 }, hotspot: 'windows' },
};

export const PART_IDS = Object.keys(PARTS) as PartId[];

// Other names a chapter may use for a part, and the default parts per chapter id / number (story.ts `parts` wins).
const ALIAS: Record<string, PartId> = {
  'heat-pump': 'heatpump', 'solar-water-heater': 'swh', windows: 'envelope', insulation: 'envelope', grid: 'meter', charger: 'ev', panels: 'pv',
};
const BY_ID: Record<string, PartId[]> = { pv: ['pv'], inverter: ['inverter'], battery: ['battery'], heat: ['heatpump', 'swh'], ev: ['ev'], grid: ['meter'], envelope: ['envelope'] };
const BY_N: PartId[][] = [[], ['pv'], ['inverter'], ['battery'], ['heatpump', 'swh'], ['ev'], ['meter'], ['envelope']];

export function partsOf(layer: { n: number; id?: string; parts?: readonly string[] }): PartId[] {
  const raw = layer.parts ?? (layer.id ? BY_ID[layer.id] : undefined) ?? BY_N[layer.n] ?? [];
  const out: PartId[] = [];
  for (const p of raw) {
    const id = (p in PARTS ? p : ALIAS[p]) as PartId | undefined;
    if (id && !out.includes(id)) out.push(id);
  }
  return out;
}

export const srcset = (files: File[]) => files.map((f) => `/house/${f.file} ${f.w}w`).join(', ');
