# LEONIDA LEDGER — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dockerhack/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dockerhack/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Bounty: https://make.fun/bounty/gta6-trophy-guide-01

An offline web app that guides and tracks all 55 GTA 6 PlayStation 5
trophies. Every trophy has a guide written in our own words, each step
citing the page it comes from — 201 cited steps across 55 guides, drawn
from 9 sources read on 20 November 2026.

## What it does

- **Ledger** — all 55 official trophies with their official name,
  description and grade, saved progress (check a trophy earned), filters
  (story / missable / collectibles / activities / side chains / crime /
  riddles / money / online / unearned / by grade), a spoiler setting that
  hides the 12 story trophies until earned or revealed one by one, and
  export/import of your progress.
- **Roadmap** — five stages from the story spine to the platinum, the
  four ground rules, and a missable watch list (2 possibly missable, 7
  watch, 46 safe after the credits).
- **Source Matrix** — a 55-row by 9-column grid: each cell is how many of
  that guide's steps cite that page, so every claim can be checked.
- **100% Ledger** — the 100% checklist itself as live counters (200/277
  vehicles, 100/255 animals, 300 stunts, 70/80 challenges, 15 Target
  Decks, 8 bank jobs, 39 gang operations, 100 optional missions, 15/18
  meditations), a save-slot planner for the 15 manual slots, and a
  disagreement ledger holding all 10 disputed items with both versions
  shown side by side.

## Run it

Serve the app and open it in a desktop browser (it is fully offline —
no network requests, no external files):

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

Or, from the repository root:

```sh
node serve.ts
# open http://localhost:8080
```

Build the entry (copies app/ and screenshots/ to the output and writes
dossier.json):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

Every guide step cites one of nine pages, numbered [1]–[9] in the app:

1. PowerPyx — GTA 6 Trophy Guide & Roadmap
2. OutputLag — GTA 6 Trophy List: All 55 Trophies and Achievements
3. KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap
4. eGamers — GTA 6 Trophy List: All 55 Trophies and Achievements, Plus
   the Hardest Ones
5. Official list — the PS5 trophy list as shipped in this contest's kit
   (mirrors Exophase and PSNProfiles)
6. GTA-Zone — GTA 6 Trophies & Achievements (updated 18 Nov 2026)
7. GTA Vibes — GTA 6 Trophy List & Achievements
8. GTABase — GTA 6 trophy list + 100% thresholds
9. Push Square — GTA 6 trophy guide

## Notes

- Unofficial fan guide. Not affiliated with Rockstar Games, Take-Two
  Interactive or Sony Interactive Entertainment. No Rockstar logo, no
  official artwork, no game screenshots.
- All 55 trophies are single-player and offline; there is no online
  trophy, no difficulty setting, no mission replay and no New Game+.
- One playthrough is enough: free roam stays open after the credits.
- Cheats disable trophies and saving — keep them off.
- Two trophies are possibly missable (#28 Meditations, #25 Strangers &
  Freaks) and five triggers are unconfirmed; the app labels them instead
  of inventing a method.

## License

MIT. See LICENSE.
