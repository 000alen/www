import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';
import * as authSchema from '@/db/auth-schema';

type Schema = typeof schema & typeof authSchema;

let _db: PostgresJsDatabase<Schema> | undefined;

export function getDb(): PostgresJsDatabase<Schema> {
  if (!_db) {
    _db = drizzle<Schema>(process.env.POSTGRES_URL!);
  }
  return _db;
}

// Keep backward compat — lazy getter
export const db = new Proxy({} as PostgresJsDatabase<Schema>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
