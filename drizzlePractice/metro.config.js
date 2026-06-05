// ─────────────────────────────────────────────────────────────────────────────
// metro.config.js  (project root)
// Tells Metro bundler to include .sql files in the bundle.
//
// WHY THIS FILE EXISTS:
//   The generated migrations are .sql text files.
//   Metro (React Native's bundler) doesn't know about .sql by default.
//   This one line adds it to the list of file types Metro will process.
//
// You create this file ONCE and never touch it again.
// ─────────────────────────────────────────────────────────────────────────────

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow Metro to import .sql migration files
config.resolver.sourceExts.push("sql");

module.exports = config;