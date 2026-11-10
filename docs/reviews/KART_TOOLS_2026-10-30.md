# Kart_tools review — 2026-10-30

Previous report: `KART_TOOLS_2026-09-18.md`. Report only; no source edits.

**Headline:** the long-running P1 (jetting/fuel silent fallbacks) is **fixed**
(commit `b2af953`, 2026-10-13). All gates pass; no regression vs last week.
Nothing that passed last time fails now, so no automatic P0.

## Executive summary

**P0: 0 | P1: 0 | P2: 6**

Healthy. Oldest open items are now P2 housekeeping carried since Sept
(calendar key shadowing, bare catch, RR README/dead JSON, GeraldtonK decision,
15 closing-gap layouts). The race-day checklist pitch (#3) is now on its
**4th report with no movement**. Gearing recommender (#5) is closer to
unblocked than previously thought (see backlog).

## Gate results

| Tool | Gate | Result |
|---|---|---|
| `tools/setup-engine` | `npm test` (vitest) | ✅ **57/57** (calculators 10, sessionContext 11, advisor 25, session 11) — was 55; +2 = P1-1 regression tests |
| `scripts/sync-setup-engine.mjs --check` | run | ✅ in sync |
| `app/` `npx tsc --noEmit` | run | ✅ exit 0 |
| `android-app/` `npx tsc --noEmit` | run | ✅ exit 0 |
| `tools/*.py` (4), `tools/art-gen/*.py` (2), `scripts/*.py` (7) | py_compile | ✅ all |
| `tools/kartcoach_gpx_audit.py` | run vs `data/gpx/` | ✅ 129/129 parsed; 1 flag (GeraldtonK 244 m) — unchanged; 126/129 in 350–1100 m; ~3.5 s |
| `scripts/*.mjs`, `api/*.js`, `api/scripts/*.js` | `node --check` | ✅ all, zero failures |
| `tools/art-gen/optimize-placed.cjs` + 5 `*.sh` | node --check / bash -n | ✅ all |
| `scripts/prove-track-maps.mjs` | run | ✅ 128 layouts, **30 warnings** (unchanged; 15 layouts × 2 app copies, all "large closing gap") |
| `scripts/validate-track-data.mjs` | run | ✅ 1 warning (newcastle_nkrc planned, no GPX — unchanged) |
| `scripts/health-check.mjs` | run | ✅ PASSED — Q&A 32 files, AU calendar cache 178 events (updated 2026-10-12), aggregation 183 events; live API not running (expected) |

Timings: validate 1.2 s, GPX audit 3.5 s, prove 14.5 s (last week noted
1.15 s — likely a different measurement/cold cache; not investigated, see
Efficiency), health-check 1 m 45 s (dominated by two `tsc` runs).

## Problems + fixes

### Resolved
- **P1-1 jetting/fuel silent fallbacks — FIXED.** Verified in source:
  `jetting.ts` `nextMainJet` now returns `valid:false` + "Check your RAD
  inputs…" when `radBasePct`, `radNewPct` or `baselineStamp` is not > 0;
  `fuel.ts` `fuelMix` returns zeroed result + "Ratio and fuel amount must be
  above 0." The screen guards on `result?.valid` (`KartSetupCalculatorsScreen`
  line ~199) and `result.ratio > 0 && result.fuelLitres > 0`. Synced copies
  in app + android-app updated in the same commit; sync check clean.
- **P2-7b (art-gen inventory)** — art-gen is now gated each week (see table).

### P2-1 — `calendar-static.json` duplicate keys / shadowing (carry-over)
Verified keys today: `australia:5 national:5 australia_club:0 club:0`.
`api/calendar.js:53–54` reads `fromPack.national || fromPack.australia` and
`fromPack.club || fromPack.australia_club`. Edits to `australia` have no effect
while `national` is populated. Fix: keep `national`/`club` only; delete the
other two keys from the JSON and drop the `||` fallbacks. (Also `motogp:0`
is a dead RR key; `calendar.js:61` still returns `{ motogp: [], australia: [] }`.)

### P2-2 — Bare `catch` in `loadAuEvents` (carry-over)
`api/calendar.js:122` — `} catch { return []; }`. Fix:
`} catch (e) { console.error('Calendar: AU kart cache load failed', e.message); return []; }`.

### P2-3 — GeraldtonK 244 m decision pending (carry-over)
`GeraldtonK.gpx` still the lone audit flag. Confirm with the club whether it is
a real training loop → whitelist in `kartcoach_gpx_audit.py` + bake; otherwise
remove. Target audit flag count 0.

### P2-4 — 15 closing-gap layouts (carry-over)
Same 30 warnings. Worst by map-space gap: bolivark_sh 43.94, east_crk_nsw
39.91, spkp_var1 39.16, wollongongk 30.15, spkp_var3 18.81, plus 10 more.
One re-bake with endpoint gap-closing (or GPX endpoint fixes) clears the
last warning class before J1 sign-off.

### P2-5 — RR leftovers in `api/data/` (carry-over, re-verified)
`api/data/README.md` still opens with MotoGP / WorldSBK / ASBK sourcing;
`au-road-race-events.json` and `au-road-race-sources.json` still present.
Fix: rewrite README for the kart pipeline; delete the two JSONs after a
`grep -rn au-road-race` to confirm nothing reads them.

### P2-6 — Bike-named modules in app (carry-over, scope shrinking)
Still named for bikes: `app/src/calc/gearing/matchBikeRef.ts`,
`app/src/data/gearing/bikePowerbandRef.json`, `app/src/data/bikeSetupBasics.ts`,
`app/src/components/BikeSetupHotspotSheet.tsx`, screens `BikeSetupBasicsScreen`
/ `BikeSetupHubScreen`. **New finding:** `app/src/data/gearing/kartEngineRef.json`
now exists (cited IAME KA100 etc., "Rok DVS Junior and KZ2 omitted until
VERIFY") and `matchBikeRef.ts` is the only file referencing it — so the engine
refs are in; only the rename/wiring is left. Rename `matchBikeRef` →
`matchKartEngineRef` and drop `bikePowerbandRef.json` when no importer remains.

### P2 (new) — `tools/art-gen/qa-results.md` generated output tracked in git
Still tracked (`git ls-files` confirms); `.gitignore` has no entry. Add it
(like `qa.log`/`run.log`) and `git rm --cached`.

### Rules/data drift — CLEAN
- Last commits to `kb/rules`, `kb/data`, `gpt-knowledge`: 2026-09-25 / 09-10;
  none since last report, working tree has no non-review modifications.
- Cadet wet tyre MW21/MW22 agreement (kb vs gpt-knowledge) noted last week is
  now committed.
- Jetting/fuel maths unchanged apart from the validation fix; the worked
  example in `gpt-knowledge/chassis-calculations.md` is unaffected.

## Efficiency wins

1. **Carry-over (4th week):** add `sync-setup-engine.mjs --check` to
   `health-check.mjs` (one `execSync`, pass/fail line). Prior P0 would have
   been caught automatically.
2. **Carry-over:** `kartcoach_gpx_audit.py --json` →
   `docs/reviews/data/gpx-audit-latest.json`. Script still has no argparse
   (`sys.argv` only); ~10 lines. Gives mechanical week-over-week flag deltas.
3. **New:** `health-check.mjs` takes ~105 s, mostly two sequential `tsc`
   runs. Run app and android-app `tsc` in parallel (`Promise.all` over
   `spawn`) — expected ~halve wall time; add a `--fast` flag to skip tsc for
   cron preflights.
4. `prove-track-maps.mjs` measured 14.5 s today vs ~1.2 s in earlier reports;
   cause not isolated (may be cold file cache or added racing-line checks).
   Worth a one-off `--cpu-prof` if it stays >10 s next week.

## New-tool backlog

| # | Tool | User | Status |
|---|---|---|---|
| 1 | RAD / jetting quick-calc screen | Racer + parent | **built** (hardened this cycle) |
| 2 | Corner-weight scale assistant | Engineer/parent | **built** |
| 3 | Race-day checklist generator | Junior racer + parent | **proposed — 4th week, needs approve/defer** |
| 4 | Session logbook analyser | Engineer | partially built (`KartSetupHistoryScreen` exists; venue trend view still open) |
| 5 | Gearing recommender per track | Racer | backlog — **unblocked-ish**: `kartEngineRef.json` landed; needs P2-6 rename + GPX-length input |
| 6 | Tyre-life tracker | Parent/engineer | backlog |

### Pitch: #3 Race-day checklist generator (inputs re-verified today)
All eight source files present in `kb-au-rules/data/` (`classes`, `clubs`,
`fees-penalties`, `licences`, `meeting-levels`, `restrictors`,
`state-overrides`, `tyres-fuel-oils`). `tools/raceday-checklist/` still does
not exist. Sketch: `node tools/raceday-checklist/index.mjs --class ka3-junior
--level club --state NSW` → printable markdown (min weight, restrictor,
control tyre/fuel/oil, licence grade, scrutineering items, key fees).
Zero new maths; doubles as a completeness test for the rules JSON; later
re-usable as a in-app "Race-day pack" screen for parents. Ask: Cursor slots
or defers it explicitly.

### Secondary pitch: #5 Gearing recommender, scoping step
Cheapest first step: one-off audit that every `kartEngineRef.json` engine id
used in `onboardingKarts.json` resolves, then a CLI that prints
sprocket suggestions per track from GPX lap length + `calculators/gearing.ts`
(`gearing(input: GearingInput)` exists in the engine). No new maths.

## Delta vs last report (2026-09-18)

- ✅ **Resolved:** P1-1 jetting/fuel fallbacks (commit b2af953, +2 tests, 57/57).
- ✅ **Resolved:** art-gen added to weekly gate inventory.
- 🆕 **Progress:** `kartEngineRef.json` landed (shrinks P2-6).
- ➡️ **Unchanged:** GPX flag 1, prove warnings 30, validate warning 1, sync
  clean, all `node --check`/py_compile clean.
- ❌ **Still open:** calendar key shadowing, bare catch, GeraldtonK, closing
  gaps, RR README/JSONs, bike-named modules, `qa-results.md` tracked,
  health-check sync guard, GPX `--json`.
- 📈 **Baselines for next week:** setup-engine **57**, GPX flags 1, prove
  warnings 30, health-check pass (~105 s).
