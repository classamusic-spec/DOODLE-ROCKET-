const { expect } = require('@playwright/test');

// Ages 2–5 games. NEW_LITTLE expose an S.q.answer hook, so they can be autoplayed to the sticker.
const ORIGINAL = ['stars','feed','daynight','bigger','spell','shapes','moonmoods','suitup','parade','sounds','rhyme','clap',
  'quick','comets','trace','sort','countdown','hop','build','name','doodle'];
const NEW_LITTLE = ['colormix','echo','feelings','weather','sinkfloat','senses','homes','memory','dots','hide','oddone'];
// Grades 1–5 games. All expose S.q.answer (quiz, place value, reader and sentence builder).
const GRADE = ['mathfacts','placevalue','skipcount','compare','arrays','fractions','geometry','story','clock','coins','measure','graphs',
  'letterlab','sightwords','spellcheck','vocab','reader','grammar','punct','builder','spacefacts','lifesci','physsci','earthsci','geo','maps','civics','history'];

/** Opens the app and records uncaught page errors on page.__errors. */
async function open(page, query = 'speed=12&mute') {
  page.__errors = [];
  page.on('pageerror', e => page.__errors.push(String(e)));
  await page.goto(`${process.env.APP_URL}?${query}`);
  await page.waitForFunction(() => !!window.DoodleRocket);
}
async function setLevel(page, level) {
  await page.evaluate(l => window.DoodleRocket.setLevel(l), level);
}
async function startGame(page, key) {
  // startGame returns a promise that only settles when the game ends, so don't await it.
  await page.evaluate(k => { window.DoodleRocket.S.inTrip = false; void window.DoodleRocket.startGame(k); }, key);
}
/** Taps whatever S.q.answer names (an #answers button by data-v, or a world object by aria-label, via Enter). */
async function answerOnce(page) {
  return page.evaluate(() => {
    const q = window.DoodleRocket.S.q, a = q && q.answer;
    if (a == null) return false;
    const b = [...document.querySelectorAll('#answers button')].find(x => x.dataset.v === String(a) && !x.disabled);
    if (b) { b.click(); return true; }
    const g = [...document.querySelectorAll('#world [role=button]')].find(x => x.getAttribute('aria-label') === String(a));
    if (g) { g.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return true; }
    return false;
  });
}
/** Plays the current game to its sticker; optionally taps one wrong answer first. */
async function autoplay(page, { wrongFirst = false, steps = 200 } = {}) {
  let triedWrong = !wrongFirst;
  for (let i = 0; i < steps; i++) {
    if (await page.locator('#party').count()) return true;
    if (!triedWrong) {
      // one attempt only: games without .ans choice buttons (place value, builder) just skip the wrong tap
      triedWrong = true;
      await page.evaluate(() => {
        const q = window.DoodleRocket.S.q; if (!q || !q.choices) return false;
        const b = [...document.querySelectorAll('#answers button.ans')].find(x => x.dataset.v !== String(q.answer) && !x.disabled);
        if (b) { b.click(); return true; } return false;
      });
      await page.waitForTimeout(200);
      continue;
    }
    await answerOnce(page);
    await page.waitForTimeout(120);
  }
  return !!(await page.locator('#party').count());
}
function noErrors(page) { expect(page.__errors, page.__errors.join('\n')).toEqual([]); }

module.exports = { ORIGINAL, NEW_LITTLE, GRADE, open, setLevel, startGame, answerOnce, autoplay, noErrors };
