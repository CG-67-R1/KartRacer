# KARTRACER image prompts

> Repo copy (reviewed by Hermes 2026-09-10; original from Downloads). See the
> **Hermes review addendum** at the bottom before generating: corrected output
> paths for the Expo apps, platform icon caveats, and missing Parts 25–28.

Paste these into ChatGPT (or another image GPT) **one part at a time**. Every image must look like it belongs in the same paddock app, not a random kart collage.

## How to generate the set

1. Copy **A. Style prefix** once.
2. Copy **one Part** (the whole fenced block).
3. Paste **prefix + that Part** as a single message. Ask for **one image** unless the Part says “set of N”.
4. Save the file using the **filename** in the Part. Do not rename casually — the app can key off these names later.
5. Start a **new chat** (or a new custom GPT) if the model starts drifting: extra colours, photoreal dirt, US oval karts, watermarks, or unreadable labels.
6. If a Part asks for several matching tiles, generate them **in one message** so they share lighting and line weight.

Do not put brand names on the kart (no OTK / CRG / Rotax logos). Australian **CIK sprint kart**, not dirt oval, not shifter-looking unless the Part says otherwise.

---

## A. Style prefix

Copy this block at the top of **every** prompt.

```
KARTRACER visual system — obey this for the whole image.

Product: KartRacer chassis-setup PWA (dark paddock tool). Images sit on dark UI panels, not posters.

Canvas: square 1024×1024 unless the Part says otherwise. Fill the frame; modest padding; subject large enough to read at ~96–160 px thumbnail.

Background: solid #11151C (near-black blue). No sky, no paddock clutter, no lens flare, no bokeh, no tripod, no people, no photoreal asphalt texture filling the frame.

Palette (use only these):
- Ink / chassis: #D7DDE8 light metal, #8B97AB muted, #2E3B52 mid, #1C2433 panel
- Accent / “active lever”: #E8C547 gold (sparingly — one highlight, arrows, selected state)
- OK / rubber / grip: #3ECF8E
- Warn / heat: #FF8A4C
- Danger / hot inner / rain: #EE5D5D
- Tyre rubber: near-black with a thin #2E3B52 highlight, not shiny chrome

Style: technical illustration, clean vector-like 3D or isometric. Crisp edges, even lighting from upper-left, no dramatic shadows. Line work may be present but not sketchy. Looks curated and instructional, like a modern workshop diagram — not a game render, not a stock photo, not a comic.

Kart: modern CIK sprint: 1050-class tube chassis, front bumper, side pods, rear bumper, rear disc, no differential, two front discs optional, seat, steering wheel. Wheels: low-profile kart slicks unless the Part says wets. Chassis colour: dark grey/black with gold accent only where specified.

Typography on image: avoid words. If labels are required, use short ALL-CAPS in a clean geometric sans (like the UI), #E8EDF5, never script. Never invent lap times, brands, or class names.

Forbidden: watermarks, signatures, QR codes, UI chrome (no fake iPhone), text paragraphs, “AI art” glow, neon, US dirt/oval, vintage 1990s US sprint numbers, floating logos, chequered flags unless the Part asks.

Output: a single composed illustration ready to drop onto a #11151C panel. Transparent PNG if the model can; otherwise the solid #11151C ground.
```

---

## Filename and size standard

| Field | Rule |
|---|---|
| Name | `kr-{group}-{slug}.png` (lowercase, hyphens) |
| Icon / tile | 1024×1024 |
| Diagram | 1024×1024 (app can crop) |
| Wide diagram | 1536×1024 only if the Part says so |
| Safe inset | Keep important geometry inside the centre 85% |

---

## Part 1 — App icon

**Use:** PWA icon, splash, favicon.  
**Save as:** `kr-brand-app-icon.png`

```
Apply the KARTRACER style prefix.

Image: app icon, square. A simplified modern sprint kart seen from a slightly elevated 3/4 front-left, cropped tight. Chassis dark, two wheels visible, a single gold (#E8C547) horizontal racing-stripe motif across the nose (like a start-finish kerb: gold interrupted by dark gaps). No driver. No text. No steering-wheel logo. Background #11151C. The kart must still read at 32×32: big wheels, simple tubes, gold stripe.

Do not add the word KARTRACER. Icon only.
```

---

## Part 2 — Empty-state kart (header / first-run)

**Use:** Chassis tab empty state, “new sheet” illustration.  
**Save as:** `kr-brand-empty-kart.png`

```
Apply the KARTRACER style prefix.

Image: a complete CIK sprint kart in a three-quarter studio view, parked, no driver, no trailer. Quiet, curated, like a product shot of the machine the sheet describes. Gold used only as a thin accent on the front bumper stripe. Background #11151C. Enough space around the kart that it can sit under a heading. No text.
```

---

## Part 2b — Chassis setup basic page (hero)

**Use:** The main **Chassis / setup sheet** page: hero above Kart, Front, Rear, Seat. This is the “this is the kart you are logging” picture, not an icon and not a single-lever diagram.  
**Save as:** `kr-page-chassis-setup.png` (wide) and optionally `kr-page-chassis-setup-square.png` if you also ask for a square crop.  
**Size:** **1536×1024** (wide). Keep the kart in the centre 85%.

```
Apply the KARTRACER style prefix.

This image is the hero for the BASIC CHASSIS SETUP PAGE — the sheet where a mechanic logs the kart as it sits (wheelbase, tyres, front, rear, seat, ballast). It must look like a curated workshop diagram of ONE complete sprint kart, not a poster and not a parts explosion.

Canvas: 1536×1024 landscape. Background solid #11151C.

Composition: slightly elevated three-quarter view from front-left, whole CIK sprint kart in frame, no driver, no trailer, no paddock. Dark grey tube chassis, black slicks, black seat, silver rear axle, rear disc visible, front bumper with a thin gold (#E8C547) interrupted stripe (same motif as the app icon). Side pods and rear bumper fitted. Lighting even, upper-left, no drama.

Purpose: the viewer should immediately read “this is the machine the numbers on this page belong to.” It is a map of the sheet, not a race still.

Gold callouts only — short ALL-CAPS, geometric sans, #E8EDF5 labels with thin gold leader lines. Four labels only, placed in quiet space so they do not cover the kart:

- KART — near the steering wheel / nose (the identity block: sheet, chassis, wheelbase, tyres, rims)
- FRONT — toward the front beam / yokes / stub axles (track, ride height, hubs, toe, camber, caster, Ackermann, front torsion, front bumper)
- REAR — toward the live axle / rear hubs (track, ride height, axle, torsion, third bearing, side pods, rear bumper)
- SEAT — toward the seat / floor pan (position, height, struts, ballast)

Do not label every nut. Do not add numbers, bar, mm, brands, class names, or a fake UI. No second kart. No 950 vs 1050 comparison. No wet weather. No driver silhouette.

The kart must still work if the labels are cropped off: clear chassis, four wheels, seat, axle. Curated, instructional, same family as the other KARTRACER diagrams.
```

---

## Part 3 — Tab icon set (six matching tiles)

**Use:** Chassis, Venue, History, Analysis, Logger, Tools.  
**Save as:** `kr-tab-chassis.png`, `kr-tab-venue.png`, `kr-tab-history.png`, `kr-tab-analysis.png`, `kr-tab-logger.png`, `kr-tab-tools.png`  
**Ask the GPT to output 6 separate images, same camera and line weight.**

```
Apply the KARTRACER style prefix.

Generate a SET OF SIX matching 1024×1024 icons. Same isometric camera, same gold accent, same #11151C ground. One simple object per tile, no words.

1) Chassis — a kart chassis tube frame only (no bodywork), isometric, gold highlight on the front yoke.
2) Venue — a small bitumen kart circuit seen from above as a simple gold ribbon loop on dark, one start marker.
3) History — two stacked setup sheets / cards, the front one with a gold corner tick.
4) Analysis — four tyre contact patches in a rectangle (FL FR / RL RR) with one gold arrow into a corner.
5) Logger — a small steering-wheel-mounted digital dash (generic, no brand) with a simple speed trace line in gold.
6) Tools — a combination of a digital tyre gauge and a 10 mm spanner, gold accent on the gauge bezel.

Each icon centred, large, no labels. Consistent scale: object fills ~70% of the square.
```

---

## Part 4 — Plan view with four corners

**Use:** Chassis map, pressure/temp entry, advice “which end”.  
**Save as:** `kr-chassis-plan-corners.png`

```
Apply the KARTRACER style prefix.

Image: true top-down orthographic plan of a sprint kart (steering wheel at the TOP of the image = front). Label the four tyres only: FL, FR, RL, RR in small geometric sans, #E8EDF5. Gold (#E8C547) thin outline on the chassis tubes. Rear axle a straight silver bar. Seat as a simple bucket. No driver. No other text. Keep labels outside the tyres so they remain readable when scaled down.
```

---

## Part 5 — Jacking / inside-rear lift

**Use:** Handling advice, “kart must lift the inside rear”.  
**Save as:** `kr-chassis-jacking-lift.png`

```
Apply the KARTRACER style prefix.

Image: rear-three-quarter view of a sprint kart in a left-hand corner, chassis flexed. The LEFT-REAR (inside) tyre is clearly LIGHT / slightly off the ground; the RIGHT-REAR is loaded and driving. Gold arrow pointing at the lifted inside-rear tyre. Subtle chassis twist in the tubes. No driver, or a generic dark helmeted silhouette with zero face detail if a rider is needed for scale — prefer no person. No text except it is better with no letters at all; the gold arrow is the caption.
```

---

## Part 6 — Front geometry (caster, camber, toe, Ackermann)

**Use:** Chassis front fields; analysis cards.  
**Save as (four images, same series):**  
`kr-lever-caster.png`  
`kr-lever-camber.png`  
`kr-lever-toe.png`  
`kr-lever-ackermann.png`

```
Apply the KARTRACER style prefix.

Generate a SET OF FOUR matching technical diagrams, same line weight, #11151C ground, gold for the “moving” angle.

1) CASTER — side view of one front upright / kingpin. A vertical dashed muted line and the kingpin axis tilted aft. Gold arc showing caster. Stub axle and a kart wheel. No chassis clutter.

2) CAMBER — front view of one front wheel. Vertical dashed line; wheel top leaned IN (negative camber). Gold dimension between rim top and the vertical. Caption-free.

3) TOE — top view of both front wheels, slight toe-out (fronts open). Gold arrows at the leading edges pointing slightly outward. Steering rack / tie rods simplified.

4) ACKERMANN — top view of front, wheels turned left. Inside (left) wheel steered MORE than the outside. Gold overlay of the two steer angles. Tie-rod inner hole suggested as a small gold dot on the steering arm.

No paragraphs of text. Optional tiny ALL-CAPS titles: CASTER / CAMBER / TOE / ACKERMANN only if needed.
```

---

## Part 7 — Track width and hubs

**Use:** Front/rear track, hub length, spacers.  
**Save as:** `kr-lever-front-track.png`, `kr-lever-rear-track.png`, `kr-lever-front-hubs.png`

```
Apply the KARTRACER style prefix.

Generate THREE matching diagrams.

1) Front track — top view of the front beam and two wheels. Gold dimension line across the outside of the front tyres. Hubs and spacers visible as stacked silver rings.

2) Rear track — top view of the live rear axle and two rear wheels. Gold dimension across the rears. Axle continuous (no diff).

3) Front hubs / spacers — close-up isometric of a front hub on the stub, several wheel spacers stacked, gold arrow “OUT” direction (wider). One spacer highlighted gold as “add one each side”.

No brand faces on the hub nuts. No text except optional OUT arrow.
```

---

## Part 8 — Ride height

**Use:** Front and rear ride height.  
**Save as:** `kr-lever-front-ride-height.png`, `kr-lever-rear-ride-height.png`

```
Apply the KARTRACER style prefix.

Generate TWO matching side-view diagrams of the same kart silhouette.

1) Front ride height — gold vertical dimension from ground plane to the front chassis rail / spindle. Kart side-on, left = front.

2) Rear ride height — gold vertical dimension from ground to the rear chassis rail near the axle. Same camera.

Muted dashed ground line. No driver. No text.
```

---

## Part 9 — Rear axle, torsion, third bearing

**Use:** Rear section of the sheet; axle polarity reminder (diagram only, no 950 essay).  
**Save as:** `kr-lever-axle.png`, `kr-lever-rear-torsion.png`, `kr-lever-third-bearing.png`

```
Apply the KARTRACER style prefix.

Generate THREE matching isometric close-ups of the rear of a sprint kart.

1) Axle — hollow rear axle through two hubs, a rear disc on the left, keyway suggested. Gold glow on the axle tube meaning “this bar is the spring”. Soft vs stiff is NOT three colours — one clear axle.

2) Rear torsion bar — torsion bar across the rear, clamps, optional “fitted vs off”: show the bar fitted, clamps gold.

3) Third bearing — extra bearing hanger on the axle between the seat and a hub, gold highlight on that third support.

No exploded hardware catalogue. No text.
```

---

## Part 10 — Seat, struts, ballast

**Use:** Seat / ballast panel.  
**Save as:** `kr-lever-seat-position.png`, `kr-lever-seat-struts.png`, `kr-lever-ballast.png`

```
Apply the KARTRACER style prefix.

Generate THREE matching diagrams.

1) Seat position — side view of seat in the chassis. Three ghost positions (forward / mid / back) in muted lines; the MID seat solid. Gold arrow along the chassis (fore-aft).

2) Seat struts — isometric of the seat with one strut per side to the chassis, gold on the struts.

3) Ballast — lead blocks as simple dark bricks: one set LOW on the floor pan (gold), ghosted HIGH on the seat (muted) to show height. Small arrows: FRONT / MID / REAR as optional ALL-CAPS only if readable.

No faces, no driver body — empty seat.
```

---

## Part 11 — Corner weights / scales

**Use:** Tools → Weights.  
**Save as:** `kr-tool-corner-weights.png`

```
Apply the KARTRACER style prefix.

Image: sprint kart on four small scale pads, true plan or high isometric. Each pad under a tyre. Tiny gold callouts of example masses only if numbers stay large and few: prefer NO numbers (the app shows kg). If numbers appear they must be generic (e.g. blocks, not 21.5). Show 43/57 idea as a slightly heavier rear pair via darker pads, not as text. Background #11151C.
```

---

## Part 12 — Handling symptoms (analysis choices)

**Use:** Analysis → Driving symptom buttons.  
**Save as (generate as one matching set):**  
`kr-symptom-understeer-entry.png`  
`kr-symptom-oversteer-entry.png`  
`kr-symptom-understeer-mid.png`  
`kr-symptom-oversteer-mid.png`  
`kr-symptom-understeer-exit.png`  
`kr-symptom-oversteer-exit.png`  
`kr-symptom-hop.png`  
`kr-symptom-chatter.png`  
`kr-symptom-slide.png`  
`kr-symptom-side-bite.png`  
`kr-symptom-darty.png`  
`kr-symptom-one-direction.png`

```
Apply the KARTRACER style prefix.

Generate a SET of twelve matching 1024×1024 story tiles. Same kart, same isometric corner, #11151C. Gold = the problem. No driver face. No words on the image (filenames carry the meaning).

1) Understeer on entry — kart turning left, front tyres pushed wide of the gold apex line; fronts scrubbing.

2) Rear sliding on entry — rear stepped out on entry, gold motion lines at the rears.

3) Understeer mid-corner — kart in the middle of the corner, nose still pushing, gold front wash.

4) Oversteer mid-corner — rotation too much at mid, gold rear arc.

5) Tight on exit — exiting, driver would unwind, nose still in; gold front plough on exit.

6) Oversteer on exit — power-on, rear stepping out, gold rear.

7) Violent hop — inside-rear slamming, kart bouncing, gold vertical arrows at a rear tyre.

8) Tyre chatter — high-frequency vibration marks on a loaded tyre, gold zigzag on the contact patch.

9) Not enough side bite — all four sliding together, gold four-wheel drift.

10) Too much side bite — kart hooked / stuck, gold “planted” hash on all patches.

11) Darty on straights — kart on a straight, gold left-right weave arrows at the nose.

12) Only wrong in one direction — same kart twice as ghost: left turn muted OK, right turn gold problem (or a single kart with a gold “R” arrow only if letters stay huge). Prefer two ghost corners.

Keep them tile-like: one idea, centred, no paddock advertising.
```

---

## Part 13 — Tyre pyrometer patterns

**Use:** Analysis → Temperatures.  
**Save as:**  
`kr-temp-legend-omi.png`  
`kr-temp-cold-middle.png`  
`kr-temp-hot-middle.png`  
`kr-temp-hot-inner.png`  
`kr-temp-hot-outer.png`

```
Apply the KARTRACER style prefix.

Generate FIVE matching close-ups of ONE kart slick tyre, tread facing camera, three heat zones across the tread: OUTER | MIDDLE | INNER (relative to the chassis centreline — inner = toward the kart).

Colour the rubber with the palette only:
- Cool: #2E3B52
- Working: #3ECF8E
- Hot: #FF8A4C
- Danger: #EE5D5D

1) Legend — even green working band across all three, tiny labels O / M / I only.

2) Cold middle — middle dark/cool, edges warmer green.

3) Hot middle — middle orange/red, edges cooler.

4) Hot inner — inner zone orange/red, outer cooler.

5) Hot outer — outer zone orange/red, inner cooler.

Same tyre, same camera. No pyrometer gun required on 2–5; optional slim probe on (1) only, gold tip, no brand.
```

---

## Part 14 — Pressures (cold / hot)

**Use:** Analysis → Pressures.  
**Save as:** `kr-pressure-cold-hot.png`

```
Apply the KARTRACER style prefix.

Image: two identical kart tyres side by side. Left: “cold” — tyre slightly more square, muted; a simple analogue gauge in the muted palette. Right: “hot” — tyre a little more ballooned, gold/orange warmth in the tread, gauge needle higher. No psi/bar numerals (the app has the numbers). Optional ALL-CAPS COLD and HOT in #E8EDF5.
```

---

## Part 15 — Slicks, wets, rims

**Use:** Chassis tyre/rim fields; wet checklist.  
**Save as:** `kr-tyre-slick.png`, `kr-tyre-wet.png`, `kr-rim-aluminium.png`, `kr-rim-magnesium.png`

```
Apply the KARTRACER style prefix.

Generate FOUR matching product-style tiles.

1) Slick — CIK-style slick, smooth tread, dark rubber, gold thin rim edge.

2) Wet — grooved rain tyre, water beads implied with a few gold-white streaks, not a storm photo.

3) Aluminium rim — silver-grey kart rim + slick, cooler metal.

4) Magnesium rim — slightly warmer gold-champagne metal (still in palette), same tyre, to read as “heats faster”.

No brand stamps. No text.
```

---

## Part 16 — Venue: circuit, direction, weather

**Use:** Venue tab, header badge, weather tiles.  
**Save as:**  
`kr-venue-circuit.png`  
`kr-venue-clockwise.png`  
`kr-venue-anticlockwise.png`  
`kr-weather-sun.png`  
`kr-weather-cloud.png`  
`kr-weather-overcast.png`  
`kr-weather-rain.png`  
`kr-weather-wind.png`  
`kr-weather-damp.png`

```
Apply the KARTRACER style prefix.

Generate a matching SET.

1) Circuit — simplified aerial of a technical bitumen kart track (not a copy of a real club layout). Gold racing line. Dark runoff. No club names, no “Bolivar”.

2) Clockwise — the same simple loop with a gold arrow following clockwise.

3) Anticlockwise — same loop, gold arrow the other way. Pair must be obviously reversed.

4) Sun — gold disc, hard shadow language, no landscape.

5) Cloud — a few #8B97AB clouds, gold peek.

6) Overcast — flat grey cloud sheet, no gold sun.

7) Rain — diagonal rain in #8B97AB, one gold lightning-free puddle ellipse (bitumen).

8) Wind — gold wind barbs / arrow from one side, a kart side-pod silhouette leaning into it optional; keep it icon-simple.

9) Damp — bitumen patch with mixed dry (dark) and wet sheen, small gold “damp” not written — visual only.

No maps of Australia, no weather-app UI, no °C digits (the app shows those).
```

---

## Part 17 — Wet paddock / Rain Meister

**Use:** Wet checklist panel.  
**Save as:** `kr-wet-checklist.png`, `kr-lever-rain-meister.png`

```
Apply the KARTRACER style prefix.

Generate TWO matching images.

1) Wet checklist — kart on a wet bitumen patch, rain tyres fitted, extra front track / caster suggested by a slightly wide front and gold kingpin. Rain, not flood. No text.

2) Rain Meister / wet helper — close-up of a simple additional wet-handling aid on the front (generic small damper/helper on the steering / chassis — do not copy a trademarked product shape). Gold on the device. If unsure, show extra front torsion / helper bar across the front, gold, on a wet kart.

No logos. No brand names.
```

---

## Part 18 — RAD / air density / jetting

**Use:** Venue RAD stats; Tools → Air and Jetting.  
**Save as:** `kr-tool-rad.png`, `kr-tool-main-jet.png`

```
Apply the KARTRACER style prefix.

Generate TWO matching technical tiles.

1) RAD — abstract air: a column of density, ISA reference as a muted dashed box, “today” as a gold shorter/thinner column (thin air) next to it. Optional tiny % is OK only if huge and a round number; prefer no digits. No Kestrel brand.

2) Main jet — a single Dellorto-style main jet as a small brass (gold) cylinder with a bore, next to a slightly smaller jet. Gold arrow “hotter / higher / more humid → smaller”. No stamp numbers (the app calculates stamps). Cutaway of the hole is fine.

Not a chemistry lab. Not a weather satellite.
```

---

## Part 19 — Gearing, fuel, caster sweep

**Use:** Tools → Gearing, Fuel, Caster sweep.  
**Save as:** `kr-tool-gearing.png`, `kr-tool-fuel.png`, `kr-tool-caster-sweep.png`

```
Apply the KARTRACER style prefix.

Generate THREE matching tiles.

1) Gearing — front sprocket and rear sprocket with chain, gold on the rear sprocket. No tooth counts.

2) Fuel — a fuel jug and a small oil bottle, gold measuring line. No brand, no 50:1 text.

3) Caster sweep — kart front, wheels at full lock left vs ghosted full lock right, gold arc on the floor showing sweep. Laser optional as a thin gold line on the stub — no laser brand.

No text.
```

---

## Part 20 — Logger / briefing

**Use:** Logger tab empty state and overlay chrome.  
**Save as:** `kr-logger-trace.png`, `kr-logger-briefing.png`

```
Apply the KARTRACER style prefix.

Generate TWO matching images.

1) Trace — a simple distance-vs-speed overlay: two gold/muted polylines on a dark chart, no axis numbers, no “T3”. Best lap gold, compare lap muted.

2) Briefing — a clipboard / card with three short gold bullets that are SHAPES not letters (bars), next to a tiny kart. Communicates “facts card”, not a novel. No readable English.

No MyChron / Alfano logos. Generic dash only if needed.
```

---

## Part 21 — History / snapshot diff

**Use:** History tab.  
**Save as:** `kr-history-snapshot.png`, `kr-history-diff.png`

```
Apply the KARTRACER style prefix.

Generate TWO matching images.

1) Snapshot — a single setup card with a kart glyph and a gold “saved” corner fold. No field names.

2) Diff — two cards overlapping; a gold highlight on one changed lever (e.g. front track wider on the later card). Arrows from old muted to new gold.

No timestamps. No “v1” marketing.
```

---

## Part 22 — Advice card / one change

**Use:** AdviceList first card, blocked-at-limit.  
**Save as:** `kr-advice-one-change.png`, `kr-advice-blocked.png`

```
Apply the KARTRACER style prefix.

Generate TWO matching icons.

1) One change — a single gold spanner or a single gold hub spacer being added; other tools muted in the background. Communicates “only one lever”.

2) Blocked / at limit — the same spacer against a stop, muted, with a warn-orange (#FF8A4C) tick mark (not a traffic sign farm). No text.
```

---

## Part 23 — Measuring kit

**Use:** Analysis temps/pressures; Tools; credibility.  
**Save as:** `kr-tool-pyrometer.png`, `kr-tool-tyre-gauge.png`, `kr-tool-camber-laser.png`

```
Apply the KARTRACER style prefix.

Generate THREE matching product illustrations on #11151C, no brands.

1) Needle pyrometer — probe into a tyre tread, three-zone tyre behind it.

2) Digital tyre gauge — simple, gold bezel, blank display (app has the numbers).

3) Stub-axle laser camber tool — generic bar on the stub, gold beam, bubbles suggested, not a named Sniper clone so close it is a trademark.

Studio lighting, not a messy toolbox photo.
```

---

## Part 24 — Grip states (green / rubbered / wet surface)

**Use:** Venue grip + surface.  
**Save as:** `kr-grip-green.png`, `kr-grip-normal.png`, `kr-grip-rubbered.png`

```
Apply the KARTRACER style prefix.

Generate THREE matching bitumen patches with a single kart tyre on each.

1) Green / low grip — dusty, light grey film, little rubber, muted.

2) Normal dry — clean dark bitumen, modest rubber marbles, gold sheen in the racing line.

3) Rubbered / high — dark polished rubber line, gold-black shine, marbles off-line.

Same camera, tyre, lighting. No text.
```

---

## After you have the files

Drop them in a folder named `app/public/art/` using the filenames above. Do not mix one photoreal icon into the vector set — regenerate the outlier with the style prefix and “match the rest of the KARTRACER icon set”.

If the model adds a chequered flag, a driver selfie, or a city skyline, reject and rerun that Part only.
```

---

## Hermes review addendum (2026-09-10)

Reviewed against the actual repos. The prompt engineering itself is excellent —
locked palette, per-part filenames, drift-reset instructions, anti-hallucination
rules (no invented numbers/brands) all match our KB discipline. Fix these before
running the set:

### P0 — output path is wrong for this codebase

“Drop them in `app/public/art/`” is the **old KARTS PWA layout**. The shipping
apps are Expo. Use:

- `C:\KartRacer\app\assets\art\` (create), mirrored to
  `C:\KartRacer\android-app\assets\art\` (no shared folders — repo rule).
- App icon (Part 1) does NOT go to art/: it replaces `app/assets/kr.png`
  (1024×1024) and is reused as the adaptive / splash image.

### P0 — platform icon requirements Part 1 misses

- **iOS**: icons may not have transparency; Apple applies the mask. Deliver
  the icon on the solid #11151C ground (the prefix’s “transparent if possible”
  must NOT apply to the app icon).
- **Android adaptive**: `kr.png` foreground must survive circle /
  squircle / rounded-square masks — keep the kart inside the centre ~66%
  safe zone, background colour set in app.json. Ask for a second export of
  Part 1 with extra padding for this.
- Add to the Part 1 prompt: “Also output a variant with the kart occupying
  only the central 66% for Android adaptive masking.”

### P1 — screens/tabs mismatch

Part 3 generates tabs for the PWA’s six tabs (Chassis/Venue/History/Analysis/
Logger/Tools). The Expo app’s navigation and the Kart Setup hub (see
`docs/KART_SETUP_TOOL_BUILD_SPEC.md`) use: Setup sheet, Analysis, History,
Upload session (logger), Calculators — venue/weather is a row on the Analysis
screen, not a tab. Rename on save:
`kr-tab-venue.png` → keep (used by the track picker row) and add
**Part 25** below for the missing Upload tile.

### P1 — background/hero image (`Kart_App_Bgrnd.png` in Downloads)

The sunset race photo (1003×639 RGBA, 1.7 MB) is the kart replacement for
`app/assets/home-poc-kart.png` (home hero) — good use, BUT:

1. It is photoreal; keep it ONLY as the home hero (the RR app does the same).
   Never mix it into the art/ illustration set.
2. 1003×639 is below full-bleed phone resolution. Regenerate at ≥1536×1024
   (or 2048×1365) before shipping, and export a darkened/gradient-overlay
   variant so white text stays readable on it (sunlight-readability doctrine).
3. Optimise before commit: PNG → high-quality JPEG/WebP for the hero
   (photo content, no alpha needed) — target < 400 KB.
4. Check kart liveries for readable sponsor logos before shipping a generated
   photo into a store build (Part prompts ban brands; the hero must obey too).

### P2 — small gaps → new Parts

- **Part 25 — Upload session tile** (`kr-tab-upload.png`): a CSV/file card
  with a gold up-arrow into a small lap-trace chart. Same set style as Part 3.
- **Part 26 — Consistency score** (`kr-session-consistency.png`): five lap
  bars, four even (green), one outlier (muted); gold median line. No numbers.
- **Part 27 — Compound window** (`kr-pressure-compound-window.png`): a tyre
  with a gold bracket band on a pressure scale — visual for “cited window”,
  no psi digits.
- **Part 28 — Here before / track history** (`kr-history-track.png`): a
  circuit ribbon (Part 3 venue style) with two ghosted setup cards anchored
  to it — the “what did we run here last time” row art.

### Process notes

- Generate Parts as batches exactly as written (shared lighting), then run a
  consistency pass: view all tiles at 96 px; regenerate outliers.
- After dropping files, mirror to android-app and run both `npx tsc --noEmit`
  gates (asset imports are typed via `require` — a missing file breaks the
  bundle at runtime, not compile; a smoke boot in Expo is the real check).
- Filenames are load-bearing (app keys off them) — keep the `kr-` scheme.
