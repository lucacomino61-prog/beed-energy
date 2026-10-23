// Shared helpers for public form posts: a honeypot field, a small per-address rate limit,
// trimmed string reads and the email check every form uses.
import { trustProxy } from './origin';

const hits = new Map<string, number[]>();

/** true when this address has posted more than `max` times in `windowMs`. */
export function rateLimited(key: string, max = 8, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return list.length > max;
}

/**
 * The visitor's address for rate limits. X-Forwarded-For is anyone's to write, so it counts only
 * behind a proxy we await run (TRUST_PROXY=1), and then its last entry: the one our proxy appended.
 */
export function clientKey(request: Request, clientAddress?: string): string {
  if (trustProxy()) {
    const fwd = request.headers.get('x-forwarded-for')?.split(',').map((s) => s.trim()).filter(Boolean);
    if (fwd?.length) return fwd[fwd.length - 1];
  }
  return clientAddress || 'local';
}

/** Bots fill every field; people never see this one ("website", hidden with CSS and aria-hidden). */
export function isBot(form: FormData): boolean {
  return String(form.get('website') ?? '').trim() !== '';
}

export function str(form: FormData, key: string, max = 500): string {
  return String(form.get(key) ?? '').trim().slice(0, max);
}

export function int(form: FormData, key: string): number | null {
  const v = String(form.get(key) ?? '').replace(/[\s  .]/g, '').replace(',', '.');
  if (!v) return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : null;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
