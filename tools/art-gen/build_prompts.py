#!/usr/bin/env python
"""Build per-part prompt files for the KartRacer art set.

Each prompt file = task wrapper + style prefix + part instructions.
A bash runner then feeds each file to `hermes chat -q`.
Source of truth for content: docs/IMAGE_GENERATION_PROMPTS.md (distilled).
"""
from pathlib import Path

ART = "C:/KartRacer/app/assets/art"
OUT = Path(r"C:\KartRacer\tools\art-gen\prompts")

STYLE = """KARTRACER visual system — obey this for the whole image.
Product: dark paddock chassis-setup tool. Images sit on dark UI panels, not posters.
Canvas: square 1024x1024 unless stated otherwise. Fill the frame; modest padding; subject readable at 96-160 px thumbnail.
Background: solid #11151C near-black blue. No sky, no paddock clutter, no lens flare, no bokeh, no people, no photoreal asphalt filling the frame.
Palette ONLY: #D7DDE8 light metal, #8B97AB muted, #2E3B52 mid, #1C2433 panel, #E8C547 gold accent (sparingly - one highlight/arrows/selected), #3ECF8E ok/grip green, #FF8A4C warn/heat orange, #EE5D5D danger red. Tyre rubber near-black with thin #2E3B52 highlight, not chrome.
Style: technical illustration, clean vector-like 3D or isometric, crisp edges, even upper-left lighting, no dramatic shadows. Curated modern workshop diagram - not a game render, not a stock photo, not a comic.
Kart when shown: modern CIK sprint, 1050-class tube chassis, front bumper, side pods, rear bumper, rear disc, no differential, seat, steering wheel, low-profile kart slicks unless wets stated. Chassis dark grey/black, gold accent only where specified.
Typography: avoid words. If labels required: short ALL-CAPS clean geometric sans #E8EDF5. Never invent lap times, brands, class names.
FORBIDDEN: watermarks, signatures, QR codes, fake phone UI, text paragraphs, AI-art glow, neon, US dirt/oval karts, vintage liveries, floating logos, chequered flags unless asked.
"""

# (filename, per-image prompt) tuples per part. Sets share a part for style consistency.
PARTS: dict[str, list[tuple[str, str]]] = {
    "p02-empty-kart": [
        ("kr-brand-empty-kart.png", "A complete CIK sprint kart in three-quarter studio view, parked, no driver, no trailer. Quiet, curated, like a product shot of the machine a setup sheet describes. Gold only as a thin accent stripe on the front bumper. Space around the kart so it can sit under a heading. No text."),
    ],
    "p02b-chassis-hero": [
        ("kr-page-chassis-setup.png", "Landscape 1536x1024. Hero for a BASIC CHASSIS SETUP page. ONE complete CIK sprint kart, slightly elevated three-quarter view from front-left, whole kart in frame, no driver, no paddock. Dark grey tube chassis, black slicks, black seat, silver rear axle, rear disc visible, front bumper with thin gold interrupted stripe. Even upper-left lighting. Four short ALL-CAPS #E8EDF5 labels with thin gold leader lines placed in quiet space: KART near the steering wheel/nose, FRONT toward the front beam/stub axles, REAR toward the live axle/rear hubs, SEAT toward the seat/floor pan. Do not label every nut. No numbers, no mm, no brands, no second kart, no fake UI."),
    ],
    "p03-tabs": [
        ("kr-tab-chassis.png", "Icon tile 1 of 6, isometric, object fills ~70%: a kart chassis tube frame only (no bodywork), gold highlight on the front yoke. No words."),
        ("kr-tab-venue.png", "Icon tile 2 of 6, same isometric camera: a small bitumen kart circuit from above as a simple gold ribbon loop on dark, one start marker. No words."),
        ("kr-tab-history.png", "Icon tile 3 of 6, same camera: two stacked setup sheets/cards, front one with a gold corner tick. No words."),
        ("kr-tab-analysis.png", "Icon tile 4 of 6, same camera: four tyre contact patches in a rectangle (FL FR / RL RR arrangement) with one gold arrow into a corner. No words."),
        ("kr-tab-logger.png", "Icon tile 5 of 6, same camera: a small steering-wheel-mounted digital dash (generic, no brand) with a simple gold speed trace line. No words."),
        ("kr-tab-tools.png", "Icon tile 6 of 6, same camera: a digital tyre gauge and a 10mm spanner together, gold accent on the gauge bezel. No words."),
    ],
    "p04-plan-corners": [
        ("kr-chassis-plan-corners.png", "True top-down orthographic plan of a sprint kart, steering wheel at the TOP (front up). Label ONLY the four tyres: FL, FR, RL, RR in small geometric sans #E8EDF5, placed outside the tyres. Gold thin outline on the chassis tubes. Rear axle a straight silver bar. Seat a simple bucket. No driver, no other text."),
    ],
    "p05-jacking": [
        ("kr-chassis-jacking-lift.png", "Rear-three-quarter view of a sprint kart mid left-hand corner, chassis flexed. The LEFT-REAR (inside) tyre clearly LIGHT, slightly off the ground; RIGHT-REAR loaded and driving. Gold arrow pointing at the lifted inside-rear tyre. Subtle twist in the chassis tubes. Prefer no person; no text - the gold arrow is the caption."),
    ],
    "p06-front-geometry": [
        ("kr-lever-caster.png", "Technical diagram 1 of 4 (matching series): side view of one front upright/kingpin. Vertical dashed muted reference line, kingpin axis tilted aft, gold arc showing the caster angle. Stub axle and one kart wheel. No chassis clutter. Optional tiny ALL-CAPS title CASTER only."),
        ("kr-lever-camber.png", "Technical diagram 2 of 4, same line weight: front view of one front wheel, vertical dashed line, wheel top leaned IN (negative camber), gold dimension between rim top and the vertical. Optional tiny title CAMBER only."),
        ("kr-lever-toe.png", "Technical diagram 3 of 4: top view of both front wheels with slight toe-out (fronts open). Gold arrows at leading edges pointing slightly outward. Simplified tie rods. Optional tiny title TOE only."),
        ("kr-lever-ackermann.png", "Technical diagram 4 of 4: top view of the front end, wheels turned left, inside (left) wheel steered MORE than the outside. Gold overlay of the two steer angles; tie-rod inner hole as a small gold dot on the steering arm. Optional tiny title ACKERMANN only."),
    ],
    "p07-track-hubs": [
        ("kr-lever-front-track.png", "Diagram 1 of 3 (matching): top view of the front beam and two wheels. Gold dimension line across the outside of the front tyres. Hubs and spacers visible as stacked silver rings. No text."),
        ("kr-lever-rear-track.png", "Diagram 2 of 3: top view of the continuous live rear axle (no diff) and two rear wheels. Gold dimension across the rears. No text."),
        ("kr-lever-front-hubs.png", "Diagram 3 of 3: close-up isometric of a front hub on the stub axle, several wheel spacers stacked, gold arrow pointing OUT (wider), one spacer highlighted gold. Optional single word OUT only."),
    ],
    "p08-ride-height": [
        ("kr-lever-front-ride-height.png", "Side-view diagram 1 of 2 (same kart silhouette, left = front): gold vertical dimension from the dashed ground line up to the front chassis rail/spindle. No driver, no text."),
        ("kr-lever-rear-ride-height.png", "Side-view diagram 2 of 2, same camera: gold vertical dimension from ground to the rear chassis rail near the axle. No text."),
    ],
    "p09-rear-axle": [
        ("kr-lever-axle.png", "Isometric close-up 1 of 3 (matching, rear of sprint kart): hollow rear axle through two bearing hangers and hubs, rear disc on the left, keyway suggested. Gold glow along the axle tube meaning 'this bar is the spring'. One clear axle, not three colours. No text."),
        ("kr-lever-rear-torsion.png", "Close-up 2 of 3: rear torsion bar fitted across the rear with clamps, clamps highlighted gold. No text."),
        ("kr-lever-third-bearing.png", "Close-up 3 of 3: an extra third bearing hanger on the axle between seat and hub, gold highlight on that third support. No exploded hardware. No text."),
    ],
    "p10-seat-ballast": [
        ("kr-lever-seat-position.png", "Diagram 1 of 3: side view of a kart seat in the chassis. Three ghost positions (forward/mid/back) in muted lines, the MID seat solid, gold fore-aft arrow along the chassis. Empty seat, no driver. No text."),
        ("kr-lever-seat-struts.png", "Diagram 2 of 3: isometric of the seat with one support strut per side down to the chassis, gold on the struts. No text."),
        ("kr-lever-ballast.png", "Diagram 3 of 3: lead ballast blocks as simple dark bricks - one set mounted LOW on the floor pan highlighted gold, a ghosted muted set HIGH on the seat back showing the height contrast. No text."),
    ],
    "p11-corner-weights": [
        ("kr-tool-corner-weights.png", "Sprint kart on four small scale pads, high isometric view, each pad under a tyre. NO numbers. Show the rear-heavy idea by making the rear pair of pads slightly darker/more loaded looking. Background #11151C."),
    ],
    "p12-symptoms": [
        ("kr-symptom-understeer-entry.png", "Story tile 1 of 12 (matching set: same kart, same isometric corner, gold = the problem, no words, no driver face): kart turning left at corner entry, front tyres pushing wide of a gold apex line, fronts scrubbing."),
        ("kr-symptom-oversteer-entry.png", "Tile 2 of 12: rear stepped out on corner entry, gold motion lines at the rear tyres."),
        ("kr-symptom-understeer-mid.png", "Tile 3 of 12: kart at mid-corner, nose still pushing wide, gold wash at the front tyres."),
        ("kr-symptom-oversteer-mid.png", "Tile 4 of 12: too much rotation at mid-corner, gold arc at the rear."),
        ("kr-symptom-understeer-exit.png", "Tile 5 of 12: corner exit, nose still tight/ploughing while the kart tries to straighten, gold front plough marks."),
        ("kr-symptom-oversteer-exit.png", "Tile 6 of 12: power-on exit, rear stepping out, gold at the rear tyres."),
        ("kr-symptom-hop.png", "Tile 7 of 12: violent hop - inside-rear slamming, kart bouncing, gold vertical arrows at one rear tyre."),
        ("kr-symptom-chatter.png", "Tile 8 of 12: high-frequency chatter - gold zigzag vibration marks on a loaded tyre contact patch."),
        ("kr-symptom-slide.png", "Tile 9 of 12: all four tyres sliding together in a drift, gold four-wheel slide marks."),
        ("kr-symptom-side-bite.png", "Tile 10 of 12: kart hooked/stuck to the track, gold planted hash marks under all four contact patches."),
        ("kr-symptom-darty.png", "Tile 11 of 12: kart on a straight, gold left-right weave arrows at the nose."),
        ("kr-symptom-one-direction.png", "Tile 12 of 12: the same kart shown twice as ghosts - a muted OK left-hand corner and a gold problem right-hand corner. No letters."),
    ],
    "p13-tyre-temps": [
        ("kr-temp-legend-omi.png", "Close-up 1 of 5 (same slick tyre, tread facing camera, three vertical heat zones OUTER|MIDDLE|INNER): even working green #3ECF8E band across all three zones, tiny labels O / M / I only, slim generic pyrometer probe with gold tip touching the tread."),
        ("kr-temp-cold-middle.png", "Close-up 2 of 5, same tyre/camera, no probe: middle zone cool dark #2E3B52, edges warmer green. Labels O/M/I only or none."),
        ("kr-temp-hot-middle.png", "Close-up 3 of 5: middle zone hot orange #FF8A4C into red, edges cooler green. No text."),
        ("kr-temp-hot-inner.png", "Close-up 4 of 5: inner zone (right side) hot orange/red, outer cooler green. No text."),
        ("kr-temp-hot-outer.png", "Close-up 5 of 5: outer zone (left side) hot orange/red, inner cooler green. No text."),
    ],
    "p14-pressures": [
        ("kr-pressure-cold-hot.png", "Two identical kart slicks side by side. Left COLD: slightly squarer profile, muted colours, simple analogue gauge low. Right HOT: slightly ballooned, gold/orange warmth in the tread, gauge needle higher. NO psi or bar numerals. Optional ALL-CAPS COLD and HOT in #E8EDF5 only."),
    ],
    "p15-tyres-rims": [
        ("kr-tyre-slick.png", "Product tile 1 of 4 (matching): a CIK-style kart slick, smooth tread, dark rubber, thin gold rim edge. No brands, no text."),
        ("kr-tyre-wet.png", "Tile 2 of 4: a grooved kart rain tyre, water beads implied with a few gold-white streaks - not a storm photo. No text."),
        ("kr-rim-aluminium.png", "Tile 3 of 4: silver-grey aluminium kart rim with slick fitted, cool metal tone. No text."),
        ("kr-rim-magnesium.png", "Tile 4 of 4: same wheel but warmer gold-champagne magnesium metal tone (reads as 'heats faster'). No text."),
    ],
    "p16-venue-weather": [
        ("kr-venue-circuit.png", "Set tile 1 of 9: simplified aerial of a fictional technical bitumen kart circuit (do not copy a real layout), gold racing line, dark runoff. No club names."),
        ("kr-venue-clockwise.png", "Tile 2 of 9: the same simple track loop with a gold arrow following it CLOCKWISE."),
        ("kr-venue-anticlockwise.png", "Tile 3 of 9: same loop, gold arrow ANTICLOCKWISE - obviously reversed from the clockwise tile."),
        ("kr-weather-sun.png", "Tile 4 of 9: weather icon - gold sun disc, hard shadow language, no landscape."),
        ("kr-weather-cloud.png", "Tile 5 of 9: a few #8B97AB clouds with a gold sun peeking."),
        ("kr-weather-overcast.png", "Tile 6 of 9: flat grey cloud sheet, no gold sun."),
        ("kr-weather-rain.png", "Tile 7 of 9: diagonal rain strokes in #8B97AB onto a bitumen puddle ellipse. No lightning."),
        ("kr-weather-wind.png", "Tile 8 of 9: gold wind barbs/arrows from one side, icon-simple."),
        ("kr-weather-damp.png", "Tile 9 of 9: a bitumen patch with mixed dry dark areas and wet sheen patches - visual 'damp', no words."),
    ],
    "p17-wet": [
        ("kr-wet-checklist.png", "Image 1 of 2: sprint kart on a wet bitumen patch, rain tyres fitted, slightly wider front track, gold highlight on the kingpin area suggesting extra caster. Rain not flood. No text."),
        ("kr-lever-rain-meister.png", "Image 2 of 2: close-up of a generic small wet-handling helper bar across the front of a wet kart chassis (invented generic device, no trademarked shape), gold on the device. No logos."),
    ],
    "p18-rad-jetting": [
        ("kr-tool-rad.png", "Technical tile 1 of 2: abstract air density - a muted dashed reference column (ISA) next to a shorter/thinner gold column (today's thin air). Prefer no digits. Not a weather app, no satellite."),
        ("kr-tool-main-jet.png", "Tile 2 of 2: a single Dellorto-style brass main jet as a small gold cylinder with a visible bore, next to a slightly smaller jet, gold arrow from big to small. Cutaway of the hole fine. NO stamp numbers."),
    ],
    "p19-tools": [
        ("kr-tool-gearing.png", "Tile 1 of 3: front sprocket and rear sprocket connected by chain, gold on the rear sprocket. No tooth counts, no text."),
        ("kr-tool-fuel.png", "Tile 2 of 3: a fuel jug and a small oil bottle, gold measuring line on the jug. No brands, no ratio text."),
        ("kr-tool-caster-sweep.png", "Tile 3 of 3: kart front end, wheels at full left lock solid, ghosted full right lock, gold arc on the floor showing the sweep. Thin gold laser line on the stub optional. No text."),
    ],
    "p20-logger": [
        ("kr-logger-trace.png", "Image 1 of 2: a simple distance-vs-speed chart on dark - best lap as a gold polyline, compare lap muted #8B97AB. No axis numbers, no sector labels."),
        ("kr-logger-briefing.png", "Image 2 of 2: a clipboard/card with three short gold bullet BARS (shapes, not letters) next to a tiny kart glyph. Communicates 'facts card'. No readable words."),
    ],
    "p21-history": [
        ("kr-history-snapshot.png", "Image 1 of 2: a single setup card with a kart glyph and a gold folded 'saved' corner. No field names, no timestamps."),
        ("kr-history-diff.png", "Image 2 of 2: two overlapping setup cards, the later one with a gold highlight on one changed lever (front track wider), small arrows from muted old to gold new. No text."),
    ],
    "p22-advice": [
        ("kr-advice-one-change.png", "Icon 1 of 2: ONE gold hub spacer (or single gold spanner) being added while other tools sit muted in the background - communicates 'change one lever only'. No text."),
        ("kr-advice-blocked.png", "Icon 2 of 2: the same spacer pressed against a stop/limit, muted, with a single warn-orange #FF8A4C tick mark. Not a traffic sign. No text."),
    ],
    "p23-measuring": [
        ("kr-tool-pyrometer.png", "Product illustration 1 of 3 (studio, no brands): a needle pyrometer probe entering a kart slick tread, a three-zone tyre behind it."),
        ("kr-tool-tyre-gauge.png", "Illustration 2 of 3: a simple digital tyre pressure gauge, gold bezel, BLANK display. No numbers."),
        ("kr-tool-camber-laser.png", "Illustration 3 of 3: a generic stub-axle laser camber/toe tool bar mounted on the stub, thin gold beam, bubble levels suggested. Generic, not a branded clone."),
    ],
    "p24-grip": [
        ("kr-grip-green.png", "Bitumen patch tile 1 of 3 (same camera, same single kart tyre resting on each): GREEN/low grip - dusty light grey film, little rubber, muted."),
        ("kr-grip-normal.png", "Tile 2 of 3: NORMAL dry - clean dark bitumen, modest rubber marbles, subtle gold sheen along the racing line."),
        ("kr-grip-rubbered.png", "Tile 3 of 3: RUBBERED/high grip - dark polished rubber line with gold-black shine, marbles swept off-line."),
    ],
    "p25-upload": [
        ("kr-tab-upload.png", "Icon tile matching the tab set (isometric, ~70% fill): a CSV/file card with a gold up-arrow feeding into a small lap-trace chart. No words."),
    ],
    "p26-consistency": [
        ("kr-session-consistency.png", "Five vertical lap-time bars: four even bars in green #3ECF8E, one taller outlier bar muted #8B97AB, a thin gold median line across. No numbers, no words."),
    ],
    "p27-compound-window": [
        ("kr-pressure-compound-window.png", "A kart slick beside a simple vertical pressure scale; a gold bracket marks a band (the cited window) on the scale. NO psi digits, no words."),
    ],
    "p28-here-before": [
        ("kr-history-track.png", "A gold circuit ribbon loop (venue style) with two small ghosted setup cards anchored to it by thin leader lines - 'what we ran here last time'. No words."),
    ],
}

WRAPPER = """You generate images for the KartRacer app art set. Use the image_generate tool for EACH image below, one at a time, and save each to the EXACT path given. If the tool saves elsewhere, move the file to the target path (bash mv). All images share one style; generate them in order so they match.

After all images: verify each file exists with ls, then reply with ONE line per image: OK <filename> or FAIL <filename> <reason>. Nothing else.

=== STYLE (applies to every image) ===
{style}
=== IMAGES ===
{images}"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for part, images in PARTS.items():
        blocks = []
        for i, (fname, prompt) in enumerate(images, 1):
            blocks.append(f"[{i}] Save to: {ART}/{fname}\nPrompt: {prompt}")
        text = WRAPPER.format(style=STYLE, images="\n\n".join(blocks))
        (OUT / f"{part}.txt").write_text(text, encoding="utf-8")
    total = sum(len(v) for v in PARTS.values())
    print(f"Wrote {len(PARTS)} part prompts covering {total} images to {OUT}")


if __name__ == "__main__":
    main()
