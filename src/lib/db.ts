// One SQLite file for the whole marketplace (node:sqlite, no native build step).
// Rows come back as plain objects; callers pass positional params.
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import schema from './schema.sql?raw';

export type Row = Record<string, any>;

const DB_PATH = resolve(process.env.BEED_DB ?? 'data/beed.db');

let handle: DatabaseSync | undefined;

export function db(): DatabaseSync {
  if (handle) return handle;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  handle = new DatabaseSync(DB_PATH);
  handle.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 4000;');
  handle.exec(schema);
  return handle;
}

export function all<T = Row>(sql: string, ...params: SQLInputValue[]): T[] {
  return db().prepare(sql).all(...params) as T[];
}

export function get<T = Row>(sql: string, ...params: SQLInputValue[]): T | undefined {
  return db().prepare(sql).get(...params) as T | undefined;
}

export function run(sql: string, ...params: SQLInputValue[]) {
  const r = db().prepare(sql).run(...params);
  return { changes: Number(r.changes), id: Number(r.lastInsertRowid) };
}

/** Runs fn inside BEGIN IMMEDIATE … COMMIT; rolls back and rethrows on any error. */
export function tx<T>(fn: () => T): T {
  const d = db();
  d.exec('BEGIN IMMEDIATE');
  try {
    const out = fn();
    d.exec('COMMIT');
    return out;
  } catch (err) {
    d.exec('ROLLBACK');
    throw err;
  }
}

export function setting<T>(key: string, fallback: T): T {
  const row = get<{ value_json: string }>('SELECT value_json FROM settings WHERE key = ?', key);
  if (!row) return fallback;
  try {
    return JSON.parse(row.value_json) as T;
  } catch {
    return fallback;
  }
}

export function saveSetting(key: string, value: unknown) {
  run(
    'INSERT INTO settings (key, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json',
    key,
    JSON.stringify(value),
  );
}

export function audit(userId: number | null, action: string, entity?: string, entityId?: number, detail?: string) {
  run(
    'INSERT INTO audit_log (user_id, action, entity, entity_id, detail) VALUES (?, ?, ?, ?, ?)',
    userId,
    action,
    entity ?? null,
    entityId ?? null,
    detail ?? null,
  );
}
