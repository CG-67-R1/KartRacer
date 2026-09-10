const path = require('path');
const fs = require('fs');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);
const previousResolve = config.resolver.resolveRequest;

/** setup-engine uses TypeScript ESM `.js` specifiers that map to `.ts` files. */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const fromSetupEngine =
    typeof context.originModulePath === 'string' &&
    context.originModulePath.replace(/\\/g, '/').includes('/src/lib/setupEngine/');
  if (fromSetupEngine && typeof moduleName === 'string' && moduleName.endsWith('.js')) {
    const asTs = path.resolve(path.dirname(context.originModulePath), moduleName.replace(/\.js$/, '.ts'));
    if (fs.existsSync(asTs)) {
      return { type: 'sourceFile', filePath: asTs };
    }
  }
  if (previousResolve) {
    return previousResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
