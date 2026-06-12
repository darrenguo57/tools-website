// Use the global @playwright/test module to avoid Node.js lstat issue with @-prefixed directories on Windows
const { defineConfig } = require(require('path').join(process.env.APPDATA, 'TRAE SOLO CN', 'ModularData', 'ai-agent', 'vm', 'tools', 'node', 'node_modules', '@playwright', 'test'));

module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    baseURL: 'http://localhost:8080',
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npx serve -l 8080',
    port: 8080,
    reuseExistingServer: true,
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
