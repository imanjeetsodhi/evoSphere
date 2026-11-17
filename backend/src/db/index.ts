import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/worlds.js';

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/evosphere';

// Drizzle pools connection lazily; it won't block server boot if local postgres is not active.
export const pool = new pg.Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
export type Database = typeof db;
export * as dbSchema from './schema/worlds.js';
