// Dev helper (not part of `npm test`): screenshots each listed game's first screen, then autoplays it to the
// sticker using the S.q.answer hook. Run: node tests/games.dev.js [phone|tablet] [level] game1,game2,...
const { chromium } = require('@playwright/test');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '../app/index.html');
const SIZES = { phone: { width: 390, height: 800 }, tablet: { width: 1024, height: 700 } };

async function answerOnce(page) {
  return page.evaluate(() => {
    const D = window.DoodleRocket, q = D.S.q, a = q && q.answer;
    if (a == null) return null;
    const b = [...document.querySelectorAll('#answers button')].find(x => x.dataset.v === String(a) && !x.disabled);
    if (b) { b.click(); return 'btn:' + a; }
    const g = [...document.querySelectorAll('#world [role=button]')].find(x => x.getAttribute('aria-label') === String(a));
    if (g) { g.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 'svg:' + a; }
    return 'miss:' + a;
  });
}

(async () => {
  const [size = 'phone', level = 'sprout', list = ''] = process.argv.slice(2);
  const keys = list.split(',').filter(Boolean);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: SIZES[size], hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(URL + '?speed=12&mute');
  await page.waitForFunction(() => !!window.DoodleRocket);
  for (const key of keys) {
    await page.evaluate(([k, l]) => { const D = window.DoodleRocket; D.setLevel(l); D.S.inTrip = false; void D.startGame(k); }, [key, level]);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/games/${size}/${level}-${key}.png` });
    let ok = false, last = '';
    for (let i = 0; i < 160; i++) {
      if (await page.locator('#party').count()) { ok = true; break; }
      const r = await answerOnce(page);
      if (r) last = r;
      await page.waitForTimeout(130);
    }
    console.log(`${level} ${key}: ${ok ? 'OK' : 'STUCK (last ' + last + ')'}`);
  }
  console.log(errs.length ? errs : 'no errors');
  await browser.close();
})();
