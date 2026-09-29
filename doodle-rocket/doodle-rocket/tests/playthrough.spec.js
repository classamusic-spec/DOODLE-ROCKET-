// Plays every Grade 1–3 game start to finish by picking the right answer (read from DoodleRocket.S.q),
// after one deliberate wrong answer per game to exercise the hint path. Passes when the sticker screen shows.
const { test, expect } = require('@playwright/test');
const { GRADE, open, setLevel, startGame, noErrors } = require('./helpers');

async function answerQuiz(page) {
  const answer = await page.evaluate(() => window.DoodleRocket.S.q && window.DoodleRocket.S.q.answer);
  if (answer == null) return false;
  const btn = page.locator('#answers button.ans', { hasText: new RegExp(`^${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) });
  if (!(await btn.count())) return false;
  await btn.first().click({ force: true });
  return true;
}
async function buildPlaceValue(page) {
  const T = await page.evaluate(() => window.DoodleRocket.S.data.lastT);
  const parts = [['+ hundred', Math.floor(T / 100)], ['+ ten', Math.floor(T / 10) % 10], ['+ one', T % 10]];
  for (const [label, n] of parts) {
    const b = page.locator('#answers button', { hasText: label });
    if (!(await b.count())) continue;
    for (let i = 0; i < n; i++) { await b.click({ force: true }); await page.waitForTimeout(40); }
  }
}

for (const level of ['g1', 'g2', 'g3']) {
  for (const key of GRADE) {
    test(`${level} · ${key} plays to the sticker`, async ({ page }) => {
      await open(page);
      await setLevel(page, level);
      const before = await page.evaluate(() => window.DoodleRocket.S.stickers.length);
      await startGame(page, key);
      let triedWrong = false;
      for (let step = 0; step < 60; step++) {
        if (await page.locator('#party').count()) break;
        await page.waitForTimeout(150);
        const quizMode = !(key === 'placevalue' && level !== 'g3');
        if (quizMode) {
          if (!triedWrong) {
            const answer = await page.evaluate(() => window.DoodleRocket.S.q && window.DoodleRocket.S.q.answer);
            const wrong = page.locator('#answers button.ans:not([disabled])').filter({ hasNotText: answer || '§' });
            if (answer && await wrong.count()) { await wrong.first().click({ force: true }); triedWrong = true; await page.waitForTimeout(250); }
          }
          await answerQuiz(page);
        } else if (await page.locator('#answers button').count()) {
          await buildPlaceValue(page);
        }
        await page.waitForTimeout(250);
      }
      await expect(page.locator('#party')).toBeVisible();
      expect(await page.evaluate(() => window.DoodleRocket.S.stickers.length)).toBe(before + 1);
      noErrors(page);
    });
  }
}
