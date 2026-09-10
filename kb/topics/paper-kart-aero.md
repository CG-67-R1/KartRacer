---
id: paper-kart-aero
title: Kart aerodynamics (CFD and spoiler)
tags: [papers, aero, drag, bodywork, spoiler]
related: [paper-lap-time-optimisation, kart-setup]
---

# Kart aerodynamics

CIK sprint karts are not F1 — aero is real but **small in lap time** next to chassis and tyres.

## Bodywork + driver size (CFD lap model)

CFD + RBF mesh morphing + a lumped lap-time model (La Conca and Sarno).

- Production bodywork they started from was already close to a **min-drag** shape. Their automatic search only trimmed Cd by about **0.13%**.
- **Smaller driver / tighter mannequin ≈ 4.5% less drag.**
- Translating those drag deltas to lap time: about **0.1–0.2 s** depending on circuit and config. Example: one low-drag case **−0.097 s (0.20%)** at La Conca and **−0.155 s (0.24%)** at Sarno vs their reference; a higher-drag case lost ~0.05–0.07 s.
- Baseline CFD: Cd used to compute ~**192 N** drag at the study speed (condition as published in the study).

**Pit takeaway:** tape, fairings, and a compact driving position are worth doing, but they will not fix a kart that will not turn. Driver size is a bigger aero lever than most bodywork tweaks.

## Leisure / hire-kart spoiler

Wintec / hire-kart style rear spoiler, SolidWorks CFD + one-way FSI. Context is **rental / tourism safety** (keep the kart on the ground at 45–90 km/h), not CIK sprint.

They compared spoiler angles (~19.5° and 29.5° to the stays) for drag, pressure, and structural stress. A spoiler adds **downforce** (more vertical load → more grip) and can cut lift; it also adds drag. **Not applicable to a CIK sprint kart that has no such wing.** Use only if you run a bodywork class that allows a wing, or hire-kart design work.
