// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig= getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
/** @type {import('expo/metro-config').MetroConfig} 
const config = getDefaultConfig(__dirname);*/

module.exports = defaultConfig;
 