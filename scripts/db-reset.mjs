// Deletes the local database file so the next seed starts clean. Local data only.
import { rmSync, existsSync } from 'node:fs';
import { DB_PATH } from './lib/db.mjs';

for (const f of [DB_PATH, DB_PATH + '-wal', DB_PATH + '-shm']) if (existsSync(f)) rmSync(f);
console.log('Removed', DB_PATH);
