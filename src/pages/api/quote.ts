// POST /api/quote — creates a quote request (same rules as the page form) and answers JSON:
// { ok: true, next: "/oferta/RFQ-…?k=…" } or { ok: false, errors }.
// POST /api/quote?code=RFQ-…&k=… — a buyer reply in that thread.
import type { APIRoute } from 'astro';
import { handleQuote, handleReply, jsonResult } from '../../lib/pages-forms';
import { langFromPath } from '../../lib/i18n';

export const POST: APIRoute = async (ctx) => {
  const ref = ctx.request.headers.get('referer');
  const lang = ctx.url.searchParams.get('lang') === 'en' || (ref && langFromPath(new URL(ref, ctx.url).pathname) === 'en') ? 'en' : 'sq';
  const code = ctx.url.searchParams.get('code');
  const r = code ? await handleReply(ctx, lang, code, ctx.url.searchParams.get('k')) : await handleQuote(ctx, lang);
  return jsonResult(r);
};
