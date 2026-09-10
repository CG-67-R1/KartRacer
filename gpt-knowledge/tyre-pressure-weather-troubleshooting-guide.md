# Kart tyre pressure / weather troubleshooting

> STATUS: POPULATED v1.0 — 2026-09. Sources: `kb/topics/tyre-setup.md`,
> `kb/topics/kart-setup.md`, `kb/playbooks/tyre-temps.md`,
> `kb/playbooks/wet-weather.md`, `kb/data/chassis-setup.json`,
> `kb-au-rules/data/tyres-fuel-oils.json`.
> Only cited ranges appear here. Per-compound cold psi tables are NOT published
> in the KA spec set — say so rather than invent numbers.

## Cold vs hot pressure logic (slicks)

- Cited working window: **0.8–1.5 bar** (≈12–22 psi), start point **~1.0 bar**.
  Class, compound, track temp, and driver weight move you inside that window.
- Pressure is a temperature tool: higher pressure brings the tyre in faster;
  too high shrinks the contact patch and overheats the centre.
- Verify with a pyrometer, outside/middle/inside, immediately on stopping.
  Optimum carcass band **75–85 °C**; ~95 °C destroys the tyre.
- Hot centre → too much pressure. Cool centre → too little.
- Adjust in **0.1 bar** steps, one end at a time, re-run, re-measure.
- Check pressures before AND after each session; log with air + track temp.

## Ambient/track temp adjustments

- Cold track / green surface: tyres struggle to reach temp — raise pressure
  slightly to bring them in faster, add mechanical grip (see green-track chassis
  changes), expect graining.
- Hot track / rubbered-in: tyres over-temp — lower pressure toward the bottom of
  the window and remove mechanical grip (soft axle, less caster, lowest rear).
- All tracks work one side harder: compare front vs rear averages, ignore small
  L/R splits. Big L/R split = check for a bent chassis.
- Each heat cycle loses grip; new tyres grip most. Scrub-in (debated): a few
  laps to temp, cool fully, recheck pressures.

## Graining conditions

Graining = cold/dirty track + tyre sliding before it reaches temp. Signature:
torn dusty grain instead of even sandpaper texture. Response: raise pressure a
step, add rear grip for chatter (rear +0.1 bar, narrower rear, stiffer axle),
smoother steering inputs, let the tyre come in over a lap rather than forcing it.

## Wet crossover decision

- Rule first: wets may only be used after the Clerk of the Course declares Wet.
  One wet set from first qualifying; State Championship wets are nominated/marked
  before the first wet session.
- Wets run **higher pressures** than slicks (they struggle to reach temp).
- Crossover judgement: standing water / no dry line = wets; drying line = the
  call is gearing + tyre temperature management. As it dries, wets overheat on
  the dry line — drive the wet line to cool them, remove rear teeth as corner
  speed rises (wet baseline was +3 or more rear teeth).
- Full wet chassis list: see chassis-setup-and-tyre-kb.md (max front track, min
  rear track, max caster, max ride heights, no torsion bars, seat up ~25 mm).

## Brand/spec anchors (cited)

- KA approved list 2026: LeCont LH03 AUS / LOH / LPM dry, SV1 wet; Maxxis 190D
  Cadet dry, MW21/MW22 wet, Maxxis Sport (4SS). Class map in
  `kart-class-reference.md`; sizes in `chassis-setup-and-tyre-kb.md`.
- Air inflation only (KA rule). No dry/wet mixing on the kart.
- Mojo = Rotax Pro Tour series tyre; use series regs for pressure guidance.
- **Cited cold-pressure baselines now exist** in `control-tyre-data-extract.md`
  (KA/importer): LH03 9.5–11 psi; LOH 8.5–10; LPM 8.0–9.5; Maxxis Cadet spec
  0.6 bar; SV1 wet 0.9 bar service; MW21/22 1.0 bar service. Start there, then
  run the pyrometer loop. KA's own caveat applies: optimum varies with track
  and weather.

## What never to do

- Never quote a per-class cold psi that is not in a cited file — cited baselines
  live in `control-tyre-data-extract.md`; outside those, the honest answer is
  the 0.8–1.5 bar window plus the pyrometer loop.
- Never deflate tyres in parc fermé.
- Never use tyre softeners/prep chemicals: safety risk, often toxic, and banned.
- Never chase a chassis fault with pressure alone, or hide a handling problem
  with gearing.
- Never mix era-1996 US oval PSI (15–20 psi scale numbers) with modern CIK
  starts — different tyres, different era.
- Never store tyres near fuel, sun, heat, or electric motors (ozone); not below 0 °C.
