# Chassis calculations (illustrative, not prescriptive)

> STATUS: POPULATED v1.0 — 2026-09. Sources: `tools/setup-engine/src/calculators/`
> (working, tested code — the numeric authority for every formula here),
> `kb/data/chassis-setup.json`, `kb/data/jetting-rad.json`, ANGRI theory notes
> in `kb/topics/`. Illustrative maths for explanation; the engine code is the
> implementation of record. Never present a computed lap/speed number as a
> promise to the driver.

## Jacking effect geometry (caster + kingpin + width)

Steering a kart with caster and kingpin inclination pushes the inside front
wheel down and lifts the outside front. Because the frame is a torsion spring,
that diagonal load lifts the **inside rear** — the only way a live-axle kart can
corner without scrubbing. Levers that increase jacking: more caster, wider
front track, more Ackermann (faster steer angle build). Published kart-dynamics
example values (models, not pit settings): kingpin ~10°, caster ~13°, steering
column ~52° (`chassis-setup.json` papers block).

## Caster measurement / sweep approximation

Laser or sweep-gauge shortcut used by the setup tools: **~4 mm height split ≈ 1°
of caster** (scales with kart width / laser spacing; approximate only). An
unexplained ~4 mm L/R difference with matched settings can also mean a twisted
chassis. Implementation: `calculators/casterSweep.ts` (MM_PER_DEGREE = 4,
match tolerance 2 mm).

## Ackermann geometry

Ackermann = inside wheel steering more than the outside because tie-rod ends
sit inboard of the kingpin axis. Moving the tie rod to the inner steering-column
hole increases Ackermann: quicker effective steer, more jacking, more
inside-rear lift. Illustrative angles from the era literature: parallel steer
~7–9° each spindle at 15° wheel; Ackermann-on example outside 7° / inside 12°.

## CG height and seat position maths

The seat is the largest movable mass, so CG follows it nearly 1:1.
Lower CG → less lateral load transfer (transfer ∝ CG height × lateral g /
track width) → less inside-rear lift, less hop. Higher CG does the opposite.
Practical use: violent hop with a tall driver = lower seat/ballast; kart won't
lift the inside rear on a green track = raise ride heights (CG up).
No fixed CG heights are published for karts — treat as directional maths.

## Weight distribution targets

Modern CIK baseline: **~43% front / 57% rear, 50/50 left-right**, cross weight
(FL+RR)/total target **~50%**. Implementation: `calculators/weight.ts` takes
four corner scales and reports front/rear/left/right/cross percentages plus
errors vs target. Ballast: mount low (seat sides), move fore/aft to trim
front percentage.

## Sprocket ratio + rollout calc

- ratio = rear teeth / front (engine) teeth
- rollout (mm) = tyre rolling circumference / ratio
- speed at rpm (km/h) = rpm × (front/rear) × circumference_mm / 1e6 × 60
Implementation: `calculators/gearing.ts` (also suggests the equivalent
one-tooth-smaller pairing and the wet preset of **+3 rear teeth**).
Rule of thumb carried from the KB: gear for the corner that matters, and never
hide a handling fault behind teeth.

## Jetting vs air density (RAD)

RAD = air density relative to a 1013.25 hPa / 15 °C / 0% RH reference, as a
percent. Direction: hotter / higher / more humid → smaller jet; colder / lower /
drier → larger jet. Formula (from a stopwatch-proven baseline):

- flow_factor = 1 + (RAD_new − RAD_base) / RAD_base
- new_diameter = old_diameter × √flow_factor, stamp ≈ diameter × 100
- Worked example: base RAD 94% on a 60 stamp, new RAD 86% → 0.574 mm → stamp 57.

Air density itself: Magnus saturation vapour pressure + partial-pressure mix
(Rd 287.058, Rv 461.495, sea-level 1.225 kg/m³) — `calculators/airDensity.ts`,
`calculators/jetting.ts`. Jet stamps are flow-tested by good makers; never
resize by drill measurement alone.

## Fuel / premix

oil ml = fuel litres × 1000 / ratio (20:1 → 50 ml/L) — `calculators/fuel.ts`.
Class fuel rules (PULP RON ≥ 95 etc.) live in `kb-au-rules/data/tyres-fuel-oils.json`.

## Corner speed vs lateral g

v = √(a_lat × r). Published kart example: ~13 m/s² lateral (≈1.3 g) on slicks;
a 2 g reference ceiling appears in modern sprint discussion — use only for
explaining why rear-only braking and inside-rear lift dominate kart technique,
never to promise a speed. Rear-brake-only deceleration example from the papers:
~−5.5 m/s². Model caveat: circular-path approximations carry ~9% error
(`chassis-setup.json` papers block, incl. a full Pacejka example set for sims).
