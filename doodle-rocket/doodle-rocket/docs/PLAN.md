# Doodle Rocket — Product & Curriculum Plan

A space adventure that lives inside a child's sketchbook. Toddlers fly Pip the astronaut from planet to planet, and every stop is a tiny game about numbers, letters, or the sky above them. Everything on screen looks like it was drawn with crayons, colored pencils, and markers, and the drawings wobble gently like a flipbook.

---

## 1. Who it's for

Doodle Rocket is for children aged 2 to 5, played alone or on a grown-up's lap, with a Grades 1–3 extension for ages 6–8 (see Section 16). Because a two-year-old and a five-year-old are wildly different learners, the game has three difficulty bands that change the content, not the look.

| Band | Ages | What they can typically do | How the game adapts |
|---|---|---|---|
| Sprouts | 2–3 | Tap, simple drag, count 1–3 by sight, name a few colors and shapes, love repetition | Tap-only by default, 1–5 quantities, every answer hinted, lots of voice |
| Explorers | 3–4 | Count to 10, recognize some letters (often from their name), match sounds, sort by one rule | Drag unlocked, 1–10, fewer hints, letter sounds introduced |
| Captains | 4–5 | Count past 20, compare numbers, hear first sounds in words, build simple words | Distractors added, 3-letter word building, "one more / one less," early addition to 5 |

Grown-ups pick the starting band, and the game quietly adjusts from there (see Section 7).

---

## 2. Design pillars

These are the rules every feature gets checked against.

**No wrong turns.** Nothing ever fails, times out, or loses progress. A wrong tap gets a friendly wiggle and a hint, never a buzzer or a red X.

**Voice first.** A child who can't read must be able to play every game. All instructions are spoken, and on-screen words exist for grown-ups and for print exposure.

**One idea per screen.** Each round teaches exactly one thing. No mixed goals, no busy HUDs.

**Short and finishable.** A game is three rounds and takes 2–4 minutes. A day's "trip" is three games, then Pip yawns and parks the rocket. The stopping point is part of the story.

**Symbols stay steady.** The art wobbles, but letters and numbers never do. They're set in a clear, child-friendly typeface so kids learn the real shapes.

**Calm by design.** No ads, no timers, no streak guilt, no loot boxes, no purchases a child can reach.

---

## 3. The world: the Sketchbook Galaxy

### Characters

**Pip** is a small round astronaut drawn in lilac crayon, with a slightly lopsided helmet and a star on an antenna. Pip is curious, a bit clumsy, and never knows the answer first, so the child is always the helper, not the student.

**Scribbles** is Pip's cardboard-tube rocket with marker fins and a crayon flame. It sputters when it's "hungry for fuel," which is a hook for tracing and counting games.

**The Planet Friends** each have one personality trait that drives a game. Mars is always hungry (counting cookies). The Moon is sleepy and changes shape as it dozes (phases). Saturn loves hula-hooping (rings, patterns). Jupiter is the big one and knows it (size comparison). The Sun is warm and bossy (day and night).

### Map structure

The galaxy map is literally a sketchbook. Each region is a new page that gets "drawn in" when unlocked, so progress feels like filling a book.

| Page | Region | Space big idea | Featured math | Featured literacy |
|---|---|---|---|---|
| 1 | Home Sweet Earth | Day, night, Sun, Moon | Counting 1–5, big/small | Letters S, A, T, M |
| 2 | Moon Bay | The Moon, craters, astronauts | Counting to 10, shapes | Letters P, I, N, O |
| 3 | Planet Parade | Planets, sizes, colors, order | Comparing, ordering | First sounds, rhymes |
| 4 | Star Garden | Stars, constellations | Patterns, subitizing | Syllables, CVC words |
| 5 | Far Out | Comets, rockets, space station | One more/one less, adding to 5 | Word building, name writing |

---

## 4. Art & sound direction

### Materials

Everything should look like physical media on paper: waxy crayon with visible grain and color outside the lines, colored pencil hatching for shading, thick marker for outlines, and watercolor washes for big skies. UI pieces are paper cutouts with rough edges, held on with translucent tape. Rewards are glossy stickers with a white die-cut border.

The night sky itself is drawn as visible crayon scribble, a zigzag of indigo strokes with paper showing through. That scribbled sky is the signature image of the app.

### Line boil

Every drawn object has three slightly different versions of its outline, cycled about 6 times a second, which recreates the hand-animated flipbook shimmer. In production this means either three hand-drawn frames per asset or a procedural displacement shader (the prototype uses the shader approach). Line boil turns off automatically when the device's reduce-motion setting is on.

### Palette

| Name | Hex | Use |
|---|---|---|
| Crayon Indigo | #1E2B63 | Night sky base |
| Sketch Paper | #FFFDF6 | UI cards, chalk lines, stickers |
| Graphite | #2B2A33 | Outlines and text |
| Sunflower | #FFD23F | Stars, success, highlights |
| Tomato | #FF6B57 | Rocket, Mars, energy |
| Mint | #43D9AD | Letter world |
| Bubblegum | #FF9BD2 | Cheeks, food world |
| Sky | #6EC6FF | Neptune, windows |
| Lilac | #B69CFF | Pip, asteroids |

Color is never the only cue. Anything that depends on color also differs in shape or position, which matters for color-blind kids and for toddlers still learning color names.

### Typography

**Gaegu** (a hand-lettered face) for titles and decorative words. **Andika** for every letter and number a child is meant to learn. Andika was designed by SIL specifically for beginning readers, with unambiguous letterforms like a single-story "a" that matches how children are taught to write it.

### Animation principles

Objects get "drawn in" when they appear, stroke by stroke, like someone is sketching them live. Success uses squash-and-stretch pops. Wrong answers wiggle side to side, a "not quite" gesture rather than a shake of disappointment. Transitions are page flips.

### Sound

The soundscape is paper-and-pencil: crayon squeaks on taps, paper rustles on page turns, soft pencil scratches when things are drawn in, and gentle marimba or toy-piano notes for success. Music is sparse and warm with long quiet stretches. Voice-over should be a real, warm human voice in production (the prototype uses text-to-speech as a stand-in), with numbers and letters recorded individually so they can be combined.

---

## 5. Curriculum framework

The curriculum is organized into three strands that reinforce each other. It's aligned to the U.S. Head Start Early Learning Outcomes Framework (ELOF), which covers birth to five and includes Mathematics Development, Literacy, Language and Communication, and Scientific Reasoning among its domains. For the Captains band, the Common Core kindergarten counting standards (K.CC) serve as the ceiling, so kids are ready for school without being pushed past it.

### 5.1 Math strand

| Skill area | Sprouts (2–3) | Explorers (3–4) | Captains (4–5) |
|---|---|---|---|
| Subitizing (seeing "how many" instantly) | 1–2 dots | 1–4 dots, familiar patterns | 1–5 dots, dice & ten-frame patterns |
| Rote counting | Say 1–5 with Pip | 1–10 | 1–20, countdown 10→0 |
| One-to-one counting | Tap each of 2–5 objects | Up to 10 scattered objects | Up to 15, including moving objects |
| Cardinality (last number = how many) | Pip says the total | Child picks total from 2 choices | Child picks from 3 choices, near-miss distractors |
| Numeral recognition | Hear & see 1–3 | 1–10 | 0–20 |
| Comparing | Bigger/smaller by size | More/fewer (clearly different groups) | More/fewer/same, compare numerals |
| Operations | — | "One more" story moments | One more/one less, adding & taking away within 5 |
| Shapes | Circle, square, triangle | + rectangle, star, oval | + hexagon, composing shapes into pictures |
| Position words | Up/down | In/out, on/under | Next to, between, behind |
| Patterns & sorting | Sort by color | AB patterns, sort by shape | ABB, ABC patterns, sort by two rules |
| Measurement | Big/little | Long/short, tall/short | Heavy/light, order 3 by size |

**Key teaching choices.** Counting always pairs the spoken number with a physical action (a tap, a cookie eaten) to build one-to-one correspondence. After every count, the game asks or states "how many?" to bridge from counting to cardinality, since many toddlers can recite numbers without understanding that the last number means the total. Quantities are shown in both scattered layouts and structured dot patterns, so kids learn to recognize "five" in different arrangements.

### 5.2 Literacy strand

| Skill area | Sprouts (2–3) | Explorers (3–4) | Captains (4–5) |
|---|---|---|---|
| Vocabulary | Sun, moon, star, rocket, planet | + astronaut, crater, comet, orbit | + galaxy, telescope, gravity, constellation |
| Listening & rhyme | Rhyming songs with Pip | Pick the rhyme (moon → spoon) | Make a rhyme from choices |
| Syllables | Clap along | Clap planet names (Ju-pi-ter) | Count syllables, sort by syllable count |
| Letter recognition | Letters in their own name | Uppercase in a set sequence | Lowercase, upper/lower matching |
| Letter sounds | Hear sounds in songs | First sounds (/s/ sun) | All sounds of taught letters, blending |
| Letter formation | Finger-trace big lines & circles | Trace uppercase letters | Trace lowercase, trace own name |
| Word building | Place letters in ghosted slots | Build 3–4 letter words with slots | Build CVC words from sounds, with distractors |
| Print concepts | Words go left to right | Words are made of letters | Spaces between words, first/last letter |

**Letter sequence.** Letters are taught in a phonics-friendly order rather than A to Z, starting with S, A, T, P, I, N. Those six letters alone make dozens of real words (sat, pin, tap, nap, sit, pan), so kids can build words quickly. Space words are introduced in the order they become buildable: SUN, then STAR, MOON, and MARS.

**Their own name.** A grown-up can enter the child's name in settings. Name letters get priority in early rounds, because a child's own name is usually the first word they recognize.

### 5.3 Space strand

| Big idea | Sprouts (2–3) | Explorers (3–4) | Captains (4–5) |
|---|---|---|---|
| Day & night | Sun means day, Moon means night | Earth spins, making day and night | Different places have day while we have night |
| The Sun | The Sun is hot and bright | The Sun is a star, the closest one to us | The Sun is huge; Earth goes around it |
| The Moon | The Moon is in the sky | The Moon looks like it changes shape | Moon phases; the Moon reflects sunlight |
| Stars | Stars twinkle | Stars make pictures (constellations) | Stars are faraway suns |
| Planets | Earth is our home | Planets have different colors and sizes | Eight planets in order from the Sun |
| Astronauts & rockets | Astronauts fly rockets | Astronauts wear suits to breathe | Floating in space, the space station |
| Scientific habits | Look and point | Notice and describe | Predict, then check |

**Accuracy rules.** Everything simplified must still be true. The Sun is always called a star. The Moon never "makes" its own light, and Pip says it "shines with sunlight." Pluto appears as a dwarf planet friend, not one of the eight planets. Planet colors roughly match reality (Mars reddish, Neptune blue) even in crayon.

### 5.4 How the strands weave together

Every game has one primary skill but touches the other strands for free. Counting stars teaches that stars form constellations. Feeding Mars builds the vocabulary word "Mars" and the concept that planets are different colors. Spelling MOON ends with the Moon waking up and explaining it shines with sunlight. This means a child who only ever picks their favorite game still gets exposure across all three strands.

---

## 6. Mini-game catalog

Each game has three rounds, a clear sticker reward, and a difficulty ladder across bands.

### Math games

| Game | Skill | How it plays | Difficulty ladder |
|---|---|---|---|
| **Star Counting** ★ | One-to-one, cardinality | Tap dotted chalk stars to color them in; each tap draws a constellation line and says the number, then "how many?" | 2–5 stars → up to 10 → up to 15 with 3 choices |
| **Feed the Planet** ★ | Counting a set, numerals | A hungry planet asks for N moon cookies; tap or drag cookies into its mouth | 1–3 → up to 6 → match a numeral with no dots shown |
| **Rocket Countdown** | Counting backward | Tap buttons 10 to 0 in order to launch Scribbles | 3→0 → 5→0 → 10→0 |
| **Alien Quick Look** | Subitizing | An alien flashes dots on its belly for a moment; tap the matching number | 1–2 → 1–4 → 1–5 in dice and ten-frame patterns |
| **Bigger Moon** | Comparing | Two moons or two groups of stars; wake up the bigger one or the one with more | Size → quantity → numerals |
| **Shape Aliens** | Shapes | Aliens are missing a body part; find the matching shape | 3 shapes → 6 shapes → build a picture from shapes |
| **Comet Tails** | Patterns | Finish a comet's tail pattern (red, yellow, red, …) | AB → ABB → ABC |
| **Space Station Sort** | Sorting | Put floating items in the right storage bins | By color → by shape → by two rules |
| **Crater Hop** | Number line, one more/less | Pip hops crater to crater; "hop one more!" | Count hops → one more → add within 5 |

### Literacy games

| Game | Skill | How it plays | Difficulty ladder |
|---|---|---|---|
| **Letter Rockets** ★ | Letter recognition, word building | Letter asteroids float by; put them in the word's slots to bring a picture to life | Ghost letters shown → blank slots → distractor letters and sound-based prompts |
| **Trace to Launch** | Letter formation | Trace a big dotted letter to lay down rocket fuel | Straight lines → uppercase → lowercase and own name |
| **Sound Satellites** | First sounds | Satellites beam pictures; tap the one that starts with /m/ | 2 choices → 3 → 4 with similar sounds |
| **Rhyme Rockets** | Rhyme | Moon wants a friend that rhymes: spoon or cup? | Listen only → choose → make a rhyme |
| **Clap the Planets** | Syllables | Clap (tap) along to planet names | Echo clapping → count claps → sort by claps |
| **Name Tag** | Own-name letters | Build your name on your space helmet | Tap letters in order → drag → trace |

### Space discovery games

| Game | Skill | How it plays |
|---|---|---|
| **Day & Night Spinner** | Earth's rotation | Spin Earth with a finger; the house sleeps and wakes |
| **Moon Moods** | Moon phases | Tuck the Moon into its blanket bit by bit to see phases |
| **Planet Parade** | Planet order and size | Line up planet friends from the Sun (Captains) or by size (Explorers) |
| **Suit Up** | Sequencing | Dress Pip in the right order: suit, boots, gloves, helmet |
| **Build a Rocket** | Shapes & parts | Assemble Scribbles from shapes, then launch |

### Creative mode

**Doodle Pad.** Kids draw their own star, planet, or alien with crayon brushes. Whatever they draw becomes a sticker and can appear in the sky on the galaxy map. It's open-ended, has no right answer, and gives the art style a personal payoff.

★ = included in the playable prototype.

---

## 7. Adaptive learning

### Skill tracking

Each skill (for example, "counts 1–5 objects" or "recognizes letter S") has its own level. The game tracks the last 10 attempts per skill, noting whether the child answered correctly and whether a hint was needed.

A child moves up a level after about 80% unhinted success across two separate sessions, because one good day can be luck. A child quietly moves down if they need the strongest hint three times in a row. Nothing on screen ever announces a level change.

### The hint ladder

If a child hesitates or taps the wrong thing, help arrives in steps, with no penalty at any step. First, after about 5 seconds of no activity, Pip gently repeats the question. Second, the correct item softly pulses or glows. Third, Pip models the answer ("Watch me! One, two, three…") and invites the child to try it together. Hints are logged as data for adaptivity, never shown as a score.

### Spaced review

Skills resurface across different games. A child who learned the letter S in Letter Rockets will meet /s/ again in Sound Satellites and see "S" on a cookie jar in Feed the Planet. Review is mixed into new content, so it never feels like a repeat.

---

## 8. Session and reward design

### The daily trip

Each day, Pip offers a trip of three planets, balanced across strands, taking around 8–10 minutes. After the third game, Pip yawns, the rocket parks, and the screen shows a sleepy scene with a gentle "See you next time!" Kids can keep playing if a grown-up unlocks it, but the natural ending helps families. The American Academy of Pediatrics recommends that children aged 2–5 have around one hour a day of high-quality screen time at most, ideally shared with a grown-up, so the app aims to be a small, good part of that hour.

### Rewards

Rewards are collectible and expressive, never currency. Stickers are earned for finishing a game and go into a scrapbook the child can arrange freely. Galaxy pages fill in with drawings as regions are explored. Pip unlocks new doodled helmets and outfits occasionally, as surprises rather than purchases. There are no stars-per-level ratings, because a three-star system teaches toddlers that two stars is failure.

---

## 9. Grown-up area

A parent gate (hold a button for 3 seconds, a gesture toddlers rarely perform) protects the grown-up area, which includes the following.

**Progress in plain language.** "Counts up to 6 objects reliably" and "Recognizes S, A, T" instead of percentages and charts.

**Off-screen activity cards.** Short ideas tied to what the child just played, like "Count the forks while setting the table" or "Find three things that start with /s/ at the store." This extends learning into the real world.

**Co-play prompts.** Suggested questions to ask while playing together, like "Which planet is your favorite color?"

**Settings.** Difficulty band, child's name, voice and sound, language, daily time limit, and reduce-motion.

---

## 10. Accessibility and inclusion

Tap targets are big, at least around 100 points for primary targets, because toddler fingers are imprecise. Both tap and drag work everywhere, since dragging is hard for young kids. Captions appear with all voice lines. Layouts work for left- and right-handed children. Color is never the only cue. Pip and the astronaut cast have diverse skin tones visible through their helmets, and kids can customize Pip. Spanish voice-over is the first additional language planned, with the letter sequence adapted for Spanish phonics rather than translated directly.

---

## 11. Privacy and safety

The children's area has no ads, no third-party trackers, no social features, no external links, and no in-app purchases. Children never create accounts. Any learning data stays on the device by default, with optional family sync behind the parent gate. The app should be designed to comply with COPPA in the U.S. and GDPR-K in Europe from day one, and should pursue a recognized kids' privacy certification. Everything works offline.

---

## 12. Technical approach

**Prototype.** A single web page using SVG, a procedural displacement filter for line boil, the browser's text-to-speech for voice, and synthesized sounds. This is what's built alongside this plan.

**Production.** Tablets first (iPad and Android), then phones. Good engine options are Godot or Unity for a full native app, or a web/PWA build with a Canvas or WebGL renderer. Rive is worth evaluating for character animation, because its state machines suit reactive toddler characters.

**Art pipeline.** Illustrators draw with real crayons and pencils on paper, scan at high resolution, and vectorize or keep as textured bitmaps. Each asset gets three boil frames. A small shader library handles grain, paper texture, and wobble so new assets match automatically.

**Content as data.** Every round is defined in data (word lists, quantities, distractors, hints, voice lines), so educators can tune the curriculum without code changes and new content can ship without app updates.

---

## 13. Roadmap

**Phase 0 — Prototype (now).** Three games (Star Counting, Feed the Planet, Letter Rockets), hub, stickers, parent gate, two difficulty bands. Goal: prove toddlers understand the interactions and love the look.

**Phase 1 — MVP (about 3–4 months).** Two map pages, eight games, all three bands, adaptive engine, recorded voice-over, grown-up progress page, offline tablet app.

**Phase 2 — Launch (about 6–8 months).** All five pages, all games in the catalog, Doodle Pad, Spanish, activity cards, family sync.

**Phase 3 — Growth.** Seasonal pages (a real eclipse or meteor shower becomes an event page), more languages, classroom mode for preschools with multiple child profiles.

---

## 14. Testing with real toddlers

Playtest early and often, with a parent present. Watch rather than ask, since toddlers can't give feedback in words. Key signals to measure: whether a child can start and finish a game with no grown-up help, how often they tap outside targets (a sign targets are too small or unclear), how often they need the third hint level, and delight markers like laughing, pointing, and asking to play again. For grown-ups, check that they understand what their child is learning from the progress page alone.

Test in short 10-minute sessions, test each band with children actually in that age range, and include kids with a range of language backgrounds and abilities.

---

## 15. What's in the prototype

`app/index.html` is a single-file, fully playable web prototype (HTML + SVG + vanilla JS, no build step, no dependencies beyond two Google Fonts).

**Screens.** Start screen with a "Who's playing?" level picker, an 8-page sketchbook hub (swipe or arrows), a 3-round game runner with progress dots, a sticker celebration, and a grown-up settings panel behind a 3-second hold on the gear.

**Levels.** Five levels: Ages 2–3 (Sprouts), Ages 4–5 (Captains), Grade 1, Grade 2, Grade 3. The Explorers band from Section 1 is folded into Captains for now. Choosing a grade opens the hub on the grade pages.

**Games (33 plus Doodle Pad).**

| Page | Games | Levels |
|---|---|---|
| Home Sweet Earth | Count the stars, Feed the planets, Day and night, Bigger moon | 2–5 |
| Moon Bay | Letter rockets, Shape aliens, Moon moods, Suit up | 2–5 |
| Planet Parade | Planet parade, Sound satellites, Rhyme rockets, Clap the planets | 2–5 |
| Star Garden | Alien quick look, Comet tails, Trace to launch, Station sort | 2–5 |
| Far Out | Countdown, Crater hop, Build a rocket, Name tag, Doodle pad | 2–5 |
| Number Nebula | Asteroid math, Place value port, Skip count stars, Array station | Grades 1–3 |
| Moon Market | Space clock, Moon money, Pizza planets, Mission control | Grades 1–3 |
| Word Galaxy | Letter lab, Sight word stars, Spell check, Space reader | Grades 1–3 |

**Not in the prototype yet:** the daily 3-game trip, the adaptive mastery engine (Section 7), saved progress (everything resets on reload), recorded voice-over (it uses the browser's speech voice), page unlocking (all pages are open), the grown-up progress page, offline/PWA install, and Spanish. See `docs/BACKLOG.md`.

---

## 16. Grades 1–3 expansion

The same world and art now reaches ages 6–8. Design pillars still apply, with three adjustments for school-age kids: rounds per game go from 3 to 5 for quick-fire practice, text appears alongside voice (reading is now part of the learning), and every answer gets a one-sentence "why" instead of just praise.

**Standards.** Math aligns to Common Core (1.OA, 1.NBT, 1.MD, 1.G through 3.OA, 3.NBT, 3.MD, 3.NF). Literacy aligns to Common Core Foundational Skills and Language (RF.1–3.3, L.1–3.2, L.3.4) plus the Dolch grade-level sight-word lists. Space science draws on NGSS 1-ESS1 (patterns of Sun, Moon and stars), 2-ESS1 (Earth changes over time, used lightly), and 3-5 ESS1 content that 3rd graders commonly meet (gravity, solar system facts).

**Scope and sequence by game.**

| Game | Grade 1 | Grade 2 | Grade 3 |
|---|---|---|---|
| Asteroid math | + and − within 20, missing addend (1.OA.6, 1.OA.8); ten-frame support after a miss | + and − within 100 (2.NBT.5) | × and ÷ within 100 (3.OA.7) |
| Place value port | Build 2-digit numbers from tens and ones, 10 ones regroup to a ten (1.NBT.2) | Adds hundreds, 10 tens regroup to a hundred (2.NBT.1) | Round to nearest 10 or 100 on a number line (3.NBT.1) |
| Skip count stars | Count by 1s past 100, by 2s, 5s, 10s (1.NBT.1) | By 2s, 5s, 10s, 100s, including from non-multiples (2.NBT.2) | Multiples of 3–9; count back by 10s and 100s (3.OA.9) |
| Array station | Count windows in 2–3 rows | Rows × columns as repeated addition (2.OA.4) | Area by tiling in square units (3.MD.7) |
| Space clock | Hour and half hour (1.MD.3) | Nearest 5 minutes (2.MD.7) | Nearest minute (3.MD.1) |
| Moon money | Dimes, nickels, pennies | Quarters, dimes, nickels, pennies (2.MD.8) | Change from $1 by counting up |
| Pizza planets | Halves, fourths, whole (1.G.3) | Halves, thirds, fourths in words (2.G.3) | Unit and non-unit fractions as a/b, denominators 2, 3, 4, 6, 8 (3.NF.1) |
| Mission control | Sun is a star, day/night, seasons, Moon light (1-ESS1-1, 1-ESS1-2) | 8 planets, orbits, day vs. year, constellations | Gravity, Moon weight, hottest/farthest planets, light travel time, phases, dwarf planets |
| Letter lab | Short vowels, digraphs sh/ch/th/ck (RF.1.3a–b) | Vowel teams ai/oa/ee/oo/ay/ow, r-controlled ar/ir, igh (RF.2.3b) | Prefixes un-/re-, suffixes -ful/-less (RF.3.3a, L.3.4b) |
| Sight word stars | Dolch Grade 1 list (RF.1.3g) | Dolch Grade 2 list (RF.2.3f) | Dolch Grade 3 list (RF.3.3d) |
| Spell check | CVC and digraph words (L.1.2d) | Long-vowel patterns (L.2.2d) | Multi-syllable space words and common tricky words (L.3.2e–f) |
| Space reader | 3-sentence story, literal recall (RL.1.1) | Sequence, cause and effect (RL.2.5, RI.2.1, RI.2.3) | Main idea and supporting reasons (RI.3.2, RI.3.8) |

**Hint ladder (grades).** First miss: a spoken hint specific to the mistake ("Try tens first, then ones", "Count up from 45 to 100"), and the wrong choice is crossed out. Second miss: the right answer pulses. The round never fails.

**Content rules for grades.** Every fact gets checked against NASA's kid-facing materials before it ships. Hedge approximate numbers ("about 8 minutes", "about a year"). Reading passages are original, 30–60 words at the target grade level, and always answerable from the text alone. Money currently uses US coins; localize before shipping outside the US.

**Roadmap impact.** Grades 1–3 slot into Phase 2 as a "Big Kid" pack. It needs its own playtest pass with 6–8 year olds, who will find the toddler pacing slow. Watch for boredom signals (skipping the voice, tapping ahead) and tune rounds and pacing from there.
