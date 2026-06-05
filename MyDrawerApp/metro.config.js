const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable support for .cjs and .mjs extensions (often used by graphql/apollo packages)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];

// Add 'wasm' to the asset extensions to support expo-sqlite on web
config.resolver.assetExts.push('wasm');

/** @type {import('expo/metro-config').MetroConfig} */
config.resolver.sourceExts.push('sql');// Add support for .sql files as raw text imports

// Add necessary COOP/COEP headers for web (required for wa-sqlite)
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

// Explicitly alias 'tslib' to its ES6 entry point to fix the Metro resolution issue:
// "Cannot destructure property '__extends' of 'tslib.default' as it is undefined"
const ALIASES = {
  tslib: 'tslib/tslib.es6.js',
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib') {
    return context.resolveRequest(
      context,
      ALIASES.tslib,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
