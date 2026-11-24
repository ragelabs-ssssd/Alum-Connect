import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

interface DbGlobalCache {
  sqlClient?: Sql;
  drizzleDb?: Database;
}

const globalForDb = globalThis as typeof globalThis & {
  __almaConnectDb?: DbGlobalCache;
};

/**
 * Checks whether a live PostgreSQL connection string is configured.
 * Safe to call in both server runtime and build-time static analysis.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Returns a pooled Drizzle ORM instance cached on `globalThis` for
 * serverless/HMR safety. Never connects at module import time.
 */
export function getDb(): Database {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      'DATABASE_URL is not configured. Check isDatabaseConfigured() before calling getDb().'
    );
  }

  if (!globalForDb.__almaConnectDb) {
    globalForDb.__almaConnectDb = {};
  }

  if (!globalForDb.__almaConnectDb.sqlClient) {
    globalForDb.__almaConnectDb.sqlClient = postgres(url, {
      prepare: false,
      max: 10,
    });
  }

  if (!globalForDb.__almaConnectDb.drizzleDb) {
    globalForDb.__almaConnectDb.drizzleDb = drizzle(
      globalForDb.__almaConnectDb.sqlClient,
      { schema }
    );
  }

  return globalForDb.__almaConnectDb.drizzleDb;
}
