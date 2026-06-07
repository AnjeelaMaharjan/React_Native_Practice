import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import migrations from '@/db/migrations/migrations';

export const DATABASE_NAME = 'students.db';

// Open SQLite database with change listener enabled for automatic UI sync
export const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});

export const db = drizzle(expoDb);

/**
 * Migration runner to execute generated SQL migrations on the client device.
 * Since this is a client SQLite database, migrations run on application startup
 * to ensure the local database structure is always up to date.
 */
export async function runMigrations() {
  try {
    await migrate(db, migrations);
    console.log('Database migrated successfully');
  } catch (error) {
    console.error('Failed to run database migrations:', error);
  }
}
