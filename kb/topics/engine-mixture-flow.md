---
id: engine-mixture-flow
title: Engine mixture flow
tags: [two-stroke, reed, ports, exhaust, scavenging]
related: [dellorto-carburettor, rotax-exhausts-matting, rotax-power-valve, ignition-system]
---

# Engine mixture flow

Path: airbox → carb → inlet → crankcase → transfers → burn → exhaust port → tuned pipe. Port **height** vs TDC/BDC is the timing.

## Airbox and carb

Airbox kills ram-pressure swings and holds the filter mat (protects jets and bore). Float carb: venturi + slide drop static pressure and pull fuel. Slide up → less vacuum, so a **tapered needle** in the needle jet opens more area. Clip position (usually free) richens/leans mid-throttle. Needle type (K57, W23, …) is a **class part**.

## Port control

Three port families: inlet, transfer, exhaust. Multiples are usually mirrored. **Piston-port** timing is symmetric: exhaust duration 150° → opens **75° BBDC**, closes **75° ABDC**. Same idea for transfers about BDC and piston inlet about TDC.

| Inlet type | Used on | Trait |
|---|---|---|
| Piston skirt | Comer C50, Kid/Mini Rok | Simple. At TDC inlet is still open → blowback at low rpm; inertia helps at high rpm |
| Disc on crank | Historic 100 cc / bikes, not current karts | Asymmetric inlet timing |
| Reed | All Rotax | One-way petals. Better low-rpm fill, A/F stays correct (mixture passes the carb once). Timing not symmetric; changes with rpm. Petals must be thin enough to open low and stiff enough not to flutter high |

## Power valve (concept)

Exhaust **width** is limited (rings). Raising the roof instead kills mid-range, so a blade sits in the port at low rpm and retracts ~**7500** (pre-EVO) / higher on EVO. See `rotax-power-valve` for the two legal rpm pairs.

## Tuned pipe

Straight pipe ≈ swept volume only (~125 cc). A good expansion chamber can process closer to **~180 cc** of mixture: positive pulse down the header, negative reflection (diffuser) **sucks** the cylinder, then a convergent baffle **stuffs** unburnt mix back before the piston closes the port. Layout: header → diffuser (often multi-angle) → optional parallel → baffle → stinger. Lengths and angles are **homologated**. Do not experiment.
