// Price alert form: validate again on the server, honeypot + rate limit, store, then PRG back to the product
// (?njoftim=ok on success). Errors and the typed values travel in a short HttpOnly flash cookie, never in the URL.
import type { APIRoute } from 'astro';
import { get } from '../../lib/db';
import { clientKey, isBot, rateLimited, str } from '../../lib/forms';
import { href } from '../../lib/i18n';
import { saveAlert, validateAlert, writeAlertFlash } from '../../lib/shop-alerts';
import { secureCookies } from '../../lib/origin';

export const POST: APIRoute = async ({ request, cookies, url, redirect, clientAddress }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  const lang = str(form, 'lang', 2) === 'en' ? 'en' : 'sq';
  const productId = Number(str(form, 'productId', 12));
  const product = Number.isInteger(productId) && productId > 0
    ? await get<{ id: number; slug: string }>("SELECT id, slug FROM products WHERE id = ? AND status = 'published'", productId)
    : undefined;
  if (!product) return redirect(href(lang, 'shop'), 303);

  // Keep the visitor's city choice when going back.
  let back = href(lang, 'product', { slug: product.slug });
  const ref = request.headers.get('referer');
  if (ref) {
    try {
      const r = new URL(ref);
      if (r.origin === url.origin && r.pathname === back) {
        r.searchParams.delete('njoftim');
        back += r.search;
      }
    } catch { /* ignore */ }
  }
  const withOk = (u: string) => `${u}${u.includes('?') ? '&' : '?'}njoftim=ok#njoftim`;
  const secure = secureCookies(url);

  // Bots get the same answer as people and nothing is stored.
  if (isBot(form)) return redirect(withOk(back), 303);

  const email = str(form, 'email', 200).toLowerCase();
  const targetRaw = str(form, 'target', 20);
  if (rateLimited(`alert:${clientKey(request, clientAddress)}`, 6)) {
    writeAlertFlash(cookies, { pid: product.id, email, target: targetRaw, errors: ['rate'] }, secure);
    return redirect(`${back}#njoftim`, 303);
  }
  const { errors, target } = await validateAlert(email, targetRaw, product.id);
  if (errors.length || target === null) {
    writeAlertFlash(cookies, { pid: product.id, email, target: targetRaw, errors }, secure);
    return redirect(`${back}#njoftim`, 303);
  }
  await saveAlert(product.id, email, target, lang);
  writeAlertFlash(cookies, { pid: product.id, ok: true, target: String(target) }, secure);
  return redirect(withOk(back), 303);
};
