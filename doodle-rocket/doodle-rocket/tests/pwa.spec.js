// Installable and offline: serves app/ over http (service workers don't run on file://), waits for the
// service worker, then reloads with the network off. Runs on the phone project only.
const { test, expect } = require('@playwright/test');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '../app');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
let server, base;

test.beforeEach(({}, info) => test.skip(info.project.name !== 'phone', 'layout-independent'));
test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/`;
});
test.afterAll(() => server && server.close());

test('manifest and every icon it lists load', async ({ request }) => {
  const m = await (await request.get(base + 'manifest.webmanifest')).json();
  expect(m.name).toBe('Doodle Rocket');
  expect(m.icons.some(i => i.purpose === 'maskable')).toBe(true);
  for (const i of m.icons) expect((await request.get(base + i.src)).ok(), i.src).toBe(true);
  for (const f of ['icons/icon-32.png', 'icons/apple-touch-icon.png']) expect((await request.get(base + f)).ok(), f).toBe(true);
});

test('works offline after the first visit', async ({ page, context }) => {
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(base + '?mute');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).length)).toBeGreaterThan(0);
  await context.setOffline(true);
  await page.reload();
  await page.waitForFunction(() => !!window.DoodleRocket);
  await expect(page.locator('#play')).toBeVisible();
  // the self-hosted fonts come from the cache too
  expect(await page.evaluate(async () => (await document.fonts.load('20px Andika')).length)).toBeGreaterThan(0);
  await context.setOffline(false);
  expect(errs).toEqual([]);
});
