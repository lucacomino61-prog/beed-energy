// POST /api/application — a seller application (same rules as the form on /shit-me-ne), answered as JSON.
import type { APIRoute } from 'astro';
import { handleApplication, jsonResult } from '../../lib/pages-forms';
import { plans } from '../../lib/pages-db';
import { langFromPath } from '../../lib/i18n';

export const POST: APIRoute = async (ctx) => {
  const ref = ctx.request.headers.get('referer');
  const lang = ctx.url.searchParams.get('lang') === 'en' || (ref && langFromPath(new URL(ref, ctx.url).pathname) === 'en') ? 'en' : 'sq';
  return jsonResult(await handleApplication(ctx, lang, plans().map((p) => p.key)));
};
