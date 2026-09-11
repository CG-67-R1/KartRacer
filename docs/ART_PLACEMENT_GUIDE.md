# KartRacer art set — Cursor placement guide

Date: 2026-09-10 (Hermes). **Updated 2026-09-10 after Cursor check-in:** motorcycle
setup sheet and chassis-balance screens are gone. Map files to **screens that
exist now**, or mark **HOLD**.

Source images: `app/assets/art/kr-*.png` (81 files). Generation / QA Save-to
stays `C:/KartRacer/app/assets/art/` — **not** `app/public/art/`. Vision-QA
verdicts in `tools/art-gen/qa-results.md` — do NOT place any file listed as
REGEN until it has been regenerated and re-passed.

## Ground rules

1. **Mirror everything.** Every art file used by `app/` must be copied to
   `android-app/assets/art/` (no shared folders — repo rule). Same relative
   paths, same filenames. (Mirror is empty as of this check-in.)
2. **Filenames are load-bearing.** Keep the `kr-` names exactly; screens key
   off them. Never rename on import.
3. **Static requires.** Metro needs static paths: build a single
   `app/src/assets/art.ts` module that exports typed requires, e.g.
   `export const ART = { tabAnalysis: require('../../assets/art/kr-tab-analysis.png'), ... }`
   — one line per **placed** file. Screens import from `art.ts`, never call
   `require()` inline. Mirror the module to android-app.
4. **Optimise before commit.** Run the whole folder through a PNG optimiser
   (e.g. `npx sharp-cli` or squoosh batch): target ≤ 300 KB per 1024px tile.
   The generator writes ~1 MB files; do not ship those weights.
5. **Dark panels only.** Images assume a `#11151C`-family panel behind them.
   Place on existing dark card components; never on white.
6. **Do not restore the bike setup sheet** to give leftover tiles a home.

## Live screens (2026-09-10)

| Screen | File | Role |
|---|---|---|
| Kart Setup hub | `BikeSetupHubScreen` | Six buttons: AI, Tool, History, Upload, Gearing, Basics |
| Kart Setup Tool | `KartSetupToolScreen` (route `BikeBalanceSetup`) | Advisor: chassis chips, track picker, grip/wet, driving / pressures / temps |
| Setup History | `KartSetupHistoryScreen` | Snapshots, venue filter, compare / restore |
| Upload session | `KartSessionUploadScreen` | MyChron CSV → laps, consistency, driver/chassis, attach |
| Kart Setup Basics | `BikeSetupBasicsScreen` | Hotspot diagram (`kart-side.jpg` today) |
| Gearing Guide | `GearingGuideScreen` | Sprocket / rollout |
| Home | `HeadlinesScreen` | Hero is `app/assets/home-poc-kart.png`, not this set |
| App icon | `app.json` | `app/assets/kr.png` — do not swap for `kr-brand-app-icon.png` unless regenerating the store icon |

## PLACE now

### Hub tiles — `BikeSetupHubScreen`

| File | Hub card |
|---|---|
| kr-tab-analysis.png | Kart Setup Tool |
| kr-history-snapshot.png | Setup History |
| kr-tab-logger.png | Upload session |
| kr-tool-gearing.png | Gearing Guide |
| kr-brand-empty-kart.png | Kart Setup Basics (or hub header) |
| kr-tab-tools.png | Optional: Kart Setup AI (or leave AI text-only) |

### Kart Setup Tool — `KartSetupToolScreen`

Driving / pressures / temps already exist. Pair art to those panels only.

| File | Placement |
|---|---|
| kr-symptom-*.png (12) | Driving-mode symptom chips — map by name to `SYMPTOM_LABELS`: understeer-entry→understeer_entry, oversteer-entry→oversteer_entry, understeer-mid→understeer_mid, oversteer-mid→oversteer_mid, understeer-exit→understeer_exit, oversteer-exit→oversteer_exit, hop→hop, chatter→chatter, slide→four_wheel_slide, side-bite→too_much_side_bite, darty→darty, one-direction→one_direction_only |
| kr-temp-legend-omi.png | Temps mode header (O/M/I explainer) |
| kr-temp-cold-middle.png, kr-temp-hot-middle.png, kr-temp-hot-inner.png, kr-temp-hot-outer.png | Advice cards for matching `classifyTread` patterns |
| kr-pressure-cold-hot.png | Pressures mode header |
| kr-pressure-compound-window.png | Compound-window hint (`compoundWindow(setup)` ≠ null) |
| kr-grip-green.png / kr-grip-normal.png / kr-grip-rubbered.png | Grip chips (green / normal / rubbered) |
| kr-wet-checklist.png | Wet checklist panel header |
| kr-lever-rain-meister.png | Rain Meister checklist row |
| kr-advice-one-change.png | First advice card badge ("one change") |
| kr-advice-blocked.png | Blocked-advice rows |
| kr-chassis-plan-corners.png | Pressure + temp entry (FL/FR/RL/RR map) |
| kr-tyre-slick.png / kr-tyre-wet.png | Only if a slick/wet control is added; compound chips exist today |
| kr-history-snapshot.png | Save snapshot / History hub tile |
| kr-history-track.png | Track picker + “Here before” / History list |
| kr-chassis-jacking-lift.png | Jacking / inside-rear-lift advice + Kart Setup Basics education |

### Kart Setup Basics — `BikeSetupBasicsScreen`

Keep `kart-side.jpg` as the photo diagram. Use lever tiles as hotspot popover art
(do not replace the photo):

| File | Hotspot |
|---|---|
| kr-lever-caster.png | Caster |
| kr-lever-camber.png | Camber |
| kr-lever-toe.png | Toe |
| kr-lever-front-track.png | Front width |
| kr-lever-axle.png | Axle |
| kr-lever-seat-position.png | Seat |
| kr-lever-front-ride-height.png / kr-lever-rear-ride-height.png | Ride height |

### Upload session — `KartSessionUploadScreen`

| File | Placement |
|---|---|
| kr-tab-logger.png | Hub tile + screen header |
| kr-logger-trace.png | Two-lap speed overlay header |

### Gearing Guide — `GearingGuideScreen`

| File | Placement |
|---|---|
| kr-tool-gearing.png | Header / intro card |

## HOLD — no live screen (do not invent one)

These stay in `app/assets/art/` until a matching screen ships. Do not wire them
into the deleted setup sheet.

| File | Was for | Hold until |
|---|---|---|
| kr-tab-chassis.png | Setup sheet hub tile | Full day-sheet screen (kart, not bike) |
| kr-tab-history.png, kr-history-diff.png | History extras | REGEN — do not place until they re-pass |
| kr-tab-upload.png, kr-logger-briefing.png, kr-session-consistency.png | Upload extras | REGEN — do not place until they re-pass |
| kr-page-chassis-setup.png | Sheet hero | Kart day-sheet screen |
| kr-tab-venue.png, kr-venue-circuit.png, kr-venue-clockwise.png, kr-venue-anticlockwise.png | Direction / venue tiles | REGEN — text chips ship until they re-pass |
| kr-weather-sun/cloud/overcast/rain/wind/damp.png | Weather chips | Weather import on Kart Setup Tool |
| kr-lever-ackermann.png, kr-lever-front-hubs.png, kr-lever-rear-track.png, kr-lever-rear-torsion.png, kr-lever-third-bearing.png, kr-lever-seat-struts.png, kr-lever-ballast.png | Sheet field popovers | Day-sheet or extra Basics hotspots |
| kr-rim-aluminium.png, kr-rim-magnesium.png | Rim select | Day-sheet rim field |
| kr-tool-fuel.png, kr-tool-rad.png, kr-tool-main-jet.png, kr-tool-caster-sweep.png, kr-tool-corner-weights.png, kr-tool-pyrometer.png, kr-tool-tyre-gauge.png, kr-tool-camber-laser.png | Extra calculators | Tools hub beyond Gearing |
| kr-brand-app-icon.png | Store icon candidate | Explicit icon regen (shipping icon is `kr.png`) |

## Acceptance checklist (run after any PLACE batch)

- [ ] All **placed** art referenced through `art.ts` (grep: no inline `require('.*art/` outside it)
- [ ] android-app mirror byte-identical (`diff -r app/assets/art android-app/assets/art`)
- [ ] `npx tsc --noEmit` clean in both apps
- [ ] Expo smoke: hub, Kart Setup Tool (all 3 modes), Basics, Gearing — no red screens
- [ ] No file placed that is REGEN in `tools/art-gen/qa-results.md`
- [ ] Folder weight after optimisation < 25 MB total
