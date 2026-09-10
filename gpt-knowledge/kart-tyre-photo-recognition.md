# Kart tyre photo recognition (text atlas)

> STATUS: POPULATED v1.0 — 2026-09. Companion to `kart-tyre-wear-patterns.md`
> (same classes, same fix orders). Mirrors the RR photo-recognition approach:
> spatial band/zone first, then texture, then classification. No third-party
> images; text atlas only.

## Photo intake protocol (band/zone first)

1. Establish orientation: which tyre (FL/FR/RL/RR), which edge is inner
   (chassis side) vs outer. If the photo doesn't show it and the user doesn't
   say, ASK — inner/outer confusion inverts the camber/transfer diagnosis.
2. Divide the face into outer shoulder / centre / inner shoulder bands.
3. Describe texture per band before naming a class: even grain, glassy, torn,
   melted, chunked, smeared, flat patch.
4. Compare bands: is damage edge-biased, centre-biased, or full-face?
5. Only then classify, and state confidence.

## Class definitions with visual cues

| Class | Visual cue | Band bias |
|---|---|---|
| Healthy | Even fine sandpaper grain | Uniform |
| Cold / not working | Smooth, glassy, shiny face | Uniform |
| Graining | Torn dusty pellets/feathering | Often centre-out |
| Blistering | Melted bubbles, pockmarks | Usually one edge |
| Hot tear | Greasy smeared rolls of rubber | Edge or full face |
| Cold tear | Sharp-edged flakes/chunks | Shoulders |
| Flat spot | Single flat patch, straight edges | One spot |
| Cone wear | Inner edge eaten, outer barely used | Inner |
| Camber wear (front) | One shoulder hot/worn, rest fine | Inner or outer |
| Toe scrub | Both fronts evenly dragged/scrubbed | Full face both tyres |

## Confusable pairs

- **Graining vs cold tear:** graining is surface dust/feathering; cold tear
  removes chunks. Both mean the tyre was worked below temp.
- **Hot tear vs blistering:** hot tear smears along the rotation direction;
  blisters are bubbles/craters. Both mean overheat — same fix direction.
- **Cone wear vs camber wear:** cone is progressive inner-edge destruction with
  an unused outer (transfer/geometry problem); camber wear is a hot shoulder
  with an otherwise even face. Rear cone = transfer; front = geometry.
- **Flat spot vs blister patch:** flat spot has straight machined-looking edges
  and driver-reported vibration; blister patch is cratered.

## When to refuse a classification

- Orientation unknown (can't tell inner from outer edge) and user can't confirm.
- Photo too blurry/dark to read texture, or tyre is dirty/wet.
- Wet tyre wear (different atlas — SV1/MW21 tread blocks; this atlas is slicks).
- Damage from debris, kerb strike, or contact (mechanical, not setup).
- Conflicting cues across tyres without pyrometer data — ask for temps
  (outside/middle/inside per tyre) before recommending changes.
When refusing, say what extra photo/data would unlock the diagnosis.
