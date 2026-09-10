# Chassis setup + control tyre KB (combined upload)

> STATUS: POPULATED v1.0 — 2026-09. Sources: `kb/topics/kart-setup.md`,
> `kb/topics/tyre-setup.md`, `kb/playbooks/handling-troubleshoot.md`,
> `kb/playbooks/wet-weather.md`, `kb/data/chassis-setup.json` (modern CIK block),
> `kb-au-rules/data/tyres-fuel-oils.json` (2026 KA Manual Update 1).
> Numbers below are the modern CIK-style baseline from those files. Anything tagged
> era-1996 in kb/ is historical US sprint/oval and is deliberately NOT in this upload.
> Confirm class regs before racing any number.

## Chassis theory (live axle, jacking, bind)

A kart is a flexible tube frame with a **live axle** (no differential). It turns
properly only when the **inside rear tyre lifts** on corner entry so the outside
rear can drive around the corner. Caster + kingpin geometry jack the inside front
down and the outside front up when steered — that jacking is what unloads the
inside rear. If the inside rear stays down, the kart pushes (understeer). If
turning the wheel loads the motor, the chassis is **bound**.

Work on the end that is failing first. One change at a time. Confirm the problem
is not the driver before rewriting the chassis.

## Baseline dry setup

- Weight distribution: ~43% front / ~57% rear, 50/50 left-right.
- Front ride height: lowest; rear higher than front (wedge).
- Tyre pressure: ~1.0 bar start (window cited 0.8–1.5 bar; class/tyre-specific).
- Toe-out: 0–3 mm (smaller motors toward 0).
- Camber: 0–2 mm negative per side.
- Caster: central/neutral, then tune from driver feedback.
- Side-pod bars loose in the chassis, bolts tight. Seat on standard mounts;
  struts if class allows.
- Chain slack: ~10 mm total (~4% of centres). 30 mm axle reference:
  2900 g ±10, 960 mm ±10.
- Rear track max: 1100 mm cadet / 1400 mm senior (regulation).

Low-grip / green track: raise both ride heights, medium–stiff axle, two seat
struts per side, rear torsion bar in (flat), more caster.

High-grip / rubbered-in: lowest rear ride height, soft axle, loosen/remove seat
struts, remove rear torsion bar, more negative camber, less caster.

## Front: width, toe, Ackermann, caster, camber, ride height

| Change | Typical result |
|---|---|
| Widen front track | More jacking, more front bite, faster turn-in |
| Narrow front track | Slower turn-in, more push |
| More toe-out | Faster turn-in, more drag, less top speed |
| Toe-in | Rarely used |
| More Ackermann (inner tie-rod hole) | Quicker steer, more inside-rear lift |
| More caster | More front bite, more jacking, more entry rotation |
| Less caster | Easier steer, frees the kart in high grip |
| Raise front ride height | More front (and some rear) transfer / grip |

Caster measurement shortcut (laser/sweep): ~4 mm height split ≈ 1° caster;
a ~4 mm unexplained L/R difference can also mean a twisted chassis
(`tools/setup-engine` casterSweep).

## Rear: track width, axle stiffness, hubs, ride height, torsion bars

| Change | Typical result |
|---|---|
| Narrow rear track | More rear grip, less stable |
| Widen rear track | More stable, less rear grip |
| Stiffer axle | More rear grip (1050 textbook / high power) |
| Softer axle | Frees chassis; inside rear stays up longer |
| Raise rear ride height | More rear grip |
| Longer hubs | Stiffen axle response (more rear grip) |
| Seat struts on/tight | More rear bite |
| Side-pod bars tight | More side bite |

Note: on a **950 chassis**, axle polarity can invert vs 1050 literature — if the
book fails, try the opposite.

## Seat position + struts

Seat is the biggest single tuning mass. Tall-driver violent hop: lower ballast
and seat (back and down), soften rear, lower rear ride height, remove extra
struts. More struts / tighter = more rear bite. Exit understeer: drop to one
strut per side, lower rear ballast.

## Wet setup changes

- Front track maximum (spindle extensions if available); rear track minimum.
- Front ride height maximum; rear ride height maximum.
- Maximum caster; add camber if possible.
- Higher pressures (wets struggle to reach temperature).
- Medium axle if time permits; remove torsion bars.
- Seat rear ~25 mm higher (or folded towel). Drain holes in seat.
- Shield the rear rotor; tape pod holes; WD-40 on ignition.
- Airbox water deflector only if class-legal.
- Gearing: +3 or more rear teeth on rain tyres; remove teeth as it dries.
- Driving: square corners off the rubbered line; lean out to load the outside front.

## Control tyres (2026 KA approved list)

KA rule: only KA-approved tyres from official suppliers; class lists the
compound. Air inflation only. No mixing dry+wet. One set = 2F+2R. From first
qualifying: 1 dry + 1 wet set (+1 replacement each if approved). Wets only after
the Clerk of the Course declares Wet.

| Class group | Dry | Wet |
|---|---|---|
| Cadet | Maxxis 190D Cadet-KA 10x4.00-5 / 11x5.00-5 | Maxxis MW21 |
| KA3 / KA4 / TaG Restricted / DD2 / Jr Max | LeCont LH03 AUS 10x4.50-5 / 11x7.10-5 | LeCont SV1 10x4.20-5 / 11x6.00-5 |
| KA2 / TaG 125 | LeCont LOH (+ bead retention) | LeCont SV1 |
| X30 / Rok GP | LeCont LPM | LeCont SV1 |
| 4SS Cadet | Maxxis 190D | Maxxis MW21 |
| 4SS Junior/Senior | Maxxis Sport | LeCont SV1 |

Suppliers: LeCont via Patrizicorse; Maxxis via St George Kart Wholesale.
Social/practice extra dry options: LH03 Aus / LOH / LPM, Maxxis Sport,
Maxxis Super Sport. Mojo = Rotax series (series regs, not the KA class table).
Spec papers live on karting.net.au technical page — see
`control-tyre-data-extract.md` for per-spec detail.

## Tyre temperatures (pyrometer)

Read outside / middle / inside as soon as the kart stops. Optimum band
**75–85 °C**; near **95 °C** tyres self-destruct. Chase variance, not absolutes:
match front vs rear averages; a big L/R split can mean a bent chassis.

Rear: cold middle → raise pressure; hot middle → drop pressure; hot inner →
more rear transfer (narrow rear / stiffen); hot outer → less transfer (widen /
soften — watch for hop).

Front: hot inner → less negative camber (check caster); hot outer → more
negative camber; hot middle even edges → drop pressure; cold middle hot edges →
raise pressure. Softer pressure increases roll → may need more negative camber
after a pressure change.

## Photo wear diagnosis quick map

- Even sandpaper grain: healthy working tyre.
- Smooth / no grain: too cold, not working.
- Aggressive strips on an inner edge: too much caster/camber or edge overheating.
- Cone (inner gone, outer unused): rear = not enough transfer; front =
  camber/caster/front width. Fix early — coned profile is permanent.
- Blisters: overworked, too hot.
Full atlas: `kart-tyre-wear-patterns.md` and `kart-tyre-photo-recognition.md`.

## Troubleshooting table (symptom → ordered fixes)

Cheap and reversible first (matches session-learning escalation order).

| Symptom | Ordered fixes |
|---|---|
| Entry understeer / front won't grip | Front hubs out 1 spacer/side → rear +0.1 bar → raise front ride height → more toe-out → more caster → ballast forward |
| Entry oversteer / rear slides | Front hubs in 1 spacer → rear −0.1 bar → ballast off front → lower front ride height → less caster → less Ackermann → narrow rear → raise rear ride height → stiffer axle (verify on 950) |
| Violent hop (often tall drivers) | Lower rear ballast → seat back+down → lower rear ride height → softer axle → remove extra struts |
| Tyre chatter (often green track) | Rear +0.1 bar → narrower rear → stiffer axle |
| Four-wheel slide (no side bite) | Fit/stiffen torsion bars → hot pressures −0.1 bar |
| Too much side bite (won't drift) | Loosen/remove torsion bars → pressures +0.1 bar |
| Exit understeer / tight | Narrow rear → rear +0.1 bar → softer axle → lower rear ballast → one strut per side → lower rear ride height |
| Darty on straights | Reduce toe-out → front hubs out ≥1 spacer |
| Push/kick at apex (brake→throttle) | Seat forward → narrow rear → widen front → raise rear pressures |
| Wrong in one direction only | Corner weights → bent/twisted chassis → asymmetric settings |

Power wasters checklist: brake-pad drag, tight wheel bearings, bad alignment,
misaligned engine/sprocket. Do not hide a handling problem with extra rear teeth.
