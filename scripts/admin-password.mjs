// Sets the admin password from the terminal (typed by the owner, never stored in the repo).
// Usage: npm run admin:password -- you@example.com "Full Name" [--local | --remote]
//
// Without a flag it writes the seed's SQLite file (data/beed.db), as before. --local writes the D1
// database `astro dev` and `wrangler dev` use; --remote writes the deployed one. Either way the
// password is hashed here, and only the scrypt hash is sent to D1.
import { createInterface } from 'node:readline/promises';
import { randomBytes, scryptSync } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { open } from './lib/db.mjs';

const args = process.argv.slice(2);
const target = args.includes('--remote') ? 'remote' : args.includes('--local') ? 'local' : 'sqlite';
const [emailArg, nameArg] = args.filter((a) => !a.startsWith('--'));
const email = (emailArg ?? 'admin@beed.local').trim().toLowerCase();
const name = nameArg ?? 'Administrator';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const pw = await rl.question(`New password for ${email}: `);
rl.close();
if (pw.length < 12) { console.error('Use at least 12 characters.'); process.exit(1); }
const salt = randomBytes(16);
const hash = `scrypt$16384$8$1$${salt.toString('base64')}$${scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 }).toString('base64')}`;

if (target === 'sqlite') {
  const db = open();
  db.prepare(`INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, 'admin', ?)
    ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, name = excluded.name`).run(email, name, hash);
  db.prepare('DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)').run(email);
} else {
  // wrangler d1 execute takes no bound parameters, so the values go in as SQL literals. The hash is
  // base64 and `$`, the email and name are quoted with '' doubled.
  const q = (s) => `'${String(s).replaceAll("'", "''")}'`;
  const sql =
    `INSERT INTO users (email, name, role, password_hash) VALUES (${q(email)}, ${q(name)}, 'admin', ${q(hash)}) ` +
    `ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, name = excluded.name; ` +
    `DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ${q(email)});`;
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  execFileSync(resolve(root, 'node_modules/.bin/wrangler'), ['d1', 'execute', 'beed-energy', `--${target}`, '--command', sql], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}
console.log(`Password set for ${email} (${target === 'sqlite' ? 'data/beed.db' : `${target} D1`})`);
