# Kart_tools review — 2026-09-10

First Kart_tools run (no previous KART_TOOLS report; KARTCOACH_2026-09-08.md read
for carry-over context — its 9 GPX data flags and junior-naming concern are noted
under Delta below).

## Executive summary

**P0: 0 | P1: 2 | P2: 7**

All gates pass. The two P1s are both in `api/calendar.js`: (1) the kart event
cache the scraper actually writes (`au-kart-events.json`) is never loaded — the
loader still points at the RoadRacer file and filters on motorcycle disciplines;
(2) the 5 AKC static rounds are force-relabelled as **ASBK (Superbike)** before
they reach the app. Setup-engine maths verified against `kb/` and
`gpt-knowledge/` — **no rules/data drift found**.

## Gate results

| Tool | Gate | Result |
|---|---|---|
| `tools/setup-engine` | `npm test` (vitest) | ✅ **35/35** (3 files: calculators 9, advisor 20, session 6) — matches baseline |
| `tools/apply_identity.py` | py_compile | ✅ |
| `tools/bootstrap_placeholders.py` | py_compile | ✅ |
| `tools/kartcoach_gpx_audit.py` | py_compile + run vs `data/gpx/` | ✅ 129/129 parsed; 1 flag (GeraldtonK 244 m below kart range) |
| `tools/tkk2gpx.py` | py_compile | ✅ (no fresh conversion run; source `.ztracks` present in `gpt-knowledge/Aus_Kart.ztracks`) |
| `scripts/*.mjs` (66 files) | `node --check` | ✅ all |
| `scripts/build-racing-lines.py` + `scripts/lib/*.py` | py_compile | ✅ |
| `api/*.js` + `api/scripts/*.js` | `node --check` | ✅ all |
| `scripts/prove-track-maps.mjs` | run | ✅ 128 layouts, 158 warnings (mostly missing racing-line overlays — expected pre-J1.7) |
| `scripts/validate-track-data.mjs` | run | ✅ 1 warning (newcastle_nkrc planned, no GPX) |
| `scripts/health-check.mjs` | run | ✅ (live API check skipped — server not running, expected) |

## Problems + fixes

### P1-1 — Kart calendar cache is dead code: scraper output never loaded
`api/calendar.js:19` reads `data/au-road-race-events.json` (contents: `[]`), while
the actual refresh script `api/scripts/refreshAuCalendar.js:16` writes
`data/au-kart-events.json` (5 AKC events, discipline `"kart"`). Even if the path
were fixed, the filter at `calendar.js:102` only passes
`['road_race','track_day']`, so `"kart"` events are dropped. The app currently
only sees kart events via the duplicated `calendar-static.json` entries.

Suggested diff (calendar.js):
```js
- const AU_EVENTS_PATH = join(__dirname, 'data', 'au-road-race-events.json');
+ const AU_EVENTS_PATH = join(__dirname, 'data', 'au-kart-events.json');
...
- .filter((ev) => ['road_race', 'track_day'].includes((ev.discipline || '').toLowerCase()))
+ .filter((ev) => ['kart', 'track_day'].includes((ev.discipline || '').toLowerCase()))
```
and replace the ASBK series inference (lines 108–116) with AKC/club inference
(`/akc|australian kart championship/i` → `akc`, else `au_kart_club`). Default
title fallback `'Road race event'` (line 104) → `'Kart event'`.

### P1-2 — AKC rounds relabelled as ASBK
`api/calendar.js:196-198`:
```js
const australia = (staticData.australia || []).map((e) =>
  normalizeStaticEvent('asbk', { ...e, series: 'asbk', seriesLabel: 'ASBK' })
);
```
The override literals come **after** the spread, so the static file's correct
`series: 'akc'` / `seriesLabel: 'Australian Kart Championship'` are clobbered.
A parent opening the calendar sees the Australian Kart Championship labelled
"ASBK". Fix: respect the event's own series —
`normalizeStaticEvent(e.series || 'au_club', { seriesLabel: e.seriesLabel || 'AU Karting', ...e })`
or simply drop the forced overrides.

### P2-1 — `calendar-static.json` has unread duplicate keys
The file carries `national` (5 events) and `club` keys that `calendar.js` never
reads (it reads `motogp`/`australia`/`australia_club`), and `national`
duplicates `australia` verbatim. Drift trap: someone updates one copy, the app
shows the other. Fix: single `australia` key (or read `national` and delete the
duplicate).

### P2-2 — MotoGP/WorldSBK still aggregated (RR leftover, scope)
`calendar.js` fetches WorldSBK from TheSportsDB and maps a `motogp` static key.
AGENTS.md says kart data instead of motorcycle road race. Pending J3.1/J3.2
decision — either drop, or replace with kart-relevant world series (FIA Karting
Worlds/Europeans). Flag for Cursor; not a build break.

### P2-3 — Silent failure in `loadAuEvents`
`calendar.js:131` — bare `catch { return []; }`. A malformed cache file is
indistinguishable from an empty one; health-check would report "0 events"
without a cause. Fix: `catch (e) { console.error('Calendar: AU kart cache load failed', e.message); return []; }`
(matches the pattern already used in `loadStatic`).

### P2-4 — `jetting.ts` invalid-input fallback produces absurd output silently
`tools/setup-engine/src/calculators/jetting.ts:52`:
`const radBasePct = input.radBasePct > 0 ? input.radBasePct : 1;`
If a UI ever passes 0/NaN-coerced base RAD, the fallback of **1%** with a real
`radNewPct` (~90) yields flowFactor ≈ 90 and a nonsense jet ~9× too big — no
warning. Same pattern in `fuel.ts:13` (`ratio <= 0` → 1:1 mix = 1000 ml/L oil).
Fix: return a `direction: "hold"`-style result with a "check your inputs" note,
or throw. Cheap, and these calculators are about to gain app-facing screens.

### P2-5 — GeraldtonK GPX 244 m (audit flag)
Only length flag out of 129. Median AU sprint is 737 m; 244 m suggests a partial
lap or a junior/training loop. Verify against club data before J1 bake — if it's
a real short layout, whitelist it in the auditor so the flag doesn't mask new
regressions.

### P2-6 — 129 GPX vs 128 proved layouts
`kartcoach_gpx_audit.py` parses 129 files; `prove-track-maps.mjs` reports 128
layouts. One file isn't making it into the layout set (plus `wollongongk` shows
a 30.15 map-unit closing gap in both app copies). Reconcile the missing id and
the wollongongk gap before J1 bake sign-off.

### P2-7 — App-side motorcycle calculators still present
`app/src/calc/bikeBalance/` (full motorcycle chassis-balance module) and
`app/src/calc/gearing/matchBikeRef.ts` are RR carry-overs in the kart app.
Known J2-scope work for Cursor, recorded here so the tools inventory is honest:
the *kart* setup maths lives in `tools/setup-engine` and is not yet wired into
the app.

### Rules/data drift check — CLEAN
- `kb/data/jetting-rad.json` worked example (base 94% / stamp 60 → 86% → 0.574 mm
  → stamp 57) matches `gpt-knowledge/chassis-calculations.md` exactly; formula in
  `jetting.ts` implements the same `sqrt(d² × flow_factor)`.
- `weight.ts` targets (43/57 front-rear, 50/50 L-R, cross 50%) match
  `chassis-calculations.md:47` and `chassis-setup-and-tyre-kb.md:25`.
- `kb/rules/pressure.json` window 0.8–1.5 bar / start 1.0 matches
  `gpt-knowledge/tyre-pressure-weather-troubleshooting-guide.md:12`.
- `airDensity.ts` uses standard Magnus + partial-pressure density vs the ISA-like
  reference declared in `jetting-rad.json.rad_standard`. Consistent.
- `quasi_steady_line.py` still has motorcycle `BIKES` — **documented and fenced**
  (module docstring + J1.7 note); carry-over, not drift.

## Efficiency wins

1. **`kartcoach_gpx_audit.py --json` output** (~10 lines): emit
   `{files, parsed, lengths, states, flags[]}` to
   `docs/reviews/data/gpx-audit-latest.json`. This weekly review (and the
   KartCoach one) currently eyeballs stdout to diff flags week-over-week; a JSON
   artifact makes the delta mechanical and catches *new* flags instantly.
2. **Single source for AKC rounds** (P2-1 fix) also removes a redundant
   parse/normalize pass over duplicated static data in every calendar build.
3. No O(n²) issues found over the 129-GPX set; audit run completes in ~1 s;
   prove/validate gates are fast. Nothing else worth touching this week.

## New-tool backlog

| # | Tool | User | Status |
|---|---|---|---|
| 1 | RAD / jetting quick-calc screen | Racer + parent at trackside | **proposed (this week)** |
| 2 | Corner-weight scale assistant | Engineer/parent on setup day | **proposed (this week)** |
| 3 | Race-day checklist generator | Junior racer + parent | **proposed (this week)** |
| 4 | Session logbook analyser | Engineer | backlog (needs session store first) |
| 5 | Gearing recommender per track (GPX length + engine ref) | Racer | backlog (blocked on kart engine refs replacing `matchBikeRef.ts`) |
| 6 | Tyre-life tracker (heat cycles vs KA durability data) | Parent/engineer | backlog |

### 1. RAD / jetting quick-calc (in-app screen)
- **Problem:** Rotax racers re-jet by feel; the maths exists and is tested but
  unreachable.
- **Feasibility (verified):** `tools/setup-engine/src/calculators/airDensity.ts`
  + `jetting.ts` are pure TS, tested, and read `kb/data/jetting-rad.json`. The
  app already fetches open-meteo in `app/src/location/trackWeather.ts` — adding
  `pressure_msl,relative_humidity_2m` to the params gives everything
  `radPercentFromWeather()` needs.
- **I/O:** inputs = baseline stamp + baseline RAD (or "use today's weather");
  output = suggested stamp, plain direction ("go one jet **smaller**"), and the
  built-in "confirm on the stopwatch" line. Junior-friendly by construction —
  the calculator already returns full-sentence summaries.
- **Lives:** app Setup hub screen; engine code vendored/shared from
  `tools/setup-engine`. Fix P2-4 first.

### 2. Corner-weight scale assistant (in-app screen)
- **Feasibility (verified):** `weight.ts` `analyzeCornerWeights()` +
  `planBallast()` are tested and already produce parent-readable notes ("Move
  about 1.5 kg forward… Do not re-bend a straight chassis").
- **I/O:** four pad readings in kg → percentages vs 43/57 target, ballast plan.
  Optional class minimum from `kb-au-rules/data/classes.json` ("you're 4 kg
  under CIK minimum — add ballast before touching balance").
- **Lives:** app Setup hub; zero new maths.

### 3. Race-day checklist generator (CLI first, screen later)
- **Feasibility (verified):** `kb-au-rules/data/` already has `classes.json`,
  `licences.json`, `meeting-levels.json`, `tyres-fuel-oils.json`,
  `fees-penalties.json`.
- **I/O:** class + meeting level → checklist: min weight, control tyre/fuel/oil,
  licence grade, scrutineering items. Output as printable markdown a parent can
  stick in the trailer.
- **Lives:** `tools/raceday-checklist/` CLI first (validates the rules JSON is
  complete enough), then app screen in J3.x.

## Delta vs last report

- No prior KART_TOOLS report — this is the baseline. All gate numbers above are
  the reference for next week (setup-engine 35, GPX flags 1, prove warnings 158).
- Carry-over from KARTCOACH_2026-09-08: the 8 start/finish-offset GPX flags and
  CanberraLong state-tag issue were coach-scoped; today's audit run shows the
  state histogram now reads ACT 2 (was 1 + 1 missing), so the CanberraLong state
  tag appears **resolved**. S/F offsets not re-measured here (coach's tooling);
  will add to the `--json` audit output once built.
- Junior display-name concern (file stems like `lkc`, `STKC`) remains open for
  J1.2.
