// ─────────────────────────────────────────────────────────────────────────────
// babel.config.js  (project root)
// Adds the "inline-import" Babel plugin for .sql migration files.
//
// WHY THIS EXISTS:
//   Drizzle's migrations are .sql files that get imported as strings at runtime.
//   The "inline-import" plugin converts:
//     import migrations from './drizzle/migrations'
//   into the actual SQL text embedded in the JS bundle.
//
// First install the plugin:
//   npm install -D babel-plugin-inline-import
// ─────────────────────────────────────────────────────────────────────────────

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // This line is the only addition — .sql files will be inlined as strings
      ["inline-import", { extensions: [".sql"] }],
    ],
  };
};