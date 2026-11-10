# KartCoach review — 2026-09-11

VERDICT: ON TRACK

The KartRacer repo now exists and is well past Phase 0: both apps compile
(tsc clean), 128 kart layouts are in the packs catalog with real club/venue
display names, the setup engine ships cited AU compound pressure windows, and
10 of 20 gpt-knowledge files are populated with sourced content. Big step up
from last week's all-skeleton state. This week's rotated surface: **setup KB +
the in-app setup engine** (pressures/temps/diagnosis), reviewed end-to-end as
a coach.

## Coach's view (plain language)

- **The setup content is trustworthy.** chassis-setup-and-tyre-kb.md,
  kart-class-reference.md, the tyre wear atlas, and `setupEngine/rules/pressure.json`
  all carry inline sources (2026 KA Manual Update 1, KA recommended-pressure
  notice, ANGRI, importer spec pages) and refuse to invent numbers. The advice
  engine even prints "Source: …" and the 950-vs-1050 axle-polarity caveat in its
  output. That is exactly the no-invent posture I asked for.
- **Last week's flags were acted on.** 8 of 9 GPX S/F flags cleared (my audit
  now shows only GeraldtonK); the suspect 244 m GeraldtonK layout was kept OUT
  of the shipping catalog (only geraldtonk_2 at 664 m ships) — correct call.
  Display names are proper club/venue names ("Launceston Kart Club (Archerville)",
  "Southern Tasmanian Kart Club (Orielton)"), not stems. Monarto is resolved:
  clubsa_* = Go Kart Club of SA (Monarto / Rocky Gully), 4 layouts.
- **Turn-direction discipline is holding (P0).** Every kart corner in
  tracks.json is `complex`/`unknown` — no hands invented from GPX. The
  check-hand-convention gate and turn_verification.json policy line both
  restate the rule. Good.
- **One factual error found and fixed in the KB:** cadet wet tyres are
  **Maxxis MW21 front + MW22 rear** (KA competition-tyre FAQ, karting.net.au) —
  two KB files said "MW21" only. Corrected in kart-class-reference.md and
  chassis-setup-and-tyre-kb.md (KB corrections are within my remit). The same
  "MW21 only" wording remains in `kb-au-rules/data/tyres-fuel-oils.json`
  (typical_by_class: cadet and 4ss_cadet) — that's data, so it's Cursor's fix.
- **The BEGIN prompt cites files that are still stubs.** instructions.md is
  populated and genuinely good (junior-safety block, rear-brakes-only rule,
  ≤0.1 bar steps, parent sign-off in the sign-off line — all coach-correct).
  But it points the model at kart_geometry_australia.json, session-learning-v1.json,
  instructions-extended.md, and driving-techniques-combined.md, all of which
  are still SKELETON (10 of 20 files remain stubs). The prompt's own rule
  ("Missing KB file → say filename; don't invent") contains the failure, but a
  live coach that keeps saying "that file is empty" erodes trust fast.
- **wollongongk still doesn't close.** prove-track-maps warns "large closing
  gap (30.15 in 0-100 map space)" in both apps — Wollongong was on last week's
  S/F flag list, and this residue suggests the trace itself, not just the
  waypoint, needs a re-look. Also: NKRC Newcastle is still honestly flagged as
  "planned layout not in catalog" (Go Kart World Newcastle is a different,
  commercial venue — do not treat it as the NKRC substitute), and most layouts
  lack racing-line overlays (~150 warnings; gate correctly treats as warn).

## Junior-communication practice (before/after)

Real strings from the shipping setup engine, said the way I'd say them to a
12-year-old Cadet 12 driver. Candidate copy for Cursor.

**1. analyzePressures.ts `uneven_hot` — "A large left/right or front/rear
pressure split after a run is a chassis, stagger, or leak check — not a
single-corner camber chase."**
> After: "Your tyre pressures came back uneven after the run. Before changing
> anything, check with your mechanic for a slow leak or a bent chassis. Don't
> start adjusting one wheel to fix it."

("stagger" and "camber chase" mean nothing to a junior; the action — get an
adult to check for leaks/damage — is the whole message.)

**2. analyzePressures.ts `rise_low` — "The tyre may not be in the working band,
the run was too short, or cold was already high."**
> After: "Your tyres barely warmed up. That usually means the run was too
> short, or you started with too much air in them. Do a longer run before you
> change anything."

**3. kartSetupBasics.ts caster summary — "Caster jacks the chassis: more caster
= more front bite and more inside-rear lift."**
> After: "Caster is how tilted the front stub axles are. More caster makes the
> front grip harder when you turn, and helps lift the inside back wheel — which
> a kart needs to corner. Ask your mechanic before changing it."

Pattern check: name what the driver felt or saw, one action, route hardware
changes to the mechanic/parent. Note the engine's detail strings are two-layer
(short title + technical why) — a "junior wording" toggle keyed off the
existing skill layer (cadet/junior/senior) would fix all of these in one place
rather than string-by-string.

## Technical findings

- **Gates run:** `prove-track-maps.mjs` — 128 layouts pass, 158 warnings
  (missing racing lines + wollongongk closing gap 30.15). `validate-track-data.mjs`
  — all checks pass, 1 warning (newcastle_nkrc planned/no GPX).
  `test-onboarding-facts.mjs` — all pass (46 drivers, 36 karts).
  `check-hand-convention.mjs` — convention correct, no kart hands set.
  `enforce-turn-verification.mjs` — clean. `npx tsc --noEmit` in app/ — exit 0.
  `tools/kartcoach_gpx_audit.py` — 129/129 parse, flags down from 9 to 1
  (GeraldtonK 244 m; correctly excluded from catalog pending club confirmation).
- **Catalog sample (6 random of 128):** SIKR Eastern Creek Var 1 (1.001 km NSW),
  Toowoomba CW (0.807 km QLD), Gippsland Tramway Park (0.611 km VIC), Geelong
  (0.734 km VIC), Wagga (0.808 km NSW), Circular Head TAS (0.709 km). All
  plausible sprint lengths, proper names, states, timezones, S/F corner entries.
- **Setup-engine worked example (pressures path):** compound windows are the
  cited KA numbers (LH03 9.5–11.0 psi, LOH 8.5–10, LPM 8.0–9.5, Maxxis Cadet
  ~0.6 bar), ±0.1 bar step respected, rim-material rise estimates honestly
  labelled "paddock estimates, not a published table", mismatch guard when the
  sheet's tyre type contradicts the compound. As a coach I'd hand this to a
  parent. One gap: rise expectations are invariant to run length — a 3-lap
  out-in will always trip `rise_low`; the copy handles it, but a laps input
  would remove the false alarm.
- **KB factual fix applied (see above):** cadet wet = MW21 front + MW22 rear.
  `pressure.json` already labelled the compound "MW21/MW22" correctly.
- **Skeleton census:** populated (10): instructions, kart-class-reference,
  chassis-setup-and-tyre-kb, control-tyre-data-extract, chassis-calculations,
  technique-by-improvement, tyre-pressure-weather-troubleshooting,
  kart-tyre-wear-patterns, kart-tyre-photo-recognition, core-diagnostic-pack.
  Still SKELETON (10): instructions-extended, driving-techniques-combined,
  session-learning-v1, session-tracking-guide, driver-skill-interaction-layer,
  kart_geometry_australia, Track_Knowledge_Base_Australia_Kart_v1,
  TRACK_SPECIFIC_DIAGNOSTIC_AU_KART_v1 (+ index/README which merely describe
  the markers).

## Recommendations for Cursor (numbered, priority)

1. **P1 — Re-trace or repair WollongongK.gpx** (closing gap 30.15/100 map
   space in both apps; flagged in prove-track-maps). It was on the 2026-09-08
   S/F flag list; the residual gap says the lap trace doesn't close. A broken
   map outline is the first thing a parent notices on the track screen.
   Ref: data/gpx/WollongongK.gpx, scripts/build-gpx-track-maps.mjs, J1.3.
2. **P1 — Populate the four stub files the live prompt cites**
   (kart_geometry_australia.json, session-learning-v1.json,
   instructions-extended.md, driving-techniques-combined.md) per the
   gpt-knowledge/README population order. The BEGIN block routes real workflows
   (session escalation, layout bias, technique drills) into empty files; the
   no-invent rule saves us from wrong answers but not from useless ones.
   Ref: gpt-knowledge/README.md population order; J3.5.
3. **P2 — Propagate the cadet wet-tyre fix to data:**
   `kb-au-rules/data/tyres-fuel-oils.json` typical_by_class cadet (and check
   4ss_cadet) should read "Maxxis MW21 front + MW22 rear" per the KA
   2022–2026 competition-tyre FAQ. I corrected the two markdown KB files
   already; the JSON snapshot is app data so it's yours. Verify the 4SS Cadet
   wet spec against the KA table while there.
4. **P2 — Junior-wording layer for setup-engine strings.** Add a cadet/junior
   variant of the advice `why` strings (or key wording off the existing skill
   layer). Three worked rewrites are in this report's junior section as
   starter copy. Ref: app/src/lib/setupEngine/analyzePressures.ts,
   diagnoseDriving.ts; J2.1/J5.1.
5. **P2 — Source the NKRC (Newcastle) trace.** validate-track-data correctly
   flags it as planned-but-missing; note Go Kart World (Newcastle) is a
   different commercial venue and must not be presented as the NKRC club
   track. Ref: data/gpx, packs/regions/au/tracks/tracks.json; pre-import list.
6. **P2 — Confirm GeraldtonK 244 m with Midwest Kart Club** (still the last
   open audit flag); if it's a real cadet/short layout, add it back labelled
   as such.

## Next week's focus

Rotate to **coach prompts / Q&A end-to-end**: run a real session through the
API coach (MODE:COACH and MODE:CHASSIS) as a KA3 Junior scenario and judge the
answers as a coach — especially what happens when it hits the stub files
(rec 2). Standing items: rerun tools/kartcoach_gpx_audit.py and
prove-track-maps after the Wollongong fix; re-check the tyres-fuel-oils.json
correction landed.
