// ─────────────────────────────────────────────────────────────────────────────
// db/client.ts
// The database connection — one file, imported everywhere.
//
// MENTAL MODEL:
//   openDatabaseSync("my.db")  → opens (or creates) the SQLite file on device
//   drizzle(expoDb, { schema })    → wraps it so Drizzle can translate TS → SQL
//
// WHY A SEPARATE FILE?
//   Same reason database's API client lives in one place:
//   you import `db` from here in every screen — no duplicate connections.
// ─────────────────────────────────────────────────────────────────────────────

import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// Step 1: Open the SQLite file on the device
// "auxfin.db" → stored in the app's private storage, persists across restarts
const expoDb = openDatabaseSync("fisrt.db", {
  // enableChangeListener lets useLiveQuery re-render when data changes
  enableChangeListener: true,
});

// Step 2: Wrap with Drizzle — this is the object you import in components
// Passing { schema } enables relational queries and type inference
export const db = drizzle(expoDb, { schema });

// Re-export the raw SQLite instance for the Drizzle Studio dev plugin
export { expoDb };