// Shared helper to resolve @playwright/test from global installation
// This avoids Node.js ENOENT lstat issue with @-prefixed directories on Windows
const path = require('path');
const globalPlaywrightPath = path.join(
  process.env.APPDATA,
  'TRAE SOLO CN', 'ModularData', 'ai-agent', 'vm', 'tools', 'node',
  'node_modules', '@playwright', 'test'
);
module.exports = require(globalPlaywrightPath);
