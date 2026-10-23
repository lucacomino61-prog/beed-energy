import { defineMiddleware } from 'astro:middleware';
import { langFromPath } from './lib/i18n';
import { readSession } from './lib/auth';
import { contentSecurityPolicy } from './lib/csp';
import { isHttps } from './lib/origin';
import { maybeSweepUnpaidCardOrders } from './lib/orders';
import { paymentMode } from './lib/payments';
import { rememberQueryCity } from './lib/city-pref';

const PUBLIC_ADMIN = new Set(['/admin/login', '/admin/logout']);
const CITY_PAGES = /^(?:\/produkt\/[^/]+|\/en\/product\/[^/]+|\/shporta|\/en\/cart|\/kalkulatori-diellor|\/en\/solar-calculator)\/?$/;

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  ctx.locals.lang = langFromPath(pathname);
  ctx.locals.user = null;

  // Card orders nobody paid give their stock back; throttled to once every 5 minutes. waitUntil keeps
  // the sweep alive after the response goes out — a promise nobody holds is cancelled when the
  // Worker's request ends, so on Cloudflare it has to be handed to the runtime explicitly.
  const sweep = maybeSweepUnpaidCardOrders();
  if (sweep) ctx.locals.cfContext?.waitUntil(sweep);

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  if (isAdmin || isAdminApi) {
    ctx.locals.user = await readSession(ctx.cookies);
    if (!ctx.locals.user && !PUBLIC_ADMIN.has(pathname)) {
      if (isAdminApi) return new Response(JSON.stringify({ error: 'auth' }), { status: 401, headers: { 'content-type': 'application/json' } });
      return ctx.redirect(`/admin/login?next=${encodeURIComponent(pathname + ctx.url.search)}`, 302);
    }
  }

  // A city chosen on a product, basket or calculator page (?qyteti= / ?city=) becomes the default for the
  // basket and the checkout (src/lib/city-pref.ts).
  if (ctx.request.method === 'GET' && CITY_PAGES.test(pathname)) await rememberQueryCity(ctx.url, ctx.cookies);

  const res = await next();
  const h = res.headers;
  h.set('X-Content-Type-Options', 'nosniff');
  // strict-origin-when-cross-origin keeps the Origin header on same-site form posts; no-referrer would send Origin: null.
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('X-Frame-Options', 'DENY');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  h.set('Cross-Origin-Opener-Policy', 'same-origin');
  // Same policy in dev and production: the dev server's scripts are files too ('self'), and its
  // HMR socket is same-origin (connect-src 'self' covers ws: on the same host in CSP 3).
  if ((h.get('content-type') ?? '').includes('text/html')) h.set('Content-Security-Policy', contentSecurityPolicy({ pok: paymentMode() === 'pok' }));
  if (isHttps(ctx.url, ctx.request)) h.set('Strict-Transport-Security', 'max-age=31536000');
  if (isAdmin || isAdminApi) {
    h.set('Cache-Control', 'no-store');
    h.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
});
