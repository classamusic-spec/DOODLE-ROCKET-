# Doodle Rocket — notes for Claude Code

Doodle Rocket is a hand-drawn space learning game. It covers math, literacy, and space science for ages 2–5, with an extension for Grades 1–3. It's a working prototype that we're growing into a shippable app.

- **The app:** `app/index.html`. One self-contained file with HTML, CSS, inline SVG, and vanilla JS. No build step and no framework.
- **The product plan:** `docs/PLAN.md`. Covers audience, design pillars, art direction, curriculum, and roadmap.
- **How the code works:** `docs/ARCHITECTURE.md`.
- **What to build next:** `docs/BACKLOG.md`. Work in priority order unless told otherwise.

## Commands

```bash
npm install
npx playwright install chromium   # first time only
npm run check                     # syntax-check the inline script
npm test                          # syntax check + all Playwright tests (phone + tablet)
npm run shots                     # screenshot every hub page and every game → test-results/shots/
npm start                         # serve app/ at http://localhost:5173 (or just open app/index.html)
```

Test hooks built into the app:
- `?speed=12` makes every `wait()`, `tween()`, and muted `say()` run 12× faster.
- `?mute` turns off voice and sound.
- `window.DoodleRocket` exposes `{startGame, hub, startScreen, S, GAMES, PAGES, LEVELS}`.
- In quiz-style games, `DoodleRocket.S.q` holds the current question (`q.answer` is the correct choice).

## Definition of done for any change

1. `npm test` passes on both projects (phone 390×800, tablet 1024×700).
2. If you touched layout or art, run `npm run shots` and look at the affected screenshots yourself. Check both phone and tablet. Nothing may be clipped, overlapping, or off-screen, and tap targets must stay big.
3. New games or content come with tests. Quiz-style games are covered automatically once added to `GRADE` in `tests/helpers.js`. Other games need a playthrough test that uses a hook like `S.q`.
4. Update `docs/BACKLOG.md` (tick the item, note anything you found) and, if the scope changed, section 15 of `docs/PLAN.md`.
5. Make one focused commit per backlog item.

## Product rules (these are requirements, not style preferences)

- **No wrong turns.** Never add fail states, lives, timers, countdowns to failure, red X's, or buzzers. A wrong answer gets a wiggle, a gentle `sfx.boop()`, and a spoken hint. After 2 misses, the right answer pulses (`choose()` and `quiz()` already do this).
- **Voice first.** Every instruction is spoken with `say()`/`prompt()`, and the caption shows the short version. Children aged 2–5 can't read, so a game must be playable with the sound on and the eyes on the pictures.
- **Symbols stay steady.** Letters and numbers a child is learning use `FONT_CLEAR` (Andika) and must never sit inside a `sketch()` boil group or get a wobble filter. Titles and labels can use `FONT_HAND` (Gaegu).
- **Big targets.** Anything a toddler taps needs a hit area of at least ~64 px. An invisible `el('circle', {r, fill:'transparent'})` inside `.core` is the usual trick. Grade levels can go a little smaller, but not under 48 px.
- **Calm and private.** No ads, analytics, trackers, external network calls, accounts, or purchases. Only the Google Fonts link is external, and self-hosting it is on the backlog. Saved progress stays on the device.
- **Respect `prefers-reduced-motion`.** The boil loop and CSS animations already switch off under reduced motion. New motion must do the same.
- **Content accuracy.** Space facts use hedged numbers ("about 8 minutes"). Check them against NASA Space Place before adding. Reading passages are original, answerable from the text, and grade-appropriate. Every quiz item needs an `explain` line.

## Code conventions and gotchas

- **Stale-screen guard.** Every screen change bumps `sid`. Game code gets `alive()`, and every `await` in game code must be followed by `if (!alive()) return;`. Skipping this is the #1 source of ghost audio and animation bugs.
- **Game contract.** `play(alive)` returns a Promise that resolves when one round is won. The runner (`startGame`) handles rounds, progress dots, the between-round burst, and the celebration. `G.init()` runs once per game to seed `S.data`. `G.rounds` may be a number or a function.
- **Layers.** `#world` (SVG) holds game art, `#ui` (HTML) holds buttons, captions, and overlays. `newScreen()` clears both. In-game SVG space runs from `TOP` (132) down to the bottom of the viewport.
- **Layout.** Layout is computed from `W`/`H` at render time. The app re-renders the current screen on resize (`startGame(key, true)` resumes the round). Always branch on `land = W > H*1.05` when phone and tablet layouts differ, and clamp every size.
- **Drawing.**
  - `sketch(parent, d, opts)` draws the hand-drawn look: fill, hatch, double stroke, and boil. Use `line()` for straight strokes, because the boil filter clips pure horizontal or vertical lines.
  - `thing(parent, x, y)` makes a movable object with `.x/.y/.s/.r` and `.place()`.
  - `interact(thing, {onTap, drag, onDrop, label})` makes it tappable, keyboard-accessible, and gives it an aria label.
- **`startGame()` never settles until the game ends.** In tests, call it with `void`, never `await`.
- **Keep one file for now.** Keep `app/index.html` self-contained until the "Split into modules" backlog item is done. Don't add npm runtime dependencies.
- **Listener cleanup.** A few games attach `window` listeners (trace, doodle). They clean up lazily through `alive()`. See the backlog item about a proper per-screen cleanup registry before adding more.
