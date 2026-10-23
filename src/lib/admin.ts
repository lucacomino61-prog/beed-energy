// Write side of the marketplace for the admin panel. Every change is scoped by the signed-in user:
// a seller account can only touch its own offers, orders and quote threads.
import { all, audit, auditStmt, batch, get, run, setting, stmt, type Stmt } from './db';
import type { User } from './auth';
import type { Attr } from './catalog';

export class Forbidden extends Error {}

export const isAdmin = (u: User) => u.role === 'admin';
export function requireAdmin(u: User) {
  if (!isAdmin(u)) throw new Forbidden('admin only');
}

export async function slugify(s: string): Promise<string> {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ---------- dashboard ----------

export async function dashboard(u: User) {
  const admin = isAdmin(u);
  const sellerFilter = admin ? '' : 'AND oi.seller_id = ?';
  const sp = admin ? [] : [u.seller_id!];
  const n = async (sql: string, ...args: (string | number)[]) => (await get<{ n: number }>(sql, ...args))?.n ?? 0;
  const period = async (days: number) =>
    (await get<{ orders: number; revenue: number; commission: number }>(
      `SELECT COUNT(DISTINCT o.id) AS orders, COALESCE(SUM(oi.line_total_all), 0) AS revenue, COALESCE(SUM(oi.commission_all), 0) AS commission
         FROM orders o JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', ?) ${sellerFilter}`,
      `-${days} days`,
      ...sp,
    ))!;

  // Every query is its own round trip to D1, so they all go at once rather than one after another.
  const [week, month, byDay, open, lowStock, topProducts, byStatus, byCategory, photos, counts] = await Promise.all([
    period(7),
    period(30),
    all<{ day: string; revenue: number; orders: number }>(
      `SELECT date(o.created_at) AS day, COALESCE(SUM(oi.line_total_all), 0) AS revenue, COUNT(DISTINCT o.id) AS orders
         FROM orders o JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', '-30 days') ${sellerFilter}
        GROUP BY day ORDER BY day`,
      ...sp,
    ),
    n(`SELECT COUNT(DISTINCT o.id) AS n FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE o.status IN ('new', 'confirmed', 'processing') ${sellerFilter}`, ...sp),
    all<any>(
      `SELECT o.id, o.stock_qty, p.slug, p.brand, p.model, s.name AS seller FROM offers o JOIN products p ON p.id = o.product_id JOIN sellers s ON s.id = o.seller_id
        WHERE o.active = 1 AND o.stock_qty <= 3 ${admin ? '' : 'AND o.seller_id = ?'} ORDER BY o.stock_qty LIMIT 8`,
      ...sp,
    ),
    all<any>(
      `SELECT oi.product_id, oi.product_name, SUM(oi.qty) AS qty, SUM(oi.line_total_all) AS revenue
         FROM order_items oi JOIN orders o ON o.id = oi.order_id
        WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', '-90 days') ${sellerFilter}
        GROUP BY oi.product_id ORDER BY revenue DESC LIMIT 6`,
      ...sp,
    ),
    // Orders of the last 90 days by where they stand now; cancelled ones included, they are part of the picture.
    all<{ status: string; n: number }>(
      `SELECT o.status, COUNT(DISTINCT o.id) AS n FROM orders o JOIN order_items oi ON oi.order_id = o.id
        WHERE o.created_at >= datetime('now', '-90 days') ${sellerFilter} GROUP BY o.status`,
      ...sp,
    ),
    all<{ id: number; name_sq: string; name_en: string; revenue: number; qty: number }>(
      `SELECT c.id, c.name_sq, c.name_en, SUM(oi.line_total_all) AS revenue, SUM(oi.qty) AS qty
         FROM order_items oi JOIN orders o ON o.id = oi.order_id JOIN products p ON p.id = oi.product_id JOIN categories c ON c.id = p.category_id
        WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', '-30 days') ${sellerFilter}
        GROUP BY c.id ORDER BY revenue DESC LIMIT 8`,
      ...sp,
    ),
    // The catalogue is BeeD's, so only staff see how much of it still has no photo.
    admin
      ? get<{ total: number; with_photo: number }>(
          `SELECT COUNT(*) AS total, COALESCE(SUM(EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id)), 0) AS with_photo
             FROM products p WHERE p.status = 'published'`,
        )
      : Promise.resolve(null),
    admin
      ? Promise.all([
          n("SELECT COUNT(*) AS n FROM seller_applications WHERE status = 'new'"),
          n("SELECT COUNT(*) AS n FROM quote_requests WHERE status = 'open'"),
          n('SELECT COUNT(*) AS n FROM contact_messages WHERE handled = 0'),
          n("SELECT COUNT(*) AS n FROM products WHERE status = 'published'"),
          n("SELECT COUNT(*) AS n FROM sellers WHERE status = 'active'"),
          n('SELECT COUNT(*) AS n FROM offers WHERE active = 1'),
          n("SELECT COUNT(*) AS n FROM products p WHERE status = 'published' AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.product_id = p.id AND o.active = 1)"),
        ]).then(([applications, quotes, messages, products, sellers, offers, noOffer]) => ({ applications, quotes, messages, products, sellers, offers, noOffer }))
      : Promise.all([
          n("SELECT COUNT(*) AS n FROM quote_requests WHERE status = 'open'"),
          n('SELECT COUNT(*) AS n FROM offers WHERE active = 1 AND seller_id = ?', u.seller_id!),
        ]).then(([quotes, offers]) => ({ quotes, offers })),
  ]);
  return { week, month, byDay, open, lowStock, topProducts, byStatus, byCategory, photos, counts };
}

// ---------- categories and spec templates ----------

export async function saveCategory(u: User, id: number | null, v: { slug_sq: string; slug_en: string; name_sq: string; name_en: string; group_key: string; intro_sq: string; intro_en: string; unit_basis: string | null; unit_label_sq: string | null; unit_label_en: string | null; sort: number; active: boolean }) {
  requireAdmin(u);
  if (id) {
    await run(
      `UPDATE categories SET slug_sq = ?, slug_en = ?, name_sq = ?, name_en = ?, group_key = ?, intro_sq = ?, intro_en = ?, unit_basis = ?, unit_label_sq = ?, unit_label_en = ?, sort = ?, active = ? WHERE id = ?`,
      v.slug_sq, v.slug_en, v.name_sq, v.name_en, v.group_key, v.intro_sq, v.intro_en, v.unit_basis, v.unit_label_sq, v.unit_label_en, v.sort, v.active ? 1 : 0, id,
    );
    await audit(u.id, 'category.update', 'category', id);
    return id;
  }
  const r = await run(
    `INSERT INTO await categories (slug_sq, slug_en, name_sq, name_en, group_key, intro_sq, intro_en, unit_basis, unit_label_sq, unit_label_en, sort, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    v.slug_sq, v.slug_en, v.name_sq, v.name_en, v.group_key, v.intro_sq, v.intro_en, v.unit_basis, v.unit_label_sq, v.unit_label_en, v.sort, v.active ? 1 : 0,
  );
  await audit(u.id, 'category.create', 'category', r.id);
  return r.id;
}

export type AttrInput = Omit<Attr, 'id' | 'category_id'> & { id?: number | null };

type SpecType = 'number' | 'text' | 'enum' | 'bool';

/**
 * Moves an attribute's stored values to its new type: numbers live in value_num, text and enum values in
 * value_text, booleans as value_num 0/1. A value that cannot be read in the new type is deleted and
 * counted, so the admin sees how many products need a look.
 */
/**
 * Works out how each stored value has to change when an attribute's type changes, and returns the
 * writes rather than performing them: saveTemplate puts them in the same batch as the template
 * itself, so a template change and its value conversions land together or not at all.
 */
async function convertSpecValues(attributeId: number, from: SpecType, to: SpecType): Promise<{ converted: number; dropped: number; writes: Stmt[] }> {
  const isNum = (t: SpecType) => t === 'number' || t === 'bool';
  const writes: Stmt[] = [];
  if (from === to || (!isNum(from) && !isNum(to))) return { converted: 0, dropped: 0, writes }; // text ↔ enum: same column
  let converted = 0;
  let dropped = 0;
  const rows = await all<{ product_id: number; value_num: number | null; value_text: string | null }>('SELECT product_id, value_num, value_text FROM product_specs WHERE attribute_id = ?', attributeId);
  for (const r of rows) {
    let num: number | null = null;
    let text: string | null = null;
    if (!isNum(to)) {
      // number/bool → text: write the number as text (21.5, not 21.500000)
      if (r.value_num !== null) text = String(r.value_num);
      else text = r.value_text;
    } else if (to === 'number') {
      if (from === 'bool' || r.value_num !== null) num = r.value_num;
      else {
        const n = Number(String(r.value_text ?? '').replace(/\s/g, '').replace(',', '.'));
        num = r.value_text && Number.isFinite(n) ? n : null;
      }
    } else {
      // → bool: numbers by zero / non-zero, words by yes / no in both languages
      if (r.value_num !== null) num = r.value_num !== 0 ? 1 : 0;
      else if (/^(1|true|yes|po|on)$/i.test(String(r.value_text ?? '').trim())) num = 1;
      else if (/^(0|false|no|jo|off)$/i.test(String(r.value_text ?? '').trim())) num = 0;
    }
    if (num === null && (text === null || text === '')) {
      writes.push(stmt('DELETE FROM product_specs WHERE product_id = ? AND attribute_id = ?', r.product_id, attributeId));
      dropped++;
    } else {
      writes.push(stmt('UPDATE product_specs SET value_num = ?, value_text = ? WHERE product_id = ? AND attribute_id = ?', num, text, r.product_id, attributeId));
      converted++;
    }
  }
  return { converted, dropped, writes };
}

/**
 * Replaces a category's spec template: updates kept attributes, adds new ones, deletes removed ones (and
 * their values). An attribute whose type changes keeps its values, converted (see convertSpecValues).
 */
export async function saveTemplate(u: User, categoryId: number, attrs: AttrInput[]): Promise<{ converted: number; dropped: number }> {
  requireAdmin(u);
  const keys = attrs.map((a) => a.key);
  if (new Set(keys).size !== keys.length) throw new Error('duplicate-key');
  const moved = { converted: 0, dropped: 0 };

  // Everything the template change needs to read happens first, then the whole edit goes down as one
  // batch. forEach with an async callback would not have waited for these in any case.
  const existing = await all<{ id: number; key: string; type: SpecType }>('SELECT id, key, type FROM spec_attributes WHERE category_id = ?', categoryId);
  const writes: Stmt[] = [];
  for (const e of existing) if (!attrs.some((a) => a.id === e.id)) writes.push(stmt('DELETE FROM spec_attributes WHERE id = ?', e.id));

  for (const [i, a] of attrs.entries()) {
    const vals = [a.key, a.label_sq, a.label_en, a.unit, a.type, JSON.stringify(a.options ?? []), +a.filterable, +a.comparable, +a.highlight, +a.required, a.better, a.decimals, i] as const;
    const prev = a.id ? existing.find((e) => e.id === a.id) : undefined;
    if (prev && prev.type !== a.type) {
      const r = await convertSpecValues(prev.id, prev.type, a.type as SpecType);
      moved.converted += r.converted;
      moved.dropped += r.dropped;
      writes.push(...r.writes);
    }
    if (a.id && existing.some((e) => e.id === a.id)) {
      writes.push(
        stmt(
          `UPDATE spec_attributes SET key = ?, label_sq = ?, label_en = ?, unit = ?, type = ?, options_json = ?, filterable = ?, comparable = ?, highlight = ?, required = ?, better = ?, decimals = ?, sort = ? WHERE id = ?`,
          ...vals,
          a.id,
        ),
      );
    } else {
      writes.push(
        stmt(
          `INSERT INTO spec_attributes (key, label_sq, label_en, unit, type, options_json, filterable, comparable, highlight, required, better, decimals, sort, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ...vals,
          categoryId,
        ),
      );
    }
  }
  writes.push(auditStmt(u.id, 'template.save', 'category', categoryId, `${attrs.length} attributes${moved.converted || moved.dropped ? `, ${moved.converted} converted, ${moved.dropped} dropped` : ''}`));
  await batch(writes);
  return moved;
}

// ---------- products ----------

export type ProductInput = {
  slug: string;
  category_id: number;
  brand: string;
  model: string;
  name_sq: string;
  name_en: string;
  summary_sq: string;
  summary_en: string;
  body_sq: string;
  body_en: string;
  width_mm: number | null;
  height_mm: number | null;
  depth_mm: number | null;
  weight_kg: number | null;
  warranty_years: number | null;
  datasheet_url: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  specs: Record<string, string>; // raw form values keyed by attribute key
};

export type FieldErrors = Record<string, string>;

/** Validates spec values against the category template; returns parsed values or errors keyed spec.<key>. */
export async function parseSpecs(categoryId: number, raw: Record<string, string>, lang: 'sq' | 'en') {
  const attrs = await all<any>('SELECT * FROM spec_attributes WHERE category_id = ? ORDER BY sort', categoryId);
  const errors: FieldErrors = {};
  const values: { attribute_id: number; value_num: number | null; value_text: string | null }[] = [];
  for (const a of attrs) {
    const v = (raw[a.key] ?? '').trim();
    if (!v) {
      if (a.required) errors[`spec.${a.key}`] = lang === 'sq' ? 'Kjo specifikim është i detyrueshëm.' : 'This spec is required.';
      continue;
    }
    if (a.type === 'number') {
      const n = Number(v.replace(/\s/g, '').replace(',', '.'));
      if (!Number.isFinite(n)) errors[`spec.${a.key}`] = lang === 'sq' ? 'Shkruani një numër, p.sh. 21,5.' : 'Enter a number, e.g. 21.5.';
      else values.push({ attribute_id: a.id, value_num: n, value_text: null });
    } else if (a.type === 'bool') {
      values.push({ attribute_id: a.id, value_num: v === '1' || v === 'true' || v === 'on' ? 1 : 0, value_text: null });
    } else if (a.type === 'enum') {
      const opts: { value: string }[] = JSON.parse(a.options_json || '[]');
      if (opts.length && !opts.some((o) => o.value === v)) errors[`spec.${a.key}`] = lang === 'sq' ? 'Zgjidhni një nga vlerat e listës.' : 'Choose one of the listed values.';
      else values.push({ attribute_id: a.id, value_num: null, value_text: v });
    } else values.push({ attribute_id: a.id, value_num: null, value_text: v.slice(0, 300) });
  }
  return { values, errors };
}

export async function saveProduct(u: User, id: number | null, p: ProductInput, lang: 'sq' | 'en'): Promise<{ id?: number; errors: FieldErrors }> {
  requireAdmin(u);
  const errors: FieldErrors = {};
  const m = lang === 'sq';
  if (!p.brand) errors.brand = m ? 'Shkruani markën.' : 'Enter the brand.';
  if (!p.model) errors.model = m ? 'Shkruani modelin.' : 'Enter the model.';
  if (!p.name_sq) errors.name_sq = m ? 'Shkruani emrin në shqip.' : 'Enter the Albanian name.';
  if (!p.name_en) errors.name_en = m ? 'Shkruani emrin në anglisht.' : 'Enter the English name.';
  p.slug = await slugify(p.slug || `${p.brand} ${p.model}`);
  if (!p.slug) errors.slug = m ? 'Adresa e faqes nuk mund të jetë bosh.' : 'The page address cannot be empty.';
  const clash = await get<{ id: number }>('SELECT id FROM products WHERE slug = ? AND id != ?', p.slug, id ?? 0);
  if (clash) errors.slug = m ? 'Ky adresë përdoret nga një produkt tjetër.' : 'Another product already uses this address.';
  if (!await get('SELECT id FROM categories WHERE id = ?', p.category_id)) errors.category_id = m ? 'Zgjidhni kategorinë.' : 'Choose a category.';
  if (p.datasheet_url && !/^https?:\/\//.test(p.datasheet_url)) errors.datasheet_url = m ? 'Lidhja duhet të fillojë me https://' : 'The link must start with https://';
  const specs = await parseSpecs(p.category_id, p.specs, lang);
  Object.assign(errors, specs.errors);
  if (Object.keys(errors).length) return { errors };

  const cols = [p.slug, p.category_id, p.brand, p.model, p.name_sq, p.name_en, p.summary_sq, p.summary_en, p.body_sq, p.body_en, p.width_mm, p.height_mm, p.depth_mm, p.weight_kg, p.warranty_years, p.datasheet_url, p.status, p.featured ? 1 : 0] as const;
  const writes: Stmt[] = [];
  // A new product has no id until its INSERT runs, and nothing in a batch can read one back, so the
  // specs point at the parent through its slug, which is UNIQUE. An existing product already has one.
  const parent = id ? '?' : '(SELECT id FROM products WHERE slug = ?)';
  const parentArg: string | number = id ?? p.slug;

  if (id) {
    writes.push(
      stmt(
        `UPDATE products SET slug = ?, category_id = ?, brand = ?, model = ?, name_sq = ?, name_en = ?, summary_sq = ?, summary_en = ?, body_sq = ?, body_en = ?,
                width_mm = ?, height_mm = ?, depth_mm = ?, weight_kg = ?, warranty_years = ?, datasheet_url = ?, status = ?, featured = ?, updated_at = datetime('now') WHERE id = ?`,
        ...cols,
        id,
      ),
    );
    writes.push(stmt('DELETE FROM product_specs WHERE product_id = ?', id));
  } else {
    writes.push(
      stmt(
        `INSERT INTO products (slug, category_id, brand, model, name_sq, name_en, summary_sq, summary_en, body_sq, body_en, width_mm, height_mm, depth_mm, weight_kg, warranty_years, datasheet_url, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ...cols,
      ),
    );
  }
  const insertIdx = id ? -1 : 0;
  for (const v of specs.values) {
    writes.push(stmt(`INSERT INTO product_specs (product_id, attribute_id, value_num, value_text) VALUES (${parent}, ?, ?, ?)`, parentArg, v.attribute_id, v.value_num, v.value_text));
  }
  const results = await batch(writes);
  const pid = id ?? results[insertIdx].id;
  await audit(u.id, id ? 'product.update' : 'product.create', 'product', pid);
  return { id: pid, errors };
}

// ---------- product photos ----------

export type PhotoResult = { added: number; rejected: { name: string; reason: 'type' | 'size' | 'empty' }[] };

/**
 * Stores the uploaded photos and appends them after the product's existing ones (the first photo is the
 * one shown on cards). A file that is not a JPEG, PNG or WebP, or is too large, is skipped and reported.
 */
export async function addProductImages(u: User, productId: number, files: File[]): Promise<PhotoResult> {
  requireAdmin(u);
  const p = await get<{ name_sq: string; name_en: string; brand: string; model: string }>('SELECT name_sq, name_en, brand, model FROM products WHERE id = ?', productId);
  if (!p) throw new Error('missing-product');
  const { putProductImage, MediaError } = await import('./media');
  const last = await get<{ s: number | null }>('SELECT MAX(sort) AS s FROM product_images WHERE product_id = ?', productId);
  let sort = (last?.s ?? -1) + 1;
  const writes: Stmt[] = [];
  const result: PhotoResult = { added: 0, rejected: [] };
  for (const f of files) {
    try {
      const img = await putProductImage(productId, f);
      // The same file twice is the same key; one row is enough.
      writes.push(
        stmt(
          `INSERT INTO product_images (product_id, path, width, height, alt_sq, alt_en, sort)
           SELECT ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = ? AND path = ?)`,
          productId, img.path, img.width, img.height, `${p.brand} ${p.model} · ${p.name_sq}`, `${p.brand} ${p.model} · ${p.name_en}`, sort++, productId, img.path,
        ),
      );
      result.added++;
    } catch (e) {
      if (e instanceof MediaError) result.rejected.push({ name: f.name, reason: e.code });
      else throw e;
    }
  }
  if (writes.length) {
    writes.push(auditStmt(u.id, 'product.photo-add', 'product', productId, `${result.added} photo(s)`));
    await batch(writes);
  }
  return result;
}

export async function removeProductImage(u: User, productId: number, imageId: number): Promise<boolean> {
  requireAdmin(u);
  const img = await get<{ path: string }>('SELECT path FROM product_images WHERE id = ? AND product_id = ?', imageId, productId);
  if (!img) return false;
  await batch([
    stmt('DELETE FROM product_images WHERE id = ?', imageId),
    auditStmt(u.id, 'product.photo-remove', 'product', productId, img.path),
  ]);
  // The row goes first: if deleting the file fails, the page no longer points at it either way.
  const { deleteMedia } = await import('./media');
  await deleteMedia(img.path).catch(() => {});
  return true;
}

/** Moves one photo to the front, which makes it the photo on cards and the first on the product page. */
export async function setMainProductImage(u: User, productId: number, imageId: number): Promise<boolean> {
  requireAdmin(u);
  const r = await batch([
    stmt('UPDATE product_images SET sort = sort + 1 WHERE product_id = ? AND EXISTS (SELECT 1 FROM product_images WHERE id = ? AND product_id = ?)', productId, imageId, productId),
    stmt('UPDATE product_images SET sort = 0 WHERE id = ? AND product_id = ?', imageId, productId),
    auditStmt(u.id, 'product.photo-main', 'product', productId, String(imageId)),
  ]);
  return r[1].changes === 1;
}

// ---------- offers ----------

export type OfferInput = {
  product_id: number;
  seller_id: number;
  price_all: number;
  compare_at_all: number | null;
  stock_qty: number;
  lead_days: number;
  min_qty: number;
  delivery_fee_all: number;
  free_delivery_over_all: number | null;
  installation_available: boolean;
  note_sq: string;
  note_en: string;
  promoted: boolean;
  active: boolean;
  tiers: { min_qty: number; price_all: number }[];
};

export async function saveOffer(u: User, id: number | null, o: OfferInput, lang: 'sq' | 'en'): Promise<{ id?: number; errors: FieldErrors }> {
  const m = lang === 'sq';
  if (id) {
    // An offer is one seller's price for one product: an edit changes the price, never the product
    // (the price history and order lines hang off this id).
    const cur = await get<{ product_id: number }>('SELECT product_id FROM offers WHERE id = ?', id);
    if (cur) o.product_id = cur.product_id;
  }
  if (!isAdmin(u)) {
    o.seller_id = u.seller_id!;
    o.promoted = id ? !!(await get<{ promoted: number }>('SELECT promoted FROM offers WHERE id = ?', id))?.promoted : false; // promotion is sold by the platform
    if (id && (await get<{ seller_id: number }>('SELECT seller_id FROM offers WHERE id = ?', id))?.seller_id !== u.seller_id) throw new Forbidden('offer');
  }
  const errors: FieldErrors = {};
  if (!(o.price_all > 0)) errors.price_all = m ? 'Çmimi duhet të jetë më i madh se 0.' : 'Price must be above 0.';
  if (o.compare_at_all !== null && o.compare_at_all <= o.price_all) errors.compare_at_all = m ? 'Çmimi i vjetër duhet të jetë më i lartë se çmimi i ri.' : 'The old price must be higher than the new one.';
  if (o.stock_qty < 0) errors.stock_qty = m ? 'Stoku nuk mund të jetë negativ.' : 'Stock cannot be negative.';
  if (o.min_qty < 1) errors.min_qty = m ? 'Sasia minimale është të paktën 1.' : 'Minimum quantity is at least 1.';
  for (const t of o.tiers) if (t.min_qty <= 1 || t.price_all <= 0 || t.price_all >= o.price_all) errors.tiers = m ? 'Çdo shkallë sasie ka sasi mbi 1 dhe çmim më të ulët se çmimi bazë.' : 'Each volume tier needs a quantity above 1 and a price below the base price.';
  const dup = await get<{ id: number }>('SELECT id FROM offers WHERE product_id = ? AND seller_id = ? AND id != ?', o.product_id, o.seller_id, id ?? 0);
  if (dup) errors.seller_id = m ? 'Ky shitës ka tashmë një ofertë për këtë produkt.' : 'This seller already has an offer for this product.';
  if (Object.keys(errors).length) return { errors };

  const prev = id ? await get<{ price_all: number }>('SELECT price_all FROM offers WHERE id = ?', id) : null;
  const cols = [o.product_id, o.seller_id, o.price_all, o.compare_at_all, o.stock_qty, o.lead_days, o.min_qty, o.delivery_fee_all, o.free_delivery_over_all, o.installation_available ? 1 : 0, o.note_sq, o.note_en, o.promoted ? 1 : 0, o.active ? 1 : 0] as const;
  const writes: Stmt[] = [];
  // UNIQUE (product_id, seller_id) is the offer's natural key, so the tiers and the price history can
  // find a brand new offer inside the same batch that creates it.
  const parent = id ? '?' : '(SELECT id FROM offers WHERE product_id = ? AND seller_id = ?)';
  const parentArgs: (string | number)[] = id ? [id] : [o.product_id, o.seller_id];

  if (id) {
    writes.push(
      stmt(
        `UPDATE offers SET product_id = ?, seller_id = ?, price_all = ?, compare_at_all = ?, stock_qty = ?, lead_days = ?, min_qty = ?, delivery_fee_all = ?, free_delivery_over_all = ?,
                installation_available = ?, note_sq = ?, note_en = ?, promoted = ?, active = ?, updated_at = datetime('now') WHERE id = ?`,
        ...cols,
        id,
      ),
    );
  } else {
    writes.push(
      stmt(
        `INSERT INTO offers (product_id, seller_id, price_all, compare_at_all, stock_qty, lead_days, min_qty, delivery_fee_all, free_delivery_over_all, installation_available, note_sq, note_en, promoted, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ...cols,
      ),
    );
  }
  const insertIdx = id ? -1 : 0;
  if (!prev || prev.price_all !== o.price_all) {
    writes.push(stmt(`INSERT INTO price_history (offer_id, price_all) VALUES (${parent}, ?)`, ...parentArgs, o.price_all));
  }
  writes.push(stmt(`DELETE FROM offer_tiers WHERE offer_id = ${parent}`, ...parentArgs));
  for (const t of o.tiers) {
    writes.push(stmt(`INSERT INTO offer_tiers (offer_id, min_qty, price_all) VALUES (${parent}, ?, ?)`, ...parentArgs, t.min_qty, t.price_all));
  }
  const results = await batch(writes);
  const oid = id ?? results[insertIdx].id;
  await audit(u.id, id ? 'offer.update' : 'offer.create', 'offer', oid);
  return { id: oid, errors };
}

/** Quick edit from the offers grid: price and stock only. */
export async function quickOffer(u: User, id: number, price: number, stock: number) {
  const row = await get<{ seller_id: number; price_all: number }>('SELECT seller_id, price_all FROM offers WHERE id = ?', id);
  if (!row) return false;
  if (!isAdmin(u) && row.seller_id !== u.seller_id) throw new Forbidden('offer');
  if (!(price > 0) || stock < 0) return false;
  const writes: Stmt[] = [stmt("UPDATE offers SET price_all = ?, stock_qty = ?, updated_at = datetime('now') WHERE id = ?", price, stock, id)];
  if (row.price_all !== price) writes.push(stmt('INSERT INTO price_history (offer_id, price_all) VALUES (?, ?)', id, price));
  writes.push(auditStmt(u.id, 'offer.quick', 'offer', id, `${price}/${stock}`));
  await batch(writes);
  return true;
}

// ---------- price comparison monitor ----------

/** Products where offers differ the most, single-seller products and products without offers. */
export async function priceMonitor() {
  const spread = await all<any>(
    `SELECT p.id, p.slug, p.brand, p.model, COUNT(o.id) AS offers, MIN(o.price_all) AS low, MAX(o.price_all) AS high,
            ROUND(100.0 * (MAX(o.price_all) - MIN(o.price_all)) / MIN(o.price_all), 1) AS spread_pct
       FROM products p JOIN offers o ON o.product_id = p.id AND o.active = 1
      WHERE p.status = 'published' GROUP BY p.id HAVING offers > 1 ORDER BY spread_pct DESC LIMIT 25`,
  );
  const single = await all<any>(
    `SELECT p.id, p.slug, p.brand, p.model, MIN(o.price_all) AS low FROM products p JOIN offers o ON o.product_id = p.id AND o.active = 1
      WHERE p.status = 'published' GROUP BY p.id HAVING COUNT(o.id) = 1 ORDER BY p.brand LIMIT 50`,
  );
  const none = await all<any>(
    `SELECT p.id, p.slug, p.brand, p.model, p.reference_price_eur FROM products p WHERE p.status = 'published'
        AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.product_id = p.id AND o.active = 1) ORDER BY p.brand`,
  );
  return { spread, single, none };
}

// ---------- sellers ----------

export async function saveSeller(u: User, id: number | null, s: Record<string, any>) {
  requireAdmin(u);
  const cols = [s.slug, s.name, s.legal_name || null, s.nipt || null, s.kind, s.city_id || null, s.address || null, s.phone || null, s.email || null, s.website || null, s.about_sq ?? '', s.about_en ?? '', s.verified ? 1 : 0, s.plan, Number(s.commission_pct), s.delivery_zones || '1,2,3', s.status] as const;
  if (id) {
    await run(
      `UPDATE sellers SET slug = ?, name = ?, legal_name = ?, nipt = ?, kind = ?, city_id = ?, address = ?, phone = ?, email = ?, website = ?, about_sq = ?, about_en = ?, verified = ?, plan = ?, commission_pct = ?, delivery_zones = ?, status = ? WHERE id = ?`,
      ...cols,
      id,
    );
    await audit(u.id, 'seller.update', 'seller', id);
    return id;
  }
  const r = await run(
    `INSERT INTO sellers (slug, name, legal_name, nipt, kind, city_id, address, phone, email, website, about_sq, about_en, verified, plan, commission_pct, delivery_zones, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ...cols,
  );
  await audit(u.id, 'seller.create', 'seller', r.id);
  return r.id;
}

/** Approving an application creates an active seller (plan as requested) and marks the application. */
export async function approveApplication(u: User, appId: number) {
  requireAdmin(u);
  const a = await get<any>("SELECT * FROM seller_applications WHERE id = ? AND status = 'new'", appId);
  if (!a) return null;
  const base = await slugify(a.company);
  let slug = base;
  let i = 2;
  while (await get('SELECT id FROM sellers WHERE slug = ?', slug)) slug = `${base}-${i++}`;
  const plan = ['start', 'pro', 'partner'].includes(a.plan) ? a.plan : 'start';
  // The commission is whatever Settings → plans says today; the old built-in numbers only if a plan is missing there.
  const fromSettings = (await setting<{ key: string; commission_pct: number }[]>('plans', [])).find((p) => p.key === plan)?.commission_pct;
  const commission = typeof fromSettings === 'number' && Number.isFinite(fromSettings) ? fromSettings : plan === 'partner' ? 6 : plan === 'pro' ? 7 : 9;

  // The application only moves to approved in the same batch that creates the seller: sellers.slug is
  // UNIQUE, so if the slug was taken between the loop above and here, the whole batch rolls back and
  // the application is still waiting rather than approved with no seller behind it.
  const results = await batch([
    stmt(
      `INSERT INTO sellers (slug, name, legal_name, nipt, kind, phone, email, plan, commission_pct, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      slug, a.company, a.company, a.nipt, a.kind, a.phone, a.email, plan, commission,
    ),
    stmt("UPDATE seller_applications SET status = 'approved' WHERE id = ? AND status = 'new'", appId),
    auditStmt(u.id, 'application.approve', 'seller', undefined, `application ${appId} → ${slug}`),
  ]);
  return results[0].id;
}

// ---------- quote threads ----------

export async function postMessage(u: User, threadType: 'rfq' | 'order', threadId: number, body: string, priceAll: number | null) {
  const role = isAdmin(u) ? 'admin' : 'seller';
  await run(
    'INSERT INTO messages (thread_type, thread_id, author_role, seller_id, body, price_all) VALUES (?, ?, ?, ?, ?, ?)',
    threadType, threadId, role, u.seller_id ?? null, body.slice(0, 4000), priceAll,
  );
  if (threadType === 'rfq' && role === 'seller') await run("UPDATE quote_requests SET status = 'answered' WHERE id = ? AND status = 'open'", threadId);
  await audit(u.id, 'message.post', threadType, threadId);
}
