# Doodle Rocket 🚀✏️

Doodle Rocket is a hand-drawn space adventure for learning at home. It covers math, reading and writing, science, social studies, art and feelings for ages 2 through Grade 5. Pip the astronaut flies the rocket Scribbles across two galaxies of mini-games, all drawn in crayon and pencil with wobbling "line boil" animation.

## Play it

Open `app/index.html` in any modern browser. Nothing needs installing. To install it as an app that works offline, serve the `app/` folder over http(s) (`npm start`) and use "Add to Home Screen" or "Install app".

- **Make an explorer:** the first time you tap Play, you pick a name, a color and a level (Ages 2–3, Ages 4–5, or Grades 1–5). Each child in the family gets their own explorer, stickers and progress.
- **Pick a world:** the galaxy map shows the worlds. Tap one to see its games. Grade-level explorers get a Missions galaxy plus a Warm-ups galaxy.
- **Today's trip:** three stops chosen for the day, mixing subjects. Finishing a trip earns a medal sticker.
- **Sticker book:** every finished game earns a sticker, and kids can arrange stickers on the page.
- **Grown-ups:** press and hold the gear button for 3 seconds. From there you can:
  - see progress by subject and skill
  - set a different level per subject
  - adjust sound, voice, music, haptics, calm mode, big text and trip length
  - manage explorers

## What's inside

60 games across 15 worlds. Little games have 3 rounds and grade games have 5. Every grade question comes with a one-sentence "why".

| World | Games | For |
|---|---|---|
| Home Sweet Earth | Count the stars, Feed the planets, Day and night, Bigger moon | Ages 2–5 |
| Moon Bay | Letter rockets, Shape aliens, Moon moods, Suit up | Ages 2–5 |
| Planet Parade | Planet parade, Sound satellites, Rhyme rockets, Clap the planets | Ages 2–5 |
| Star Garden | Alien quick look, Comet tails, Trace to launch, Station sort | Ages 2–5 |
| Far Out | Countdown, Crater hop, Build a rocket, Name tag | Ages 2–5 |
| Rainbow Nebula | Color mixer, Echo song, Pip's feelings, Doodle pad | Ages 2–5 |
| Science Station | Weather wardrobe, Sink or float, Five senses, Animal homes | Ages 2–5 |
| Puzzle Planet | Moon match, Connect the stars, Hide and seek, Odd one out | Ages 2–5 |
| Number Nebula | Asteroid math, Place value port, Skip count stars, Compare numbers | Grades 1–5 |
| Shape Station | Array station, Pizza planets, Shape explorer, Space stories | Grades 1–5 |
| Moon Market | Space clock, Moon money, Measure up, Graph galaxy | Grades 1–5 |
| Word Galaxy | Letter lab, Sight word stars, Spell check, Word wizard | Grades 1–5 |
| Story Cluster | Space reader, Grammar rockets, Punctuation port, Sentence builder | Grades 1–5 |
| Science Lab | Mission control, Living things, Forces and matter, Earth and weather | Grades 1–5 |
| Globe Trotter | World explorer, Map quest, Town hall, Time travelers | Grades 1–5 |

The content is aligned to Common Core math and ELA, NGSS science and the C3 social studies framework. See `docs/PLAN.md` sections 15–17.

## Repo layout

```
app/index.html          the whole app (HTML + SVG + vanilla JS), including all content banks
app/fonts/              self-hosted Andika and Gaegu (SIL OFL)
app/icons/, app/manifest.webmanifest, app/sw.js    installable, offline PWA
docs/PLAN.md            product plan: audience, pillars, art, curriculum, roadmap
docs/ARCHITECTURE.md    how the code is organized and how to add a game or content
docs/BACKLOG.md         prioritized next steps with acceptance criteria
tests/                  Playwright suites (smoke, playthrough, app, content, PWA, screenshots)
CLAUDE.md               working notes for Claude Code
```

## Develop

```bash
npm install
npx playwright install chromium
npm test          # syntax check + Playwright on phone and tablet
npm run shots     # screenshots of every screen on phone, tablet and desktop → test-results/shots/
npm start         # serve app/ at http://localhost:5173
```

Requires Node 18 or later.

## Principles

The app has:
- no ads, purchases, tracking, accounts or network calls
- progress that stays on the device
- no fail screens for kids
- every instruction spoken aloud

It works offline and respects reduced motion. See `docs/PLAN.md` for the full design pillars and privacy approach.
