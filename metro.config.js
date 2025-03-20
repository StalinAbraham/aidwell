// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Increase the max workers and RAM
config.maxWorkers = 2; // Reduce number of workers
config.transformer.minifierConfig = {
  compress: false, // Disable compression during development
  mangle: false // Disable name mangling
};

// Optimize caching
config.cacheStores = [];
config.resetCache = true;

module.exports = config;