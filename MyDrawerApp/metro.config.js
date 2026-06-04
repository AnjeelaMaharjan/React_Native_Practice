const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable support for .cjs and .mjs extensions (often used by graphql/apollo packages)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];

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
