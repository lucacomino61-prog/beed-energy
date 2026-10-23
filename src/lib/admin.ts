// Write side of the marketplace for the admin panel. Every change is scoped by the signed-in user:
// a seller account can only touch its own offers, orders and quote threads.
import { all, audit, get, run, tx } from './db';
import type { User } from './auth';
import type { Attr } from './catalog';

export class Forbidden extends Error {}

export const isAdmin = (u: User) => u.role === 'admin';
export function requireAdmin(u: User) {
  if (!isAdmin(u)) throw new Forbidden('admin only');
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ---------- dashboard ----------

export function dashboard(u: User) {
  const sellerFilter = isAdmin(u) ? '' : 'AND oi.seller_id = ?';
  const sp = isAdmin(u) ? [] : [u.seller_id!];
  const period = (days: number) =>
    get<{ orders: number; revenue: number; commission: number }>(
      `SELECT COUNT(DISTINCT o.id) AS orders, COALESCE(SUM(oi.line_total_all), 0) AS revenue, COALESCE(SUM(oi.commission_all), 0) AS commission
         FROM orders o JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', ?) ${sellerFilter}`,
      `-${days} days`,
      ...sp,
    )!;
  const byDay = all<{ day: string; revenue: number; orders: number }>(
    `SELECT date(o.created_at) AS day, COALESCE(SUM(oi.line_total_all), 0) AS revenue, COUNT(DISTINCT o.id) AS orders
       FROM orders o JOIN order_items oi ON oi.order_id = o.id
      WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', '-30 days') ${sellerFilter}
      GROUP BY day ORDER BY day`,
    ...sp,
  );
  const open = get<{ n: number }>(
    `SELECT COUNT(DISTINCT o.id) AS n FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE o.status IN ('new', 'confirmed', 'processing') ${sellerFilter}`,
    ...sp,
  )!.n;
  const lowStock = all<any>(
    `SELECT o.id, o.stock_qty, p.slug, p.brand, p.model, s.name AS seller FROM offers o JOIN products p ON p.id = o.product_id JOIN sellers s ON s.id = o.seller_id
      WHERE o.active = 1 AND o.stock_qty <= 3 ${isAdmin(u) ? '' : 'AND o.seller_id = ?'} ORDER BY o.stock_qty LIMIT 8`,
    ...sp,
  );
  const topProducts = all<any>(
    `SELECT oi.product_id, oi.product_name, SUM(oi.qty) AS qty, SUM(oi.line_total_all) AS revenue
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'cancelled' AND o.created_at >= datetime('now', '-90 days') ${sellerFilter}
      GROUP BY oi.product_id ORDER BY revenue DESC LIMIT 6`,
    ...sp,
  );
  const counts = isAdmin(u)
    ? {
        applications: get<{ n: number }>("SELECT COUNT(*) AS n FROM seller_applications WHERE status = 'new'")!.n,
        quotes: get<{ n: number }>("SELECT COUNT(*) AS n FROM quote_requests WHERE status = 'open'")!.n,
        messages: get<{ n: number }>('SELECT COUNT(*) AS n FROM contact_messages WHERE handled = 0')!.n,
        products: get<{ n: number }>("SELECT COUNT(*) AS n FROM products WHERE status = 'published'")!.n,
        sellers: get<{ n: number }>("SELECT COUNT(*) AS n FROM sellers WHERE status = 'active'")!.n,
        offers: get<{ n: number }>('SELECT COUNT(*) AS n FROM offers WHERE active = 1')!.n,
        noOffer: get<{ n: number }>("SELECT COUNT(*) AS n FROM products p WHERE status = 'published' AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.product_id = p.id AND o.active = 1)")!.n,
      }
    : {
        quotes: get<{ n: number }>("SELECT COUNT(*) AS n FROM quote_requests WHERE status = 'open'")!.n,
        offers: get<{ n: number }>('SELECT COUNT(*) AS n FROM offers WHERE active = 1 AND seller_id = ?', u.seller_id!)!.n,
      };
  return { week: period(7), month: period(30), byDay, open, lowStock, topProducts, counts };
}

// ---------- categories and spec templates ----------

export function saveCategory(u: User, id: number | null, v: { slug_sq: string; slug_en: string; name_sq: string; name_en: string; group_key: string; intro_sq: string; intro_en: string; unit_basis: string | null; unit_label_sq: string | null; unit_label_en: string | null; sort: number; active: boolean }) {
  requireAdmin(u);
  if (id) {
    run(
      `UPDATE categories SET slug_sq = ?, slug_en = ?, name_sq = ?, name_en = ?, group_key = ?, intro_sq = ?, intro_en = ?, unit_basis = ?, unit_label_sq = ?, unit_label_en = ?, sort = ?, active = ? WHERE id = ?`,
      v.slug_sq, v.slug_en, v.name_sq, v.name_en, v.group_key, v.intro_sq, v.intro_en, v.unit_basis, v.unit_label_sq, v.unit_label_en, v.sort, v.active ? 1 : 0, id,
    );
    audit(u.id, 'category.update', 'category', id);
    return id;
  }
  const r = run(
    `INSERT INTO categories (slug_sq, slug_en, name_sq, name_en, group_key, intro_sq, intro_en, unit_basis, unit_label_sq, unit_label_en, sort, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    v.slug_sq, v.slug_en, v.name_sq, v.name_en, v.group_key, v.intro_sq, v.intro_en, v.unit_basis, v.unit_label_sq, v.unit_label_en, v.sort, v.active ? 1 : 0,
  );
  audit(u.id, 'category.create', 'category', r.id);
  return r.id;
}

export type AttrInput = Omit<Attr, 'id' | 'category_id'> & { id?: number | null };

/** Replaces a category's spec template: updates kept attributes, adds new ones, deletes removed ones (and their values). */
export function saveTemplate(u: User, categoryId: number, attrs: AttrInput[]) {
  requireAdmin(u);
  const keys = attrs.map((a) => a.key);
  if (new Set(keys).size !== keys.length) throw new Error('duplicate-key');
  tx(() => {
    const existing = all<{ id: number; key: string }>('SELECT id, key FROM spec_attributes WHERE category_id = ?', categoryId);
    for (const e of existing) if (!attrs.some((a) => a.id === e.id)) run('DELETE FROM spec_attributes WHERE id = ?', e.id);
    attrs.forEach((a, i) => {
      const vals = [a.key, a.label_sq, a.label_en, a.unit, a.type, JSON.stringify(a.options ?? []), +a.filterable, +a.comparable, +a.highlight, +a.required, a.better, a.decimals, i] as const;
      if (a.id && existing.some((e) => e.id === a.id)) {
        run(
          `UPDATE spec_attributes SET key = ?, label_sq = ?, label_en = ?, unit = ?, type = ?, options_json = ?, filterable = ?, comparable = ?, highlight = ?, required = ?, better = ?, decimals = ?, sort = ? WHERE id = ?`,
          ...vals,
          a.id,
        );
      } else {
        run(
          `INSERT INTO spec_attributes (key, label_sq, label_en, unit, type, options_json, filterable, comparable, highlight, required, better, decimals, sort, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ...vals,
          categoryId,
        );
      }
    });
  });
  audit(u.id, 'template.save', 'category', categoryId, `${attrs.length} attributes`);
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
export function parseSpecs(categoryId: number, raw: Record<string, string>, lang: 'sq' | 'en') {
  const attrs = all<any>('SELECT * FROM spec_attributes WHERE category_id = ? ORDER BY sort', categoryId);
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

export function saveProduct(u: User, id: number | null, p: ProductInput, lang: 'sq' | 'en'): { id?: number; errors: FieldErrors } {
  requireAdmin(u);
  const errors: FieldErrors = {};
  const m = lang === 'sq';
  if (!p.brand) errors.brand = m ? 'Shkruani markën.' : 'Enter the brand.';
  if (!p.model) errors.model = m ? 'Shkruani modelin.' : 'Enter the model.';
  if (!p.name_sq) errors.name_sq = m ? 'Shkruani emrin në shqip.' : 'Enter the Albanian name.';
  if (!p.name_en) errors.name_en = m ? 'Shkruani emrin në anglisht.' : 'Enter the English name.';
  p.slug = slugify(p.slug || `${p.brand} ${p.model}`);
  if (!p.slug) errors.slug = m ? 'Adresa e faqes nuk mund të jetë bosh.' : 'The page address cannot be empty.';
  const clash = get<{ id: number }>('SELECT id FROM products WHERE slug = ? AND id != ?', p.slug, id ?? 0);
  if (clash) errors.slug = m ? 'Ky adresë përdoret nga një produkt tjetër.' : 'Another product already uses this address.';
  if (!get('SELECT id FROM categories WHERE id = ?', p.category_id)) errors.category_id = m ? 'Zgjidhni kategorinë.' : 'Choose a category.';
  if (p.datasheet_url && !/^https?:\/\//.test(p.datasheet_url)) errors.datasheet_url = m ? 'Lidhja duhet të fillojë me https://' : 'The link must start with https://';
  const specs = parseSpecs(p.category_id, p.specs, lang);
  Object.assign(errors, specs.errors);
  if (Object.keys(errors).length) return { errors };

  const pid = tx(() => {
    const cols = [p.slug, p.category_id, p.brand, p.model, p.name_sq, p.name_en, p.summary_sq, p.summary_en, p.body_sq, p.body_en, p.width_mm, p.height_mm, p.depth_mm, p.weight_kg, p.warranty_years, p.datasheet_url, p.status, p.featured ? 1 : 0] as const;
    let pid = id;
    if (pid) {
      run(
        `UPDATE products SET slug = ?, category_id = ?, brand = ?, model = ?, name_sq = ?, name_en = ?, summary_sq = ?, summary_en = ?, body_sq = ?, body_en = ?,
                width_mm = ?, height_mm = ?, depth_mm = ?, weight_kg = ?, warranty_years = ?, datasheet_url = ?, status = ?, featured = ?, updated_at = datetime('now') WHERE id = ?`,
        ...cols,
        pid,
      );
      run('DELETE FROM product_specs WHERE product_id = ?', pid);
    } else {
      pid = run(
        `INSERT INTO products (slug, category_id, brand, model, name_sq, name_en, summary_sq, summary_en, body_sq, body_en, width_mm, height_mm, depth_mm, weight_kg, warranty_years, datasheet_url, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ...cols,
      ).id;
    }
    for (const v of specs.values) run('INSERT INTO product_specs (product_id, attribute_id, value_num, value_text) VALUES (?, ?, ?, ?)', pid, v.attribute_id, v.value_num, v.value_text);
    return pid;
  });
  audit(u.id, id ? 'product.update' : 'product.create', 'product', pid);
  return { id: pid, errors };
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

export function saveOffer(u: User, id: number | null, o: OfferInput, lang: 'sq' | 'en'): { id?: number; errors: FieldErrors } {
  const m = lang === 'sq';
  if (!isAdmin(u)) {
    o.seller_id = u.seller_id!;
    o.promoted = id ? !!get<{ promoted: number }>('SELECT promoted FROM offers WHERE id = ?', id)?.promoted : false; // promotion is sold by the platform
    if (id && get<{ seller_id: number }>('SELECT seller_id FROM offers WHERE id = ?', id)?.seller_id !== u.seller_id) throw new Forbidden('offer');
  }
  const errors: FieldErrors = {};
  if (!(o.price_all > 0)) errors.price_all = m ? 'Çmimi duhet të jetë më i madh se 0.' : 'Price must be above 0.';
  if (o.compare_at_all !== null && o.compare_at_all <= o.price_all) errors.compare_at_all = m ? 'Çmimi i vjetër duhet të jetë më i lartë se çmimi i ri.' : 'The old price must be higher than the new one.';
  if (o.stock_qty < 0) errors.stock_qty = m ? 'Stoku nuk mund të jetë negativ.' : 'Stock cannot be negative.';
  if (o.min_qty < 1) errors.min_qty = m ? 'Sasia minimale është të paktën 1.' : 'Minimum quantity is at least 1.';
  for (const t of o.tiers) if (t.min_qty <= 1 || t.price_all <= 0 || t.price_all >= o.price_all) errors.tiers = m ? 'Çdo shkallë sasie ka sasi mbi 1 dhe çmim më të ulët se çmimi bazë.' : 'Each volume tier needs a quantity above 1 and a price below the base price.';
  const dup = get<{ id: number }>('SELECT id FROM offers WHERE product_id = ? AND seller_id = ? AND id != ?', o.product_id, o.seller_id, id ?? 0);
  if (dup) errors.seller_id = m ? 'Ky shitës ka tashmë një ofertë për këtë produkt.' : 'This seller already has an offer for this product.';
  if (Object.keys(errors).length) return { errors };

  const oid = tx(() => {
    const prev = id ? get<{ price_all: number }>('SELECT price_all FROM offers WHERE id = ?', id) : null;
    const cols = [o.product_id, o.seller_id, o.price_all, o.compare_at_all, o.stock_qty, o.lead_days, o.min_qty, o.delivery_fee_all, o.free_delivery_over_all, o.installation_available ? 1 : 0, o.note_sq, o.note_en, o.promoted ? 1 : 0, o.active ? 1 : 0] as const;
    let oid = id;
    if (oid) {
      run(
        `UPDATE offers SET product_id = ?, seller_id = ?, price_all = ?, compare_at_all = ?, stock_qty = ?, lead_days = ?, min_qty = ?, delivery_fee_all = ?, free_delivery_over_all = ?,
                installation_available = ?, note_sq = ?, note_en = ?, promoted = ?, active = ?, updated_at = datetime('now') WHERE id = ?`,
        ...cols,
        oid,
      );
    } else {
      oid = run(
        `INSERT INTO offers (product_id, seller_id, price_all, compare_at_all, stock_qty, lead_days, min_qty, delivery_fee_all, free_delivery_over_all, installation_available, note_sq, note_en, promoted, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ...cols,
      ).id;
    }
    if (!prev || prev.price_all !== o.price_all) run('INSERT INTO price_history (offer_id, price_all) VALUES (?, ?)', oid, o.price_all);
    run('DELETE FROM offer_tiers WHERE offer_id = ?', oid);
    for (const t of o.tiers) run('INSERT INTO offer_tiers (offer_id, min_qty, price_all) VALUES (?, ?, ?)', oid, t.min_qty, t.price_all);
    return oid;
  });
  audit(u.id, id ? 'offer.update' : 'offer.create', 'offer', oid);
  return { id: oid, errors };
}

/** Quick edit from the offers grid: price and stock only. */
export function quickOffer(u: User, id: number, price: number, stock: number) {
  const row = get<{ seller_id: number; price_all: number }>('SELECT seller_id, price_all FROM offers WHERE id = ?', id);
  if (!row) return false;
  if (!isAdmin(u) && row.seller_id !== u.seller_id) throw new Forbidden('offer');
  if (!(price > 0) || stock < 0) return false;
  tx(() => {
    run("UPDATE offers SET price_all = ?, stock_qty = ?, updated_at = datetime('now') WHERE id = ?", price, stock, id);
    if (row.price_all !== price) run('INSERT INTO price_history (offer_id, price_all) VALUES (?, ?)', id, price);
  });
  audit(u.id, 'offer.quick', 'offer', id, `${price}/${stock}`);
  return true;
}

// ---------- price comparison monitor ----------

/** Products where offers differ the most, single-seller products and products without offers. */
export function priceMonitor() {
  const spread = all<any>(
    `SELECT p.id, p.slug, p.brand, p.model, COUNT(o.id) AS offers, MIN(o.price_all) AS low, MAX(o.price_all) AS high,
            ROUND(100.0 * (MAX(o.price_all) - MIN(o.price_all)) / MIN(o.price_all), 1) AS spread_pct
       FROM products p JOIN offers o ON o.product_id = p.id AND o.active = 1
      WHERE p.status = 'published' GROUP BY p.id HAVING offers > 1 ORDER BY spread_pct DESC LIMIT 25`,
  );
  const single = all<any>(
    `SELECT p.id, p.slug, p.brand, p.model, MIN(o.price_all) AS low FROM products p JOIN offers o ON o.product_id = p.id AND o.active = 1
      WHERE p.status = 'published' GROUP BY p.id HAVING COUNT(o.id) = 1 ORDER BY p.brand LIMIT 50`,
  );
  const none = all<any>(
    `SELECT p.id, p.slug, p.brand, p.model, p.reference_price_eur FROM products p WHERE p.status = 'published'
        AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.product_id = p.id AND o.active = 1) ORDER BY p.brand`,
  );
  return { spread, single, none };
}

// ---------- sellers ----------

export function saveSeller(u: User, id: number | null, s: Record<string, any>) {
  requireAdmin(u);
  const cols = [s.slug, s.name, s.legal_name || null, s.nipt || null, s.kind, s.city_id || null, s.address || null, s.phone || null, s.email || null, s.website || null, s.about_sq ?? '', s.about_en ?? '', s.verified ? 1 : 0, s.plan, Number(s.commission_pct), s.delivery_zones || '1,2,3', s.status] as const;
  if (id) {
    run(
      `UPDATE sellers SET slug = ?, name = ?, legal_name = ?, nipt = ?, kind = ?, city_id = ?, address = ?, phone = ?, email = ?, website = ?, about_sq = ?, about_en = ?, verified = ?, plan = ?, commission_pct = ?, delivery_zones = ?, status = ? WHERE id = ?`,
      ...cols,
      id,
    );
    audit(u.id, 'seller.update', 'seller', id);
    return id;
  }
  const r = run(
    `INSERT INTO sellers (slug, name, legal_name, nipt, kind, city_id, address, phone, email, website, about_sq, about_en, verified, plan, commission_pct, delivery_zones, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ...cols,
  );
  audit(u.id, 'seller.create', 'seller', r.id);
  return r.id;
}

/** Approving an application creates an active seller (plan as requested) and marks the application. */
export function approveApplication(u: User, appId: number) {
  requireAdmin(u);
  return tx(() => {
    const a = get<any>("SELECT * FROM seller_applications WHERE id = ? AND status = 'new'", appId);
    if (!a) return null;
    let slug = slugify(a.company);
    let i = 2;
    while (get('SELECT id FROM sellers WHERE slug = ?', slug)) slug = `${slugify(a.company)}-${i++}`;
    const plan = ['start', 'pro', 'partner'].includes(a.plan) ? a.plan : 'start';
    const commission = plan === 'partner' ? 6 : plan === 'pro' ? 7 : 9;
    const id = run(
      `INSERT INTO sellers (slug, name, legal_name, nipt, kind, phone, email, plan, commission_pct, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      slug, a.company, a.company, a.nipt, a.kind, a.phone, a.email, plan, commission,
    ).id;
    run("UPDATE seller_applications SET status = 'approved' WHERE id = ?", appId);
    audit(u.id, 'application.approve', 'seller', id);
    return id;
  });
}

// ---------- quote threads ----------

export function postMessage(u: User, threadType: 'rfq' | 'order', threadId: number, body: string, priceAll: number | null) {
  const role = isAdmin(u) ? 'admin' : 'seller';
  run(
    'INSERT INTO messages (thread_type, thread_id, author_role, seller_id, body, price_all) VALUES (?, ?, ?, ?, ?, ?)',
    threadType, threadId, role, u.seller_id ?? null, body.slice(0, 4000), priceAll,
  );
  if (threadType === 'rfq' && role === 'seller') run("UPDATE quote_requests SET status = 'answered' WHERE id = ? AND status = 'open'", threadId);
  audit(u.id, 'message.post', threadType, threadId);
}
