# Doodle Rocket 🚀✏️

Doodle Rocket is a hand-drawn space adventure for learning math, reading, and space science. It covers ages 2–5, plus Grades 1–3. Pip the astronaut flies the rocket Scribbles across an eight-page sketchbook galaxy of mini-games, all drawn in crayon and pencil with wobbling "line boil" animation.

## Play it

Open `app/index.html` in any modern browser. It's one self-contained file with nothing to install. For the best experience, use a tablet or a phone in full screen with the sound on.

- **Pick a player:** on the start screen, pick who's playing: Ages 2–3, Ages 4–5, Grade 1, Grade 2, or Grade 3.
- **Change pages:** swipe or use the arrows.
- **Grown-up settings:** press and hold the gear (bottom right) for 3 seconds. There you can change the level, sound, voice, and the child's name for the Name tag game.

## What's inside

| Map page | Games | For |
|---|---|---|
| Home Sweet Earth | Count the stars, Feed the planets, Day and night, Bigger moon | Ages 2–5 |
| Moon Bay | Letter rockets, Shape aliens, Moon moods, Suit up | Ages 2–5 |
| Planet Parade | Planet parade, Sound satellites, Rhyme rockets, Clap the planets | Ages 2–5 |
| Star Garden | Alien quick look, Comet tails, Trace to launch, Station sort | Ages 2–5 |
| Far Out | Countdown, Crater hop, Build a rocket, Name tag, Doodle pad | Ages 2–5 |
| Number Nebula | Asteroid math, Place value port, Skip count stars, Array station | Grades 1–3 |
| Moon Market | Space clock, Moon money, Pizza planets, Mission control | Grades 1–3 |
| Word Galaxy | Letter lab, Sight word stars, Spell check, Space reader | Grades 1–3 |

## Repo layout

```
app/index.html          the whole app (HTML + SVG + vanilla JS)
docs/PLAN.md            product plan: audience, pillars, art, curriculum, roadmap
docs/ARCHITECTURE.md    how the code is organized and how to add a game
docs/BACKLOG.md         prioritized next steps with acceptance criteria
tests/                  Playwright smoke, playthrough, and screenshot suites
CLAUDE.md               working notes for Claude Code
KICKOFF_PROMPT.md       a ready-to-paste first prompt for Claude Code
```

## Develop

```bash
npm install
npx playwright install chromium
npm test          # 88 tests: boot, every page, every game at every level, full Grade 1–3 playthroughs
npm run shots     # screenshots of every screen → test-results/shots/
```

Requires Node 18 or later.

## Principles

No ads, no purchases, no tracking, and no network calls. Kids never see a fail screen. Every instruction is spoken aloud. See `docs/PLAN.md` for the full design pillars and privacy approach.
