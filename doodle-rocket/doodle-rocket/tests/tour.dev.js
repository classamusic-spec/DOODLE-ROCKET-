// Dev helper (not part of `npm test`): walks the menu screens and saves screenshots to test-results/tour/.
// Run: node tests/tour.dev.js [phone|tablet|desktop|all]
const { chromium } = require('@playwright/test');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '../app/index.html');
const SIZES = { phone: { width: 390, height: 800 }, tablet: { width: 1024, height: 700 }, desktop: { width: 1440, height: 900 }, wide: { width: 1920, height: 1080 } };

(async () => {
  const which = process.argv[2] || 'all';
  const browser = await chromium.launch();
  for (const [name, vp] of Object.entries(SIZES)) {
    if (which !== 'all' && which !== name) continue;
    const ctx = await browser.newContext({ viewport: vp, hasTouch: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    const dir = `test-results/tour/${name}`;
    const shot = async (n, ms = 700) => { await page.waitForTimeout(ms); await page.screenshot({ path: `${dir}/${n}.png` }); };
    await page.goto(URL + '?mute');
    await page.waitForFunction(() => !!window.DoodleRocket);
    await shot('01-title', 1800);
    await page.locator('#play').click({ force: true });
    await shot('02-editor');
    await page.locator('#editor input').fill('Mia');
    await page.locator('#editor .opt', { hasText: 'Grade 2' }).click({ force: true });
    await shot('03-editor-filled', 300);
    await page.locator('#saveProfile').click({ force: true });
    await shot('04-map', 1400);
    await page.evaluate(() => { window.DoodleRocket.S.galaxy = 'little'; window.DoodleRocket.mapScreen(); });
    await shot('05-map-little', 1200);
    await page.evaluate(() => { window.DoodleRocket.S.page = 9; window.DoodleRocket.hub(); });
    await shot('06-hub-grade', 1200);
    await page.evaluate(() => { window.DoodleRocket.S.page = 0; window.DoodleRocket.hub(); });
    await shot('07-hub-little', 1200);
    await page.evaluate(() => window.DoodleRocket.tripScreen());
    await shot('08-trip', 1200);
    await page.evaluate(() => window.DoodleRocket.bookScreen());
    await shot('09-book-empty', 900);
    await page.evaluate(() => { const D = window.DoodleRocket; D.setLevel('g2'); void D.startGame('mathfacts'); });
    await shot('10-game-quiz', 900);
    await page.evaluate(() => { const D = window.DoodleRocket; D.setLevel('sprout'); void D.startGame('stars'); });
    await shot('11-game-stars', 900);
    await page.evaluate(() => { const D = window.DoodleRocket; D.celebrate('stars'); });
    await shot('12-party', 1300);
    await page.evaluate(() => { const D = window.DoodleRocket; for (let i = 0; i < 7; i++) D.S.stickers.push({ type: ['star','cookie','sun','moon','rocket','planet','medal'][i], rot: 5 }); D.bookScreen(); });
    await shot('13-book', 1100);
    await page.evaluate(() => window.DoodleRocket.profilesScreen());
    await shot('14-profiles', 900);
    await page.evaluate(() => window.DoodleRocket.openPanel());
    await shot('15-panel-progress', 600);
    await page.locator('#panel .ptabs button', { hasText: 'Learning' }).click({ force: true });
    await shot('16-panel-learning', 400);
    await page.locator('#panel .ptabs button', { hasText: 'Settings' }).click({ force: true });
    await shot('17-panel-settings', 400);
    await page.locator('#panel .ptabs button', { hasText: 'Players' }).click({ force: true });
    await shot('18-panel-players', 400);
    console.log(name, errs.length ? errs : 'no errors');
    await ctx.close();
  }
  await browser.close();
})();
