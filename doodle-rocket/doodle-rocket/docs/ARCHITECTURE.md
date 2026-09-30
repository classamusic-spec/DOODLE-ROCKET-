# Architecture

Everything lives in `app/index.html` (about 6,300 lines). The script is one IIFE in strict mode, split into sections by banner comments (`/* ===== Section ===== */`). Search for the banner names below. Line numbers drift, so they aren't listed here.

Next to it:

```
app/fonts/                 self-hosted Andika + Gaegu woff2 subsets (SIL OFL, licences alongside)
app/icons/                 app icon (SVG + PNGs, including maskable and apple-touch)
app/manifest.webmanifest   PWA manifest (full screen, any orientation)
app/sw.js                  service worker: precaches everything, cache-first; page loads network-first
```

The service worker only registers over http(s). On `file://` the app runs the same, just without offline install. Add `?nosw` to skip registration.

## Page structure

```
<svg id="stage">           full-window SVG, viewBox = 0 0 VW VH
  <defs>                   one boil filter #wb (turbulence seed cycled by the boil loop), #hatch, nebula gradients
  <g id="sky">             scribbled crayon sky, nebulae, twinkling stars (drawSky, redrawn on resize)
  <g id="frame">           transform = translate(OX,0) scale(UIS)
    <g id="world">         everything on the current screen, laid out in W×H play-frame units
<div id="grain">           paper-grain overlay
<main id="ui">             HTML layer: captions, answer cards, dock, back/gear buttons (CSS-scaled by UIS)
<div id="modal">           overlays: explorer editor, grown-ups panel, celebration
<div id="fx">              transition iris and confetti
```

**The layout frame.** `VW×VH` is the whole window. `W×H` is the play frame that screens lay out in:
- It skips safe areas.
- Its aspect is capped at 2.1, and it is centred with offset `OX`.
- On large screens it is scaled up by `UIS`, so a 1440 px desktop looks like a big tablet rather than a sparse phone.

Pointer handlers use `px(e)` and `py(e)` to convert to frame units. `frameRect(el)` does the same for HTML elements. The constants `TOP` (under the title and caption) and `DOCK_H` (the bottom dock) bound the play area.

## Section map

| Banner | What's in it |
|---|---|
| Helpers | `el`, `h`, `rnd`, `pick`, `shuffle`, `clamp`, `wait`, `tween`, easing, `seeded`/`hashStr`, the per-screen cleanup registry (`onLeave`, `listen`, `every`, `later`), `px`/`py`/`frameRect` |
| Levels, storage, profiles & learning stats | `LEVELS` (sprout, captain, g1–g5), `setLevel`, `gr()`, versioned `localStorage` (`load`/`save`/`flush`), profiles (`newProfile`, `useProfile`, `ensureProfile`), stats (`noteStart`/`noteRound`/`noteWin`, `mastery`) |
| Hand-drawn shape primitives | `blob`, `ovalD`, `starD`, `rrD`, … (jittered path strings), `sketch`, `at`, `txt`, `line`; the boil loop with auto low-power mode |
| Things | `thing`, `appear`, `wiggle`, `pop`, `flyTo`, `interact` (tap, drag, keyboard, `upTap` for swipe-safe taps), `choose`, `scatter` |
| Characters & doodle library | `face` (blinks), `drawRocket`, `drawPlanet`, `ART`, `DOODLE` (about 80 picture-word drawings), `drawPip`, `drawSticker` |
| Sound, music, voice & haptics | WebAudio `sfx.*`, a sparse music bed, `say()`/`prompt()` speech, `buzz()` haptics, praise lines |
| UI chrome | `ICON`, `caption`, `gameChrome`, `setProg`, `askNumber`, `dock`, `backButton`, `screenTitle` |
| Screens | `newScreen`, `go()` iris transition, `startScreen`, `profilesScreen`, `editProfile`, `GAMES`, `PAGES`, `galaxies`, `mapScreen`, `hub`, `tripScreen` (`ensureTrip`), `bookScreen`, `startGame` runner |
| MATH / LITERACY / SPACE GAMES | the 21 original games (ages 2–5) |
| ART, MUSIC & FEELINGS · SCIENCE STATION · PUZZLE PLANET | the 11 newer little-kid games (color mixer, echo song, feelings, weather, sink or float, senses, animal homes, memory, dots, hide and seek, odd one out) |
| GRADES 1–5: quiz engine | `mc`, `fresh`, `quiz()` |
| CONTENT | every question bank as data (see below) |
| MATH (grades 1–5) | math question generators (`qFacts`, `qCompare`, `qPlace*`, `qSkip`, `qArray`/`qAreaPerim`/`qVolume`, `qClock`/`qElapsed`, `qCoins`, `qFrac*`, `qGeometry`, `qStory`, `qMeasure`, `qGraphs`) and `playPlaceValue` |
| BANK QUIZZES | `bankQ`/`qBank`: turn a `CONTENT` bank item into a quiz question, with an optional picture |
| LITERACY (grades 1–5) | `qLab`, `qSight`, `qSpell`, `qVocab`, `playReader` (passage + questions), `playBuilder` (sentence builder) |
| SOCIAL STUDIES | grid maps (`qMaps`), a world map of continents and oceans (`qWorldMap`) |
| Celebration | `celebrate()` awards the sticker, advances the trip and records the win |
| Grown-ups area | `gearButton` (3 s hold), `openPanel` with Progress, Learning, Settings, Players and About tabs; `applySettings` |
| Boot & resize | `layout`, debounced re-render, service-worker registration, `window.DoodleRocket` |

## State and saved data

```js
S = {
  level, age,               // current level; age ('little'|'big') is the legacy flag the original 21 games read
  profile, name, stickers,  // the active explorer (stickers is that explorer's array)
  screen, gameKey, round, miss, data, q, repeat,
  page, galaxy, inTrip, greeted,
  sound, voice, music, haptics, calm, big   // mirrored from DB.settings by applySettings()
}
DB = {                      // localStorage["doodle-rocket:v1"]
  v: 1,
  settings: {sound, voice, music, haptics, calm, big, tripLen, tripStop, allWorlds},
  active: profileId,
  profiles: [{id, name, avatar, level, subj:{math:'g3', …}, stickers:[…], page,
              stats:{g:{'key@level':{p, w, r, f, h:[[day, firstTry]…], t}}, d:{day: minutes}},
              trip:{d, lv, k:[keys], done:[keys], medal}}]
}
```

- `save()` debounces writes. `flush()` writes immediately; it runs after a sticker and on `pagehide`.
- `fixProfile()` sanitizes whatever comes out of storage.
- Every storage access is wrapped in try/catch, so blocked storage still boots.
- `levelFor(key)` applies a per-subject level override, if one is set, when a game starts.

## Screen lifecycle and the `alive()` guard

`newScreen(name)` does five things:
- runs the previous screen's `onLeave` cleanups
- bumps `sid`
- clears `#world` and `#ui`
- cancels speech
- fades in

Any async code captures `my = sid` and checks `alive = () => my === sid` after every `await`. Use `listen()`, `every()` and `later()` instead of raw `addEventListener`, `setInterval` and `setTimeout`, so they are removed on leave. Resize calls the screen function again, and a game resumes at the same `S.round`.

## The game contract

```js
GAMES.key = {
  name, subject,            // subject: math | reading | science | social | arts | life (trip balance, grown-up report)
  color, ring?, icon,       // planet look: icon is a DOODLE key, 't:TEXT', or (g, r) => draw
  sticker,                  // reward sticker type
  rounds: 3,                // number or () => number
  init() {},                // optional: seed S.data once per game
  play(alive) {},           // returns a Promise that resolves when ONE round is won
  gen?(g),                  // grade quiz games: returns a question for grade g (tests call this directly)
  noTrip?                   // leave out of the daily trip (Doodle pad)
}
PAGES = [{id, name, band:'little'|'grade', color, icon, games:[keys]}, ...]
```

`startGame(key)` does the following:
- draws the chrome (home button, progress stars, `#answers`)
- loops `play()` once per round
- records stats
- calls `celebrate()`

It never settles until the game ends, so tests call it with `void`.

## Two ways to build a game

**1. Custom interactive (ages 2–5 style).** Draw things into `world`, make them tappable with `interact()`, use `choose()` for "tap the right one", and use `askNumber()` for "how many?" number cards. Set `S.q = {answer}` so tests can autoplay. See `playColorMix` and `playSinkFloat`.

**2. Quiz (grades style).** Write a generator that returns a question object, then register it with `...quizGame(g => qMyGen(g))`, which gives you `rounds: 5`, `gen` and `play`:

```js
{
  key,                  // de-dupe key; fresh() avoids repeats within a game
  cap, spoken,          // caption text and what Pip says
  s?,                   // optional sentence card ("___" renders as a blank)
  answer, choices,      // strings; build choices with mc(answer, candidates, n) (dedupes, including 8 vs 8.0)
  labels?, aria?,       // optional HTML labels / spoken names for choice buttons
  explain,              // one-sentence "why", spoken after a right answer
  hint(choice),         // optional spoken hint after a wrong pick
  draw(world, A),       // optional picture; A = {x, y, w, h} is the free area above the answers
  onRight(), onMiss(n), quietCap
}
```

For fact-style content, add items to a `CONTENT` bank and use `qBank(CONTENT.MYBANK)`. No code is needed beyond the registry line. Then add the key to a page and to `GRADE` in `tests/helpers.js`; the smoke, playthrough and content tests cover it automatically.

## Content

`CONTENT` holds all editable learning content, keyed by grade (1–5):

| Bank | What |
|---|---|
| `SPACEQ`, `LIFESCI`, `EARTHSCI`, `PHYSSCI` | science (NGSS-aligned) |
| `GEO`, `CIVICS`, `HISTORY` | social studies (C3-aligned) |
| `VOCAB`, `GRAMMAR`, `PUNCT`, `CONFUSED`, `ROOTS` | language (CCSS L.1–L.5) |
| `READ` | original passages, `{title, text, qs:[items]}` |
| `SPELL`, `SIGHT`, `LAB`, `AFFIX` | word study lists |

Each quiz item has this shape: `{q, a, w:[2–3 wrong], why, pic?, s?}`. `tests/content.spec.js` validates every bank and runs every generator hundreds of times per grade.

## Art rules in code

- Use `sketch()` for anything that should look crayon-drawn (it boils). Use plain `el()`/`line()` for crisp elements and straight lines.
- Colors come from `C` (the palette in PLAN.md section 4).
- Put learnable glyphs in `txt(..., {hand:false})` (Andika), outside any boil group.
- Motion respects `prefers-reduced-motion` and the grown-up "Calm mode" (`motionOff()`).

## Testing

| Spec | Covers |
|---|---|
| `smoke.spec.js` | boot, first-run explorer editor, all 15 worlds, every game loading at every level, parent gate |
| `playthrough.spec.js` | every grade game at Grades 1–5 to the sticker (one wrong answer first); every newer little game at both levels |
| `app.spec.js` | profiles, persistence across reload, blocked storage, map → world, daily trip + medal, sticker book, grown-up tabs |
| `content.spec.js` | every `CONTENT` bank is well formed; every generator produces answerable questions |
| `pwa.spec.js` | manifest and icons; offline reload through the service worker |
| `screenshots.spec.js` | `npm run shots`: every screen on phone, tablet and desktop |

`tests/tour.dev.js` and `tests/games.dev.js` are dev helpers for quick screenshot tours and autoplay runs outside the test runner.

What's not covered yet: full playthroughs of the 21 original games (see the backlog).
