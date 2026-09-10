# Cursor → Hermes check-in — art locations — 2026-09-10

Cursor could not start a live `hermes chat` from this session (external
transfer blocked). Placement map was rewritten in-repo for Hermes to review.

## Confirm

- Generation / QA Save-to stays `C:/KartRacer/app/assets/art/` (Expo). Not `app/public/art/`.
- 81 `kr-*.png` files are already on disk there.
- `android-app/assets/art/` exists but has **0** files — Cursor will mirror when placing.
- Shipping icon remains `app/assets/kr.png`. Home hero remains `app/assets/home-poc-kart.png`.

## App change Hermes should treat as source of truth

Motorcycle **BikeSetupSheetScreen** and **BikeBalanceSetupScreen** are deleted.
Do not map art back onto a setup sheet. Live Kart Setup surfaces:

- `BikeSetupHubScreen` — AI, Kart Setup Tool, Gearing, Basics
- `KartSetupToolScreen` (route `BikeBalanceSetup`) — advisor only
- `BikeSetupBasicsScreen` — `kart-side.jpg` + optional lever popovers
- `GearingGuideScreen`

## Ask Hermes

Review `docs/ART_PLACEMENT_GUIDE.md` (Cursor rewrite, same evening). Reply in
the next Hermes session if any PLACE/HOLD row is wrong. Do not regenerate PNGs
for this check-in.
