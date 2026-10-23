// Read helpers for the basket, checkout and order pages (T4). Pricing itself stays in cart.ts → quote();
// this file only adds what the pages show around it: cities, seller details per parcel, drawings,
// the free-delivery threshold, bank details and the order's parcels.
import { all, get, setting } from './db';
import { categories } from './catalog';
import { drawProduct } from './drawing';
import type { Quote, QuotedLine } from './cart';
import type { Lang } from './i18n';

export type City = { id: number; slug: string; name_sq: string; name_en: string; zone: number };

export function cities(): City[] {
  return all<City>('SELECT id, slug, name_sq, name_en, zone FROM cities ORDER BY sort, name_sq');
}

export const cityName = (c: Pick<City, 'name_sq' | 'name_en'>, lang: Lang) => (lang === 'sq' ? c.name_sq : c.name_en);

/** The city query parameter is localised: ?qyteti= in Albanian, ?city= in English. */
export const cityParam = (lang: Lang) => (lang === 'sq' ? 'qyteti' : 'city');

export function readCity(url: URL, all: City[]): City | null {
  const slug = url.searchParams.get('qyteti') ?? url.searchParams.get('city') ?? '';
  return all.find((c) => c.slug === slug) ?? null;
}

export type SellerInfo = { id: number; slug: string; name: string; verified: boolean; isDemo: boolean; city_sq: string | null; city_en: string | null };

export function sellerInfo(ids: number[]): Map<number, SellerInfo> {
  if (!ids.length) return new Map();
  const rows = all<any>(
    `SELECT s.id, s.slug, s.name, s.verified, s.is_demo, c.name_sq AS city_sq, c.name_en AS city_en
       FROM sellers s LEFT JOIN cities c ON c.id = s.city_id WHERE s.id IN (${ids.map(() => '?').join(',')})`,
    ...ids,
  );
  return new Map(rows.map((r) => [r.id, { id: r.id, slug: r.slug, name: r.name, verified: !!r.verified, isDemo: !!r.is_demo, city_sq: r.city_sq, city_en: r.city_en }]));
}

/** Lowest free-delivery threshold per seller among the offers in the basket (same rule as quote()). */
export function freeOver(offerIds: number[]): Map<number, number> {
  if (!offerIds.length) return new Map();
  const rows = all<{ seller_id: number; t: number }>(
    `SELECT seller_id, MIN(free_delivery_over_all) AS t FROM offers
      WHERE id IN (${offerIds.map(() => '?').join(',')}) AND free_delivery_over_all IS NOT NULL GROUP BY seller_id`,
    ...offerIds,
  );
  return new Map(rows.map((r) => [r.seller_id, r.t]));
}

/** Whether any offer in the basket is a seeded sample (is_demo = 1). */
export function demoOffers(offerIds: number[]): Set<number> {
  if (!offerIds.length) return new Set();
  return new Set(
    all<{ id: number }>(`SELECT id FROM offers WHERE is_demo = 1 AND id IN (${offerIds.map(() => '?').join(',')})`, ...offerIds).map((r) => r.id),
  );
}

let catSlugs: Map<number, string> | null = null;
function categorySlug(id: number): string {
  if (!catSlugs) catSlugs = new Map(categories().map((c) => [c.id, c.slug_en]));
  return catSlugs.get(id) ?? '';
}

export function lineDrawing(l: Pick<QuotedLine, 'categoryId' | 'width_mm' | 'height_mm' | 'depth_mm' | 'brand' | 'model'>): string {
  return drawProduct({ category: categorySlug(l.categoryId), w: l.width_mm, h: l.height_mm, d: l.depth_mm, dims: false, title: `${l.brand} ${l.model}` });
}

export const productName = (l: { brand: string; model: string; name_sq: string; name_en: string }, lang: Lang) =>
  (lang === 'sq' ? l.name_sq : l.name_en) || `${l.brand} ${l.model}`;

export type LineGroup = { sellerId: number; lines: QuotedLine[]; parcel: Quote['parcels'][number] | null; lead: number };

/** Lines grouped by seller in basket order; each group is one parcel (null when every line in it is gone). */
export function groupBySeller(q: Quote): LineGroup[] {
  const groups: LineGroup[] = [];
  for (const l of q.lines) {
    let g = groups.find((x) => x.sellerId === l.sellerId);
    if (!g) {
      g = { sellerId: l.sellerId, lines: [], parcel: q.parcels.find((p) => p.sellerId === l.sellerId) ?? null, lead: 0 };
      groups.push(g);
    }
    g.lines.push(l);
    if (l.problem !== 'gone') g.lead = Math.max(g.lead, l.leadDays);
  }
  return groups;
}

export function codLimit(): number {
  return setting<{ codLimit?: number }>('delivery', {}).codLimit ?? 250000;
}

/** Settings → delivery → "pickup from the seller" switch (on unless turned off). */
export function pickupAvailable(): boolean {
  return setting<{ pickupAvailable?: boolean }>('delivery', {}).pickupAvailable !== false;
}

export type Bank = { beneficiary: string | null; bank: string | null; iban: string | null; swift: string | null };
export function bankDetails(): Bank | null {
  const b = setting<Partial<Bank> | null>('bank', null);
  if (!b || !b.iban) return null;
  return { beneficiary: b.beneficiary ?? null, bank: b.bank ?? null, iban: b.iban, swift: b.swift ?? null };
}

export type ParcelFee = { fee: number | null; free: boolean };

/**
 * The delivery fee each seller parcel was charged, as stored at checkout (order_parcels). Orders from
 * before that table have no rows: with one parcel the order's delivery is that parcel's; with several
 * the split is unknown (null) rather than guessed.
 */
export function parcelFees(orderId: number, deliveryAll: number): (sellerId: number | null) => ParcelFee {
  const rows = all<{ seller_id: number; fee_all: number; free: number }>('SELECT seller_id, fee_all, free FROM order_parcels WHERE order_id = ?', orderId);
  // Counted over the whole order, also when a seller looks at only its own lines.
  const parcelCount = rows.length ? rows.length : (get<{ n: number }>('SELECT COUNT(DISTINCT COALESCE(seller_id, 0)) AS n FROM order_items WHERE order_id = ?', orderId)?.n ?? 0);
  const bySeller = new Map(rows.map((r) => [r.seller_id, { fee: r.fee_all, free: !!r.free }]));
  return (sellerId) => {
    const hit = sellerId === null ? undefined : bySeller.get(sellerId);
    if (hit) return hit;
    if (!rows.length && parcelCount === 1) return { fee: deliveryAll, free: deliveryAll === 0 };
    return { fee: null, free: false };
  };
}

/** Order lines with the product slug for links, grouped by seller, with each parcel's delivery fee. */
export function orderParcels(orderId: number) {
  const items = all<any>(
    `SELECT i.*, p.slug, p.name_sq, p.name_en, p.category_id, p.width_mm, p.height_mm, p.depth_mm, p.brand, p.model
       FROM order_items i LEFT JOIN products p ON p.id = i.product_id WHERE i.order_id = ? ORDER BY i.id`,
    orderId,
  );
  const groups: { seller: string; sellerId: number | null; items: any[]; subtotal: number; fee: number | null; free: boolean }[] = [];
  for (const it of items) {
    let g = groups.find((x) => x.sellerId === it.seller_id && x.seller === it.seller_name);
    if (!g) groups.push((g = { seller: it.seller_name, sellerId: it.seller_id, items: [], subtotal: 0, fee: null, free: false }));
    g.items.push(it);
    g.subtotal += it.line_total_all;
  }
  const delivery = get<{ delivery_all: number }>('SELECT delivery_all FROM orders WHERE id = ?', orderId)?.delivery_all ?? 0;
  const feeOf = parcelFees(orderId, delivery);
  for (const g of groups) Object.assign(g, feeOf(g.sellerId));
  return groups;
}

export function orderDrawing(it: any): string {
  if (!it.category_id) return '';
  return drawProduct({ category: categorySlug(it.category_id), w: it.width_mm, h: it.height_mm, d: it.depth_mm, dims: false, title: it.product_name });
}

/**
 * "offerId:unitPrice:qty" for each line: what the buyer saw when the form was drawn. The total the buyer
 * saw (delivery for the chosen city included) travels in its own field, seen_total, because checkout.ts
 * updates it when it re-prices the summary for another city or for pickup.
 */
export function seenKey(q: Quote): string {
  return q.lines.map((l) => `${l.offerId}:${l.unitPrice}:${l.qty}`).join(',');
}

export function parseSeen(s: string): Map<number, { price: number; qty: number }> {
  const m = new Map<number, { price: number; qty: number }>();
  for (const part of s.split(',').slice(0, 60)) {
    const [id, price, qty] = part.split(':').map(Number);
    if (Number.isInteger(id) && id > 0 && Number.isFinite(price) && Number.isFinite(qty)) m.set(id, { price, qty });
  }
  return m;
}

/** The posted seen_total, or null when the form did not carry one. */
export function parseSeenTotal(s: string): number | null {
  return /^\d{1,12}$/.test(s.trim()) ? Number(s.trim()) : null;
}

export function sellerCity(sellerId: number): { sq: string | null; en: string | null } {
  const r = get<{ sq: string | null; en: string | null }>('SELECT c.name_sq AS sq, c.name_en AS en FROM sellers s LEFT JOIN cities c ON c.id = s.city_id WHERE s.id = ?', sellerId);
  return r ?? { sq: null, en: null };
}

/** +355691234567 → +355 69 123 4567 (mobiles); anything else is shown as stored. */
export function phoneDisplay(p: string): string {
  const m = p.match(/^\+355(\d{2})(\d{3})(\d{3,4})$/);
  return m ? `+355 ${m[1]} ${m[2]} ${m[3]}` : p;
}
