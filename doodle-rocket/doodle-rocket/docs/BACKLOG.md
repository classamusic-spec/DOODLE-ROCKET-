# Backlog

Work top to bottom. Each item lists why it matters, what to build, and how to tell it's done. Tick items off (`[x]`) as you finish them and add a short note about anything you learned.

Current state (v0.4): 60 games including Doodle Pad, 7 levels (Ages 2–3 through Grade 5), 15 worlds in two galaxies, explorer profiles with saved progress, a daily trip, a sticker book, a grown-ups progress page, and offline PWA install. `npm test` runs 112 tests across phone and tablet (smoke, playthroughs at every grade, app flows, content validation, PWA). All pass.

---

## P0 — Harden the prototype

- [x] **1. Save progress on the device.**
  - **Why:** everything resets on reload, and families will notice right away.
  - **What:** persist `stickers`, `level`, `name`, `sound`, `voice`, and `page` to `localStorage` under one versioned key (`doodle-rocket:v1`). Wrap every read and write in try/catch, since private mode and blocked storage must still work. Load on boot, and save after each change and after `celebrate()`. Add a "Reset progress" button (with a confirm step) in the grown-up panel.
  - **Done when:** a test reloads the page and sees stickers and level restored, and a test with storage throwing still boots.
  - **Done (v0.4):** `doodle-rocket:v1` holds settings plus multiple explorer profiles (name, color, level, per-subject levels, stickers, stats, trip). Reset lives in Grown-ups → Players. `tests/app.spec.js` covers reload persistence and blocked storage.

- [x] **2. Per-screen cleanup registry.**
  - **Why:** trace, doodle, and hub swipe add `window` listeners that only clean up lazily. Timers from `setTimeout` can also fire after leaving a screen.
  - **What:** add `onLeave(fn)`, which `newScreen()` calls for the previous screen. Convert the existing `addEventListener('pointermove'…)` sites to use it.
  - **Done when:** after visiting every game and returning home, `getEventListeners(window)` (checked in a DevTools-protocol test) holds no game listeners.
  - **Done (v0.4):** `onLeave`/`listen`/`every`/`later` in Helpers; `newScreen()` runs the previous screen's cleanups. The DevTools-protocol listener test is still to write.

- [ ] **3. Crater hop layout on phones.**
  - **Why:** in portrait at 390 px wide, the craters, numbers, and Pip come out too small for toddlers.
  - **What:** in portrait, use fewer craters (0–5 for Sprouts, 0–7 for Captains), or wrap the number line, and scale Pip up.
  - **Done when:** the phone screenshot shows crater numbers at 24 px or larger and hit areas at 56 px or larger.

- [ ] **4. Playthrough tests for the 21 original games.**
  - **What:** expose a test hook per game (for example, `S.q = {target}`, or the right `thing` exposed on `S.data`) and write specs that tap or drag to completion at Sprout and Captain levels.
  - **Done when:** every original game reaches the sticker screen in CI on both projects.

- [x] **5. Self-host fonts.**
  - **What:** Andika and Gaegu are both SIL OFL. Add `.woff2` subsets under `app/fonts/` and switch to `@font-face`, keeping the fallbacks. This is required for offline use and removes the only external request.
  - **Done when:** the app renders with the right fonts when the network is blocked in Playwright.
  - **Done (v0.4):** Andika 400/700 and Gaegu 700 latin woff2 subsets in `app/fonts/` with their OFL licences. `tests/pwa.spec.js` checks the fonts load while offline.

- [x] **6. Visual QA pass.**
  - **What:** run `npm run shots` and review every image on phone and tablet. Fix clipping and overlap, keep the caption from colliding with the home or speaker buttons on narrow phones, and make sure long answer buttons wrap cleanly.
  - **Done when:** a written list of findings is resolved, with before and after screenshots noted in the commit.
  - **Done (v0.4):** Reviewed phone, tablet and a new desktop (1440×900) project. Fixed: editor fold on phones, hub arrows over labels, dots labels off-screen, sentence cards overflowing, reader question below the fold, elapsed-time clocks overflowing, 6-digit compare numbers spilling out of their planets, number-line end labels clipped. Large screens now scale the play frame (UIS).

## P1 — Core systems from the plan

- [x] **7. Content as data.**
  - **What:** move word lists, question banks (`SPACEQ`, `READ`, `SIGHT`, `SPELL`, `LAB`, `AFFIX`, `RHYMES`, `SYL`, `PL8`), and per-level parameters into one `CONTENT` object with a documented schema. Games read from it. Add a test that validates the schema: every quiz item has an answer that appears in its choices and an explanation.
  - **Done when:** educators can edit content without touching game logic.
  - **Done (v0.4):** All banks live in `CONTENT` with the schema documented at the top of the section and in ARCHITECTURE.md; `tests/content.spec.js` validates every item and every math generator.

- [ ] **8. Adaptive mastery engine (PLAN section 7).**
  - **What:** track per-skill attempts (skill IDs such as `count.1-5`, `add.20`, `clock.half`). Treat a skill as mastered at about 80% first-try success across 2 sessions. Step difficulty within a level up or down, and resurface mastered skills for spaced review. The Grown-up level choice sets the starting point, and the engine adjusts from there.
  - **Done when:** unit tests on the engine (pure functions, no DOM) cover promotion, demotion, and review scheduling.

- [x] **9. Daily trip (PLAN section 8).**
  - **What:** the Play button starts a trip of 3 games picked by the engine. After the third, Pip yawns and parks the rocket, and the hub shows "See you tomorrow!" with a gentle wind-down. Free play stays open, but the grown-up panel can switch it off.
  - **Done when:** a test covers the trip flow and the grown-up toggle.
  - **Done (v0.4):** `tripScreen`/`ensureTrip`: 3 stops per explorer per day (length set in Grown-ups), balanced by subject and favouring least-played games; a medal sticker and Pip's goodnight at the end. Covered in `tests/app.spec.js`. Free play stays open.

- [ ] **10. Map progression.**
  - **What:** pages unlock as the child plays (a sticker threshold or engine signal), with an unlock celebration. The grown-up panel has "Open all pages." Grade pages are open by default for grade levels.
  - **Partly done (v0.4):** worlds are organised into a Little Explorer and a Big Kid galaxy, and a grown-up setting lets little explorers visit the Big Kid worlds too. Unlocking with a celebration is not built.

- [x] **11. Grown-up progress page.**
  - **What:** a plain-language summary for each strand ("Counting to 10: got it", "Short vowels: practicing"), taken from engine data, plus a time-played-today figure. It sits behind the same 3-second gate.
  - **Done (v0.4):** Grown-ups → Progress: minutes today/this week, stickers, games finished, and per subject and game a mastery label (Just started / Practicing / Almost there / Got it!) with an off-screen activity idea.

- [ ] **12. Explorers band (ages 3–4).**
  - **What:** add the middle band from PLAN section 1 as a sixth level, and give each original game an Explorers setting between little and big.

- [ ] **13. Recorded voice-over pipeline.**
  - **What:** give every spoken line an ID (`vo.feed.intro`). `say()` plays the recorded clip if one is present (an audio sprite or per-file), otherwise it falls back to TTS. Add a script that exports every line to a CSV for the voice actor. TTS pronunciation of letter names and phonemes (`SOUND` map) is the weakest part of the prototype.

## P2 — Production

- [ ] **14. Split into modules.**
  - **What:** move to Vite with vanilla ES modules (no UI framework): `core/` (draw, things, audio, runner), `games/` (one file per game), `content/`, and `screens/`. Keep a single-file build with `vite-plugin-singlefile`, so sharing one HTML file still works.
  - **Done when:** all tests pass unchanged against the built output.

- [x] **15. PWA / offline install.**
  - **What:** add a manifest, icons, and a service worker that caches everything. Make it installable on iPad and Android, and lock it to full screen.
  - **Done (v0.4):** `manifest.webmanifest` (full screen, any orientation), `sw.js` (precache + cache-first, network-first page loads), SVG/PNG/maskable/apple-touch icons. `tests/pwa.spec.js` reloads offline.

- [ ] **16. Accessibility pass.**
  - **What:**
    - Make every drag interaction also work by tap (most already do) and by keyboard.
    - Make sort-by-color use shape plus color, so it's color-blind safe.
    - Add a captions-size option.
    - Test with VoiceOver and TalkBack.
    - Check the contrast of text on `C.space`.
  - **Partly done (v0.4):** big-text and calm-mode settings, keyboard access for every `interact()` target, and aria labels on answer buttons. VoiceOver/TalkBack testing and colour-blind sort are still open.

- [ ] **17. Performance on low-end tablets.**
  - **What:** profile the boil filter (SVG displacement on many groups is expensive). Offer auto-degrade, which stops the boil when frame time runs over 20 ms, and cap `DOODLE` complexity.
  - **Done when:** there's a written benchmark on a throttled-CPU Playwright run.
  - **Partly done (v0.4):** one shared boil filter instead of three, and auto-degrade (`goLowPower`) that stops the boil when frames run slow. The written throttled-CPU benchmark is still open.

- [ ] **18. Localization.**
  - **What:** add a string table and Spanish first (voice, captions, and word lists need real localization, not translation: rhymes, first sounds, and syllables change per language). Localize currency for Moon money.

- [ ] **19. Grade content depth.**
  - **What:** grow each grade bank to 30+ items with no repeats in a week. Add a second question per reading passage. Add grade variants to a few original games (comets patterns with growing sequences, trace with lowercase and cursive for Grade 3).
  - **Partly done (v0.4):** Grades 4–5 added throughout; about 780 bank items across 12 banks, 39 passages with 2 questions each, and 7 new grade subjects (science strands, social studies, grammar, punctuation, vocabulary, sentence building). Banks are 12–20 items per grade, short of the 30+ target, and there are no week-long no-repeat guarantees yet.

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

- ~~Hub swipe and planet taps share `pointerdown`.~~ Fixed in v0.4: planets use `interact(…, {upTap:true})`, which activates on `pointerup` under a movement threshold.
- `speechSynthesis` voices vary a lot by device and browser, and letter-sound pronunciation (the `SOUND` map) is the least reliable part. Item 13 fixes this properly.
- ~~Place value port has no "take away" button.~~ Fixed in v0.4.
- The original 21 little games still have no autoplay hook, so only load tests cover them (item 4).
- A few grade screens are plain (for example "Which fraction is the same as 0.9?" has no picture). Add small visuals when content grows.
- The service worker's `VERSION` must be bumped by hand when app files change.
