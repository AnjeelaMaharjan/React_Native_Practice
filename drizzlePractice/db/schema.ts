
// MENTAL MODEL:
//   sqliteTable("table_name", { columns })  → defines ONE database table
//   integer().primaryKey({ autoIncrement: true }) → auto ID (like loan_id 1,2,3…)
//   text().notNull()  → required string column
//   text()            → optional string column (can be null)
//   integer()         → number column
//
// WHY DRIZZLE?
//   After this file, TypeScript knows EXACTLY what shape every row has.
//   You get autocomplete on db.select(), db.insert(), db.update() — no guessing.
// ─────────────────────────────────────────────────────────────────────────────

import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

// ─── BORROWERS TABLE ──────────────────────────────────────────────────────────
// Represents a microfinance borrower in the Auxfin system.

export const borrowersTable = sqliteTable("borrowers", {

  id: integer("id").primaryKey({ autoIncrement: true }),  // Primary key — SQLite auto-assigns 1, 2, 3... on each insert
  
  fullName: text("full_name").notNull(),// Full legal name (required for KYC)

  // Phone number used for OTP authentication (e.g. "977-9841234567")
  phone: text("phone").notNull().unique(),

  // Nepal district (e.g. "Kathmandu", "Pokhara", "Dharan")
  district: text("district").notNull(),

  // Loan status: "active" | "pending" | "closed" | "defaulted"
  loanStatus: text("loan_status").notNull().default("pending"),

  // Outstanding loan amount in NPR (Nepalese Rupees), null if no loan yet
  loanAmountNPR: real("loan_amount_npr"),

  // Field officer assigned to this borrower (can be null if unassigned)
  fieldOfficer: text("field_officer"),

  // ISO timestamp string — when the record was created
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// ─── INFERRED TYPES (auto-generated from schema above) ───────────────────────
// You NEVER write these manually — Drizzle creates them from your table definition.

// Shape of a row you GET back from the database (SELECT)
export type Borrower = typeof borrowersTable.$inferSelect;
// → { id: number; fullName: string; phone: string; district: string;
//     loanStatus: string; loanAmountNPR: number | null;
//     fieldOfficer: string | null; createdAt: string }

// Shape of a row you SEND to the database (INSERT) — id/createdAt optional
export type NewBorrower = typeof borrowersTable.$inferInsert;
// → { fullName: string; phone: string; district: string;
//     loanStatus?: string; loanAmountNPR?: number | null; … }