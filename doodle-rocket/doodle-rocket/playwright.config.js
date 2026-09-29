// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

// Tests load the app straight from disk. ?speed=12&mute makes rounds finish fast and silently.
process.env.APP_URL = 'file://' + path.resolve(__dirname, 'app/index.html');

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: ['**/screenshots.spec.js'],   // run those with `npm run shots`
  timeout: 120_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'phone',  use: { viewport: { width: 390, height: 800 }, hasTouch: true } },
    { name: 'tablet', use: { viewport: { width: 1024, height: 700 }, hasTouch: true } },
  ],
});
