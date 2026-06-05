module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]] // --- it allows us to import .sql files as raw text, which is useful for loading SQL queries from files in our app. This way, we can keep our SQL queries organized in separate .sql files and import them directly into our JavaScript/TypeScript code as strings.
  };
};
