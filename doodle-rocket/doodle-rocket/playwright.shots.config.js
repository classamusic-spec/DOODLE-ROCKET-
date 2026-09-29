// Screenshot-only config: `npm run shots` → test-results/shots/{phone,tablet}/*.png
const base = require('./playwright.config.js');
module.exports = { ...base, testIgnore: [], testMatch: ['**/screenshots.spec.js'], timeout: 300_000 };
