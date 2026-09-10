---
id: martin-chassis-theory
title: US sprint chassis theory (era-1996)
tags: [chassis, flex, side-bite, torsion-bar, ackermann, era-1996]
related: [kart-setup, chassis-cornering-dynamics, martin-baseline-setup, martin-trackside-tuning, paper-frame-stiffness]
---

# US sprint chassis theory (era-1996)

Numbers in [`data/chassis-setup.json`](../data/chassis-setup.json) under `era_1996_us_sprint`. Do not copy PSI/stagger onto a modern CIK/Rotax kart.

## Core idea

With no suspension, the **frame is the spring**. It is a set of welded torsion bars. Flex can help the kart settle onto the tyre patches; too much flex distorts the patches or takes a permanent set. Some 1990s builders treated frames as worn after about **18 months** of hard use.

If you race the same oval week after week, the frame can **take a set**. Historical diagnostic: one practice day a year running **the opposite direction**. Not a modern CIK procedure.

## Side bite

**Side bite** = how well the kart stays planted without sliding. On asphalt, sliding is usually slower than driving the corner. Correct bite **unloads the inside rear** and cuts live-axle scrub. Too much bite → hop or bicycle, or so much scrub the engine falls out of the band. Too little → loose, like a wet track.

- **Narrower rear frame rails** (era: ~24–25" vs ~27–28" at rail centres) → more rear side bite.
- **Narrower kingpin spacing** (~22–24" vs ~28–30") → more front bite.
- Short, triangulated rails = stiffer. Long rails, fewer cross-members = more flex.
- Low-power classes often want **more flex**. High-power 2-stroke / strong 4-stroke often want **stiffer**.
- Dirt stock: less rear bite so the rear can slide and hold rpm. 2-cycle dirt: more rear bite to pull off the corner.

## Torsion bars you already have

Anything clamped rigid can act as a torsion bar and **over-stiffen** the kart:

- Rear torsion bar: **flat** = more independent rail flex; **vertical** = locks the rear.
- Long nerf / side rails: mount on rubber or springs; holes must align without preload.
- Front and rear bumpers: arms pre-bent to the tabs. After a hit, unbolt and check they are not stressing the frame.

## Ackermann

Inside front should steer a tighter arc than the outside so the inside tyre does not scrub. On long sweepers the error is small; on tight ovals it matters.

- **Zero Ackermann** (common then): single-bolt / single-point steering, equal spindle-arm lengths — both wheels move the same degrees.
- **Ackermann on**: inside wheel turns more (example: outside ~7°, inside ~12° for a 15° wheel input).

## Era vs now

This set is US sprint / speedway / LTO offset as well as road courses. Modern CIK 950/1050 live-axle theory is in `kart-setup` and `chassis-cornering-dynamics`. Use this file for flex vocabulary; use modern setup topics for current starting numbers.
