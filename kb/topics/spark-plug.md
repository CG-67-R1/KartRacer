---
id: spark-plug
title: Spark plug
tags: [spark-plug, gap, heat-range, ngk, rotax]
related: [ignition-system, eyeballing-temperatures, measuring-equipment]
data: data/spark-plugs.json---

# Spark plug

Machine numbers: [`data/spark-plugs.json`](../data/spark-plugs.json). Confirm class regs — gap over the limit is a **non-protestable exclusion**.

Correct plug + gap is worth about **1–2%** power, not a new engine. Classes usually allow one or two part numbers (three in Bambino).

## Heat range

Tip needs **500–800 °C** (self-clean). Longer insulator nose = **hotter** plug; shorter = **colder**.

- **NGK / Denso:** higher number = **colder**. Adjacent NGK numbers ≈ **75–100 °C** tip step.
- **Champion / Bosch:** higher number = **hotter**.

Read the plug after a session:

| Look | Cause |
|---|---|
| Damp, near-black | Rich / tip < ~500 °C (fouling) |
| Light straw → brown | Mixture in the window |
| Dry, blistered, toward white | Lean / tip > ~800 °C (pre-ignition risk) |

## Gap

Voltage needed scales with gap. Bigger gap = longer spark = better burn **until** the coil cannot jump it or turbulence blows it out. **Legal max wins.**

- Factory gap is rarely the race gap.
- Iridium / fine platinum: **do not load the centre electrode**.
- Bend the **ground** electrode. Prefer fewer than **six** bends; damage = new plug.
- Metric feelers: **0.05 mm** steps, thickest often **1.00 mm**. Stack **adjacent** blades (0.50+0.60 for 1.10, not 1.00+0.10). Near a legal max, **err tight**.

## Class table (example at scrape)

| Class | Allowed | Thread | Reach | Hex | Gap |
|---|---|---|---|---|---|
| Bambino | RCJ7Y / WS5F / BPMR7A | M14×1.25 | 9.5 mm | 19 mm | free |
| Rotax Micro/Mini | GR8DI or GR9DI (5 kΩ) | M14×1.25 | 19 mm | 21 mm | max **1.2 mm** (OEM 0.9) |
| Rotax Jnr/Snr/DD2 | same | same | 19 | 21 | max **1.0 mm** (OEM 0.9) |
| Kid Rok / OKJ | B9EG or B10EG | M14×1.25 | 19 | 21 | free (OEM 0.6) |
| Mini Rok | B10EG only | same | 19 | 21 | free |
| KZ2 | mass-produced original | — | — | — | free |

NGK **8** warmer than **9**; **9** warmer than **10**.

## Head mods

Machining the plug seat or thinning the copper gasket raises compression. CIK: dimension **A ≥ 18.5 mm** for a **19 mm** reach. Scrutineers have gauges. Do not.
