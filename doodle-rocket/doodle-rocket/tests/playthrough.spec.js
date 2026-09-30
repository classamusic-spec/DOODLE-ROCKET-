// Plays every Grade 1–5 game start to finish at every grade, reading the right answer from DoodleRocket.S.q
// after one deliberate wrong answer per game (to exercise the hint path). Passes when the sticker screen shows.
const { test, expect } = require('@playwright/test');
const { GRADE, NEW_LITTLE, open, setLevel, startGame, autoplay, noErrors } = require('./helpers');

for (const key of GRADE) {
  test(`${key} plays to the sticker at grades 1–5`, async ({ page }) => {
    test.setTimeout(240_000);
    await open(page);
    for (const level of ['g1', 'g2', 'g3', 'g4', 'g5']) {
      await setLevel(page, level);
      const before = await page.evaluate(() => window.DoodleRocket.S.stickers.length);
      await startGame(page, key);
      expect(await autoplay(page, { wrongFirst: true }), `${key} at ${level}`).toBe(true);
      expect(await page.evaluate(() => window.DoodleRocket.S.stickers.length)).toBe(before + 1);
    }
    noErrors(page);
  });
}

for (const key of NEW_LITTLE) {
  test(`${key} plays to the sticker at both little levels`, async ({ page }) => {
    await open(page);
    for (const level of ['sprout', 'captain']) {
      await setLevel(page, level);
      await startGame(page, key);
      expect(await autoplay(page), `${key} at ${level}`).toBe(true);
    }
    noErrors(page);
  });
}
