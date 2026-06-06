import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

/**
 * ============================================================================
 * HOW DRIZZLE WORKS (Offline-First Architecture)
 * ============================================================================
 * 
 * 1. drizzle-orm: A TypeScript ORM. Instead of writing raw SQL strings, you 
 *    write type-safe query builders (e.g., `db.select().from(posts).where(...)`).
 * 
 * 2. expo-sqlite: Provides the actual SQLite file on the device (iOS/Android) 
 *    or in-memory via sql.js wasm (Web). Drizzle sits on top of this as a query layer.
 * 
 * 3. Migrations: `drizzle-kit` reads your `schema.ts` and generates SQL migration 
 *    files. At runtime, `migrate()` (or `<MigrationRunner>`) applies any unapplied 
 *    migrations in order. This ensures schema changes are safely handled across 
 *    app updates.
 * 
 * 4. To VIEW the database during development:
 *    - Android: use `adb shell` + `sqlite3` or Expo Dev Tools DB inspector.
 *    - iOS Simulator: find the .db file in ~/Library/Developer/CoreSimulator/…
 *    - Web: open DevTools → Application → IndexedDB (sql.js stores it there).
 *    - Recommended: install "Drizzle Studio" via `npx drizzle-kit studio`, 
 *      which opens a local web UI to browse/query your SQLite tables live.
 * 
 * 5. All Drizzle operations return Promises (async/await friendly):
 *    - INSERT: await db.insert(posts).values({ ... })
 *    - SELECT: await db.select().from(posts).where(...)
 *    - UPDATE: await db.update(posts).set({ title: '...' }).where(...)
 *    - DELETE: await db.delete(posts).where(...)
 * ============================================================================
 */

/**
 * useDb()
 *
 * Returns a Drizzle ORM instance backed by the SQLite database
 * opened via <SQLiteProvider> in the root layout.
 *
 * This hook MUST be called inside a component that is a descendant
 * of <SQLiteProvider>. Using this hook-based pattern prevents the "Sync 
 * operation timeout" error on web.
 */
export function useDb() {
  const sqliteDb = useSQLiteContext();
  return drizzle(sqliteDb, { schema });
}

