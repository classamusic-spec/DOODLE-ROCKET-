// Saves screenshots of the menu screens, every world, and every game's first screen at every level it
// supports to test-results/shots/<project>/. Run with `npm run shots`, then look through them for layout problems.
const { test } = require('@playwright/test');
const { ORIGINAL, NEW_LITTLE, GRADE, open, setLevel, startGame } = require('./helpers');

test('capture screenshots', async ({ page }, info) => {
  test.setTimeout(900_000);
  const dir = `test-results/shots/${info.project.name}`;
  const shot = async (name, ms = 500) => { await page.waitForTimeout(ms); await page.screenshot({ path: `${dir}/${name}.png` }); };
  await open(page);
  await shot('00-start', 1200);
  await page.evaluate(() => window.DoodleRocket.editProfile(null, { first: true }));
  await shot('01-editor');
  await page.evaluate(() => { document.querySelector('#editor')?.remove(); const D = window.DoodleRocket; D.setLevel('g3'); D.ensureProfile(); D.S.profile.level = 'g3'; });
  for (const gal of ['grade', 'little']) {
    await page.evaluate(g => { window.DoodleRocket.S.galaxy = g; window.DoodleRocket.mapScreen(); }, gal);
    await shot(`02-map-${gal}`, 900);
  }
  await page.evaluate(() => window.DoodleRocket.tripScreen()); await shot('03-trip', 900);
  await page.evaluate(() => window.DoodleRocket.bookScreen()); await shot('04-book', 700);
  await page.evaluate(() => window.DoodleRocket.profilesScreen()); await shot('05-profiles', 700);
  await page.evaluate(() => window.DoodleRocket.openPanel()); await shot('06-panel', 500);
  await page.evaluate(() => document.querySelector('#panel')?.remove());
  const n = await page.evaluate(() => window.DoodleRocket.PAGES.length);
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => { window.DoodleRocket.S.page = i; window.DoodleRocket.hub(); }, i);
    await shot(`10-hub-${String(i).padStart(2, '0')}`, 600);
  }
  const plan = [['sprout', [...ORIGINAL, ...NEW_LITTLE]], ['captain', [...ORIGINAL, ...NEW_LITTLE]],
    ...['g1', 'g2', 'g3', 'g4', 'g5'].map(l => [l, GRADE])];
  for (const [level, keys] of plan) {
    await setLevel(page, level);
    for (const key of keys) {
      await startGame(page, key);
      await shot(`${level}-${key}`);
    }
  }
});
