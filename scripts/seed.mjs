// Seeds the local database from the research files.
//   npm run seed            categories, spec templates, cities (PVGIS), real products from research/*.json
//   npm run seed -- --demo  also invented demo sellers, offers, price history, a few orders and quote threads
// Real data: product models, specs, dimensions, datasheet links, PVGIS yields.
// Invented data (only with --demo, every row is_demo = 1): sellers, their prices, stock, orders.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { open, ROOT } from './lib/db.mjs';
import { CATEGORIES } from './catalog/categories.mjs';
import { DEMO_SELLERS } from './catalog/demo-sellers.mjs';
import { CITY_ZONES } from './catalog/cities.mjs';

const DEMO = process.argv.includes('--demo');
const db = open();
const q = (sql) => db.prepare(sql);
const json = (p) => JSON.parse(readFileSync(resolve(ROOT, p), 'utf8'));

// Deterministic pseudo-random numbers so a reseed gives the same demo shop.
let seed = 20261023;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pickN = (arr, n) => [...arr].sort(() => rnd() - 0.5).slice(0, n);

db.exec('BEGIN');
try {
  // ---------- settings ----------
  const settings = json('scripts/catalog/settings.json');
  for (const [k, v] of Object.entries(settings)) {
    q('INSERT INTO settings (key, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json').run(k, JSON.stringify(v));
  }

  // ---------- cities with PVGIS yields ----------
  const pv = existsSync(resolve(ROOT, 'research/pvgis-albania.json')) ? json('research/pvgis-albania.json') : { cities: [] };
  CITY_ZONES.forEach((c, i) => {
    const y = pv.cities.find((x) => x.slug === c.slug || x.name_sq === c.name_sq);
    q(`INSERT INTO cities (slug, name_sq, name_en, lat, lon, zone, pv_yield, pv_monthly_json, pv_slope, pv_azimuth, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET name_sq = excluded.name_sq, name_en = excluded.name_en, lat = excluded.lat, lon = excluded.lon,
         zone = excluded.zone, pv_yield = excluded.pv_yield, pv_monthly_json = excluded.pv_monthly_json, pv_slope = excluded.pv_slope,
         pv_azimuth = excluded.pv_azimuth, sort = excluded.sort`).run(
      c.slug, c.name_sq, c.name_en, y?.lat ?? c.lat ?? null, y?.lon ?? c.lon ?? null, c.zone,
      y?.yield_kwh_per_kwp_year ?? null, y ? JSON.stringify(y.monthly_kwh_per_kwp) : null,
      y?.optimal_slope_deg ?? null, y?.optimal_azimuth_deg ?? null, i,
    );
  });

  // ---------- categories and spec templates ----------
  const catId = new Map();
  CATEGORIES.forEach((c, i) => {
    q(`INSERT INTO categories (slug_sq, slug_en, name_sq, name_en, group_key, intro_sq, intro_en, unit_basis, unit_label_sq, unit_label_en, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug_en) DO UPDATE SET slug_sq = excluded.slug_sq, name_sq = excluded.name_sq, name_en = excluded.name_en,
         group_key = excluded.group_key, intro_sq = excluded.intro_sq, intro_en = excluded.intro_en, unit_basis = excluded.unit_basis,
         unit_label_sq = excluded.unit_label_sq, unit_label_en = excluded.unit_label_en, sort = excluded.sort`).run(
      c.slug_sq, c.slug_en, c.name_sq, c.name_en, c.group_key, c.intro_sq, c.intro_en, c.unit_basis ?? null,
      c.unit_label_sq ?? null, c.unit_label_en ?? null, i,
    );
    const id = q('SELECT id FROM categories WHERE slug_en = ?').get(c.slug_en).id;
    catId.set(c.research, id);
    c.attrs.forEach((a, j) => {
      q(`INSERT INTO spec_attributes (category_id, key, label_sq, label_en, unit, type, options_json, filterable, comparable, highlight, required, better, decimals, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(category_id, key) DO UPDATE SET label_sq = excluded.label_sq, label_en = excluded.label_en, unit = excluded.unit,
           type = excluded.type, options_json = excluded.options_json, filterable = excluded.filterable, comparable = excluded.comparable,
           highlight = excluded.highlight, required = excluded.required, better = excluded.better, decimals = excluded.decimals, sort = excluded.sort`).run(
        id, a.key, a.label_sq, a.label_en, a.unit, a.type, JSON.stringify(a.options), +a.filterable, +a.comparable, +a.highlight, +a.required,
        a.better, a.decimals, j,
      );
    });
  });

  // ---------- real products from research ----------
  const files = ['research/products-pv.json', 'research/products-building.json'].filter((f) => existsSync(resolve(ROOT, f)));
  const products = files.flatMap((f) => json(f));
  let added = 0;
  const unknownKeys = new Map();
  for (const p of products) {
    const cid = catId.get(p.category);
    if (!cid) {
      console.warn('No category for', p.slug, p.category);
      continue;
    }
    const d = p.dimensions_mm ?? {};
    q(`INSERT INTO products (slug, category_id, brand, model, name_sq, name_en, summary_sq, summary_en, width_mm, height_mm, depth_mm,
                             weight_kg, warranty_years, datasheet_url, sources_json, reference_price_eur, reference_price_source, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 0)
       ON CONFLICT(slug) DO UPDATE SET category_id = excluded.category_id, brand = excluded.brand, model = excluded.model,
         name_sq = excluded.name_sq, name_en = excluded.name_en, summary_sq = excluded.summary_sq, summary_en = excluded.summary_en,
         width_mm = excluded.width_mm, height_mm = excluded.height_mm, depth_mm = excluded.depth_mm, weight_kg = excluded.weight_kg,
         warranty_years = excluded.warranty_years, datasheet_url = excluded.datasheet_url, sources_json = excluded.sources_json,
         reference_price_eur = excluded.reference_price_eur, reference_price_source = excluded.reference_price_source,
         updated_at = datetime('now')`).run(
      p.slug, cid, p.brand, p.model, p.name_sq, p.name_en, p.summary_sq ?? '', p.summary_en ?? '',
      d.w ?? null, d.h ?? null, d.d ?? null, p.weight_kg ?? null, p.warranty_years ?? null, p.datasheet_url ?? null,
      JSON.stringify(p.sources ?? []), p.reference_price_eur ?? null,
      p.price_source ? `${p.price_source}${p.price_note ? ' — ' + p.price_note : ''}` : null,
    );
    const pid = q('SELECT id FROM products WHERE slug = ?').get(p.slug).id;
    const attrs = q('SELECT id, key, type FROM spec_attributes WHERE category_id = ?').all(cid);
    for (const [key, raw] of Object.entries(p.specs ?? {})) {
      const at = attrs.find((x) => x.key === key);
      if (!at) {
        unknownKeys.set(`${p.category}.${key}`, raw);
        continue;
      }
      if (raw === null || raw === undefined || raw === '') continue;
      let vn = null;
      let vt = null;
      if (at.type === 'number') {
        const n = typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.').replace(/[^0-9.\-]/g, ''));
        if (Number.isFinite(n)) vn = n;
        else vt = String(raw);
      } else if (at.type === 'bool') vn = raw === true || raw === 'true' || raw === 1 ? 1 : 0;
      else vt = Array.isArray(raw) ? raw.join(', ') : String(raw);
      q(`INSERT INTO product_specs (product_id, attribute_id, value_num, value_text) VALUES (?, ?, ?, ?)
         ON CONFLICT(product_id, attribute_id) DO UPDATE SET value_num = excluded.value_num, value_text = excluded.value_text`).run(pid, at.id, vn, vt);
    }
    added++;
  }
  if (unknownKeys.size) console.warn('Spec keys with no template attribute (skipped):', [...unknownKeys.keys()].join(', '));
  console.log(`Products: ${added} from ${files.join(', ') || 'no research files yet'}`);

  if (DEMO) seedDemo();
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  throw e;
}

function seedDemo() {
  const fx = json('scripts/catalog/settings.json').currency?.eurAll ?? 100;
  const cityId = (slug) => q('SELECT id FROM cities WHERE slug = ?').get(slug)?.id ?? null;
  for (const s of DEMO_SELLERS) {
    q(`INSERT INTO sellers (slug, name, legal_name, nipt, kind, city_id, address, phone, email, website, about_sq, about_en, verified, plan,
                            commission_pct, rating, rating_count, delivery_zones, status, is_demo)
       VALUES (?, ?, ?, NULL, ?, ?, NULL, NULL, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1)
       ON CONFLICT(slug) DO UPDATE SET name = excluded.name, kind = excluded.kind, city_id = excluded.city_id, about_sq = excluded.about_sq,
         about_en = excluded.about_en, verified = excluded.verified, plan = excluded.plan, commission_pct = excluded.commission_pct,
         rating = excluded.rating, rating_count = excluded.rating_count, delivery_zones = excluded.delivery_zones`).run(
      s.slug, s.name, s.name, s.kind, cityId(s.city), s.about_sq, s.about_en, s.verified ? 1 : 0, s.plan, s.commission_pct,
      s.rating, s.rating_count, s.zones,
    );
  }
  const sellers = q('SELECT * FROM sellers WHERE is_demo = 1').all();
  const prods = q('SELECT p.*, c.slug_en AS cat, c.unit_basis FROM products p JOIN categories c ON c.id = p.category_id').all();

  // Category medians of price per unit basis, for products whose research found no public price.
  const unitVal = (p) => {
    if (!p.unit_basis) return null;
    const r = q(`SELECT ps.value_num FROM product_specs ps JOIN spec_attributes a ON a.id = ps.attribute_id WHERE ps.product_id = ? AND a.key = ?`).get(p.id, p.unit_basis);
    return r?.value_num ?? null;
  };
  // Net (VAT-free) euro price from the research note: Alma Solar quotes Luxembourg VAT (17%).
  const netEur = (p) => {
    if (!p.reference_price_eur) return null;
    const note = (p.reference_price_source ?? '').toLowerCase();
    if (note.includes('luxembourg')) return p.reference_price_eur / 1.17;
    if (note.includes('incl')) return p.reference_price_eur / 1.2;
    return p.reference_price_eur;
  };
  const perUnit = new Map();
  for (const p of prods) {
    const u = unitVal(p);
    const n = netEur(p);
    if (n && u) perUnit.set(p.cat, [...(perUnit.get(p.cat) ?? []), n / u]);
  }
  const median = (xs) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : null);
  // Module prices: sun.store pv.index, September 2026 (B2B, €/Wp): TOPCon bifacial 0.114, TOPCon 0.12, back contact 0.128, full black 0.129.
  const specOf = (p, key) => q(`SELECT ps.value_num, ps.value_text FROM product_specs ps JOIN spec_attributes a ON a.id = ps.attribute_id WHERE ps.product_id = ? AND a.key = ?`).get(p.id, key);
  const moduleEurPerWp = (p) => {
    const tech = String(specOf(p, 'cell_type')?.value_text ?? '').toLowerCase();
    const bif = specOf(p, 'bifacial')?.value_num === 1;
    if (tech.includes('back contact') || tech.includes('abc') || tech.includes('hjt') || tech.includes('heterojunction')) return 0.128;
    if (/black/.test(p.model.toLowerCase() + p.slug)) return 0.129;
    if (tech.includes('topcon') && bif) return 0.114;
    return 0.12;
  };

  let offers = 0;
  for (const p of prods) {
    // Demo shelf price in lekë incl. 20% VAT. Retail references get +8% (import, transport, margin);
    // B2B index prices get +35% to reach a retail shelf. Both are demo assumptions (NEEDS_VERIFICATION.md).
    let net = netEur(p);
    let margin = 1.08;
    if (!net && p.cat === 'solar-panels') {
      const wp = unitVal(p);
      if (wp) {
        net = moduleEurPerWp(p) * wp;
        margin = 1.35;
      }
    }
    if (!net) {
      const m = median(perUnit.get(p.cat) ?? []);
      const u = unitVal(p);
      if (m && u) net = m * u;
    }
    if (!net) continue; // no honest basis: the product shows "request a quote"
    const baseAll = net * fx * 1.2 * margin;
    const fit = sellers.filter((s) => s.kind !== 'contractor' || ['cement-and-masonry', 'insulation'].includes(p.cat));
    const n = 2 + Math.floor(rnd() * 3);
    for (const s of pickN(fit, n)) {
      const factor = 0.94 + rnd() * 0.16;
      const price = roundPrice(baseAll * factor);
      const discounted = rnd() < 0.18;
      const stock = rnd() < 0.12 ? 0 : Math.floor(5 + rnd() * (p.cat === 'solar-panels' || p.cat === 'cement-and-masonry' ? 400 : 40));
      const heavy = ['solar-panels', 'cement-and-masonry', 'insulation', 'batteries', 'heat-pumps', 'solar-water-heaters', 'windows'].includes(p.cat);
      const r = q(`INSERT INTO offers (product_id, seller_id, price_all, compare_at_all, stock_qty, lead_days, min_qty, delivery_fee_all, free_delivery_over_all,
                                       installation_available, promoted, active, is_demo, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now', ?))
                   ON CONFLICT(product_id, seller_id) DO UPDATE SET price_all = excluded.price_all, compare_at_all = excluded.compare_at_all,
                     stock_qty = excluded.stock_qty, lead_days = excluded.lead_days, delivery_fee_all = excluded.delivery_fee_all,
                     free_delivery_over_all = excluded.free_delivery_over_all, installation_available = excluded.installation_available,
                     promoted = excluded.promoted`).run(
        p.id, s.id, price, discounted ? roundPrice(price * (1.08 + rnd() * 0.1)) : null, stock,
        1 + Math.floor(rnd() * (heavy ? 6 : 3)), p.cat === 'cement-and-masonry' ? 10 : 1,
        heavy ? 1500 + Math.floor(rnd() * 4) * 500 : 400 + Math.floor(rnd() * 3) * 100,
        heavy ? null : 20000 + Math.floor(rnd() * 3) * 10000,
        s.kind === 'installer' && ['solar-panels', 'inverters', 'batteries', 'heat-pumps', 'air-conditioners', 'solar-water-heaters', 'ev-chargers'].includes(p.cat) ? 1 : 0,
        s.plan === 'partner' && rnd() < 0.25 ? 1 : 0,
        `-${Math.floor(rnd() * 20)} days`,
      );
      const offerId = r.lastInsertRowid ? Number(r.lastInsertRowid) : q('SELECT id FROM offers WHERE product_id = ? AND seller_id = ?').get(p.id, s.id).id;
      if (['solar-panels', 'cement-and-masonry', 'insulation', 'pv-accessories'].includes(p.cat)) {
        q('DELETE FROM offer_tiers WHERE offer_id = ?').run(offerId);
        q('INSERT INTO offer_tiers (offer_id, min_qty, price_all) VALUES (?, ?, ?)').run(offerId, p.cat === 'solar-panels' ? 10 : 50, roundPrice(price * 0.96));
        q('INSERT INTO offer_tiers (offer_id, min_qty, price_all) VALUES (?, ?, ?)').run(offerId, p.cat === 'solar-panels' ? 30 : 200, roundPrice(price * 0.92));
      }
      // 120 days of price history, a gentle drift down with a few steps.
      q('DELETE FROM price_history WHERE offer_id = ?').run(offerId);
      let hp = price * (1.04 + rnd() * 0.08);
      for (let day = 120; day >= 0; day -= 6 + Math.floor(rnd() * 8)) {
        hp = day === 0 ? price : hp * (0.985 + rnd() * 0.02);
        q(`INSERT INTO price_history (offer_id, price_all, recorded_at) VALUES (?, ?, datetime('now', ?))`).run(offerId, roundPrice(day === 0 ? price : hp), `-${day} days`);
      }
      offers++;
    }
  }
  q(`UPDATE products SET featured = 1 WHERE slug IN (SELECT slug FROM products ORDER BY id LIMIT 0)`).run();
  console.log(`Demo: ${sellers.length} sellers, ${offers} offers`);
}

function roundPrice(x) {
  if (x < 1000) return Math.round(x / 10) * 10;
  if (x < 20000) return Math.round(x / 50) * 50;
  if (x < 200000) return Math.round(x / 100) * 100;
  return Math.round(x / 500) * 500;
}

export const _token = () => randomBytes(12).toString('base64url');
