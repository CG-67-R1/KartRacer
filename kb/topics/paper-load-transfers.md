---
id: paper-load-transfers
title: Load-transfer FEM
tags: [papers, fem, load-transfer, steering, stiffness]
related: [paper-lap-time-optimisation, paper-frame-stiffness, chassis-cornering-dynamics, caster-camber-adjusters]
---

# Load-transfer FEM

FEM + track-data paper from Tor Vergata. Goal: **vertical load on each tyre** of a suspension-less kart, including the moment a rear wheel lifts (3-contact vs 4-contact).

## Method

Detailed FE model with driver and non-structural mass. Five static cases, then combined:

- Longitudinal acceleration
- Lateral acceleration
- Vertical acceleration
- Two vertical hub displacements = **steer jacking** (front hubs pulled/pushed by kingpin / caster kinematics)

A parametric steering formula maps wheel-angle to **angular and vertical** front-hub motion, so setup changes (caster, kingpin) can be simulated. The solver can drop from four constraints to three when a rear lifts.

Example geometry in their symbol list (one kart, not a universal spec): kingpin **−10°**, caster **−13°**, steering-column inclination **−52°**.

## What the lap replay showed

Fed with **real steer and accel** from a lap:

- **Braking** moves load to the fronts.
- **Initial steer** can load the **inside-front** (steer kinematics) until lateral accel wins and dumps that load back outboard.
- Steer kinematics **unload the inside-rear** on entry. On exit, that same inside-rear can **gain load again** — useful for traction.
- A messy mid-corner (lots of steer/throttle correction) shows up as **spiky** wheel loads. A clean exit is smoother, even if the driver is managing drive-oversteer.

## Pit takeaway

Caster / kingpin / Ackermann are not just “feel.” They **move vertical load** before the kart has even built much lateral g. That is why a caster change can fix a push that tyre pressure cannot. Pair with `caster-camber-adjusters` and `chassis-cornering-dynamics`.
