const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');
config.resolver.assetExts.push('wasm');

// Add secure headers required for SharedArrayBuffer support in SQLite on Web.
// wa-sqlite (used by expo-sqlite on web) requires Cross-Origin Isolation,
// which is enabled by these two headers together.
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // 'require-corp' is needed (not 'credentialless') for full SharedArrayBuffer access
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
