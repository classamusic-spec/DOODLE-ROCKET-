// Content checks: every question bank is well formed, and every generated question is answerable.
// Runs once (phone project only) since it doesn't depend on layout.
const { test, expect } = require('@playwright/test');
const { open, noErrors } = require('./helpers');

test.beforeEach(({}, info) => test.skip(info.project.name !== 'phone', 'layout-independent'));

// CONFUSED (grades 3–5) and ROOTS (grades 4–5) only cover the grades that teach them.
const GRADES = { CONFUSED: [3, 4, 5], ROOTS: [4, 5] };
const QUIZ_BANKS = ['SPACEQ', 'LIFESCI', 'EARTHSCI', 'PHYSSCI', 'GEO', 'CIVICS', 'HISTORY', 'VOCAB', 'GRAMMAR', 'PUNCT', 'CONFUSED', 'ROOTS'];

test('every quiz bank item has a question, one right answer, distinct choices and a why line', async ({ page }) => {
  await open(page);
  const problems = await page.evaluate(([banks, only]) => {
    const C = window.DoodleRocket.CONTENT, out = [];
    const checkItem = (where, it) => {
      const bad = [];
      if (!it.q || typeof it.q !== 'string') bad.push('no q');
      if (it.a == null || String(it.a).trim() === '') bad.push('no a');
      if (!Array.isArray(it.w) || it.w.length < 2 || it.w.length > 3) bad.push('w must have 2-3 items');
      const all = [it.a, ...(it.w || [])].map(x => String(x).trim().toLowerCase());
      if (new Set(all).size !== all.length) bad.push('duplicate choices');
      if (!it.why || /^yes\b/i.test(it.why)) bad.push('missing or "Yes"-prefixed why');
      if (/undefined|NaN/.test(JSON.stringify(it))) bad.push('bad text');
      if (bad.length) out.push(`${where}: ${bad.join(', ')} :: ${JSON.stringify(it).slice(0, 140)}`);
    };
    for (const name of banks) {
      const b = C[name];
      if (!b) { out.push(`${name} missing`); continue; }
      for (const g of only[name] || [1, 2, 3, 4, 5]) {
        const list = b[g] || [];
        if (list.length < 6) out.push(`${name} grade ${g}: only ${list.length} items`);
        const seen = new Set();
        list.forEach((it, i) => { checkItem(`${name}[${g}][${i}]`, it); if (seen.has(it.q + '|' + (it.s || ''))) out.push(`${name}[${g}][${i}] repeated question`); seen.add(it.q + '|' + (it.s || '')); });
      }
    }
    for (const g of [1, 2, 3, 4, 5]) {
      const ps = C.READ[g] || [];
      if (ps.length < 5) out.push(`READ grade ${g}: only ${ps.length} passages`);
      ps.forEach((p, i) => {
        if (!p.title || !p.text || p.text.length < 60) out.push(`READ[${g}][${i}] short or untitled`);
        if (!Array.isArray(p.qs) || p.qs.length < 2) out.push(`READ[${g}][${i}] needs 2 questions`);
        (p.qs || []).forEach((it, j) => checkItem(`READ[${g}][${i}].qs[${j}]`, it));
      });
    }
    for (const g of Object.keys(C.SPELL)) C.SPELL[g].forEach((r, i) => {
      if (r.length !== 3 || new Set(r).size !== 3) out.push(`SPELL[${g}][${i}] ${r}`);
    });
    for (const g of Object.keys(C.LAB)) C.LAB[g].forEach(([word, at, len, ch], i) => {
      if (!ch.includes(word.substr(at, len)) || new Set(ch).size !== ch.length) out.push(`LAB[${g}][${i}] ${word}`);
    });
    C.AFFIX.forEach((it, i) => { if (!it.m || !it.a || !it.why || it.w.includes(it.a)) out.push(`AFFIX[${i}]`); });
    for (const g of Object.keys(C.SIGHT)) if (new Set(C.SIGHT[g]).size !== C.SIGHT[g].length) out.push(`SIGHT[${g}] has repeats`);
    return out;
  }, [QUIZ_BANKS, GRADES]);
  expect(problems, problems.join('\n')).toEqual([]);
  noErrors(page);
});

test('every question generator makes answerable questions at grades 1–5', async ({ page }) => {
  test.setTimeout(180_000);
  await open(page);
  const problems = await page.evaluate(() => {
    const D = window.DoodleRocket, out = [];
    for (const [k, G] of Object.entries(D.GAMES)) {
      if (!G.gen) continue;
      for (const g of [1, 2, 3, 4, 5]) {
        for (let i = 0; i < 200; i++) {
          let q; try { q = G.gen(g); } catch (e) { out.push(`${k} g${g}: threw ${e.message}`); break; }
          if (q == null) break;
          const ch = q.choices.map(String), bad = [];
          if (!ch.includes(String(q.answer))) bad.push('answer not in choices');
          if (new Set(ch).size !== ch.length) bad.push('duplicate choices');
          // "8" and "8.0" (or "0.50" and ".5") would both be right
          const nums = ch.filter(c => /^-?\d*\.?\d+$/.test(c)).map(Number);
          if (new Set(nums).size !== nums.length) bad.push('numerically equal choices');
          if (ch.length < 2) bad.push('fewer than 2 choices');
          const blob = JSON.stringify([q.cap, q.spoken, q.answer, ch, q.explain]);
          if (/undefined|NaN|null|Infinity|\[object/.test(blob)) bad.push('bad text');
          if (!q.cap || !q.explain) bad.push('missing caption or explain');
          if (bad.length) { out.push(`${k} g${g}: ${bad.join(', ')} :: ${blob.slice(0, 200)}`); break; }
        }
      }
    }
    return out;
  });
  expect(problems, problems.join('\n')).toEqual([]);
  noErrors(page);
});
