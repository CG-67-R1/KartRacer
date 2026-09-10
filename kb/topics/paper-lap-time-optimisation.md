---
id: paper-lap-time-optimisation
title: Locked-axle lap dynamics
tags: [papers, dynamics, live-axle, slip, jacking, telemetry]
related: [chassis-cornering-dynamics, paper-load-transfers, paper-frame-stiffness, kart-setup]
---

# Locked-axle lap dynamics

Optimal-control lap of a 125 cc kart. Model validated against a professional driver’s telemetry. Theory model — no setup sheet.

## Why karts are not small cars

No suspension, no differential, four contact patches → **hyperstatic**. Vertical load on each tyre is set by **tyre radial stiffness + chassis compliance**. The live axle locks rear spin: in a constant-speed turn the **inside rear runs positive longitudinal slip**, the **outside rear negative**. Those forces fight the yaw you want. Cure: **unload the inside rear**, ideally to zero — the lift you see from good drivers.

Steering geometry helps: lock **pulls the inside-front down** and **lifts the outside-front** the same amount, so load moves onto the inside-front and off the inside-rear. Frame stiffness and steer geometry are the two big levers.

## Model (what they included)

Seven DOF: six for the kart body + rear-axle spin (rear brake only; fronts omitted). Chassis compliance as four vertical springs wheel-to-body, four tyre springs, plus anti-roll springs. Rider treated as rigid with the kart (seat is stiff; torso lean ignored). Lab-measured kart used to feed the model.

## Track findings that matter in the pits

- Validated speed and accelerations vs telemetry; then used the sim to study slip.
- Optimal control **reproduced inside-rear lift**. That manoeuvre exists because of the locked axle.
- You cannot put both rears on the friction limit at once. The optimiser loads the **outside** tyre to ~κ 0.105; the unloaded inside is forced to higher slip (~0.17), past the Pacejka peak.
- Fronts may sit slightly past peak lateral (helps braking with steer). Rears stay nearer peak via drift angle, not steer.
- **Rear brake only** caps deceleration: they saw ~**−5.5 m/s²** from ~85 → 45 km/h even with estimated long. μ ≈ 0.91 — far short of 0.91 g.
- Mid-corner lateral ~**13 m/s²** on the studied right-hander.
- A small **pendulum** (yaw through zero) appears before turn-in.
- Rough split of that corner: **understeer while braking**, **oversteer while accelerating**. Most long. force is on the loaded outside tyre → braking yaw **aligns**, drive yaw **rotates** the kart in.

## Use in this KB

Same physical story as jacking / inside-rear lift (`chassis-cornering-dynamics`). Use it when someone argues a kart should behave like a car with a diff.
