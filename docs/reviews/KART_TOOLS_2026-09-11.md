# Kart_tools review — 2026-09-11

Previous report: `KART_TOOLS_2026-09-10.md` (baseline). Both of last week's P1
calendar bugs are **fixed**; this week a new P0 appeared: the engine↔app sync is
stale and `npx tsc --noEmit` in `app/` now fails (it passed last week).

## Executive summary

**P0: 1 | P1: 1 | P2: 6**

The setup engine grew new features this week (engine kind, jetting baselines,
premix ratio, class id, analysis trace — tests now 55/55, up from 35) and the
app grew screens that *use* them (`KartSetupCalculatorsScreen`,
`KartSetupSheetFields`, `KartSetupAdviceList`), but
`scripts/sync-setup-engine.mjs` was never re-run: **12 stale synced files**,
so `app/` TypeScript fails with ~24 errors and `health-check.mjs` fails. One
command fixes it. The P1 is last week's P2-4 escalated: the silent
absurd-output fallbacks in `jetting.ts`/`fuel.ts` are now reachable from a
shipping app screen.

## Gate results

| Tool | Gate | Result |
|---|---|---|
| `tools/setup-engine` | `npm test` (vitest) | ✅ **55/55** (4 files: calculators 9, sessionContext 11, advisor 25, session 10). Up from 35 baseline — new engineKind/jetting-baseline/trace features are tested |
| `scripts/sync-setup-engine.mjs --check` | run | ❌ **FAIL — 12 stale files** (6 in `app/src/lib/setupEngine`, 6 in android-app mirror: analyzePressures, analyzeTemps, defaults, diagnoseDriving, diff, types) |
| `app/` | `npx tsc --noEmit` | ❌ **FAIL** (~24 errors, all caused by the stale sync — see P0-1) |
| `android-app/` | `npx tsc --noEmit` | ✅ (its screens don't use the new fields yet; mirror is still stale → latent break) |
| `tools/*.py` (4 files) | py_compile | ✅ all |
| `tools/kartcoach_gpx_audit.py` | run vs `data/gpx/` | ✅ 129/129 parsed; 1 flag (GeraldtonK 244 m) — same as last week |
| `scripts/*.mjs` (52 files) | `node --check` | ✅ all |
| `api/*.js` + `api/scripts/*.js` (18 files) | `node --check` | ✅ all |
| `scripts/prove-track-maps.mjs` | run | ✅ 128 layouts, 158 warnings (unchanged) |
| `scripts/validate-track-data.mjs` | run | ✅ 1 warning (newcastle_nkrc planned, no GPX — unchanged) |
| `scripts/health-check.mjs` | run | ❌ **FAILED (1 issue)** — `FAIL TypeScript (app)`; same root cause as P0-1. Everything else OK: retrieveForAsk 5 chunks, Q&A 32 files, AU calendar 5 events, aggregation 5 |

## Problems + fixes

### P0-1 — Setup-engine sync stale: app TypeScript gate broken
`scripts/sync-setup-engine.mjs --check` reports 12 stale files. The source
engine (`tools/setup-engine/src/types.ts`) gained `EngineKind`,
`baselineJetStamp`, `baselineRadPct`, `premixRatio`, `classId` on
`ChassisSetup` and `trace: AnalysisTraceStep[]` on `AnalysisResult`; app
screens already consume all of them
(`KartSetupSheetFields.tsx:30/64/280–291`,
`KartSetupCalculatorsScreen.tsx:128–254`, `KartSetupAdviceList.tsx:28–31`),
but the synced copy `app/src/lib/setupEngine/types.ts` predates the change.
Result: `tsc` fails in `app/` (TS2339/TS2353 ×24) and `health-check.mjs`
fails — a gate that passed last week, so automatic P0.

**Fix (one command):** `node scripts/sync-setup-engine.mjs`, then re-run
`npx tsc --noEmit` in both `app/` and `android-app/`.
**Process fix:** whoever edits `tools/setup-engine` must run the sync in the
same change — consider adding `sync-setup-engine.mjs --check` as a step inside
`health-check.mjs` so this can't silently regress again (it currently isn't
checked there; I caught it only because the skill inventory mandates it).

### P1-1 — `jetting.ts` / `fuel.ts` silent absurd fallbacks now user-reachable (escalated from last week's P2-4)
`tools/setup-engine/src/calculators/jetting.ts:52` —
`const radBasePct = input.radBasePct > 0 ? input.radBasePct : 1;` → a 0/NaN
base RAD with a real `radNewPct` (~90) yields flowFactor ≈ 90 and a jet ~9×
too big, with a confident summary sentence. `fuel.ts:13` — `ratio > 0 ? ratio
: 1` → 1:1 "premix" = 1000 ml oil/L, silently. Last week these were P2
("about to gain app-facing screens"); `KartSetupCalculatorsScreen.tsx` now
exists and calls both (`fuelMix`, RAD/jetting path), so bad input → confidently
wrong trackside numbers for a junior racer's parent. That is P1 by this
skill's own ladder.

**Fix:** return an explicit invalid-input result instead of clamping, e.g.
```ts
if (!(input.radBasePct > 0) || !(input.radNewPct > 0)) {
  return { ...hold, summary: "Check your RAD inputs — both values must be above 0." };
}
```
and in `fuelMix`: `if (!(ratio > 0) || !(fuelLitres > 0)) return { …, summary: "Ratio and fuel amount must be above 0." }`.
Add a vitest case each (baseline moves 55 → 57).

### P2-1 — `calendar-static.json` unread duplicate keys (carry-over)
Still present: `national` (5 events) duplicates `australia` verbatim; `club`
is unread. `calendar.js` reads `australia`/`australia_club` only. Same drift
trap as last week. Fix unchanged: keep one key.

### P2-2 — Bare `catch` in `loadAuEvents` (carry-over)
`api/calendar.js:122` — `catch { return []; }`. Fix unchanged:
`catch (e) { console.error('Calendar: AU kart cache load failed', e.message); return []; }`.

### P2-3 — GeraldtonK: 244 m flag **and** it is the missing 129th layout (merges last week's P2-5 + P2-6)
Root cause found this run: normalising stems, the one GPX absent from
`app/src/data/gpxTrackMaps/` is exactly `GeraldtonK.gpx` — the 244 m file the
auditor flags. So "129 GPX vs 128 proved layouts" and the length flag are one
item: the bake path evidently excludes it (or it was never baked). Decide
before J1 sign-off: confirm against the Geraldton City Kart Club whether 244 m
is a real junior/training loop → bake it and whitelist the length in
`kartcoach_gpx_audit.py`; or it's a partial lap → fix/remove the GPX. Either
way the audit flag should go to zero so new flags stand out.

### P2-4 — wollongongk 30.15 map-unit closing gap (carry-over)
Unchanged in both app copies per `prove-track-maps.mjs`. Reconcile before J1
bake sign-off.

### P2-5 — RR leftovers: stale `api/data/README.md` + dead road-race data files (new)
`api/calendar.js` is now fully karted (nice), but `api/data/README.md` still
documents MotoGP/WorldSBK/ASBK/TheSportsDB sourcing that no longer exists, and
`api/data/au-road-race-events.json` + `au-road-race-sources.json` are now dead
files nothing reads. Fix: rewrite README for the kart pipeline
(`au-kart-sources.json` → `refreshAuCalendar.js` → `au-kart-events.json`),
delete the two road-race JSONs.

### P2-6 — Bike-named calc modules remain in app (carry-over, reduced)
`app/src/calc/bikeBalance/` is **gone** (good). Still present:
`app/src/calc/gearing/matchBikeRef.ts` (+ bike-ref data flow) and
`bikeSetupBasics.ts` alongside `kartSetupBasics.ts` in `app/src/data/`. J2
scope for Cursor; blocks new-tool backlog #5 (gearing recommender).

### Rules/data drift check — CLEAN
- `kb/data/jetting-rad.json` (keys: rad_standard, direction, jet_stamp,
  formula, example) still matches `jetting.ts` maths and the
  `gpt-knowledge/chassis-calculations.md` worked example (94%→86% → stamp 57).
- `kb/rules/pressure.json` window/step unchanged; matches synced app copy and
  `gpt-knowledge` pressure guide.
- New engine fields (`engineKind`, premix, baselines) are typed/config only —
  no numeric authority added, nothing to drift. Sealed-4SS "hide jet stamps"
  gating is consistent with `kb` treating jetting as two-stroke-only.
- `quasi_steady_line.py` motorcycle `BIKES` — still fenced, still J1.7.

## Efficiency wins

1. **Carry-over, still recommended:** `kartcoach_gpx_audit.py --json` →
   `docs/reviews/data/gpx-audit-latest.json`. Not implemented (script has no
   argparse/json today). ~10 lines; makes week-over-week flag deltas mechanical
   for both this review and KartCoach's.
2. **New:** fold `sync-setup-engine.mjs --check` into `health-check.mjs` (one
   `execSync` + pass/fail line). This week's P0 would have been caught by the
   first person who ran the health gate instead of by the weekly review.
3. No O(n²) or startup regressions found; audit ~1 s, prove/validate fast.

## New-tool backlog

| # | Tool | User | Status |
|---|---|---|---|
| 1 | RAD / jetting quick-calc screen | Racer + parent | **built** — `KartSetupCalculatorsScreen.tsx` uses `radPercentFromWeather` + jetting path (blocked from shipping only by P0-1 sync; harden with P1-1 fix) |
| 2 | Corner-weight scale assistant | Engineer/parent | **built** — same screen uses `analyzeCornerWeights` + `planBallast` |
| 3 | Race-day checklist generator | Junior racer + parent | **proposed → advance this week** (see below) |
| 4 | Session logbook analyser | Engineer | **partially built** — `KartSessionUploadScreen.tsx` wires `parseLoggerCsv` + `analyzeLogger`; venue trend history still open |
| 5 | Gearing recommender per track | Racer | backlog — still blocked on kart engine refs replacing `matchBikeRef.ts` (P2-6) |
| 6 | Tyre-life tracker (heat cycles vs KA durability) | Parent/engineer | backlog |

### This week's pitch: #3 Race-day checklist generator (CLI first)
- **User/problem:** an 8–16yo's parent at their first club meeting doesn't know
  the scrutineering list, class minimum weight, control tyre/fuel, or which
  licence grade applies.
- **Feasibility (re-verified today):** `kb-au-rules/data/` has all required
  inputs — `classes.json`, `licences.json`, `meeting-levels.json`,
  `tyres-fuel-oils.json`, `fees-penalties.json`, `state-overrides.json`,
  `clubs.json`.
- **I/O:** `node tools/raceday-checklist/index.mjs --class ka3-junior --level club --state NSW`
  → printable markdown: min weight, control tyre/fuel/oil, licence grade +
  P-plate rule, scrutineering items, key fees. Plain sentences, no jargon.
- **Lives:** `tools/raceday-checklist/` CLI first (doubles as a completeness
  test of the rules JSON), app screen in J3.x. Zero new maths.

## Delta vs last report (2026-09-10)

- ✅ **Resolved:** P1-1 (calendar reads `au-kart-events.json`, kart discipline
  filter, AKC inference — all verified in `calendar.js:17/96/100–107`);
  P1-2 (ASBK relabel gone — static normalize respects `e.series`, line 136);
  P2-7 partially (bikeBalance module deleted).
- ❌ **New P0:** sync-setup-engine stale → app tsc + health-check fail (gates
  that passed last week).
- ⬆️ **Escalated:** P2-4 → P1-1 (calculator fallbacks now behind a real screen).
- 🔎 **Root-caused:** 129-vs-128 mystery = GeraldtonK (merged with its length
  flag into P2-3).
- ➡️ **Carry-over open:** static-JSON duplicate keys, bare catch, wollongongk
  gap, matchBikeRef, junior display names (J1.2), `--json` audit output.
- 📈 **New baselines for next week:** setup-engine **55** tests, GPX flags 1,
  prove warnings 158, sync-check must be clean.
