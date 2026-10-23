// Staff sign-in for the admin panel: scrypt password hashes, server-side sessions,
// the cookie carries a random token and the database keeps only its SHA-256.
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { get, run } from './db';

export const SESSION_COOKIE = 'beed_s';
const SESSION_DAYS = 7;

export type User = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'seller';
  seller_id: number | null;
  csrf: string;
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [algo, n, r, p, saltB64, hashB64] = stored.split('$');
  if (algo !== 'scrypt') return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

export function createSession(userId: number, cookies: AstroCookies, secure: boolean) {
  const token = randomBytes(32).toString('base64url');
  const csrf = randomBytes(18).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  run('INSERT INTO sessions (id, user_id, csrf, expires_at) VALUES (?, ?, ?, ?)', sha256(token), userId, csrf, expires.toISOString());
  run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", userId);
  cookies.set(SESSION_COOKIE, token, { path: '/', httpOnly: true, sameSite: 'lax', secure, expires });
}

export function readSession(cookies: AstroCookies): User | null {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = get<User & { expires_at: string }>(
    `SELECT u.id, u.email, u.name, u.role, u.seller_id, s.csrf, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?`,
    sha256(token),
  );
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    run('DELETE FROM sessions WHERE id = ?', sha256(token));
    return null;
  }
  const { expires_at: _e, ...user } = row;
  return user;
}

export function endSession(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) run('DELETE FROM sessions WHERE id = ?', sha256(token));
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/** Local development only: lets the "sign in as developer" button work without typing a password. */
export function devLoginAllowed(url: URL): boolean {
  // trim(): `set DEV_LOGIN=1 && npm run dev` in cmd.exe stores "1 " with the trailing space.
  return process.env.DEV_LOGIN?.trim() === '1' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost');
}

/** Same-site form posts carry the session's CSRF token as well as passing Astro's origin check. */
export function csrfOk(user: User, form: FormData): boolean {
  const sent = String(form.get('_csrf') ?? '');
  return sent.length > 0 && sent.length === user.csrf.length && timingSafeEqual(Buffer.from(sent), Buffer.from(user.csrf));
}

export function randomToken(bytes = 16): string {
  return randomBytes(bytes).toString('base64url');
}
