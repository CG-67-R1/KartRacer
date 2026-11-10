# Kart_tools review — 2026-11-06

Previous report: `KART_TOOLS_2026-10-30.md`. Report only; no source edits.

**Headline:** nothing changed in the repo since last week (last commit 2026-10-13,
no non-review working-tree changes). All gates pass and match the baselines, so
there is no automatic P0. All six open items are carry-over P2s.

## Executive summary

**P0: 0 | P1: 0 | P2: 6**

The race-day checklist pitch (#3) is now on its **5th report with no decision**.
The weekly efficiency items are also unchanged (health-check sync guard, GPX
`--json`, parallel tsc).

## Gate results

| Tool | Gate | Result |
|---|---|---|
| `tools/setup-engine` | `npm test` (vitest) | ✅ **57/57** (calculators 10, sessionContext 11, advisor 25, session 11) — same as baseline |
| `scripts/sync-setup-engine.mjs --check` | run | ✅ in sync |
| `app/` and `android-app/` `npx tsc --noEmit` | run | ✅ exit 0 / exit 0 |
| `tools/*.py` (4) + `scripts/*.py` (7) | py_compile | ✅ all 11 |
| `tools/kartcoach_gpx_audit.py` | run vs `data/gpx/` | ✅ 129/129 parsed; 1 flag (GeraldtonK 244 m) — unchanged; 126/129 in 350–1100 m; 2.4 s |
| `scripts/*.mjs`, `api/*.js` | `node --check` | ✅ zero failures |
| `scripts/prove-track-maps.mjs` | run | ✅ 128 layouts, **30 warnings** (unchanged, closing gap) |
| `scripts/validate-track-data.mjs` | run | ✅ 1 warning (newcastle_nkrc planned, no GPX — unchanged) |
| `scripts/health-check.mjs` | run | ✅ passed — AU calendar aggregation 183 events; live API not running (expected) |

## Problems + fixes (all carry-over, re-verified today)

### P2-1 — `calendar-static.json` key shadowing
`api/calendar.js:53–54` reads `fromPack.national || fromPack.australia` and
`fromPack.club || fromPack.australia_club`; edits to the fallback keys are
ignored while `national`/`club` are populated. Line 52 still returns dead RR key
`motogp`. Fix: keep `national`/`club` only, drop the `||` fallbacks and `motogp`.

### P2-2 — Bare `catch` in `loadAuEvents`
`api/calendar.js:~122` — `} catch { return []; }`. Fix:
`} catch (e) { console.error('Calendar: AU kart cache load failed', e.message); return []; }`.

### P2-3 — GeraldtonK 244 m decision pending
Lone audit flag. Confirm with the club that it is a real loop → whitelist in
`kartcoach_gpx_audit.py` and bake; otherwise remove. Target flag count 0.

### P2-4 — 15 closing-gap layouts (30 prove warnings)
Largest: bolivark_sh 43.94, east_crk_nsw 39.91, spkp_var1 39.16, wollongongk
30.15. One re-bake with endpoint gap-closing clears this warning class.

### P2-5 — RR leftovers in `api/data/`
`au-road-race-events.json` and `au-road-race-sources.json` still present;
`README.md` (22 lines) still describes MotoGP/WorldSBK/ASBK sourcing. Rewrite
README for the kart pipeline; delete the two JSONs after `grep -rn au-road-race`
shows no reader.

### P2-6 — Bike-named modules in app
`app/src/calc/gearing/matchBikeRef.ts`, `app/src/data/gearing/bikePowerbandRef.json`
(next to `kartEngineRef.json`), `bikeSetupBasics.ts`, `BikeSetupHotspotSheet.tsx`,
`BikeSetupBasicsScreen` / `BikeSetupHubScreen`. Rename `matchBikeRef` →
`matchKartEngineRef`; drop `bikePowerbandRef.json` when no importer remains.

### P2-7 — `tools/art-gen/qa-results.md` generated output tracked in git
Still in `git ls-files`. Add to `.gitignore` and `git rm --cached`.

### Rules/data drift — CLEAN
No commits to `kb/rules`, `kb/data` or `gpt-knowledge` since last report and no
working-tree changes there. setup-engine maths unchanged.

## Efficiency wins (all carry-over)

1. Add `sync-setup-engine.mjs --check` to `health-check.mjs` (one `execSync`,
   one pass/fail line). `grep` confirms health-check still does not call it —
   5th week.
2. `kartcoach_gpx_audit.py --json` → `docs/reviews/data/gpx-audit-latest.json`
   (no argparse yet; `sys.argv` only; ~10 lines) for mechanical week-over-week
   flag deltas.
3. Run app and android-app `tsc` in parallel inside `health-check.mjs` and add
   `--fast` to skip tsc for cron preflights.
4. `prove-track-maps.mjs` timing noted at 14.5 s two weeks ago (earlier reports
   ~1.2 s); not re-measured, not a defect — profile only if it becomes a problem.

## New-tool backlog

| # | Tool | User | Status |
|---|---|---|---|
| 1 | RAD / jetting quick-calc screen | Racer + parent | built |
| 2 | Corner-weight scale assistant | Engineer/parent | built |
| 3 | Race-day checklist generator | Junior racer + parent | **proposed — 5th week, needs approve/defer** |
| 4 | Session logbook analyser | Engineer | partially built (`KartSetupHistoryScreen`; venue trend view open) |
| 5 | Gearing recommender per track | Racer | backlog — needs P2-6 rename + GPX-length input |
| 6 | Tyre-life tracker | Parent/engineer | backlog |

### Pitch (unchanged): #3 Race-day checklist generator
`tools/raceday-checklist/` still does not exist. Inputs live in
`kb-au-rules/data/` (classes, clubs, fees-penalties, licences, meeting-levels,
restrictors, state-overrides, tyres-fuel-oils). Sketch:
`node tools/raceday-checklist/index.mjs --class <id> --level club --state NSW` →
printable markdown (min weight, restrictor, control tyre/fuel/oil, licence
grade, scrutineering items, key fees). No new maths; doubles as a completeness
test for the rules JSON; later reusable as an in-app "Race-day pack" screen for
parents. Please slot or defer explicitly.

### Pitch (unchanged): #5 Gearing recommender — scoping step
Verify every engine id used in onboarding karts resolves in `kartEngineRef.json`,
then a CLI printing sprocket suggestions per track from GPX lap length +
`calculators/gearing.ts`. No new maths.

## Delta vs last report (2026-10-30)

- ✅ No regressions; every gate and baseline identical.
- ➡️ Unchanged: setup-engine 57/57, GPX flags 1, prove warnings 30, validate
  warning 1, sync clean, tsc clean.
- ❌ Still open: P2-1…P2-7 above; health-check sync guard; GPX `--json`; parallel tsc.
- 📈 Baselines for next week: setup-engine **57**, GPX flags 1, prove warnings 30.
