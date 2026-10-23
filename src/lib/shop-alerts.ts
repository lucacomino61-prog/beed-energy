// Price alerts: validation and storage for /api/price-alert, plus a one-read flash cookie that carries
// the form's result back to the product page after the redirect (so the email never goes into a URL).
import type { AstroCookies } from 'astro';
import { get, run } from './db';
import { EMAIL_RE } from './forms';

export const ALERT_FLASH = 'beed_alert';
export type AlertFlash = { pid?: number; ok?: boolean; email?: string; target?: string; errors?: string[] } | null;

export function writeAlertFlash(cookies: AstroCookies, value: NonNullable<AlertFlash>, secure: boolean) {
  cookies.set(ALERT_FLASH, JSON.stringify(value), { path: '/', httpOnly: true, sameSite: 'lax', secure, maxAge: 120 });
}

/** Reads and clears the flash, only for the product it was written for. */
export function readAlertFlash(cookies: AstroCookies, productId: number): AlertFlash {
  const raw = cookies.get(ALERT_FLASH)?.value;
  if (!raw) return null;
  cookies.delete(ALERT_FLASH, { path: '/' });
  try {
    const v = JSON.parse(raw);
    return v && v.pid === productId ? v : null;
  } catch {
    return null;
  }
}

export async function lowestPrice(productId: number): Promise<number | null> {
  return (
    (await get<{ p: number | null }>(
      `SELECT MIN(o.price_all) AS p FROM offers o JOIN sellers s ON s.id = o.seller_id
        WHERE o.product_id = ? AND o.active = 1 AND s.status = 'active'`,
      productId,
    ))?.p ?? null
  );
}

export async function validateAlert(email: string, targetRaw: string, productId: number): Promise<{ errors: string[]; target: number | null }> {
  const errors: string[] = [];
  if (!EMAIL_RE.test(email) || email.length > 200) errors.push('email');
  const digits = targetRaw.replace(/[\s  .,]/g, '');
  const target = /^\d{1,9}$/.test(digits) ? Number(digits) : null;
  const low = await lowestPrice(productId);
  if (target === null || target <= 0 || (low !== null && target >= low)) errors.push('target');
  return { errors, target };
}

/** One open alert per email and product: a second request moves the target. */
export async function saveAlert(productId: number, email: string, target: number, lang: string) {
  const open = await get<{ id: number }>('SELECT id FROM price_alerts WHERE product_id = ? AND email = ? AND notified_at IS NULL', productId, email);
  if (open) await run('UPDATE price_alerts SET target_all = ?, lang = ?, created_at = datetime(\'now\') WHERE id = ?', target, lang, open.id);
  else await run('INSERT INTO price_alerts (product_id, email, target_all, lang) VALUES (?, ?, ?, ?)', productId, email, target, lang);
}
