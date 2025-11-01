// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-av modülünü resolver'dan hariç tut
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  /.*\/node_modules\/expo-av\/.*/,
];

module.exports = config;

