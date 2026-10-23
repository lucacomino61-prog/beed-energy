// Running behind a proxy or a CDN: the request URL the server sees can be http://127.0.0.1:…
// while buyers use https://beed.al. PUBLIC_ORIGIN names the real address (payment return and webhook
// URLs, Secure cookies); TRUST_PROXY=1 lets X-Forwarded-For / X-Forwarded-Proto speak for the client.

export function configuredOrigin(): string | null {
  const o = String(process.env.PUBLIC_ORIGIN ?? '').trim().replace(/\/+$/, '');
  return /^https?:\/\/[^/]+$/.test(o) ? o : null;
}

/** The origin buyers see: PUBLIC_ORIGIN when set, else the request's own. */
export function publicOrigin(url: URL): string {
  return configuredOrigin() ?? url.origin;
}

export const trustProxy = () => process.env.TRUST_PROXY?.trim() === '1';

/** True when the visitor reached us over https (directly, through the configured origin, or a trusted proxy). */
export function isHttps(url: URL, request?: Request): boolean {
  if (url.protocol === 'https:') return true;
  if (trustProxy() && request?.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https') return true;
  return false;
}

/** Cookies get Secure when the site is served over https, even if the proxy talks plain http to us. */
export function secureCookies(url: URL): boolean {
  return url.protocol === 'https:' || (configuredOrigin()?.startsWith('https:') ?? false);
}
