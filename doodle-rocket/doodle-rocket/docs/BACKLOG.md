# Backlog

Work top to bottom. Each item lists why it matters, what to build, and how to tell it's done. Tick items off (`[x]`) as you finish them and add a short note about anything you learned.

Current state (v0.3): 33 games plus Doodle Pad, 5 levels (Ages 2–3 through Grade 3), 8 hub pages. 88 tests run: 8 smoke tests and 36 Grade 1–3 playthroughs, each on phone and tablet. All pass.

---

## P0 — Harden the prototype

- [ ] **1. Save progress on the device.**
  - **Why:** everything resets on reload, and families will notice right away.
  - **What:** persist `stickers`, `level`, `name`, `sound`, `voice`, and `page` to `localStorage` under one versioned key (`doodle-rocket:v1`). Wrap every read and write in try/catch, since private mode and blocked storage must still work. Load on boot, and save after each change and after `celebrate()`. Add a "Reset progress" button (with a confirm step) in the grown-up panel.
  - **Done when:** a test reloads the page and sees stickers and level restored, and a test with storage throwing still boots.

- [ ] **2. Per-screen cleanup registry.**
  - **Why:** trace, doodle, and hub swipe add `window` listeners that only clean up lazily. Timers from `setTimeout` can also fire after leaving a screen.
  - **What:** add `onLeave(fn)`, which `newScreen()` calls for the previous screen. Convert the existing `addEventListener('pointermove'…)` sites to use it.
  - **Done when:** after visiting every game and returning home, `getEventListeners(window)` (checked in a DevTools-protocol test) holds no game listeners.

- [ ] **3. Crater hop layout on phones.**
  - **Why:** in portrait at 390 px wide, the craters, numbers, and Pip come out too small for toddlers.
  - **What:** in portrait, use fewer craters (0–5 for Sprouts, 0–7 for Captains), or wrap the number line, and scale Pip up.
  - **Done when:** the phone screenshot shows crater numbers at 24 px or larger and hit areas at 56 px or larger.

- [ ] **4. Playthrough tests for the 21 original games.**
  - **What:** expose a test hook per game (for example, `S.q = {target}`, or the right `thing` exposed on `S.data`) and write specs that tap or drag to completion at Sprout and Captain levels.
  - **Done when:** every original game reaches the sticker screen in CI on both projects.

- [ ] **5. Self-host fonts.**
  - **What:** Andika and Gaegu are both SIL OFL. Add `.woff2` subsets under `app/fonts/` and switch to `@font-face`, keeping the fallbacks. This is required for offline use and removes the only external request.
  - **Done when:** the app renders with the right fonts when the network is blocked in Playwright.

- [ ] **6. Visual QA pass.**
  - **What:** run `npm run shots` and review every image on phone and tablet. Fix clipping and overlap, keep the caption from colliding with the home or speaker buttons on narrow phones, and make sure long answer buttons wrap cleanly.
  - **Done when:** a written list of findings is resolved, with before and after screenshots noted in the commit.

## P1 — Core systems from the plan

- [ ] **7. Content as data.**
  - **What:** move word lists, question banks (`SPACEQ`, `READ`, `SIGHT`, `SPELL`, `LAB`, `AFFIX`, `RHYMES`, `SYL`, `PL8`), and per-level parameters into one `CONTENT` object with a documented schema. Games read from it. Add a test that validates the schema: every quiz item has an answer that appears in its choices and an explanation.
  - **Done when:** educators can edit content without touching game logic.

- [ ] **8. Adaptive mastery engine (PLAN section 7).**
  - **What:** track per-skill attempts (skill IDs such as `count.1-5`, `add.20`, `clock.half`). Treat a skill as mastered at about 80% first-try success across 2 sessions. Step difficulty within a level up or down, and resurface mastered skills for spaced review. The Grown-up level choice sets the starting point, and the engine adjusts from there.
  - **Done when:** unit tests on the engine (pure functions, no DOM) cover promotion, demotion, and review scheduling.

- [ ] **9. Daily trip (PLAN section 8).**
  - **What:** the Play button starts a trip of 3 games picked by the engine. After the third, Pip yawns and parks the rocket, and the hub shows "See you tomorrow!" with a gentle wind-down. Free play stays open, but the grown-up panel can switch it off.
  - **Done when:** a test covers the trip flow and the grown-up toggle.

- [ ] **10. Map progression.**
  - **What:** pages unlock as the child plays (a sticker threshold or engine signal), with an unlock celebration. The grown-up panel has "Open all pages." Grade pages are open by default for grade levels.

- [ ] **11. Grown-up progress page.**
  - **What:** a plain-language summary for each strand ("Counting to 10: got it", "Short vowels: practicing"), taken from engine data, plus a time-played-today figure. It sits behind the same 3-second gate.

- [ ] **12. Explorers band (ages 3–4).**
  - **What:** add the middle band from PLAN section 1 as a sixth level, and give each original game an Explorers setting between little and big.

- [ ] **13. Recorded voice-over pipeline.**
  - **What:** give every spoken line an ID (`vo.feed.intro`). `say()` plays the recorded clip if one is present (an audio sprite or per-file), otherwise it falls back to TTS. Add a script that exports every line to a CSV for the voice actor. TTS pronunciation of letter names and phonemes (`SOUND` map) is the weakest part of the prototype.

## P2 — Production

- [ ] **14. Split into modules.**
  - **What:** move to Vite with vanilla ES modules (no UI framework): `core/` (draw, things, audio, runner), `games/` (one file per game), `content/`, and `screens/`. Keep a single-file build with `vite-plugin-singlefile`, so sharing one HTML file still works.
  - **Done when:** all tests pass unchanged against the built output.

- [ ] **15. PWA / offline install.**
  - **What:** add a manifest, icons, and a service worker that caches everything. Make it installable on iPad and Android, and lock it to full screen.

- [ ] **16. Accessibility pass.**
  - **What:**
    - Make every drag interaction also work by tap (most already do) and by keyboard.
    - Make sort-by-color use shape plus color, so it's color-blind safe.
    - Add a captions-size option.
    - Test with VoiceOver and TalkBack.
    - Check the contrast of text on `C.space`.

- [ ] **17. Performance on low-end tablets.**
  - **What:** profile the boil filter (SVG displacement on many groups is expensive). Offer auto-degrade, which stops the boil when frame time runs over 20 ms, and cap `DOODLE` complexity.
  - **Done when:** there's a written benchmark on a throttled-CPU Playwright run.

- [ ] **18. Localization.**
  - **What:** add a string table and Spanish first (voice, captions, and word lists need real localization, not translation: rhymes, first sounds, and syllables change per language). Localize currency for Moon money.

- [ ] **19. Grade content depth.**
  - **What:** grow each grade bank to 30+ items with no repeats in a week. Add a second question per reading passage. Add grade variants to a few original games (comets patterns with growing sequences, trace with lowercase and cursive for Grade 3).

## P3 — Ship

- [ ] **20. Store packaging.**
  - **What:** wrap with Capacitor for iOS and Android.
  - **Kids-category compliance:**
    - no third-party SDKs
    - parental gate on external links
    - privacy policy
  - **Privacy:** COPPA and GDPR-K review (PLAN section 11).

- [ ] **21. Playtesting kit.**
  - **What:** add a hidden, grown-up-only "observer mode" that logs taps outside targets, hint-level usage, and time per round to a local downloadable JSON file, to support the PLAN section 14 protocol. It never sends anything anywhere.

---

## Known issues (small)

- Hub swipe and planet taps share `pointerdown`. Planet taps fire immediately, so a swipe that starts on a planet opens that game. Fix it by moving planet activation to `pointerup` with a movement threshold.
- `speechSynthesis` voices vary a lot by device and browser, and letter-sound pronunciation (the `SOUND` map) is the least reliable part. Item 13 fixes this properly.
- Place value port (Grades 1–2) has no "take away" button. Kids remove pieces by tapping them, but the caption only says so after they overshoot. A visible "take one away" control would be easier to discover.
