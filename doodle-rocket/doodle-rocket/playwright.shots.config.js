// Screenshot-only config: `npm run shots` → test-results/shots/{phone,tablet,desktop}/*.png
const base = require('./playwright.config.js');
module.exports = { ...base, testIgnore: [], testMatch: ['**/screenshots.spec.js'], timeout: 900_000,
  projects: [...base.projects, { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } }] };
