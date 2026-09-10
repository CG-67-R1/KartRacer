---
id: jetting-rad
title: Jetting from RAD
tags: [jetting, rad, main-jet]
related: [jetting-and-air-density, dellorto-carburettor, eyeballing-temperatures]
data: data/jetting-rad.json---

# Jetting from RAD

Use [`data/jetting-rad.json`](../data/jetting-rad.json).

1. Baseline = **fastest legal** main jet at a logged RAD (`Y` @ `X%`).
2. `factor = 1 + (RAD_now − X) / X`
3. `Ø_old = Y / 100` (mm)
4. `Ø_new = √(Ø_old² × factor)`
5. New stamp ≈ `round(Ø_new × 100)` to a jet you actually own
6. Confirm on the stopwatch, then EGT/λ vs a known WOT baseline

Hotter / higher / wetter air → factor **< 1** → **smaller** jet.

Worked: 60 @ 94% → 86% → factor 0.915 → 0.574 mm → **57**.
