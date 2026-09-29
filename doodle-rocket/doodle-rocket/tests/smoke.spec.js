const { test, expect } = require('@playwright/test');
const { ORIGINAL, GRADE, open, setLevel, startGame, noErrors } = require('./helpers');

test('start screen shows the title, level picker and play button', async ({ page }) => {
  await open(page);
  await expect(page.locator('#play')).toBeVisible();
  await expect(page.locator('#levels .lvl')).toHaveCount(5);
  await page.locator('#levels .lvl', { hasText: 'Grade 2' }).click();
  expect(await page.evaluate(() => window.DoodleRocket.S.level)).toBe('g2');
  noErrors(page);
});

test('all eight map pages render', async ({ page }) => {
  await open(page);
  await page.locator('#play').click({ force: true });
  const n = await page.evaluate(() => window.DoodleRocket.PAGES.length);
  expect(n).toBe(8);
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => { window.DoodleRocket.S.page = i; window.DoodleRocket.hub(); }, i);
    await expect(page.locator('#world [role=button]').first()).toBeVisible();
  }
  noErrors(page);
});

for (const level of ['sprout', 'captain']) {
  test(`every original game loads (${level})`, async ({ page }) => {
    await open(page);
    await setLevel(page, level);
    for (const key of ORIGINAL) {
      await startGame(page, key);
      await page.waitForTimeout(250);
      await expect(page.locator('#cap')).toBeVisible();
    }
    noErrors(page);
  });
}

for (const level of ['g1', 'g2', 'g3']) {
  test(`every grade game loads (${level})`, async ({ page }) => {
    await open(page);
    await setLevel(page, level);
    for (const key of GRADE) {
      await startGame(page, key);
      await page.waitForTimeout(250);
      await expect(page.locator('#answers button').first()).toBeVisible();
    }
    noErrors(page);
  });
}

test('parent gate opens after a 3-second hold', async ({ page }) => {
  await open(page);
  await page.evaluate(() => window.DoodleRocket.hub());
  const box = await page.locator('#gear').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
  await expect(page.locator('#panel')).toBeVisible();
  noErrors(page);
});
