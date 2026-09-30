const { test, expect } = require('@playwright/test');
const { ORIGINAL, NEW_LITTLE, GRADE, open, setLevel, startGame, noErrors } = require('./helpers');

test('title screen shows the logo and play button; first play opens the explorer editor', async ({ page }) => {
  await open(page);
  await expect(page.locator('#play')).toBeVisible();
  await page.locator('#play').click({ force: true });
  await expect(page.locator('#editor')).toBeVisible();
  await page.locator('#editor .opt', { hasText: 'Grade 2' }).click({ force: true });
  await page.locator('#saveProfile').click({ force: true });
  await expect(page.locator('#dock')).toBeVisible();
  expect(await page.evaluate(() => window.DoodleRocket.S.level)).toBe('g2');
  noErrors(page);
});

test('every world page renders its game planets', async ({ page }) => {
  await open(page);
  const n = await page.evaluate(() => window.DoodleRocket.PAGES.length);
  expect(n).toBe(15);
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => { window.DoodleRocket.S.page = i; window.DoodleRocket.hub(); }, i);
    await expect(page.locator('#world [role=button]').first()).toBeVisible();
    const planets = await page.locator('#world [role=button]').count();
    expect(planets).toBeGreaterThanOrEqual(4);
  }
  noErrors(page);
});

for (const level of ['sprout', 'captain']) {
  test(`every little game loads (${level})`, async ({ page }) => {
    await open(page);
    await setLevel(page, level);
    for (const key of [...ORIGINAL, ...NEW_LITTLE]) {
      await startGame(page, key);
      await page.waitForTimeout(250);
      await expect(page.locator('#cap')).toBeVisible();
    }
    noErrors(page);
  });
}

for (const level of ['g1', 'g3', 'g5']) {
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

test('grown-up gate opens after a 3-second hold', async ({ page }) => {
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
