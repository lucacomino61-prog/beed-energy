// POST /api/contact — a contact message (same rules as the form on /kontakt), answered as JSON.
import type { APIRoute } from 'astro';
import { handleContact, jsonResult } from '../../lib/pages-forms';
import { langFromPath } from '../../lib/i18n';

export const POST: APIRoute = async (ctx) => {
  const ref = ctx.request.headers.get('referer');
  const lang = ctx.url.searchParams.get('lang') === 'en' || (ref && langFromPath(new URL(ref, ctx.url).pathname) === 'en') ? 'en' : 'sq';
  return jsonResult(await handleContact(ctx, lang));
};
