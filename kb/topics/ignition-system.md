---
id: ignition-system
title: The ignition system
tags: [ignition, timing, ecu, rotax, advance]
related: [spark-plug, rotax-power-valve, eyeballing-temperatures]
---

# The ignition system

Spark must fire **before TDC** so peak pressure lands just after TDC. More rpm → more crank angle in the same burn time → **more advance**. Analogue = fixed advance. Digital = rpm-mapped.

Static advance on 2-strokes is usually **mm BTDC** via a DTI in the plug hole: find TDC (needle reverses), zero, rotate opposite to running direction to the stated mm, line rotor/stator marks, lock, re-check.

## By engine (confirm current regs)

**Comer C50/C52 — analogue.** Align trailing magnet leading edge with the coil lamination. C50 max **3.8 mm** (~29–32.7°). C52 max **4.2 mm** (~29.9–33.4°).

**Kid/Mini Rok — analogue.** Marks on stator/rotor. Kid was 3.0 mm fixed, later **free** like Mini. Table ~2.6–3.4 mm ≈ 25.6–28.5°.

**OK Junior — PVL 684 digital.** Static is low for push-start; advance more than doubles by ~2750 rpm, holds to 13500, then falls toward **14000** limiter. Marks = advance at **5000 rpm** (~33° if set at TDC; static ~15°). Timing **free**: shift the whole curve by lining marks BTDC (more) or ATDC (less). Example: 0.15 mm BTDC → ~38.4° from 2750 up.

**Rotax — sealed digital ECU**, pickup on the crank, **no legal timing change**. Senior/DD2 PV rpm via a ground wire: Senior **7600 or 7900**; DD2 **8800 or 9100** (ground = lower). Crankcase pulses + one-way hose + ECU magnetic valve open the PV. Wrong-way valve = PV stays shut. Jnr/Snr maps include a top-end jump + limiter; DD2 has a cut for flat-shift.

## Tuning notes

Analogue: more advance = stronger mid, flatter top. Very rich **or** very lean burns slow → wants more advance. Too much = **ping/knock** (easy to hole a piston). Fixed-gear, tall gearing, slow uphill exits, overweight drivers: consider **less** advance and/or richer jet. Fast WOT circuits: lean knock. Change timing **alone**.
