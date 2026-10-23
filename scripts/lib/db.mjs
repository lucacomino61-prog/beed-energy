// Plain-Node access to the same SQLite file the site uses (scripts run outside Vite).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DB_PATH = resolve(root, process.env.BEED_DB ?? 'data/beed.db');
export const ROOT = root;

export function open() {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 4000;');
  db.exec(readFileSync(resolve(root, 'src/lib/schema.sql'), 'utf8'));
  return db;
}
