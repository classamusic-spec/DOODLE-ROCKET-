const { expect } = require('@playwright/test');

const ORIGINAL = ['stars','feed','daynight','bigger','spell','shapes','moonmoods','suitup','parade','sounds','rhyme','clap',
  'quick','comets','trace','sort','countdown','hop','build','name','doodle'];
const GRADE = ['mathfacts','placevalue','skipcount','arrays','clock','coins','fractions','spacefacts','letterlab','sightwords','spellcheck','reader'];

/** Opens the app and records uncaught page errors on page.__errors. */
async function open(page, query = 'speed=12&mute') {
  page.__errors = [];
  page.on('pageerror', e => page.__errors.push(String(e)));
  await page.goto(`${process.env.APP_URL}?${query}`);
  await page.waitForFunction(() => !!window.DoodleRocket);
}
async function setLevel(page, level) {
  await page.evaluate(l => {
    const S = window.DoodleRocket.S;
    S.level = l; S.age = l === 'sprout' ? 'little' : 'big';
  }, level);
}
async function startGame(page, key) {
  // startGame returns a promise that only settles when the game ends, so don't await it.
  await page.evaluate(k => { void window.DoodleRocket.startGame(k); }, key);
}
function noErrors(page) { expect(page.__errors, page.__errors.join('\n')).toEqual([]); }

module.exports = { ORIGINAL, GRADE, open, setLevel, startGame, noErrors };
