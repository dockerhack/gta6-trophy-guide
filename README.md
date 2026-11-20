# THE LEONIDA FILES — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dockerhack/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dockerhack/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that is the best guide and tracker for the 55 PlayStation 5
trophies of Grand Theft Auto VI: every trophy with its official name,
description and grade, a checklist saved in the browser, a 5-stage roadmap to
the platinum, a missables watch list, a source matrix proving every guide cites
its sources, and a 100% ledger tracking the A Long Road checklist itself. All
guides are written in our own words and cite the pages they draw on. Unofficial
fan guide, not affiliated with Rockstar Games or Sony.

Entry for the [make.fun bounty "Build the best GTA 6 trophy guide"](https://make.fun/bounty/gta6-trophy-guide-01).

## Run

Open `app/index.html` in a desktop browser, or serve the `app/` folder with any
static server:

```sh
python3 -m http.server 8000 --directory app
```

Then open http://localhost:8000/ — everything works with the network off.
Progress is saved in the browser (localStorage) and can be exported, imported,
or shared as a progress link.
