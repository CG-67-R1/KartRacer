---
id: jetting-and-air-density
title: Jetting and air density
tags: [jetting, rad, density, main-jet]
related: [dellorto-carburettor, eyeballing-temperatures, engine-mixture-flow]
data: data/jetting-rad.json---

# Jetting and air density

Calculator inputs: [`data/jetting-rad.json`](../data/jetting-rad.json).

Air density sets oxygen per gulp. Wrong density → wrong A/F → less power at the axle. Density falls when it is **hotter**, **higher**, or **more humid** (water molecules displace O₂/N₂). All three → **smaller** main jet. Opposite → larger.

## RAD

Compare track density to a reference: **0 m, 15 °C, 1013.25 mb, 0% RH**. Result is **relative air density (RAD)** in percent. Handheld meters (e.g. Kestrel) output this directly. Do not hand-solve the ideal-gas form in the pits.

## Baseline method

1. Find a jet that is **fast on the stopwatch** at a known RAD. That pair is the baseline `(Y @ X%)`.
2. New day RAD = `X2`. Flow factor = `1 + (X2 − X) / X`.
3. Kart jet stamps ≈ **diameter in 0.01 mm** (60 → 0.60 mm).
4. `new_Ø = √(old_Ø² × flow_factor)`.
5. Pick the nearest stamp. Example: **60 @ 94% RAD → 57 @ 86%** (factor 0.915, Ø 0.574 mm).

Stamp is a **flow** class, not a hole you ream. A “96” may measure 0.94–0.98 mm and still flow as 96. Cone, parallel length, and exit all matter.

## After the calculator

RAD gets you on the right jet **family**. Then chassis, a bent tie-rod, a tired ring, or a bad baseline lap will still look like a jet problem. Re-baseline when the kart or driver changes. Pair with EGT/λ in `eyeballing-temperatures` — peak 2-stroke power often near **λ 0.86** (Micro/Mini nearer **1.0**).
