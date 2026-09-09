# KartRacer — Motorsport Is Life

Australian kart racing companion: Driver Coach, Kart Setup, Track Details, Events, and Q&A.

Sister app to RoadRacer. Same screens. Kart data. Trading name **Motorsport Is Life**.

## Status

Phase 0 bootstrap: app factory copied from RoadRacer, motorcycle catalogs emptied. **129 kart GPX files** are in `data/gpx/` and are **not yet imported** into `scripts/track-memory-gpx/`. Coach pack in `gpt-knowledge/` is skeleton-only.

Canonical jobs: [`docs/CURSOR_BUILD_JOBS.md`](docs/CURSOR_BUILD_JOBS.md).

## Quick start

```bash
cd api && npm install && npm start
cd ../app && npm install && npx expo start
```

API defaults to `http://localhost:3001`. Do not point this app at the RoadRacer Render host.

## Features (shell)

- **Home** — kart photo + avatar (leathers art is placeholder until J2.5)
- **Events** — calendar UI; kart ICS not wired (J3.1)
- **Driver Coach** — chrome only; KB is skeleton (J3.5)
- **Kart Setup** — chrome only; motorcycle physics quarantined (J2.1)
- **Q & A** — tabs only; no MoMS (J3.4)

## Do not

- Reuse RoadRacer bike/car GPX as kart tracks
- Invent tyre pressures or class weights
- Upload `gpt-knowledge/` stubs as facts
- Ship onto `com.milroadracer.app`
