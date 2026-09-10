# Kart Setup tool — Cursor build spec (J2.1 / KR-SETUP)

Date: 2026-09-10 (Hermes; updated same day with track/weather/upload features).
Status: engine READY + verified (49 vitest tests). Screens to build.
Design source: `tools/setup-pwa-reference/` (the Cursor-project PWA we imported).
Engine: `tools/setup-engine/` — synced into both apps.

## What Hermes already did (do not redo)

1. **Engine embedded in both apps.** `node scripts/sync-setup-engine.mjs` copies
   `tools/setup-engine/src` → `app/src/lib/setupEngine/` and
   `android-app/src/lib/setupEngine/` (54 files), rewriting the kb JSON imports
   (`rules/load.ts` → local `./rules/*.json`; `calculators/jetting.ts` →
   `./kbdata/jetting-rad.json`). Both apps' `npx tsc --noEmit` pass with the
   engine in the tree. `--check` mode exits 1 when stale (add to preflight).
   NEVER hand-edit `src/lib/setupEngine` — edit `tools/setup-engine` + re-sync.
2. **AU compound windows added to the engine** (`kb/rules/pressure.json` v1.1.0
   + `analyzePressures.ts`): `ChassisSetup.tyreCompound` selects LeCont
   LH03/LOH/LPM/SV1 or Maxxis Cadet/MW; cold pressures are judged against the
   cited KA/importer window, hot against window+rise; compound/tyre-type
   mismatch warns. `compoundWindow(setup)` is exported for UI hints.
   Falls back to the generic 0.8–1.5 bar band when compound = "unknown".
3. Tests: 5 new compound tests in `advisor.test.ts` (39 total).
4. **Session context module** (`sessionContext.ts`, 10 tests → 49 total):
   - `Conditions` grew `trackId`, `trackName`, `humidityPct`, `pressureHpa`
     (all nullable; old saves merge cleanly via the defaults-merge load).
   - `applyWeather(conditions, weather, force?)` — merges imported weather
     WITHOUT stomping user-entered values (only fills nulls unless force);
     WMO rain codes (51-67, 80-82, 95+) flip `wet` on force-import only.
   - `conditionsAirDensity(conditions)` — RAD/density altitude once temp +
     pressure + humidity are present (drives a jetting hint on screen).
   - `firstGpsFix(samples)` — first valid GPS point in an uploaded log, for
     geofence auto-tagging of the venue.
   - `sessionConsistency(analysis)` — junior-friendly lap read: best/median/
     MAD, 0-100 consistency score, insights (improving / fading / outlier
     spikes / "change ONE thing" green light).
   - `lapTableRows(analysis)` — ready-made per-lap table (time, +delta,
     top/min speed).
   - `snapshotLabel` now includes the track name.

## Screens to build (Expo, replace the Bike* placeholders)

Reuse the design from `tools/setup-pwa-reference/src/screens/*` — same panels,
fields, and flow, restyled to the app's existing components. Keep the RR
navigation shell; rename user-facing strings only.

| PWA reference | Expo screen (replace) | Notes |
|---|---|---|
| ChassisScreen.tsx | BikeSetupSheetScreen → KartSetupSheetScreen | Full sheet: Kart / Front / Rear / Seat-ballast panels. Field-for-field port; add a **Tyre compound** SelectField (options from `pressureRules.compounds` keys + labels, "unknown" first) next to the existing Tyres slick/wet select |
| AnalysisScreen.tsx | BikeBalanceSetupScreen → KartAnalysisScreen | Three modes: Driving (symptom buttons from `SYMPTOM_LABELS`), Pressures (4×cold + 4×hot bar inputs), Temps (4×3 pyrometer grid). Run button → `diagnoseDriving` / `analyzePressures` / `analyzeTemps`. Render `AnalysisResult` (advice cards show title, why, magnitude, kbSource link, polarityNote badge for 950). Wet checklist section appears when conditions.wet (from `wetPresetChecklist`) |
| HistoryScreen.tsx | new KartSetupHistoryScreen | Snapshots via `createSnapshot`/`restoreSnapshot`/`upsertSnapshot`; label + note; restore = load into current sheet |
| ToolsScreen.tsx | fold into BikeSetupHubScreen → KartSetupHubScreen | Hub cards: Setup sheet, Analysis, History, Calculators (gearing, fuel mix, corner weights, caster sweep, RAD/jetting — all in `../lib/setupEngine`) |
| storage.ts | app/src/storage/kartSetup.ts | Same shape but AsyncStorage (async) instead of localStorage. Keys: reuse engine constants `CURRENT_STORAGE_KEY` / `HISTORY_STORAGE_KEY` but prefix `@kartrace_` per AGENTS.md: `@kartrace_setup_current_v1`, `@kartrace_setup_history_v1`. Merge-with-defaults on load exactly like the PWA (`{ ...fallback.setup, ...current.setup }`) so schema additions (e.g. tyreCompound) never crash old saves |

`BikeSetupBasicsScreen` (hotspot diagram): keep as a separate J2.1 task —
`kartSetupBasics.ts` content comes from `gpt-knowledge/chassis-setup-and-tyre-kb.md`.
The interactive tool above is the priority; the diagram is education copy.

## Import pattern (both apps)

```ts
import {
  diagnoseDriving, analyzePressures, analyzeTemps,
  defaultChassisSetup, defaultConditions, emptyCornerPressures, emptyTyreTemps,
  wetPresetChecklist, wetPaddockReminders, compoundWindow,
  SYMPTOM_LABELS, LEVER_LABELS, pressureRules,
  type ChassisSetup, type Conditions, type AnalysisResult,
} from '../lib/setupEngine';
```

Mirror every screen to android-app (no shared folders — copy, per repo rule).

## UX rules (KartRacer audience: juniors + parents)

- Advice cards: ONE highlighted "do this next" (advice[0]) + collapsed rest.
  The engine already sorts by priority and enforces one-change-at-a-time.
- Always show `result.reminder` at top and `warnings` as amber banners.
- Show the compound window under the pressure inputs when compound ≠ unknown:
  `compoundWindow(setup)` → "LH03: 9.5–11 psi cold (KA guidance)".
- Blocked advice (`result.blocked`) renders greyed with the reason — teaches
  why "widen front" is off the table at max width.
- Units: bar primary, psi secondary in parentheses (KA quotes psi; engine is bar).
- No lap-time promises anywhere; sign-off line matches gpt-knowledge/instructions.md.

## Gates before merge

```bash
cd tools/setup-engine && npm test          # 39 green
node scripts/sync-setup-engine.mjs --check # in-sync guard
cd app && npx tsc --noEmit
cd ../android-app && npx tsc --noEmit
```

Add `sync-setup-engine.mjs --check` to `scripts/mobile-review-preflight.mjs`
(or health-check) so a drifted engine copy fails the gate. Kart_tools cron
(Fridays 17:00) audits the engine weekly.

## Known deferrals

- Compound auto-select from class (kart-class-reference mapping) — nice-to-have
  after J2.2 kartEngineRef lands.
- PWA `dist/` build — reference only, never ship.

## Track, weather, and upload features (added 2026-09-10)

### 1. Track context — geofence auto-populate + picker

On KartAnalysisScreen (and the sheet header), a **Track** row:

- Auto: reuse the existing arrival stack — `detectTrackAtCurrentLocation()`
  from `app/src/location/trackGeofence.ts` (128 baked geofences). On match,
  set `conditions.trackId/trackName` and show "📍 Detected: <name>" with a
  one-tap confirm. Never silently overwrite a manually chosen track.
- Manual: searchable picker over the tracks catalog (`getTrackById` /
  tracks.ts list) — juniors' parents may log sessions from home. "Other /
  not listed" allowed (trackId null, free-text name).
- Persisted into every snapshot; `snapshotLabel` already includes it, so
  History becomes filterable by venue with no extra storage work.
- **Track history section ("Here before"):** when `conditions.trackId` (or a
  hand-typed name) is set, show previous setups at that venue directly on the
  setup sheet / analysis screen — `snapshotsForTrack(history, trackId,
  trackName)` (engine, tested) returns them newest-first (trackId exact match;
  case-insensitive name fallback for hand-tagged venues). Render each row as
  date · label · grip/wet · attached lap summary if present, with two actions:
  **Restore** (`restoreSnapshot`) and **Compare to current**
  (`diffSnapshots(current, snap)` → changed-fields list). Empty state: "First
  time at this track — save a snapshot after the session." Cap the inline list
  at 5 with "See all in History" linking to the full History screen pre-filtered
  by that venue.

### 2. Weather import

"Import weather" button on the Track/weather panel:

- Coords: geofence match centre (or `getTrackCoords(trackId)` for a manual
  pick; device GPS as fallback).
- Extend the open-meteo call in `app/src/location/trackWeather.ts` `current`
  params with `relative_humidity_2m,surface_pressure` (same API, zero new
  dependencies) and map into `ImportedWeather`.
- Merge via `applyWeather()` — fills empty fields only; a second tap offers
  "Overwrite with fresh weather" (force=true). Rain codes set the wet flag
  (with the wet checklist appearing as it already does).
- When temp+humidity+pressure land, show a small **air density card**:
  `conditionsAirDensity()` → "RAD 97.2% · density altitude 340 m" plus, for
  2-stroke classes, a link to the jetting calculator pre-filled with that RAD.
  This is the same maths the RAD/jetting calculators already use — now fed by
  live weather instead of hand-typed numbers.

### 3. Upload data — lap analysis (KartSessionUploadScreen)

New screen under the Setup hub: "Upload session data".

- Input: CSV via `expo-document-picker` (add dependency) → file text →
  `parseLoggerCsv()` (AiM Race Studio 3 aliases already handled: Time, GPS
  Speed, RPM, water/EGT temp, lat/lon G, GPS lat/lon, distance, lap) →
  `analyzeLogger()`. MyChron CSV exports use these channel names.
- Auto-tag venue: `firstGpsFix(samples)` → `findTrackByLocation(lat, lon)` →
  offer "Tag this session to <track>?" (fills conditions.trackId too).
- Render, top to bottom:
  1. Session card — venue, lap count, best lap, consistency score
     (`sessionConsistency`), one-line insights (improving/fading/outliers).
  2. Lap table — `lapTableRows()`: time, +delta to best, top/min speed.
     Tap two laps to compare.
  3. Driver-vs-chassis verdicts — `analysis.verdicts` (already implemented:
     brake-point drift = driver; low min-speed + low latG = push/chassis;
     sector-third loss; water temp; RPM-vs-topspeed gearing check). Render
     as the same advice cards as the chassis analyser.
  4. "Attach to snapshot" — stores `{bestS, medianS, consistencyPct, lapCount}`
     summary (NOT the raw samples — AsyncStorage stays small) onto the current
     sheet's next snapshot, so History shows lap evidence per setup change.
- Empty/error states come from `analysis.warnings` (bad header, <10 samples,
  lap-split failure) — show verbatim, they're already written for humans.

### What the laptime data is useful for (product rationale)

- **Setup A/B evidence**: snapshot + attached lap summary = "front hubs out,
  median dropped 0.24 s" — turns the one-change-at-a-time discipline into
  visible proof. This is the loop pro teams run; juniors get it for free.
- **Driver-vs-chassis split**: the verdicts stop parents spending money on
  setup when the stopwatch says brake markers moved (driver), and vice versa.
- **Consistency coaching**: the 0-100 score + median-vs-best framing teaches
  juniors that repeatability beats hero laps, and tells engineers when the
  driver is consistent enough for a setup change to be readable.
- **Conditions correlation (later)**: with weather + RAD on every snapshot and
  lap summaries attached, "we're 0.3 s slower and RAD is down 4%" becomes
  answerable — groundwork for a session logbook trend view (P2, backlogged in
  Kart_tools).

### Gate additions

- `expo-document-picker` added in BOTH apps (no shared folders).
- Kart_tools weekly baseline moves to **49 tests**.
