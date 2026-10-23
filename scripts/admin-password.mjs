// Sets the admin password from the terminal (typed by the owner, never stored in the repo).
// Usage: npm run admin:password -- you@example.com "Full Name"
import { createInterface } from 'node:readline/promises';
import { randomBytes, scryptSync } from 'node:crypto';
import { open } from './lib/db.mjs';

const email = (process.argv[2] ?? 'admin@beed.local').trim().toLowerCase();
const name = process.argv[3] ?? 'Administrator';
const rl = createInterface({ input: process.stdin, output: process.stdout });
const pw = await rl.question(`New password for ${email}: `);
rl.close();
if (pw.length < 12) { console.error('Use at least 12 characters.'); process.exit(1); }
const salt = randomBytes(16);
const hash = `scrypt$16384$8$1$${salt.toString('base64')}$${scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 }).toString('base64')}`;
const db = open();
db.prepare(`INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, 'admin', ?)
  ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, name = excluded.name`).run(email, name, hash);
db.prepare('DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)').run(email);
console.log('Password set for', email);
