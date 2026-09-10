# KartRacer coaching KB — master index

> STATUS: POPULATED v1.0 — 2026-09. Mirror of README authority order; keep in sync.

## Upload set table

| File | Status | Role |
|---|---|---|
| instructions.md | POPULATED v1.0 | Configure block (modes, safety, anti-hallucination) |
| instructions-extended.md | SKELETON | Full workflow text |
| core-diagnostic-pack-kart-v1.json | POPULATED v1.0 | Symptom → ordered fixes engine |
| driver-skill-interaction-layer.json | SKELETON | Wording depth by driver level |
| chassis-setup-and-tyre-kb.md | POPULATED v1.0 | Chassis theory, baselines, control tyres, troubleshooting |
| tyre-pressure-weather-troubleshooting-guide.md | POPULATED v1.0 | Pressure logic, weather, wet crossover |
| kart-tyre-wear-patterns.md | POPULATED v1.0 | Wear atlas + fix orders |
| kart-tyre-photo-recognition.md | POPULATED v1.0 | Photo intake + classification rules |
| control-tyre-data-extract.md | POPULATED v1.0 | KA spec papers 2022–2026 + importer pressures (PDFs in kb/sources/tyre-spec-pdfs/) |
| kart-class-reference.md | POPULATED v1.0 | Class bias, weights, licences (2026 Manual) |
| chassis-calculations.md | POPULATED v1.0 | Jacking, caster, gearing, RAD jetting maths |
| technique-by-improvement.md | POPULATED v1.0 | Technique → improvement map |
| driving-techniques-combined.md | STUB | Awaits book extracts (Dove/Gidley/Hall) |
| kart_geometry_australia.json | SKELETON | Layout facts from data/gpx (J1 bake) |
| TRACK_SPECIFIC_DIAGNOSTIC_AU_KART_v1.json | SKELETON | Per-track bias (AKC venues first) |
| Track_Knowledge_Base_Australia_Kart_v1.md | SKELETON | Track prose (bias Medium/Low) |
| session-learning-v1.json | SKELETON | Hold / escalate / revert |
| session-tracking-guide.md | SKELETON | Log format |

Backing repo KBs (not uploaded, cited as sources): `kb/` (setup/engine/tyres,
45 topics + playbooks + data JSON), `kb-au-rules/` (2026 KA Manual snapshot:
national + 6 states + clubs + machine tables), `tools/setup-engine/` (tested
TS calculators: gearing, RAD jetting, air density, caster sweep, corner
weights, fuel mix — 35 passing tests).

## Missing from pack (do not invent)

- Driving-technique book extracts (Dove/Gidley/Hall) — technique file carries
  KB-derived content only.
- Track geometry + per-track bias (waiting on J1 GPX bake + club verification).
- Rotax Pro Tour series regs (Mojo pressures etc.).
- Engine-specific tuning beyond jetting maths (carb models per class).

## Track coverage table (geometry vs bias)

None populated yet. 129 layouts exist as GPX in `data/gpx/`; geometry JSON and
AKC-venue bias files (Bolivar, Coffs Harbour, Ipswich, Emerald, Newcastle,
Todd Rd/GKCV, Monarto) come after the J1 bake + per-club direction verification.
GPX alone never sets turn direction (P0).

## Quick reference by improvement area

| Want to improve | Read |
|---|---|
| Corner speed / technique | technique-by-improvement.md |
| Handling fault (push/loose/hop) | core-diagnostic-pack-kart-v1.json → chassis-setup-and-tyre-kb.md |
| Pressures / weather | tyre-pressure-weather-troubleshooting-guide.md |
| Tyre wear / photos | kart-tyre-wear-patterns.md + kart-tyre-photo-recognition.md |
| What class / weights / licence | kart-class-reference.md |
| Setup maths / gearing / jetting | chassis-calculations.md |
| Wet racing | chassis-setup-and-tyre-kb.md (wet) + technique-by-improvement.md (wet pace) |
