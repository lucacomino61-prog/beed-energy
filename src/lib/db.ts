// One D1 database for the whole marketplace. Rows come back as plain objects; callers pass
// positional params, exactly as they did against node:sqlite — only now every call is awaited.
//
// The binding comes from `cloudflare:workers`, which exposes the Worker's env to any module, so no
// caller has to pass it along. Bindings are the same for every request an isolate serves.
import { env } from 'cloudflare:workers';
// Imported as types rather than pulled in globally: @cloudflare/workers-types replaces lib.dom, and
// the browser scripts under src/scripts need the DOM.
import type { D1Database, D1Result } from '@cloudflare/workers-types';

export type { D1Database };

export type Row = Record<string, any>;
export type SQLValue = string | number | bigint | ArrayBuffer | null;

export function db(): D1Database {
  const binding = env.DB;
  if (!binding) throw new Error('D1 binding "DB" is missing: check d1_databases in wrangler.jsonc.');
  return binding;
}

/** D1 rejects `undefined`; the old node:sqlite layer accepted it and stored NULL. */
function clean(params: SQLValue[]): SQLValue[] {
  return params.map((p) => (p === undefined ? null : p));
}

function prepare(sql: string, params: SQLValue[]) {
  const s = db().prepare(sql);
  return params.length ? s.bind(...clean(params)) : s;
}

export async function all<T = Row>(sql: string, ...params: SQLValue[]): Promise<T[]> {
  const { results } = await prepare(sql, params).all<T>();
  return results ?? [];
}

export async function get<T = Row>(sql: string, ...params: SQLValue[]): Promise<T | undefined> {
  const row = await prepare(sql, params).first<T>();
  return row ?? undefined;
}

export type RunResult = { changes: number; id: number };

export async function run(sql: string, ...params: SQLValue[]): Promise<RunResult> {
  const { meta } = await prepare(sql, params).run();
  return { changes: Number(meta.changes ?? 0), id: Number(meta.last_row_id ?? 0) };
}

export type Stmt = { sql: string; params: SQLValue[] };

/** Builds one statement for (await batch()). Nothing runs until the batch does. */
export function stmt(sql: string, ...params: SQLValue[]): Stmt {
  return { sql, params };
}

/**
 * D1's replacement for BEGIN IMMEDIATE … COMMIT. The statements run in order inside a single
 * transaction and either all land or none do: a constraint failure anywhere rolls the batch back
 * and throws. Two consequences the old tx() callers have to respect:
 *
 *  - No branching mid-flight. Every statement is fixed before the batch starts, so a decision that
 *    depends on an earlier statement's result has to be pushed into SQL — a WHERE guard, or a CHECK
 *    constraint that aborts the (await batch (that is how stock is held in orders.ts)).
 *  - last_insert_rowid() does carry across statements, so rows that reference a row inserted
 *    earlier in the same batch can still find its id.
 */
export async function batch(stmts: Stmt[]): Promise<RunResult[]> {
  if (!stmts.length) return [];
  const d = db();
  const results = await d.batch(stmts.map((s) => (s.params.length ? d.prepare(s.sql).bind(...clean(s.params)) : d.prepare(s.sql))));
  return results.map((r: D1Result) => ({ changes: Number(r.meta?.changes ?? 0), id: Number(r.meta?.last_row_id ?? 0) }));
}

/** True when an error is SQLite refusing the write (CHECK, UNIQUE, FK) rather than D1 falling over. */
export function isConstraintError(err: unknown): boolean {
  return /SQLITE_CONSTRAINT|constraint failed/i.test(String((err as Error)?.message ?? err));
}

export async function setting<T>(key: string, fallback: T): Promise<T> {
  const row = await get<{ value_json: string }>('SELECT value_json FROM settings WHERE key = ?', key);
  if (!row) return fallback;
  try {
    return JSON.parse(row.value_json) as T;
  } catch {
    return fallback;
  }
}

export function saveSettingStmt(key: string, value: unknown): Stmt {
  return stmt(
    'INSERT INTO settings (key, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json',
    key,
    JSON.stringify(value),
  );
}

export async function saveSetting(key: string, value: unknown) {
  const s = saveSettingStmt(key, value);
  await run(s.sql, ...s.params);
}

export function auditStmt(userId: number | null, action: string, entity?: string, entityId?: number, detail?: string): Stmt {
  return stmt(
    'INSERT INTO audit_log (user_id, action, entity, entity_id, detail) VALUES (?, ?, ?, ?, ?)',
    userId,
    action,
    entity ?? null,
    entityId ?? null,
    detail ?? null,
  );
}

export async function audit(userId: number | null, action: string, entity?: string, entityId?: number, detail?: string) {
  const s = auditStmt(userId, action, entity, entityId, detail);
  await run(s.sql, ...s.params);
}
