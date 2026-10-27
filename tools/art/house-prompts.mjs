// Prompts for the realistic house renders in public/house/ (see ASSETS.md "Realistic house renders").
// Model: FLUX.2 [klein] 4B (@cf/black-forest-labs/flux-2-klein-4b, Apache 2.0 weights) on
// Cloudflare Workers AI, inside the free daily allowance (10,000 neurons, resets 00:00 UTC; error
// 4006 when used up). Price on 2026-10-27: 26.05 neurons per output 512×512 tile and 5.37 per input
// (reference) tile, so a 1024×1024 part ≈ 104 neurons, a 2048×1536 house ≈ 313, the dusk edit ≈ 377.
//
// What was kept (2026-10-27, 32 renders, ≈ 6,700 neurons):
//   base       ← BASE, candidate 9 of 11 (cleanest house; 8 PV panels, collector without a tank)
//   base-dusk  ← DUSK with base 9 as input_image_0, then registered onto the day render
//   parts      ← pv 2, inverter 1, battery 2, heatpump 1, swh 3, ev 2, meter 2, insulation 1, window 2
//   Tried and dropped: FLUX.2 edits of a chosen base to add a tank / battery / panels (they moved or
//   replaced other equipment), and an earlier wording of BASE (more panels, messier roofs).
//
// Rerun:  node tools/art/house-prompts.mjs <raw dir> [--only base,part-pv,…] [--n 2] [--ref base.jpg]
// Needs a live `npx wrangler login` (`npx wrangler whoami` renews an expired token). From Luca's
// machine api.cloudflare.com only answers on some IPv4 addresses: set CF_API_IP (104.19.193.176
// worked on 2026-10-27). Saves <raw dir>/<id>-<n>.jpg and skips files already there. Every run
// gives new images (no seed is fixed); the cut-outs (background removed, WebP with alpha) are made
// afterwards with sharp.

export const MODEL = '@cf/black-forest-labs/flux-2-klein-4b';

/** Shared camera, light and background — every image uses it so the parts sit with the house. */
export const STYLE = [
  'Photorealistic 3D architectural product render.',
  'Isometric three-quarter view from the front-right, camera elevated about 30 degrees, looking slightly down.',
  'Soft diffuse daylight from the upper left, gentle soft shadows, clean studio look, crisp realistic materials.',
  'Plain uniform very light grey background (#f2f2f2) filling the whole frame, seamless, no horizon, no ground texture,',
  'only a soft contact shadow directly under the object.',
  'No text, no letters, no numbers, no labels, no logos, no brand names, no watermark, no people.',
].join(' ');

export const BASE = {
  id: 'base',
  width: 2048,
  height: 1536,
  prompt: [
    'A modern two-storey Albanian family house shown as a single isolated architectural model, the entire house in frame and centred, with a wide empty margin of background on every side.',
    'Smooth white render walls, a pitched terracotta clay tile roof with its large slope facing the viewer.',
    'On the left part of that roof slope: a rooftop solar photovoltaic array of 12 dark blue-black monocrystalline panels forming one neat rectangular block of two rows of six on aluminium rails, no panel offset.',
    'On the right part of the same roof slope, separate from the photovoltaic array: a thermosiphon solar water heater, one flat glazed solar thermal collector panel in a silver frame tilted on a small metal stand, with a horizontal white cylindrical hot-water tank fixed along its upper edge.',
    'Ground floor: a grey sectional garage door on the front with a short light concrete driveway in front of it, and a compact wall-mounted electric car charger with a coiled black cable on the wall beside the garage door.',
    'On the right side wall: a white wall-mounted solar inverter, a tall white home battery cabinet next to it, a small grey electricity meter box, and a grey heat-pump outdoor unit with a round fan grille standing on the ground at the foot of the wall.',
    'Large energy-efficient double-glazed windows with slim anthracite frames, a small balcony with a glass railing on the upper floor.',
    'All equipment has plain unbranded surfaces. No garden, no trees, no fence, no cars.',
    STYLE,
  ].join(' '),
};

/** Same house at dusk; sent with the chosen day render as input_image_0 (FLUX.2 keeps the framing). */
export const DUSK = {
  id: 'base-dusk',
  width: 2048,
  height: 1536,
  reference: true,
  prompt: [
    'The exact same house as in the reference image, same camera angle, same framing, same roof, same solar panels and equipment, same plain background.',
    'Change only the time of day to blue-hour dusk: every window glows with warm yellow interior light, a soft warm light by the front door and garage,',
    'the walls and roof in cool soft evening light, the background a plain uniform muted grey-blue, a soft contact shadow under the house.',
    'Photorealistic 3D architectural render. No text, no letters, no logos, no watermark, no people.',
  ].join(' '),
};

const part = (id, subject) => ({
  id: `part-${id}`,
  width: 1024,
  height: 1024,
  prompt: [
    `A single isolated ${subject}, the only object in the image, centred, fully visible with a wide empty margin of background on every side.`,
    STYLE,
  ].join(' '),
});

export const PARTS = [
  part('pv', 'block of six dark blue-black monocrystalline solar photovoltaic panels in a 3 by 2 grid, lying at a gentle roof pitch on two long silver aluminium rails that are visible under the panels, small mounting clamps between the panels'),
  part('inverter', 'white wall-mounted residential solar inverter: a slim rectangular box with rounded edges, a small dark status display panel, cooling fins on the side and cable glands underneath, mounted on a short piece of white wall'),
  part('battery', 'residential home battery: three stacked white lithium iron phosphate battery modules forming a tall rectangular cabinet with a slim control unit on top, small status light strip, standing on the floor, completely plain surfaces with no lettering'),
  part('heatpump', 'air-to-water heat pump outdoor unit: a light grey metal cabinet with one large round black fan grille on the front, standing on two small feet, copper pipe connections on the side'),
  part('swh', 'flat-plate solar water heater: one flat-plate solar thermal collector in a silver aluminium frame tilted on a metal stand, under its glass a dark blue-black absorber plate with eight thin perfectly straight, evenly spaced, parallel copper riser tubes running from the bottom header to the top header (not photovoltaic cells), with a horizontal white cylindrical insulated hot-water tank mounted along its top edge, short pipes connecting them'),
  part('ev', 'wall-mounted home electric vehicle charger: a compact white and dark grey wallbox with a small status light ring, mounted on a short piece of white wall, a thick black charging cable coiled neatly around a holder, ending in a round Type 2 electric car charging connector resting in its holster'),
  part('meter', 'residential smart electricity meter and consumer unit: a closed light grey wall cabinet with a small clear window in its door, behind the window a small white digital electricity meter with a blank display and a row of white circuit breakers, mounted on a short piece of white wall, plain surfaces with no lettering'),
  part('insulation', 'neat stack of building facade insulation boards: rigid pale yellow-green stone wool boards and white expanded polystyrene EPS boards stacked in layers on a small wooden pallet, cut edges showing the fibrous texture'),
  part('window', 'energy-efficient PVC window section: one complete rectangular tilt-and-turn window with an anthracite grey frame and sash and a slim handle, triple-glazed glass, standing upright, seen at a three-quarter angle so the depth of the thick multi-chamber frame is visible'),
];

export function briefs() {
  return [BASE, DUSK, ...PARTS];
}

// ---- runner ------------------------------------------------------------------------------
import { pathToFileURL } from 'node:url';

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const https = await import('node:https');
  const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
  const dir = process.argv[2];
  if (!dir || dir.startsWith('--')) {
    console.log('usage: node tools/art/house-prompts.mjs <raw dir> [--only base,part-pv] [--n 2] [--ref base.jpg]');
    process.exit(1);
  }
  const only = arg('--only')?.split(',');
  const n = Number(arg('--n') || 2);
  const ref = arg('--ref');
  const ip = process.env.CF_API_IP || '104.19.193.176';
  const lookup = (host, options, cb) => (options.all ? cb(null, [{ address: ip, family: 4 }]) : cb(null, ip, 4));
  const toml = fs.readFileSync(path.join(os.homedir(), '.wrangler', 'config', 'default.toml'), 'utf8');
  const token = toml.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
  const expires = toml.match(/^expiration_time\s*=\s*"([^"]+)"/m)?.[1];
  if (!token || (expires && Date.parse(expires) < Date.now() + 60_000)) throw new Error('wrangler login missing or expired: run `npx wrangler whoami`');
  const api = (method, url, body, type) => new Promise((resolve, reject) => {
    const req = https.request(url, { method, lookup, timeout: 180_000, headers: { authorization: `Bearer ${token}`, ...(type ? { 'content-type': type } : {}) } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        let json;
        try { json = JSON.parse(Buffer.concat(chunks).toString()); } catch { return reject(new Error(`HTTP ${res.statusCode}`)); }
        if (res.statusCode !== 200 || json.success === false) reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(json.errors ?? json).slice(0, 300)}`));
        else resolve(json.result);
      });
    });
    req.on('timeout', () => req.destroy(new Error('timed out')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
  // FLUX.2 on Workers AI takes multipart form data; reference images go in input_image_0…3
  const form = (fields) => {
    const b = '----house' + Math.random().toString(16).slice(2);
    const parts = Object.entries(fields).flatMap(([k, v]) => {
      if (!Buffer.isBuffer(v)) return [Buffer.from(`--${b}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`)];
      const png = v[0] === 0x89 && v[1] === 0x50;
      return [Buffer.from(`--${b}\r\nContent-Disposition: form-data; name="${k}"; filename="${k}.${png ? 'png' : 'jpg'}"\r\nContent-Type: image/${png ? 'png' : 'jpeg'}\r\n\r\n`), v, Buffer.from('\r\n')];
    });
    return { body: Buffer.concat([...parts, Buffer.from(`--${b}--\r\n`)]), type: `multipart/form-data; boundary=${b}` };
  };
  const [account] = await api('GET', 'https://api.cloudflare.com/client/v4/accounts');
  fs.mkdirSync(dir, { recursive: true });
  for (const brief of briefs()) {
    if (only ? !only.includes(brief.id) : brief.reference) continue;
    for (let i = 1; i <= n; i++) {
      if (['.jpg', '.png'].some((ext) => fs.existsSync(path.join(dir, `${brief.id}-${i}${ext}`)))) continue;
      const fields = { prompt: brief.prompt, width: String(brief.width), height: String(brief.height) };
      if (brief.reference) {
        if (!ref) throw new Error(`${brief.id} needs --ref <day render>`);
        fields.input_image_0 = fs.readFileSync(ref);
      }
      const { body, type } = form(fields);
      const { image } = await api('POST', `https://api.cloudflare.com/client/v4/accounts/${account.id}/ai/run/${MODEL}`, body, type);
      const bytes = Buffer.from(image, 'base64');
      const file = path.join(dir, `${brief.id}-${i}${bytes[0] === 0x89 ? '.png' : '.jpg'}`);
      fs.writeFileSync(file, bytes);
      console.log(file);
    }
  }
}
