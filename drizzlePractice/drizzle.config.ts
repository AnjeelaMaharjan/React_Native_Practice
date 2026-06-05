// ─────────────────────────────────────────────────────────────────────────────
// drizzle.config.ts  (project root)
// Configuration for the drizzle-kit CLI tool.
//
// MENTAL MODEL:
//   When you run:  npx drizzle-kit generate
//   drizzle-kit reads THIS file to find your schema.ts,
//   then generates SQL migration files in the ./drizzle/ folder.
//
// You only touch this file when you:
//   - Add a new schema file
//   - Change the migrations output directory
// ─────────────────────────────────────────────────────────────────────────────

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Which database engine — "sqlite" for Expo mobile
  dialect: "sqlite",

  // Special driver for Expo — handles mobile SQLite quirks
  driver: "expo",

  // Where your table definitions live (the file we just created)
  schema: "./db/schema.ts",

  // Where drizzle-kit will write the generated SQL migration files
  out: "./drizzle",
});