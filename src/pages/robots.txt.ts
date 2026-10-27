// /robots.txt: everything public may be crawled except the admin, the API and the dev pages; the sitemap is on the
// same origin as the request (or PUBLIC_ORIGIN, like the canonical tags and sitemap.xml.ts).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url, site }) => {
  const origin = site?.origin ?? url.origin;
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api', 'Disallow: /dev', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};
