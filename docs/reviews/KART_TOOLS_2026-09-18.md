# Kart_tools review — 2026-09-18

Previous report: `KART_TOOLS_2026-09-11.md`. Last week's P0 (stale
setup-engine sync) is **fixed** — sync check clean, `tsc` passes in both app
copies, `health-check.mjs` passes. Last week's P1 (silent calculator
fallbacks) is **still open and still user-reachable**; it leads this week.
Big positive delta: J1.7 landed (`KARTS` envelopes in the solver, 128 racing
lines baked, kart corner detector) and prove-track-maps warnings dropped
158 → 30.

## Executive summary

**P0: 0 | P1: 1 | P2: 7**

Healthy week. Every gate passes. The one P1 is a two-file, ~10-line fix that
has now survived two review cycles while sitting behind a shipping screen
(`KartSetupCalculatorsScreen`): typing `0` into "Baseline RAD %" or "Ratio"
still produces confidently wrong jetting / a silent 1:1 premix. A new tool
family (`tools/art-gen/`) appeared in the repo and is not in the audit
inventory; it syntax-checks clean but tracks a generated artifact.

## Gate results

| Tool | Gate | Result |
|---|---|---|
| `tools/setup-engine` | `npm test` (vitest) | ✅ **55/55** (calculators 9, sessionContext 11, advisor 25, session 10) — matches last week's baseline |
| `scripts/sync-setup-engine.mjs --check` | run | ✅ **in sync** (last week's P0 resolved) |
| `app/` | `npx tsc --noEmit` | ✅ exit 0 (was ~24 errors) |
| `android-app/` | `npx tsc --noEmit` | ✅ exit 0 |
| `tools/*.py` (4) + `tools/art-gen/*.py` (2) + `scripts/*.py` (3 incl. quasi_steady_line, build-racing-lines) | py_compile | ✅ all |
| `tools/kartcoach_gpx_audit.py` | run vs `data/gpx/` | ✅ 129/129 parsed; **1 flag** (GeraldtonK 244 m) — unchanged |
| `scripts/*.mjs` (52) | `node --check` | ✅ all |
| `api/*.js` + `api/scripts/*.js` (18) | `node --check` | ✅ all |
| `tools/art-gen/optimize-placed.cjs` + 4 `*.sh` | `node --check` / `bash -n` | ✅ all (new, added to inventory this week) |
| `scripts/prove-track-maps.mjs` | run | ✅ 128 layouts, **30 warnings** (was 158 — J1.7 corner/line work cleared 128 of them; all 30 remaining are "large closing gap", 15 layouts × 2 app copies) |
| `scripts/validate-track-data.mjs` | run | ✅ 1 warning (newcastle_nkrc planned, no GPX — unchanged) |
| `scripts/health-check.mjs` | run | ✅ **PASSED** (was FAIL): tsc both apps OK, retrieveForAsk 5 chunks fromKb, Q&A 32 files, AU calendar 5 events, aggregation 5; live API not running (expected) |

Timings: prove 1.15 s, validate 1.33 s, GPX audit ~1 s — no startup
regressions.

## Problems + fixes

### P1-1 — `jetting.ts` / `fuel.ts` silent absurd fallbacks — STILL OPEN (2nd week at P1)
Verified unchanged in source and both synced copies:

- `tools/setup-engine/src/calculators/jetting.ts:52` —
  `const radBasePct = input.radBasePct > 0 ? input.radBasePct : 1;`
  A user typing `0` into the screen's "Baseline RAD %" `OptionalNum`
  (`KartSetupCalculatorsScreen.tsx:167–171`) reaches `nextMainJet` with
  `radBasePct = 0` (the screen only guards `!= null`, line 145–148) →
  flowFactor ≈ 90 → jet ~9.5× too big, delivered with a confident summary.
- `tools/setup-engine/src/calculators/fuel.ts:13` —
  `const safeRatio = ratio > 0 ? ratio : 1;` The screen passes
  `session.setup.premixRatio ?? 20` (line 239), so a stored `0` becomes a
  silent 1:1 "premix" = 1000 ml oil/L.

**Fix (unchanged from last week):** return explicit invalid-input results
instead of clamping:

```ts
// jetting.ts, top of nextMainJet
if (!(input.radBasePct > 0) || !(input.radNewPct > 0) || !(input.baselineStamp > 0)) {
  return { ...holdResult(input), summary: "Check your RAD inputs — baseline stamp and both RAD values must be above 0." };
}
// fuel.ts
if (!(ratio > 0) || !(fuelLitres > 0)) {
  return { oilMl: 0, oilOz: 0, fuelLitres: 0, ratio: 0, summary: "Ratio and fuel amount must be above 0." };
}
```

Add one vitest each (55 → 57), then `node scripts/sync-setup-engine.mjs`.
This is a junior-facing tracked hazard; recommend Cursor takes it this week.

### P2-1 — `calendar-static.json` duplicate keys, now with silent shadowing (carry-over, re-worded)
`calendar.js:52–54` now reads `fromPack.national || fromPack.australia` and
`fromPack.club || fromPack.australia_club` — so the previously-unread keys are
read, but as *fallback-shadow pairs*. The file carries `national` (5) and
`australia` (5, identical) plus empty `club`/`australia_club`; whoever edits
`australia` will see nothing change because `national` wins. Fix: keep one
key per concept (`national`, `club`), delete `australia`/`australia_club`
from the JSON, drop the `||` fallbacks.

### P2-2 — Bare `catch` in `loadAuEvents` (carry-over)
`api/calendar.js:122` — `catch { return []; }` still swallows cache-load
failures. Fix unchanged:
`catch (e) { console.error('Calendar: AU kart cache load failed', e.message); return []; }`.

### P2-3 — GeraldtonK 244 m: decision still pending (carry-over)
`data/gpx/` has `GeraldtonK.gpx` (244 m, flagged, not baked) and
`GeraldtonK 2.gpx` (baked as `geraldtonk_2`). Decision unchanged: confirm
with Geraldton City KC whether 244 m is a real junior/training loop → bake +
whitelist in `kartcoach_gpx_audit.py`, or fix/remove the GPX. Audit flag
count should be 0 so new flags stand out.

### P2-4 — Closing-gap warnings: 15 layouts remain, wollongongk worst (carry-over, scoped)
Warnings collapsed 158 → 30; every survivor is a closing gap. Worst:
wollongongk 30.15, spkp_var3 18.81, then spkp_var1, rockhamptonk,
portgawlerk, mackayk, lkc, lismorek, launcestonk, indy800c + 5 more (each in
both app copies). These are GPX start/end mismatches — one re-bake pass with
gap-closing (or GPX endpoint fixes) clears the last warning class before J1
sign-off.

### P2-5 — RR leftovers in `api/data/` (carry-over, verified still present)
`api/data/README.md` still documents MotoGP/WorldSBK/ASBK/Timely road-race
sourcing; `au-road-race-events.json` + `au-road-race-sources.json` still dead.
Fix unchanged: rewrite README for the kart pipeline, delete the two JSONs.

### P2-6 — Bike-named modules in app (carry-over)
Still present: `app/src/calc/gearing/matchBikeRef.ts`,
`app/src/data/gearing/bikePowerbandRef.json`, `app/src/data/bikeSetupBasics.ts`,
`app/src/components/BikeSetupHotspotSheet.tsx`. J2 scope; still blocks
backlog #5 (gearing recommender needs kart engine refs).

### P2-7 — `tools/art-gen/` new + untracked by this audit; generated artifact in git (new)
New art-generation tool family (2 Python prompt builders, 1 cjs optimizer,
4 shell runners, prompt/qa text corpus — 68 tracked files). All syntax-check
clean; no secrets found (uses `hermes chat`, no keys in scripts). Two nits:
(a) `qa-results.md` is a generated output tracked in git — add to
`.gitignore` like `qa.log`/`run.log` already are; (b) this skill's inventory
table should gain an art-gen row so future runs gate it automatically.

### Rules/data drift check — CLEAN
- Uncommitted working-copy edits to `gpt-knowledge/chassis-setup-and-tyre-kb.md`
  and `kart-class-reference.md` change Cadet wet tyre "Maxxis MW21" →
  "MW21 front + MW22 rear (KA FAQ)". `kb/rules/pressure.json:59–64` already
  says "Maxxis MW21/MW22 (Cadet wet)" — **kb and gpt-knowledge now agree**;
  the edit closes drift rather than creating it. Fine to commit.
- `kb/data/jetting-rad.json` unchanged; still matches `jetting.ts` maths and
  the chassis-calculations worked example.
- `quasi_steady_line.py`: **J1.7 done** — `KARTS` envelopes (cadet/sprint/kz2)
  added, sourced to `docs/KR_TOOLS_AND_RESEARCH.md §4.3` (verified present);
  `BIKES` retained but fenced with an explicit do-not-use comment, and
  `build-racing-lines.py` defaults `--kart sprint` with `--bike` labelled
  RoadRacer-only. Values are within §4.3's stated engineering ranges
  (sprint ay 1.6 g vs mu_lat 1.4–1.8 start; brake 1.4 g vs 1.2–1.6 g
  rear-only). Acceptable; not coaching facts, per the doc's own framing.

## Efficiency wins

1. **Landed (by J1.7 work, acknowledge):** prove-track-maps warnings 158 → 30.
2. **Carry-over, still recommended:** fold `sync-setup-engine.mjs --check`
   into `health-check.mjs` (one `execSync` + pass/fail line). The P0 it would
   have caught got fixed, but the guard was never added — the same failure
   mode will recur next time the engine grows a field.
3. **Carry-over:** `kartcoach_gpx_audit.py --json` →
   `docs/reviews/data/gpx-audit-latest.json` (~10 lines, still no argparse in
   the script) for mechanical week-over-week flag deltas.
4. No O(n²) or startup regressions; all frequently-run gates ≤ ~1.3 s.

## New-tool backlog

| # | Tool | User | Status |
|---|---|---|---|
| 1 | RAD / jetting quick-calc screen | Racer + parent | **built** — unblocked by sync fix; hardening = P1-1 |
| 2 | Corner-weight scale assistant | Engineer/parent | **built** |
| 3 | Race-day checklist generator | Junior racer + parent | **proposed → re-pitched** (2nd week; not started) |
| 4 | Session logbook analyser | Engineer | **partially built** — venue trend history still open |
| 5 | Gearing recommender per track | Racer | backlog — blocked on P2-6 (`matchBikeRef` → kart engine refs) |
| 6 | Tyre-life tracker (heat cycles vs KA durability) | Parent/engineer | backlog — feasibility re-verified: `gpt-knowledge/control-tyre-data-extract.md` exists; pitch after #3 lands |

### This week's pitch: #3 Race-day checklist generator (unchanged, inputs re-verified today)
All eight source files still present in `kb-au-rules/data/` (`classes.json`,
`clubs.json`, `fees-penalties.json`, `licences.json`, `meeting-levels.json`,
`restrictors.json`, `state-overrides.json`, `tyres-fuel-oils.json`).
CLI first: `node tools/raceday-checklist/index.mjs --class ka3-junior --level club --state NSW`
→ printable markdown (min weight, control tyre/fuel/oil, licence grade +
P-plate rule, scrutineering items, key fees). Zero new maths; doubles as a
completeness test of the rules JSON. Second week on the board with no
movement — suggest Cursor slots it or explicitly defers it so the backlog
reflects reality.

## Delta vs last report (2026-09-11)

- ✅ **Resolved:** P0-1 (sync re-run; app tsc + health-check green again).
- ✅ **Landed:** J1.7 solver retune (`KARTS`), 128 racing lines baked, kart
  corner detector; prove warnings 158 → 30.
- ❌ **Still open (2nd week at P1):** jetting/fuel silent fallbacks — now the
  oldest actionable item on the board.
- ➕ **New:** P2-7 (`tools/art-gen/` inventory + tracked `qa-results.md`).
- ➡️ **Carry-over open:** static-JSON key shadowing, bare catch, GeraldtonK
  decision, 15 closing-gap layouts, RR README/dead JSONs, bike-named modules,
  `--json` audit output, health-check sync guard.
- 📈 **Baselines for next week:** setup-engine **55** tests (57 after P1-1
  fix), GPX flags 1, prove warnings **30**, sync-check clean, health-check
  pass.
