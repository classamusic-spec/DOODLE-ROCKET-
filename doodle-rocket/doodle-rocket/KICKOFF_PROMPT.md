# Kickoff prompt for Claude Code

Open this folder in Claude Code and paste the prompt below as your first message. Edit the last paragraph if you want a different focus.

---

You're taking over Doodle Rocket, a hand-drawn space learning game for ages 2 through Grade 3. It's a working single-file web prototype.

First, get oriented:
1. Read `CLAUDE.md`, `docs/ARCHITECTURE.md`, and `docs/BACKLOG.md`. Skim `docs/PLAN.md` (sections 2, 7, 8, 15, and 16 matter most).
2. Run `npm install`, `npx playwright install chromium`, and `npm test`. Everything should pass. If anything fails, stop and tell me before changing code.
3. Run `npm run shots` and look through the phone and tablet screenshots, so you know what the game looks like.

Then work through the backlog in order, starting with P0:
- One backlog item at a time. Make a short plan, implement it, add or extend tests, run `npm test` (and `npm run shots` for anything visual), tick it off in `docs/BACKLOG.md`, and make one commit.
- Follow the product rules in `CLAUDE.md` strictly: no fail states or timers, voice for every instruction, steady (non-boiling) letters and numbers, big tap targets, no network calls or tracking.
- If an item needs a product decision that isn't in the docs (for example, how many stickers unlock a page), pick a sensible default, note it in the backlog item, and keep going.
- After finishing all of P0, stop and give me a summary with screenshots of anything that changed visually before starting P1.
