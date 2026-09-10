# KartRacer — Cursor build jobs

Goal: KartRacer looks and feels identical to Send-It (RoadRace) and keeps every function.
Only the DATA changes: motorbike road-racing content out, Australian kart racing content in.

Do NOT redesign screens. Rename user-facing strings only where they say bike/rider/road-race.

## Crosswalk (plan ids)

| Plan id | This file |
|---------|-----------|
| KR-TRACKS-AU | J1.2 |
| KR-GPX-BAKE | J1.1, J1.3, J1.8 |
| KR-HANDS | J1.5 |
| KR-LINE-MODEL | J1.7 |
| KR-GEOFENCE | J1.4 |
| KR-CAL-AU | J3.1–J3.2 |
| KR-RULES-QA | J3.4, J3.6 |
| KR-ONBOARD | J2.3 |
| KR-SETUP | J2.1, J2.2, J2.4 |
| KR-COACH | J3.5 |
| KR-PACKS-AU | J4.1–J4.3 |
| KR-AVATAR | J2.5 |
| KR-TRIVIA | J2.7 |
| KR-LEGAL-STORE / KR-HOST | J6.3 |

## Pre-import (do before J1.1)

> **2026-09-10 art set (Hermes):** the full 81-image KartRacer art set has been generated to
> `app/assets/art/` (prompt pack: `IMAGE_GENERATION_PROMPTS.md`; vision-QA verdicts:
> `tools/art-gen/qa-results.md`). **Placement instructions: [`ART_PLACEMENT_GUIDE.md`](ART_PLACEMENT_GUIDE.md)**
> — per-file screen mapping, `art.ts` require module, android-app mirroring, optimisation,
> and the acceptance checklist. Do not place files marked REGEN in the QA results.

> **2026-09-10 research handoff (Hermes):** all remaining placeholder data has been researched
> and compiled in [`CURSOR_RESEARCH_HANDOFF_2026-09-10.md`](CURSOR_RESEARCH_HANDOFF_2026-09-10.md)
> — tyre pressures/specs (KA spec PDFs archived in `kb/sources/tyre-spec-pdfs/`), engine reference
> table, 2026 AKC calendar, state calendar sources, verified RSS feeds, onboarding driver/kart
> source lists, and the ordered P0→P2 job list with the ready-to-test gate checklist. Work from
> that report; it supersedes per-job research notes below where they overlap.

> **2026-09 KARTS import (Hermes):** `kb/` (setup/engine/tyre KB + machine JSON), `kb-au-rules/`
> (2026 KA Manual Update 1 structured snapshot: classes/weights/restrictors/licences/clubs/fees,
> national + 6 states), and `tools/setup-engine/` (tested TS calculators + rules JSON, 35 vitest
> tests passing) now live in this repo. gpt-knowledge chassis/tyre/class/technique/diagnostic
> files are POPULATED from those sources (see `gpt-knowledge/coaching-knowledge-base-index.md`).
> J2.1/J2.2/J3.5 content sources are now local; J3.4 Q&A can cite `kb-au-rules/` while the raw
> KA Manual PDF ingest is pending.

From `docs/reviews/KARTCOACH_2026-09-08.md`:

1. Fix S/F waypoints >30 m off polyline: GoldfieldsK, SPKP Var3, SPKP Var4, LismoreK, OrangeK B, OrangeK C, WollongongK, MegaFastKart.
2. Tag `CanberraLong.gpx` state as ACT.
3. Confirm or hold `GeraldtonK` (244 m).
4. Confirm CHKRC = Coffs Harbour; source Newcastle + Monarto if missing.
5. Stem → official venue name table (do not ship `lkc` / `CHKRC A3` as display names).
6. Re-run `python tools/kartcoach_gpx_audit.py`.

---

## Phase 0 — Repo bootstrap

- [x] J0.1 Merge Send-It working tree into `C:\KartRacer` without clobbering `data/`, `gpt-knowledge/`, `tools/`, or these docs.
- [x] J0.2 Identity rename to KartRacer - Motorsport_Is_Life (slug/bundle/storage keys). Hosting URLs blank.
- [x] J0.3 Folder layout kept. AGENTS.md rewritten. Motorcycle catalogs emptied; placeholders point here.
- [x] J0.4 npm install in app/, android-app/, api/; `npx tsc --noEmit` passes in both apps.

## Phase 1 — Strip RR track data, load kart tracks

Source: `C:\KartRacer\data\gpx\` — 129 one-lap GPX files with Start/Finish waypoint (already built).

- [ ] J1.1 Empty `scripts/track-memory-gpx/` of RR circuits; import the 129 kart GPX files (naming convention: keep track name, kebab-case id).
- [ ] J1.2 Build track catalog: replace `app/src/data/tracks.json` / `tracks.ts` entries with kart venues (id, name, club, state, length_m, lat/lon from GPX S/F wpt, timezone).
- [ ] J1.3 Run `node scripts/build-gpx-track-maps.mjs` to regenerate `app/src/data/gpxTrackMaps/` (mirror to android-app). Polyline-only JSON, same renderer, unchanged TrackFacilityMap.
- [ ] J1.4 Regenerate `app/src/data/catalog_track_geofences.json` from GPX bounding boxes + S/F points.
- [ ] J1.5 Reset `app/src/data/track_turn_verification.json` to kart tracks (empty hands allowed initially; P0 rule unchanged: GPX never sets turn direction; fill from club maps as verified).
- [ ] J1.6 Reset `app/src/data/trackDetailsCorners/`, `trackInfo/`, `trackMemory/` to kart venues (empty/skeleton entries; populated per KR_DATA_EQUIVALENTS.md).
- [ ] J1.7 Racing lines: rerun `python scripts/build-racing-lines.py` per layout once solver params are retuned for karts (lower mass, higher lateral g, no lean-angle model). Until retuned, ship without lines (gate treats missing line as warning — unchanged).
- [ ] J1.8 Gates pass: `node scripts/prove-track-maps.mjs`, `node scripts/validate-track-data.mjs`, `node scripts/diagnose-track-memory.mjs`, tsc in both apps.

## Phase 2 — Strip RR domain data (bike -> kart)

Same screens, same components, renamed labels + swapped data files.

- [ ] J2.1 Bike Setup hub -> Kart Setup hub. **Build spec ready: [`KART_SETUP_TOOL_BUILD_SPEC.md`](KART_SETUP_TOOL_BUILD_SPEC.md)** — setup-engine is embedded in both apps (`scripts/sync-setup-engine.mjs`, tsc-clean) with AU compound pressure windows; spec maps the imported PWA screens onto the Bike* replacements. `bikeSetupBasics.ts` -> `kartSetupBasics.ts` (content from C:\KartRacer\gpt-knowledge\chassis-setup-and-tyre-kb.md). Screens keep structure: Balance -> Chassis Balance (front/rear grip), Setup Sheet fields become kart fields (front width, rear track, caster, camber, toe, axle, hubs, seat pos, ride height, sprocket, pressures).
- [ ] J2.2 Gearing: `app/src/data/gearing/bikePowerbandRef.json` -> `kartEngineRef.json` (X30, KA100, Rotax, KZ2, 4SS rpm bands; sprocket teeth front 10-11, rear 68-95). GearingGuideScreen math switches from gearbox ratios to single-ratio sprocket calc.
- [ ] J2.3 Onboarding: `onboardingBikes.json` -> `onboardingKarts.json` (chassis brands: Tony Kart/OTK, Birel ART, CRG, Kosmic, EOS, Arrow, Parolin + engine packages); `onboardingRiders.json` -> `onboardingDrivers.json` themed on the karting-to-pro pathway: F1 (Piastri, Ricciardo, Hamilton, Verstappen...), V8 Supercars champions, IndyCar (Power, McLaughlin, Palou...), F1 Academy — every blurb verified, karting-origin angle preferred. Keep facts-test script pattern (`scripts/test-onboarding-facts.mjs`).
- [ ] J2.4 Tyre Wear Analysis screen: swap wear-pattern dataset for kart slick patterns (graining, blistering, hot tear, flat-spot, inner/outer shoulder). Same photo flow.
- [ ] J2.5 Avatar: leathers art -> kart race suit art. PRESERVE `FACE_PHOTO.md` invariants (hole math and capture pipeline unchanged; only the artwork layer changes).
- [ ] J2.6 FAQs: `rider_ai_faqs.json` (app + api) -> kart racing FAQs (licensing, classes, first race day, pressures, chain, weights) + pro-pathway general info (karting -> F4 -> F3/F2 -> F1; karting -> Supercars; F1 Academy route).
- [ ] J2.7 Trivia: api trivia bank (triviaBankData.js, triviaAuExtra.js) -> trivia themed on Formula 1, V8 Supercars, IndyCar Series, F1 Academy, GT Cup, GT World Challenge, NASCAR, and FIA WEC/Le Mans — new-generation racers and older greats, standout teams/drivers/cars of the last 50 years, karting-origin angles (champions who started in AU karting, AKC pathway).

## Phase 3 — API re-point (calendar, headlines, Q&A, coach)

- [ ] J3.1 Calendar scrapers: replace `api/data/au-road-race-sources.json` with kart sources (Karting Australia calendar, KA state bodies, Rotax Pro Tour). Keywords: include Kart/AKC/Rotax/Club Day; exclude Motocross/Speedway/Road Race/Superkart (Superkarts are OUT of scope). Same scraper framework (`calendarScrapers.js`).
- [ ] J3.2 Static calendar seed: 2026 AKC rounds + state championships -> `api/data/calendar-static.json`, cache -> `au-kart-events.json`. Health check threshold (10+ events) unchanged.
- [ ] J3.3 Headlines feeds: RR feeds -> KartSportNews, Karting Australia news, FIA Karting, TKART. Same RSS/cheerio pipeline.
- [ ] J3.4 Q&A knowledge: empty `Q&A/` PDFs; ingest kart source set (Karting Australia Manual PDF, class tech regs, setup guides) PLUS general-info corpus themed on Formula 1, V8 Supercars, IndyCar Series, F1 Academy, GT Cup, GT World Challenge, NASCAR, and FIA WEC/Le Mans — new-generation racers and older greats, standout teams/drivers/cars of the last 50 years (replaces RR's MotoGP/TT book set) — per data doc. Rerun `npm run scrape-pdfs` pipeline unchanged.
- [ ] J3.5 Coach (roadraceAi.js): rename kartraceAi.js; system prompts swap rider/bike/suspension vocabulary for driver/kart/chassis; modes COACH / CHASSIS (was SUSPENSION) / FULL. Wire to new gpt-knowledge pack (C:\KartRacer\gpt-knowledge).
- [ ] J3.6 MoMS ingestion (scrapeMomsToJson, momsOnlineUrls) -> Karting Australia Manual ingestion (same JSON output shape).

## Phase 4 — Packs

- [ ] J4.1 Keep packs framework + schema unchanged. Rebuild `packs/regions/au/` content for karting: tracks (from catalog), calendar sources, headlines sources, organisations (KA + 7 state bodies + clubs), licensing (KA licence grades), competitions (classes.json = KA classes; series.json = AKC/Rotax Pro Tour/state), rules (KA Manual ref), terminology (kart glossary), suppliers, emergency, weather (unchanged).
- [ ] J4.2 Other regions: mark inactive in registry.json (AU-only launch). Framework stays for later FIA-region packs.
- [ ] J4.3 `node scripts/validate-packs` equivalents pass; active.json points at AU.

## Phase 5 — Screens sweep + strings

- [ ] J5.1 Screen-by-screen string sweep (all 20 screens): bike->kart, rider->driver, leathers->race suit, trackday->race day/practice day. No layout changes.
- [ ] J5.2 TrackWalk / TrackPrep / TrackdayPrep flows: checklist content swapped for kart paddock checklist (fuel mix, chain, sprockets, tyres, transponder, scrutineering). Same components.
- [ ] J5.3 ImportTrackNotes: unchanged mechanics; sample notes swapped.
- [ ] J5.4 Home country config: `homeCountries.ts` AU-first (unchanged mechanics).

## Phase 6 — Gates, CI, release identity

- [ ] J6.1 Port scripts/: health-check, mobile-review-preflight, prove-track-maps, validate-track-data, enforce-turn-verification, diagnose-track-memory — path/name updates only.
- [ ] J6.2 GitHub Actions workflows: repo names + cache job (refresh-au-calendar -> refresh-au-kart-calendar).
- [ ] J6.3 New icons/splash (kart silhouette), store metadata, Render/Vercel projects. EAS profile per android-app README pattern.
- [ ] J6.4 Full gate suite green: api health-check, tsc x2, prove-track-maps, validate-track-data, onboarding facts test.

## Definition of done (per phase)

Phase merges only when: tsc clean in app/ and android-app/, gate scripts pass,
no RR-domain string or data file remains in the phase's surface
(grep guard: "motorcycle|motorbike|ASBK|MotoGP|leathers|swingarm|fork|suspension" -> 0 hits outside legacy docs).
