// Saves a screenshot of every hub page and every game's first screen to test-results/shots/.
// Run with `npm run shots`, then look through the images for layout problems.
const { test } = require('@playwright/test');
const { ORIGINAL, GRADE, open, setLevel, startGame } = require('./helpers');

test('capture screenshots', async ({ page }, info) => {
  test.setTimeout(300_000);
  const dir = `test-results/shots/${info.project.name}`;
  await open(page);
  await page.screenshot({ path: `${dir}/00-start.png` });
  await page.evaluate(() => window.DoodleRocket.hub());
  for (let i = 0; i < 8; i++) {
    await page.evaluate(i => { window.DoodleRocket.S.page = i; window.DoodleRocket.hub(); }, i);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${dir}/01-hub-${i}.png` });
  }
  for (const [level, keys] of [['sprout', ORIGINAL], ['captain', ORIGINAL], ['g1', GRADE], ['g2', GRADE], ['g3', GRADE]]) {
    await setLevel(page, level);
    for (const key of keys) {
      await startGame(page, key);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${dir}/${level}-${key}.png` });
    }
  }
});
