# Leonida Platinum Log — GTA VI trophy guide & tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/XIIIIXV/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/XIIIIXV/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app for the make.fun **gta6-trophy-guide-01** bounty
($250, free entry, deadline 2026-11-21T11:00:00Z): a guide and tracker
for all 55 PlayStation 5 trophies of Grand Theft Auto VI.

## What it is

- **Tracker** — every trophy with its official name, description and
  grade; a checklist saved in the browser (localStorage) with export and
  import; progress counters for the 19 counted trophies; filters by kind
  (story, missable, collectibles, activities, online), grade, earned /
  unearned, disputed and unconfirmed; search and four sort orders.
- **Spoiler shield (on by default)** — the 28 PSN-hidden trophies stay
  hidden until earned, or until you switch the shield off.
- **Roadmap** — three stages to the platinum (~200 hours, difficulty
  4/10, 1 playthrough, 0 online trophies) plus the full 100% completion
  checklist with its required shares.
- **Missables** — the 1 possibly missable trophy (Positive Mental
  Attitude: the Chapter 1 balcony meditation) and a 7-item watch list
  with chapter windows and last chances.
- **Cited guides** — every one of the 55 guides is written in our own
  words and cites its sources by number (10 sources, read 20 Nov 2026:
  PowerPyx, KeenGamer, Push Square, OutputLag, Exophase, PSNProfiles,
  GTASpotter, GamesFuze, Mobalytics, Insider Gaming). Where sources
  disagree, both versions are shown and the trophy is flagged disputed
  (6); where no source has a verified method, the trophy is flagged
  unconfirmed (1: Bad Luck, I Guess) and no method is invented.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Static files under `app/` only, no build step, no network requests at
runtime — it works with the network off. No Rockstar Games logo,
artwork or game screenshots.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.
