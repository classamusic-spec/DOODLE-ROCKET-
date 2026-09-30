// App flows outside the games: explorers, saved progress, blocked storage, the map, the daily trip,
// the sticker book and the grown-ups panel.
const { test, expect } = require('@playwright/test');
const { open, startGame, autoplay, noErrors } = require('./helpers');

/** Creates an explorer through the editor overlay. */
async function makeExplorer(page, name, level) {
  await page.evaluate(() => window.DoodleRocket.editProfile(null));
  await page.locator('#editor input').fill(name);
  await page.locator('#editor .opt', { hasText: level }).dispatchEvent('click');
  // taps are dispatched to the element itself: a coordinate click can land on the page-transition overlay
  await expect(page.locator('#editor .opt', { hasText: level })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#saveProfile').dispatchEvent('click');
  await expect(page.locator('#editor')).toHaveCount(0);
  // a new explorer flies to the galaxy map through the iris transition; let it land before moving on
  await expect.poll(() => page.evaluate(() => window.DoodleRocket.S.screen), { timeout: 15_000 }).toBe('map');
}

test('explorers can be created and switched, each with their own level', async ({ page }) => {
  await open(page);
  await makeExplorer(page, 'Ada', 'Grade 4');
  await makeExplorer(page, 'Bo', 'Ages 2–3');
  await page.evaluate(() => window.DoodleRocket.profilesScreen());
  await expect(page.locator('#profiles .pcard:not(.add)')).toHaveCount(2);
  await page.locator('#profiles .pcard', { hasText: 'Ada' }).dispatchEvent('click');
  await expect.poll(() => page.evaluate(() => [window.DoodleRocket.S.name, window.DoodleRocket.S.level])).toEqual(['ADA', 'g4']);
  noErrors(page);
});

test('progress survives a reload: stickers, level and explorer', async ({ page }) => {
  await open(page);
  await makeExplorer(page, 'Cy', 'Grade 3');
  await startGame(page, 'mathfacts');
  expect(await autoplay(page)).toBe(true);
  await page.evaluate(() => window.DoodleRocket.flush());
  await page.reload();
  await page.waitForFunction(() => !!window.DoodleRocket);
  const st = await page.evaluate(() => { const D = window.DoodleRocket, p = D.ensureProfile(); return [p.name, p.level, p.stickers.length, D.DB.profiles.length]; });
  expect(st).toEqual(['CY', 'g3', 1, 1]);
});

test('the app still boots and plays when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    const boom = () => { throw new Error('blocked'); };
    Storage.prototype.getItem = boom; Storage.prototype.setItem = boom;
  });
  await open(page);
  await expect(page.locator('#play')).toBeVisible();
  await page.evaluate(() => { window.DoodleRocket.setLevel('g2'); window.DoodleRocket.mapScreen(); });
  await startGame(page, 'compare');
  expect(await autoplay(page)).toBe(true);
  noErrors(page);
});

test('galaxy map opens a world hub', async ({ page }) => {
  await open(page);
  await makeExplorer(page, 'Di', 'Grade 1');
  await page.evaluate(() => window.DoodleRocket.mapScreen());
  await expect.poll(() => page.evaluate(() => window.DoodleRocket.S.screen), { timeout: 15_000 }).toBe('map');
  const w = page.locator('#world [role=button]').first();
  await w.dispatchEvent('keydown', { key: 'Enter' });
  await expect.poll(() => page.evaluate(() => window.DoodleRocket.S.screen), { timeout: 15_000 }).toBe('hub');
  expect(await page.locator('#world [role=button]').count()).toBeGreaterThanOrEqual(4);
  noErrors(page);
});

test("finishing today's trip awards the medal sticker", async ({ page }) => {
  test.setTimeout(180_000);
  await open(page);
  await makeExplorer(page, 'Ez', 'Grade 3');
  await page.evaluate(() => window.DoodleRocket.tripScreen());
  const keys = await page.evaluate(() => window.DoodleRocket.S.profile.trip.k);
  expect(keys.length).toBe(3);
  for (const k of keys) {
    await page.evaluate(k => { window.DoodleRocket.S.inTrip = true; void window.DoodleRocket.startGame(k); }, k);
    expect(await autoplay(page), k).toBe(true);
  }
  expect(await page.evaluate(() => window.DoodleRocket.S.profile.trip.done.length)).toBe(3);
  await page.evaluate(() => window.DoodleRocket.tripScreen());
  await expect.poll(() => page.evaluate(() => window.DoodleRocket.S.profile.stickers.filter(s => s.type === 'medal').length)).toBe(1);
  // revisiting the finished trip does not hand out a second medal
  await page.evaluate(() => window.DoodleRocket.tripScreen());
  expect(await page.evaluate(() => window.DoodleRocket.S.profile.stickers.filter(s => s.type === 'medal').length)).toBe(1);
  noErrors(page);
});

test('sticker book shows earned stickers', async ({ page }) => {
  await open(page);
  await makeExplorer(page, 'Fi', 'Grade 2');
  await page.evaluate(() => window.DoodleRocket.bookScreen());
  await expect(page.locator('#world [role=button]')).toHaveCount(0);
  await startGame(page, 'coins');
  expect(await autoplay(page)).toBe(true);
  await page.evaluate(() => window.DoodleRocket.bookScreen());
  await expect(page.locator('#world [role=button][aria-label^="Sticker"]')).toHaveCount(1);
  noErrors(page);
});

test('grown-ups panel: every tab renders', async ({ page }) => {
  await open(page);
  await makeExplorer(page, 'Gus', 'Grade 5');
  await page.evaluate(() => window.DoodleRocket.openPanel());
  await expect(page.locator('#panel')).toBeVisible();
  for (const t of ['Progress', 'Learning', 'Settings', 'Players', 'About']) {
    await page.locator('#panel .ptabs button', { hasText: t }).first().dispatchEvent('click');
    await expect(page.locator('#panel .ptabs button', { hasText: t }).first()).toHaveAttribute('aria-pressed', 'true');
  }
  await page.locator('#panel .x').dispatchEvent('click');
  await expect(page.locator('#panel')).toHaveCount(0);
  noErrors(page);
});
