# KartRacer — Research data + Cursor build instructions

Date: 2026-09-10 (Hermes research pass)
Goal: fill every remaining data placeholder and complete the build to an
OPERATIONAL PRODUCT READY TO TEST (app boots, screens populated, API serves
kart calendar + Q&A, gates pass).

Read first: `docs/CURSOR_BUILD_JOBS.md` (job numbers referenced below),
`docs/KR_DATA_EQUIVALENTS.md`, `AGENTS.md`.

Rule of the repo: NEVER invent numbers. Every figure below carries its source.
Anything marked VERIFY needs a human/source check before shipping in-app.

---

## 1. TYRE DATA (researched, cited — ready to use)

Already written into the repo by Hermes — do not re-research:

- `gpt-knowledge/control-tyre-data-extract.md` — POPULATED v1.0. Full KA
  2022–2026 spec-paper extract (sizes, service/max pressures, tread depths,
  weights, hardness, durability classes) + cited cold-pressure baselines.
- `kb/sources/tyre-spec-pdfs/` — the six official KA spec PDFs archived.
- `gpt-knowledge/tyre-pressure-weather-troubleshooting-guide.md` — updated
  with those baselines.

Key numbers Cursor may surface in-app (all cited in the extract file):

| Tyre | Classes | Cold pressure baseline | Source |
|---|---|---|---|
| LeCont LH03 AUS | KA3, KA4, TaG Restricted, DD2, Jr Max | 9.5–11.0 psi | KA notice + International Karting |
| LeCont LOH (SVB spec) | KA2, TaG 125, Jr Performance | 8.5–10 psi | KA notice |
| LeCont LPM (SVC spec) | X30, Rok GP, KZ2 | 8.0–9.5 psi | KA notice |
| Maxxis Cadet M190D | Cadet 9/12 | 0.6 bar (~8.7 psi) recommended | KA spec paper |
| LeCont SV1 (wet) | all LeCont classes | 0.9 bar service ±0.3 | CIK form |
| Maxxis MW21 (F) / MW22 (R) wet | Cadet | 1.0 bar service / 0.6 recommended | KA spec paper |

App copy rule: present as "recommended starting pressure — adjust for track
and weather" (KA's own caveat). Weights in classes are kart+driver+equipment.

## 2. ENGINE REFERENCE — for J2.2 `kartEngineRef.json`

Researched specs (manufacturer/importer published):

| Engine | Classes | Power | Notes | Source |
|---|---|---|---|---|
| IAME KA100 (100cc air-cooled Reedjet) | KA3/KA4 (restricted variants), KA3 Snr unrestricted | ~13 hp @ 9,500 rpm restricted; ~15 Nm @ 9,750 unrestricted figure block on importer sheet | Restrictors: KA4 19mm→22mm from 2023 (2026 book: 19mm KA4, 22mm KA3 Jr — use kb-au-rules/data/restrictors.json as authority) | agskartparts.com.au IAME KA sheet (VERIFY hp/rpm pairing vs sheet), karting.net.au restructure notice |
| IAME X30 (125cc TaG, water-cooled) | X30 | ~30 hp @ ~11,000–11,250 rpm; ~19.5 Nm @ 10,250–10,500; 16,000 rpm limiter | Dry centrifugal clutch, PULP | velocekart.com.au (Lightning Karts AU) + italcorseamerica.com |
| Rotax 125 Senior MAX EVO | Rotax 125, TaG Restricted (SR2/SR3) | 30 hp (22 kW) @ 11,500 rpm; 21 Nm @ 9,000 | Restrictor ids in kb-au-rules/data/restrictors.json | rotax-racing.com datasheet |
| Rotax 125 Junior MAX EVO | Junior Max | 23 hp (17 kW) @ 8,500 rpm; 19 Nm @ 8,500; SR4 23.5mm | rotax-racing.com datasheet |
| Vortex Mini Rok (60cc) | Cadet 9 (16mm restr.) / Cadet 12 (open) | 10 hp @ 11,000 rpm; 6.5 Nm @ 9,000; max 15,500 | vortex-engines.com |
| Torini Clubmaxx TC210 (212cc 4-stroke) | 4SS | 10 hp @ 5,600 rpm; 15 Nm @ 3,400; sealed | Homologation PDF: kartingaustralia.mymedia.delivery TC210 (Feb 2024) | patrizicorse.com + torini.com.au |
| Rok DVS Junior | KA2 | VERIFY — pull from vortex-engines.com DVS page | — |
| KZ 125 gearbox | KZ2 | ~40+ hp class figure — VERIFY per homologated make | — |

Sprocket context for the gearing screen: single ratio, front 10–11T typical,
rear ~68–95T; wet preset +3 rear teeth (already in tools/setup-engine).

## 3. 2026 AKC CALENDAR — for J3.2 `calendar-static.json`

Source: karting.net.au/ka-calendar + KartSportNews 2025-12-04 + AKC Facebook
(Round 3 venue). Series name: 2026 Penrite Australian Kart Championship.

| Round | Date 2026 | Venue | State |
|---|---|---|---|
| 1 | Mar 13–15 | C.ex Raceway, Coffs Harbour (Coffs Harbour Kart Racing Club) | NSW |
| 2 | May 15–17 | Ipswich Kart Club | QLD |
| 3 | Jul 3–5 | Townsville (per AKC provisional entry list post) | QLD |
| 4 | Sep 4–6 | Eastern Lions Kart Club, Seymour | VIC |
| 5 | Oct 16–18 | Bolivar Raceway, Southern Go-Kart Club | SA |

AKC classes on entry schedule: Cadet 9, Cadet 12, KA2, KA3 Junior, KA3 Senior,
X30, TaG 125, KZ2. Rounds 1–2 and 4–5 dates also on karting.net.au/ka-calendar.
Rotax Pro Tour + state title dates: VERIFY at rotax.com.au / state calendars
before adding (not researched this pass).

## 4. CALENDAR SOURCES — for J3.1 `au-kart-sources.json`

State calendar URLs (linked from karting.net.au/ka-calendar — treat as
authoritative link set; scrape format VERIFY per site):

- NSW: kansw.com.au/calendar/
- NT: kartingnt.com.au/calendar/
- QLD: kartingqld.com.au/calendar/
- SA: kartingsa.com.au/calendar/ (confirmed rich event list incl. AKC R5)
- TAS: karting.net.au/the-aka-calendar/tasmania
- VIC: vka.asn.au/calendar/
- WA: kartingwa.com.au/calendar/
- National combined: portal-driven widget on karting.net.au/ka-calendar
  (client-side; may need portal API inspection — same pattern as RR Timely ICS
  discovery: check network tab for a JSON/ICS feed).

## 5. HEADLINES FEEDS — for J3.3 (probed live 2026-09-10)

| Feed | URL | Status |
|---|---|---|
| KartSportNews | https://www.kartsportnews.com/feed/ | 200, valid RSS — PRIMARY |
| Karting Australia | https://www.karting.net.au/feed/ | 200, valid RSS |
| TKART | https://www.tkart.it/feed/ | 403 (blocked) — DROP or retry with UA header |
| FIA Karting | https://www.fiakarting.com/rss | 200 but text/html — VERIFY real feed URL or scrape news page |

Include keywords: Kart, AKC, Rotax, Club Day, State Titles, Cup.
Exclude: Motocross, Speedway, Road Race, Superkart (DECIDED: superkarts out).

## 6. ONBOARDING DATA — for J2.3 (researched angle, blurbs to write)

`onboardingDrivers.json` (karting-to-pro pathway, verify every fact on the
official series bios before shipping):

- F1 ex-AU-karting: Oscar Piastri (started karting ~2011 Vic), Daniel
  Ricciardo (Tiger Kart Club WA), Jack Doohan (AKC graduate). Global ex-karters:
  Hamilton, Verstappen, Leclerc, Norris, Alonso.
- Supercars from AU karting: Scott McLaughlin (also IndyCar), Will Power
  (IndyCar, Toowoomba karting origin), Broc Feeney, Will Brown, Cam Waters.
- IndyCar: Power, McLaughlin, Palou (Spanish karting), Dixon (NZ karting).
- F1 Academy: Aiva Anagnostiadis (AU, ex-karting) — VERIFY current grid.
- Format: keep RR aliases + characteristics schema (see onboardingRiders.json
  in Send-It for shape). Kid-readable blurbs, karting-origin angle first.

`onboardingKarts.json` (chassis + engine packages; importer set confirmed on
KA partner page): Tony Kart / Kosmic / LN Kart (OTK Kart Group Australia),
Birel ART + Lenzokart (Patrizicorse / JDP), Arrow + FA Kart + KR + DAP (DPE
Kart Superstore), Parolin (Parolin Australia), EOS (Alpha Motorsport / EKS).
Engines: KA100 + X30 (Remo Racing = IAME AU), Rotax (International Karting /
IKD), Torini (torini.com.au), Vortex (vortex-engines.com).

## 7. CURSOR JOB LIST — fill placeholders, then build to testable

Execute in this order (job ids from docs/CURSOR_BUILD_JOBS.md):

P0 — data plumbing (app boots with kart data):
1. J1.1–J1.4: bake 129 GPX → tracks.json catalog, gpxTrackMaps, geofences.
   Pre-import fixes listed in CURSOR_BUILD_JOBS (S/F offsets, CanberraLong ACT
   tag, venue-name table). Gates: prove-track-maps, validate-track-data.
2. J1.5–J1.6: reset turn_verification (empty hands OK; P0 rule: GPX never sets
   direction), skeleton trackDetailsCorners/trackInfo/trackMemory.
3. J2.1: kartSetupBasics.ts from gpt-knowledge/chassis-setup-and-tyre-kb.md
   (hotspots: front width, caster, camber, toe, axle, hubs, seat, ride height,
   pressures — use section 1 pressure table for the pressure hotspot copy).
4. J2.2: kartEngineRef.json from section 2 table (mark VERIFY rows; omit until
   verified rather than guess). Gearing screen → single-ratio sprocket calc;
   port math from tools/setup-engine/src/calculators/gearing.ts.

P1 — content (screens feel real):
5. J2.3: onboardingKarts.json + onboardingDrivers.json from section 6.
6. J2.6: rider_ai_faqs → kart FAQs from kb-au-rules (licence path, class
   picker, first club day, transponders, weights). Cite KA Manual edition.
7. J3.1–J3.2: au-kart-sources.json (section 4) + calendar-static.json
   (section 3). Refresh script rename: refresh-au-calendar → kart version.
8. J3.3: headlines feeds from section 5 (KartSportNews primary).
9. J2.7: trivia bank — theme per KR_DATA_EQUIVALENTS (F1/Supercars/IndyCar/
   F1 Academy/GT/NASCAR/WEC + karting origins). Use buildTriviaBank.js.

P2 — coach + Q&A:
10. J3.5: kartraceAi.js — system prompt from gpt-knowledge/instructions.md
    (BEGIN..END block is written and ready); modes COACH/CHASSIS/FULL.
11. J3.4: Q&A ingest — download 2026 KA Manual PDFs from
    karting.net.au/administration/rules into Q&A/, run scrape-pdfs. The six
    tyre spec PDFs in kb/sources/tyre-spec-pdfs/ can join the corpus.

Definition of "ready to test" (all must pass from repo root):
- npx tsc --noEmit in app/ AND android-app/ — clean
- node scripts/prove-track-maps.mjs — pass (lines may warn-missing)
- node scripts/validate-track-data.mjs — pass
- node scripts/health-check.mjs — pass with au-kart-events.json populated
  (10+ events) and API serving /health + /calendar
- cd tools/setup-engine && npm test — 35 tests green (already passing)
- App boots in Expo: Home, Events (2026 AKC visible), Tracks list (129 venues),
  Kart Setup hub, Coach, Q&A respond without motorcycle remnants
- grep gate: no "bike|rider|motorcycle" user-facing strings left in app/src
  (internal filenames can wait)

Out of scope for this pass (post-test): racing-line solver retune (J1.7),
per-track coaching bias files, technique book extracts, Rotax Pro Tour data.

---
Sources register for this report: karting.net.au (technical page, tyre FAQ,
ka-calendar, restructure notice), kartingaustralia.mymedia.delivery (spec +
homologation PDFs), patrizicorse.com, internationalkarting.com.au,
velocekart.com.au, italcorseamerica.com, rotax-racing.com, vortex-engines.com,
torini.com.au, agskartparts.com.au, kartsportnews.com, AKC Facebook.
Community anecdotes (Reddit pressures) are flagged as anecdote only.
