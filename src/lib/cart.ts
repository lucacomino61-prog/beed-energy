// The basket lives in the browser as [{offerId, qty}]; every price, stock level and delivery fee
// is recomputed here from the database, so a stale or edited basket can never set a price.
import { all, get, setting } from './db';
import { unitPriceFor } from './catalog';
import { vatOf } from './money';

export type CartLineInput = { offerId: number; qty: number };

export type DeliverySettings = {
  zoneSurcharge: Record<string, number>; // added per seller parcel for zones 2 and 3
  pickupAvailable: boolean;
  codLimit: number; // cash on delivery above this total is not offered
};

export const DEFAULT_DELIVERY: DeliverySettings = { zoneSurcharge: { '1': 0, '2': 300, '3': 600 }, pickupAvailable: true, codLimit: 250000 };

export type QuotedLine = {
  offerId: number;
  productId: number;
  slug: string;
  name_sq: string;
  name_en: string;
  brand: string;
  model: string;
  categoryId: number;
  sellerId: number;
  sellerName: string;
  sellerSlug: string;
  qty: number;
  unitPrice: number;
  listPrice: number;
  lineTotal: number;
  stock: number;
  leadDays: number;
  minQty: number;
  commissionPct: number;
  width_mm: number | null;
  height_mm: number | null;
  depth_mm: number | null;
  problem: null | 'gone' | 'stock' | 'min' | 'zone';
};

export type Parcel = { sellerId: number; sellerName: string; subtotal: number; fee: number; free: boolean };

export type Quote = {
  lines: QuotedLine[];
  parcels: Parcel[];
  subtotal: number;
  delivery: number;
  total: number;
  vat: number;
  commission: number;
  codAllowed: boolean;
  ok: boolean;
};

export function cleanLines(input: unknown): CartLineInput[] {
  if (!Array.isArray(input)) return [];
  const merged = new Map<number, number>();
  for (const x of input.slice(0, 60)) {
    const offerId = Number((x as any)?.offerId);
    const qty = Math.floor(Number((x as any)?.qty));
    if (!Number.isInteger(offerId) || offerId <= 0 || !Number.isFinite(qty) || qty <= 0) continue;
    merged.set(offerId, Math.min(9999, (merged.get(offerId) ?? 0) + qty));
  }
  return [...merged].map(([offerId, qty]) => ({ offerId, qty }));
}

export function quote(input: CartLineInput[], opts: { cityId?: number | null; pickup?: boolean } = {}): Quote {
  const delivery = { ...DEFAULT_DELIVERY, ...setting<Partial<DeliverySettings>>('delivery', {}) };
  const zone = opts.cityId ? (get<{ zone: number }>('SELECT zone FROM cities WHERE id = ?', opts.cityId)?.zone ?? 1) : 1;
  const ids = input.map((l) => l.offerId);
  const rows = ids.length
    ? all<any>(
        `SELECT o.id AS offerId, o.price_all, o.stock_qty, o.lead_days, o.min_qty, o.delivery_fee_all, o.free_delivery_over_all, o.active,
                p.id AS productId, p.slug, p.name_sq, p.name_en, p.brand, p.model, p.category_id, p.status,
                p.width_mm, p.height_mm, p.depth_mm,
                s.id AS sellerId, s.name AS sellerName, s.slug AS sellerSlug, s.commission_pct, s.status AS sellerStatus, s.delivery_zones
           FROM offers o JOIN products p ON p.id = o.product_id JOIN sellers s ON s.id = o.seller_id
          WHERE o.id IN (${ids.map(() => '?').join(',')})`,
        ...ids,
      )
    : [];
  const tiers = ids.length
    ? all<{ offer_id: number; min_qty: number; price_all: number }>(
        `SELECT * FROM offer_tiers WHERE offer_id IN (${ids.map(() => '?').join(',')}) ORDER BY min_qty`,
        ...ids,
      )
    : [];

  const lines: QuotedLine[] = [];
  for (const l of input) {
    const r = rows.find((x) => x.offerId === l.offerId);
    if (!r) continue;
    const t = tiers.filter((x) => x.offer_id === r.offerId);
    const unitPrice = unitPriceFor({ price_all: r.price_all, tiers: t }, l.qty);
    const zones = String(r.delivery_zones ?? '1,2,3').split(',');
    let problem: QuotedLine['problem'] = null;
    if (!r.active || r.status !== 'published' || r.sellerStatus !== 'active') problem = 'gone';
    else if (l.qty > r.stock_qty) problem = 'stock';
    else if (l.qty < r.min_qty) problem = 'min';
    else if (!opts.pickup && !zones.includes(String(zone))) problem = 'zone';
    lines.push({
      offerId: r.offerId,
      productId: r.productId,
      slug: r.slug,
      name_sq: r.name_sq,
      name_en: r.name_en,
      brand: r.brand,
      model: r.model,
      categoryId: r.category_id,
      sellerId: r.sellerId,
      sellerName: r.sellerName,
      sellerSlug: r.sellerSlug,
      qty: l.qty,
      unitPrice,
      listPrice: r.price_all,
      lineTotal: unitPrice * l.qty,
      stock: r.stock_qty,
      leadDays: r.lead_days,
      minQty: r.min_qty,
      commissionPct: r.commission_pct,
      width_mm: r.width_mm,
      height_mm: r.height_mm,
      depth_mm: r.depth_mm,
      problem,
    });
  }

  // One parcel per seller: the seller's highest line fee, plus the zone surcharge, free above the seller's threshold.
  const parcels: Parcel[] = [];
  for (const line of lines.filter((x) => x.problem !== 'gone')) {
    let p = parcels.find((x) => x.sellerId === line.sellerId);
    if (!p) {
      p = { sellerId: line.sellerId, sellerName: line.sellerName, subtotal: 0, fee: 0, free: false };
      parcels.push(p);
    }
    p.subtotal += line.lineTotal;
  }
  for (const p of parcels) {
    const offers = rows.filter((r) => r.sellerId === p.sellerId);
    const base = Math.max(0, ...offers.map((r) => r.delivery_fee_all ?? 0));
    const thresholds = offers.map((r) => r.free_delivery_over_all).filter((x) => x !== null && x !== undefined) as number[];
    const freeOver = thresholds.length ? Math.min(...thresholds) : null;
    p.free = !!opts.pickup || (freeOver !== null && p.subtotal >= freeOver);
    p.fee = p.free ? 0 : base + (delivery.zoneSurcharge[String(zone)] ?? 0);
  }

  const valid = lines.filter((x) => x.problem === null);
  const subtotal = lines.filter((x) => x.problem !== 'gone').reduce((s, x) => s + x.lineTotal, 0);
  const deliveryTotal = parcels.reduce((s, p) => s + p.fee, 0);
  const total = subtotal + deliveryTotal;
  const commission = valid.reduce((s, x) => s + Math.round((x.lineTotal * x.commissionPct) / 100), 0);
  return {
    lines,
    parcels,
    subtotal,
    delivery: deliveryTotal,
    total,
    vat: vatOf(total),
    commission,
    codAllowed: total <= delivery.codLimit,
    ok: lines.length > 0 && valid.length === lines.length,
  };
}
