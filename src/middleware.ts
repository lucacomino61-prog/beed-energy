import { defineMiddleware } from 'astro:middleware';
import { langFromPath } from './lib/i18n';
import { readSession } from './lib/auth';

const PUBLIC_ADMIN = new Set(['/admin/login', '/admin/logout']);

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  ctx.locals.lang = langFromPath(pathname);
  ctx.locals.user = null;

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  if (isAdmin || isAdminApi) {
    ctx.locals.user = readSession(ctx.cookies);
    if (!ctx.locals.user && !PUBLIC_ADMIN.has(pathname)) {
      if (isAdminApi) return new Response(JSON.stringify({ error: 'auth' }), { status: 401, headers: { 'content-type': 'application/json' } });
      return ctx.redirect(`/admin/login?next=${encodeURIComponent(pathname + ctx.url.search)}`, 302);
    }
  }

  const res = await next();
  const h = res.headers;
  h.set('X-Content-Type-Options', 'nosniff');
  // strict-origin-when-cross-origin keeps the Origin header on same-site form posts; no-referrer would send Origin: null.
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('X-Frame-Options', 'DENY');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  h.set('Cross-Origin-Opener-Policy', 'same-origin');
  if (isAdmin || isAdminApi) {
    h.set('Cache-Control', 'no-store');
    h.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
});
