# KartRacer — Agent Context

Mobile app for **Australian kart racing** (Motorsport Is Life). Sister product to RoadRacer / Send-It. Same screens and gates; kart data instead of motorcycle road race.

**Brand:** Motorsport Is Life. **Product:** KartRacer. Expo owner stays `motorsport-is-life`. Bundle `com.milkartracer.app`. Do not call the RoadRacer Render API or reuse Send-It EAS/ASC ids.

## Repo layout

- `app/` — Expo client (web + iOS EAS); TypeScript; `App.tsx`
- `android-app/` — Expo Android / Play copy (no shared folders with `app/`)
- `api/` — Express calendar + Q&A + coach API
- `packs/` — regional packs; AU-only launch (`active.json` = `["au"]`); `discipline`: `karting`
- `data/gpx/` — **129 one-lap kart GPX** (import source; not yet baked)
- `gpt-knowledge/` — KartRacer AI pack skeletons (do not upload as fact)
- `Q&A/` — empty; ingest KA Manual in J3.4
- `scripts/` — track-map factory (copied from RoadRacer) plus KartRacer `tools/`
- `tools/` — `tkk2gpx.py`, `kartcoach_gpx_audit.py`

## Stack

Expo ~54, React 19, React Navigation 7, AsyncStorage. API: Express, port 3001.

## Commands

```bash
cd api && npm install && npm start
cd app && npm install && npx expo start
cd android-app && npm install && npx tsc --noEmit
```

Gates (after J1 bake):

```bash
npx tsc --noEmit   # in app/ and android-app/
node scripts/prove-track-maps.mjs
node scripts/validate-track-data.mjs
node scripts/health-check.mjs
```

## Configuration

- API: `app/constants/api.ts` — default `http://localhost:3001` (no Send-It host)
- Storage prefix: `@kartrace_*`

## Key docs

- [`docs/CURSOR_BUILD_JOBS.md`](docs/CURSOR_BUILD_JOBS.md) — canonical Cursor backlog
- [`docs/KR_DATA_EQUIVALENTS.md`](docs/KR_DATA_EQUIVALENTS.md) — RR → KR file map
- [`docs/KR_TOOLS_AND_RESEARCH.md`](docs/KR_TOOLS_AND_RESEARCH.md) — setup maths + solver retune
- [`gpt-knowledge/README.md`](gpt-knowledge/README.md) — coach pack (skeletons)
- `app/src/avatar/FACE_PHOTO.md` — face-hole math (art becomes kart suit in J2.5)

## Hermes

Skills live in `docs/hermes/skills/kart-racer/` (`kr-app-expert`, `mobile-review`, `mobile-app-expert`, `track-data-analyst`, `agent-apple`, `agent-play`, `ai-enterprise-watch`, `market-pack`).

Install (when asked): `.\scripts\install-hermes-skills.ps1` → `%LOCALAPPDATA%\hermes\skills\kart-racer\`

Do not install cron unless asked. Do not reuse Send-It job names.

## Track Details invariants (unchanged)

- Bake from repo GPX only. Do not restore board PNGs.
- GPX never sets turn hand. `track_turn_verification.json` is P0.
- Racing line is an overlay; stroke in map units; no modelled lap time.
- `quasi_steady_line.py` still has motorcycle `BIKES` — retune to karts in J1.7 before `--with-lines`.

## Workflow

Hermes report → Cursor implements `CURSOR_BUILD_JOBS.md` → `tsc` + prove/validate → merge.
