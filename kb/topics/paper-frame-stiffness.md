---
id: paper-frame-stiffness
title: Frame stiffness vs path
tags: [papers, stiffness, adams, slip-angle, chassis]
related: [martin-chassis-theory, chassis-size-vs-axle, paper-lap-time-optimisation, kart-setup]
---

# Frame stiffness vs path

ADAMS flexible-frame model of a production Italian kart, checked against **static torsion** and **constant-radius** running. Frame steel noted as **25CrMo4**.

## Claim

Tyres + welded tubes **are** the suspension. A locked rear axle wants both rears at the same spin speed, which is hostile to a curve — unless **frame and axle flex are tuned to the tyres**. Then the kart can run large lateral accelerations.

You cannot retune a kart continuously like a car damper. Everyday levers are **axle diameter/length** (and bars, seat, ride height). One stiffness is a **compromise** for a whole race.

## Results (summary)

- Elastic members — not a rigid-body cartoon — dominate the dynamic response.
- Circular-path radii: model vs test, **max error ~9%**.
- At fixed speed and steer, **changing frame stiffness changes the path** — a stiffer or softer tube set is a handling change, not just “feel.”
- A simplified torsion representation is enough for a first look at load transfer and frame twist.

## Pit takeaway

Matches the torsion-bar frame idea and 950-vs-1050 / axle-stiffness notes. If the kart hops or refuses to lift the inside rear, stiffness (axle, torsion bar, seat struts, chassis age) is a first-class suspect, not a last resort.
