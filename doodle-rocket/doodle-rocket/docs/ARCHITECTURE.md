# Architecture

Everything lives in `app/index.html` (about 2,500 lines). The script is one IIFE in strict mode, split into sections by banner comments (`/* ===== Section ===== */`). Search for the banner names below. Line numbers drift, so they aren't listed here.

## Page structure

```
<svg id="stage">           full-screen SVG, viewBox = 0 0 W H (CSS pixels)
  <defs>                   boil filters #w0 #w1 #w2 (turbulence + displacement), #hatch pattern
  <g id="sky">             scribbled crayon sky + stars (drawSky, redrawn on resize)
  <g id="world">           everything on the current screen
<div id="grain">           paper-grain overlay (CSS background noise)
<div id="ui">              HTML layer: captions, buttons, answer cards, overlays
```

## Section map

| Banner | What's in it |
|---|---|
| Helpers | `el`, `rnd`, `pick`, `shuffle`, `clamp`, `wait`, `tween`, easing functions, `SPEED`/`?mute` test hooks |
| Hand-drawn shape primitives | `blob`, `ovalD`, `starD`, `rrD`, `heartD`, `hexD`, `triD` (return path `d` strings with jitter), `SHAPE`/`SHAPE_WH`, `sketch`, `drawShape`, `at`, `txt`, `line`; the 165 ms boil loop |
| Things | `thing`, `appear`, `wiggle`, `pop`, `flyTo`, `interact`, `choose`, `rowXs`, `cardBg`, `picCard`, `shapeCard`, `scatter` |
| Characters & doodle library | `face`, `drawRocket`, `drawCookie`, `drawPlanet`, `moonPhase`, `ART` (SUN/STAR/MOON/MARS), `DOODLE` (about 23 picture-word drawings), `drawPip`, `drawSticker` |
| Sound & voice | WebAudio `tone`/`noise`, `sfx.*`, speechSynthesis `say()`, `LETTER` names, `NUMW` number words |
| UI chrome | `ICON` SVG strings, `caption`, `prompt`, `gameChrome`, `setProg`, `askNumber` |
| Screens | `newScreen`, `drawSky`, `burst`, `startScreen` (level picker), `GAMES` registry, `PAGES`, `hub`, `flip`, swipe handling, `startGame` runner |
| MATH / LITERACY / SPACE GAMES | the 21 original games (ages 2–5) |
| GRADES 1–3 | `LEVELS`, `gr()`, `setLevel`, `mc`, `fresh`, the `quiz()` engine, drawing helpers (`tenFrames`, `drawClock`, `drawCoin`, `drawPizza`, `speakerPlanet`), and 12 question generators or games |
| Celebration, parent gate, settings | `celebrate`, `gearButton` (3 s hold), `openPanel` |
| Boot & resize | `layout`, debounced resize re-render, `window.DoodleRocket` |

## State

```js
S = {
  level: 'sprout' | 'captain' | 'g1' | 'g2' | 'g3',
  age:   'little' | 'big',        // legacy flag the original 21 games read; setLevel() keeps it in sync
  sound, voice, name,             // grown-up settings
  stickers: [],                   // {type, rot} or {type:'doodle', strokes}
  page, screen, gameKey, round,
  data: {},                       // per-game scratch, reset by startGame() and seeded by G.init()
  q, repeat,                      // current quiz question / "say it again" callback
}
```

Nothing is saved yet, and a reload resets everything (see the backlog).

## Screen lifecycle and the `alive()` guard

`newScreen(name)` increments `sid`, clears `#world` and `#ui`, cancels speech, and fades in. Any async code started on a screen captures `my = sid` and checks `alive = () => my === sid` after every `await`. Resize calls the screen function again, and a game resumes at the same `S.round`.

## The game contract

```js
GAMES.key = {
  name, color, icon,        // hub planet: icon is a DOODLE key, 't:TEXT', or (g, r) => draw
  sticker,                  // reward sticker type (DOODLE key, 'star', 'letter')
  rounds: 3,                // number or () => number
  init() {},                // optional: seed S.data once per game
  play(alive) {}            // returns a Promise that resolves when ONE round is won
}
PAGES = [{name, games:[keys], grade?:true}, ...]
```

`startGame(key)` draws the chrome (home button, progress dots, `#answers` container), loops `play()` for each round, then calls `celebrate()`.

## Two ways to build a game

**1. Custom interactive (ages 2–5 style).** Draw things into `world`, make them tappable with `interact()`, use `choose()` for "tap the right one", and use `askNumber()` for "how many?" number cards. For examples, see `playShapes` (a simple pick) and `playFeed` (drag with a tap fallback).

**2. Quiz (Grades 1–3 style).** Write a generator that returns a question object and pass it to `quiz()`:

```js
{
  key,                  // de-dupe key; fresh() avoids repeats within a game
  cap, spoken,          // caption text and what Pip says
  answer, choices,      // strings; choices must include answer (use mc(answer, candidates, n))
  explain,              // one-sentence "why", spoken after a right answer
  hint(choice),         // optional spoken hint after a wrong pick
  draw(world, A),       // optional picture; A = {x, y, w, h, top, bottom} is the free area above the answers
  onRight(), onMiss(n), // optional reactions
  quietCap              // true = don't show the hint text (e.g., spelling games where it would give the answer away)
}
```

Register it like this: `play: a => quiz(a, fresh(() => qMyGen(gr())))`, with `rounds: 5`, and add the key to a page and to `GRADE` in `tests/helpers.js`. The playthrough test covers it automatically.

## Art rules in code

- Use `sketch()` for anything that should look crayon-drawn (it boils). Use plain `el()`/`line()` for crisp elements and straight lines.
- Colors come from `C` (the palette in PLAN.md section 4). Don't add new hex values casually.
- Put learnable glyphs in `txt(..., {hand:false})` (Andika), outside any boil group.

## Testing

- `tests/smoke.spec.js` covers boot, the level picker, all 8 hub pages, every game loading at every level, and the parent gate.
- `tests/playthrough.spec.js` plays all 12 grade games at Grades 1, 2 and 3 to the sticker, including one wrong answer per game.
- `tests/screenshots.spec.js` captures every screen for visual review (`npm run shots`).

What's not covered yet: full playthroughs of the 21 original games (see the backlog).
