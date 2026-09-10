#!/usr/bin/env python
"""Build per-part vision-QA prompts for the KartRacer art set.

Each QA prompt makes a hermes sub-session vision_analyze every image in the
part and grade it PASS / REGEN against two bars:
  1. STYLE — dark #11151C-family ground, technical illustration (not photoreal),
     palette adherence, no watermarks/brands/invented text.
  2. REAL-WORLD ACCURACY — the depicted part/geometry must match how a real
     CIK sprint kart works. Criteria per part are written below and come from
     kb/ (ANGRI setup KB): wrong-direction geometry is a hard REGEN.
Verdicts are appended by the runner to tools/art-gen/qa-results.md.
"""
from pathlib import Path

ART = "C:/KartRacer/app/assets/art"
OUT = Path(r"C:\KartRacer\tools\art-gen\qa")

STYLE_BAR = (
    "STYLE bar (applies to every image): near-black dark blue ground (#11151C family), "
    "clean technical illustration or vector-like 3D - NOT a photograph, NOT photoreal, no AI-art glow/neon; "
    "gold #E8C547 used as the single accent; no watermarks, no signatures, no brand names or logos, "
    "no chequered flags, no invented numbers/lap times, no readable text beyond the short ALL-CAPS labels "
    "explicitly allowed for that image; subject centred and readable at ~96px thumbnail."
)

KART_BAR = (
    "KART realism bar (whenever a whole kart is shown): must read as a modern CIK SPRINT kart - "
    "flat low tube-frame chassis with NO suspension, seat low between the rear wheels, rear axle a single "
    "straight live axle (no differential housing), rear track visibly wider than front, small 5-inch wheels "
    "with low-profile tyres, front bumper + nose cone, side pods, steering wheel on a raked column. "
    "REGEN if it looks like a car, a dirt/oval kart, a toy, or has springs/dampers/suspension arms."
)

# part -> list of (filename, accuracy criteria)
CRITERIA: dict[str, list[tuple[str, str]]] = {
    "p01-icon": [
        ("kr-brand-app-icon.png", "Simplified sprint kart, 3/4 front-left, gold interrupted stripe on the nose. Must read at small size. No text."),
    ],
    "p02-empty-kart": [
        ("kr-brand-empty-kart.png", "Complete sprint kart, 3/4 studio view, parked, no driver. All four wheels, seat, steering wheel, side pods present and in correct positions."),
    ],
    "p02b-chassis-hero": [
        ("kr-page-chassis-setup.png", "Wide hero: ONE complete sprint kart. Exactly four labels KART / FRONT / REAR / SEAT with leader lines pointing at the correct regions: KART near steering wheel/nose, FRONT at the front beam/stub axles, REAR at the live axle/rear hubs, SEAT at the seat. A label pointing at the wrong region is a REGEN."),
    ],
    "p03-tabs": [
        ("kr-tab-chassis.png", "A kart tube-frame chassis ONLY (no bodywork/pods): two main rails, cross members, front yokes - a real kart frame shape, not a random truss."),
        ("kr-tab-venue.png", "A closed circuit loop ribbon viewed from above with one start marker. Loop must be closed and track-like (no dead ends)."),
        ("kr-tab-history.png", "Two stacked cards/sheets, front one with a gold corner tick. Reads as documents, not photos."),
        ("kr-tab-analysis.png", "Four contact patches arranged as a kart footprint: two front patches NARROWER apart than the two rear. One gold arrow."),
        ("kr-tab-logger.png", "A steering-wheel-mounted digital dash (rectangular display on a kart wheel) with a single trace line. No brand."),
        ("kr-tab-tools.png", "A tyre pressure gauge plus an open-end spanner. Both tools must be mechanically plausible (gauge has a chuck/hose or dial+stem; spanner has parallel jaws)."),
    ],
    "p04-plan-corners": [
        ("kr-chassis-plan-corners.png", "TOP-DOWN plan, front at TOP (steering wheel top). Labels: FL top-left, FR top-right, RL bottom-left, RR bottom-right - wrong quadrant = REGEN. Rear axle one straight bar; rear track wider than front."),
    ],
    "p05-jacking": [
        ("kr-chassis-jacking-lift.png", "Kart in a LEFT-hand corner: the LEFT-rear (inside) tyre lifted/light, RIGHT-rear loaded. Gold arrow at the lifted LEFT-rear. If the lifted wheel is the right-rear or a front, REGEN - this teaches the core jacking concept."),
    ],
    "p06-front-geometry": [
        ("kr-lever-caster.png", "Side view: kingpin axis tilted so its TOP leans REARWARD (toward the driver) versus a vertical dashed line, gold arc between them. Forward-leaning top = REGEN."),
        ("kr-lever-camber.png", "Front view: wheel TOP leaned INWARD (negative camber) vs vertical dashed line. Top leaning outward = REGEN."),
        ("kr-lever-toe.png", "Top view, both front wheels: LEADING edges opened OUTWARD slightly (toe-out). Leading edges pinched inward = REGEN."),
        ("kr-lever-ackermann.png", "Top view, wheels turned LEFT: the LEFT (inside) wheel steered at a visibly GREATER angle than the right. Equal or reversed angles = REGEN."),
    ],
    "p07-track-hubs": [
        ("kr-lever-front-track.png", "Top view front end: gold dimension line spanning OUTSIDE face to outside face of the two front tyres (full track width), not hub-to-hub."),
        ("kr-lever-rear-track.png", "Top view rear: one continuous axle bar through both rear hubs (no diff bulge), gold dimension across the outside of the rears."),
        ("kr-lever-front-hubs.png", "Close-up of a front hub on a stub axle with ring spacers stacked on the stub; gold arrow pointing OUTBOARD (away from chassis). Arrow pointing inboard = REGEN."),
    ],
    "p08-ride-height": [
        ("kr-lever-front-ride-height.png", "Side view: gold VERTICAL dimension from ground line up to the FRONT chassis rail/spindle area (front half of the kart)."),
        ("kr-lever-rear-ride-height.png", "Same camera: gold vertical dimension at the REAR rail near the axle. Dimension at wrong end = REGEN."),
    ],
    "p09-rear-axle": [
        ("kr-lever-axle.png", "Rear close-up: ONE hollow straight axle through bearing hangers with hubs at each end, brake disc on the axle. No differential, no CV joints - those are REGEN."),
        ("kr-lever-rear-torsion.png", "A separate torsion BAR mounted across the rear of the chassis with clamps (gold). Must be an add-on bar, not the axle itself."),
        ("kr-lever-third-bearing.png", "THREE axle supports visible: standard hanger near each hub plus a THIRD bearing hanger toward the middle, highlighted gold."),
    ],
    "p10-seat-ballast": [
        ("kr-lever-seat-position.png", "Side view: bucket seat with fore/aft ghost positions along the chassis; gold arrow HORIZONTAL (fore-aft). Vertical arrow = REGEN."),
        ("kr-lever-seat-struts.png", "Seat with a thin support strut per side running from seat upper edge down/back to the chassis/axle area, struts gold."),
        ("kr-lever-ballast.png", "Dark lead-style blocks: solid set mounted LOW on the floor/seat base (gold), ghosted set HIGH on the seat back (muted). Height contrast must be obvious."),
    ],
    "p11-corner-weights": [
        ("kr-tool-corner-weights.png", "Kart with each of its FOUR wheels on its own small scale pad. Pads under wheels (not beside). Rear pads may read heavier - fine; numbers absent."),
    ],
    "p12-symptoms": [
        ("kr-symptom-understeer-entry.png", "Corner entry: FRONT of the kart tracking WIDE of the gold line (nose pushing out). Rear stepped out instead = REGEN."),
        ("kr-symptom-oversteer-entry.png", "Corner entry: REAR stepped out of line, fronts still pointed in."),
        ("kr-symptom-understeer-mid.png", "Mid-corner: nose wide of apex line, front wash marks."),
        ("kr-symptom-oversteer-mid.png", "Mid-corner: rear rotating past the line, gold arc at rear."),
        ("kr-symptom-understeer-exit.png", "Exit: kart still turned in/ploughing at the front while track opens."),
        ("kr-symptom-oversteer-exit.png", "Exit under power: rear breaking sideways."),
        ("kr-symptom-hop.png", "Vertical gold arrows at a REAR tyre with the kart visibly bouncing/tilted - vertical motion, not slide."),
        ("kr-symptom-chatter.png", "Zigzag/high-frequency vibration marks at a loaded tyre contact patch."),
        ("kr-symptom-slide.png", "All FOUR tyres sliding together - kart drifting bodily off line."),
        ("kr-symptom-side-bite.png", "Kart visually planted/hooked, hash marks under ALL patches (grip, not slide)."),
        ("kr-symptom-darty.png", "Kart on a STRAIGHT with left-right weave arrows at the nose. On a corner = REGEN."),
        ("kr-symptom-one-direction.png", "Two ghost scenes: one corner direction OK/muted, the OTHER direction gold/problem. Both directions must actually differ."),
    ],
    "p13-tyre-temps": [
        ("kr-temp-legend-omi.png", "Slick tread facing camera split into three vertical zones labelled O / M / I; even green across all three; slim probe with gold tip."),
        ("kr-temp-cold-middle.png", "MIDDLE zone cool/dark, both edges warmer green. Any other zone pattern = REGEN."),
        ("kr-temp-hot-middle.png", "MIDDLE zone orange/red, edges cooler."),
        ("kr-temp-hot-inner.png", "ONE edge zone hot orange/red, opposite edge cooler (inner-edge overheat pattern)."),
        ("kr-temp-hot-outer.png", "The OPPOSITE edge zone hot versus the hot-inner tile - the pair must be mirrored, not identical."),
    ],
    "p14-pressures": [
        ("kr-pressure-cold-hot.png", "Two tyres: COLD one squarer/muted with low gauge; HOT one slightly ballooned/warm with higher gauge needle. No psi/bar digits."),
    ],
    "p15-tyres-rims": [
        ("kr-tyre-slick.png", "Completely SMOOTH tread kart slick. Any grooves = REGEN."),
        ("kr-tyre-wet.png", "GROOVED rain tread. Smooth = REGEN."),
        ("kr-rim-aluminium.png", "Kart wheel, cool silver-grey metal rim."),
        ("kr-rim-magnesium.png", "Same wheel form, warmer gold-champagne metal - must be distinguishable from the aluminium tile."),
    ],
    "p16-venue-weather": [
        ("kr-venue-circuit.png", "Closed fictional kart circuit from above with a gold racing line following plausible corner geometry (line hugs insides of corners, not centreline everywhere)."),
        ("kr-venue-clockwise.png", "Loop with gold direction arrows going CLOCKWISE."),
        ("kr-venue-anticlockwise.png", "Same style loop with arrows ANTICLOCKWISE - must be opposite to the clockwise tile."),
        ("kr-weather-sun.png", "Sun icon, gold disc."),
        ("kr-weather-cloud.png", "Partly cloudy: grey clouds + gold sun peek."),
        ("kr-weather-overcast.png", "Full grey sheet, NO gold sun."),
        ("kr-weather-rain.png", "Diagonal rain over a bitumen puddle. No lightning."),
        ("kr-weather-wind.png", "Wind arrows/barbs from one side."),
        ("kr-weather-damp.png", "Bitumen patch with mixed dry (matte dark) and wet (sheen) areas."),
    ],
    "p17-wet": [
        ("kr-wet-checklist.png", "Sprint kart on wet bitumen wearing GROOVED wet tyres (grooves visible)."),
        ("kr-lever-rain-meister.png", "Generic helper bar/device on the FRONT of a wet kart, gold. No brand shapes."),
    ],
    "p18-rad-jetting": [
        ("kr-tool-rad.png", "Two columns: muted dashed reference column and a shorter/thinner gold column (thinner air today). Abstract is fine; no weather map."),
        ("kr-tool-main-jet.png", "Small brass carburettor main jet(s): cylindrical body with a visible axial BORE, a slightly smaller second jet, gold arrow big-to-small. No stamped numbers."),
    ],
    "p19-tools": [
        ("kr-tool-gearing.png", "SMALL front sprocket and LARGE rear sprocket joined by a chain (size difference must be visible), gold on the rear."),
        ("kr-tool-fuel.png", "Fuel jug + small oil bottle, gold fill/measure line. No brands or ratio text."),
        ("kr-tool-caster-sweep.png", "Kart front end: wheels at full LEFT lock solid, ghosted full RIGHT lock, gold sweep arc on the floor between them."),
    ],
    "p20-logger": [
        ("kr-logger-trace.png", "Chart with TWO polylines - one gold (best), one muted (compare) - over distance. No axis numbers."),
        ("kr-logger-briefing.png", "Card/clipboard with three gold bullet BARS (abstract shapes, no letters) + tiny kart glyph."),
    ],
    "p21-history": [
        ("kr-history-snapshot.png", "One setup card, kart glyph, gold folded corner. No timestamps."),
        ("kr-history-diff.png", "Two overlapping cards, ONE lever visibly changed and highlighted gold, arrow old->new."),
    ],
    "p22-advice": [
        ("kr-advice-one-change.png", "Exactly ONE gold tool/spacer active; other tools muted background - 'one change' must read."),
        ("kr-advice-blocked.png", "Same object at a stop/limit, muted, single orange tick/mark. Not a road sign."),
    ],
    "p23-measuring": [
        ("kr-tool-pyrometer.png", "Needle probe entering a slick tread, three-zone tyre behind. Probe must touch/enter the rubber."),
        ("kr-tool-tyre-gauge.png", "Digital tyre gauge with BLANK display (no digits), gold bezel."),
        ("kr-tool-camber-laser.png", "Bar-style tool mounted on a front stub axle with a thin gold laser line. Generic."),
    ],
    "p24-grip": [
        ("kr-grip-green.png", "Bitumen dusty/grey with little rubber - low grip look."),
        ("kr-grip-normal.png", "Clean dark bitumen, some marbles, subtle sheen on line."),
        ("kr-grip-rubbered.png", "Dark polished rubber line clearly darker than surroundings, marbles off-line. Must be distinguishable from normal tile."),
    ],
    "p25-upload": [
        ("kr-tab-upload.png", "File/CSV card with gold up-arrow into a small lap-trace chart."),
    ],
    "p26-consistency": [
        ("kr-session-consistency.png", "Five bars: FOUR even green + ONE taller muted outlier + thin gold median line. Count must be right."),
    ],
    "p27-compound-window": [
        ("kr-pressure-compound-window.png", "Tyre beside a vertical scale with a gold BRACKET marking a band on the scale. No digits."),
    ],
    "p28-here-before": [
        ("kr-history-track.png", "Gold circuit ribbon with two ghosted setup cards linked to it by leader lines."),
    ],
}

WRAPPER = """You are the art QA inspector for the KartRacer app. For EACH image listed below, call vision_analyze on the file with the given question, judge it against BOTH bars, then decide PASS or REGEN.

{style_bar}

{kart_bar}

Be strict on ACCURACY (wrong-direction geometry, wrong wheel lifted, wrong zone hot, missing grooves = REGEN) and pragmatic on style (minor palette drift that still reads dark+gold = PASS with note).

Final reply: ONE line per image, nothing else, exactly:
PASS <filename> - <5-word note>
or
REGEN <filename> - <specific reason>

=== IMAGES ===
{images}"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    for part, images in CRITERIA.items():
        blocks = []
        for fname, criteria in images:
            blocks.append(
                f"File: {ART}/{fname}\n"
                f"vision_analyze question: Describe exactly what this technical illustration shows: subject, geometry/orientation details, colours, any text or labels, background, and whether it is photoreal or illustrated.\n"
                f"ACCURACY criteria: {criteria}"
            )
            n += 1
        text = WRAPPER.format(style_bar=STYLE_BAR, kart_bar=KART_BAR, images="\n\n".join(blocks))
        (OUT / f"{part}.txt").write_text(text, encoding="utf-8")
    print(f"Wrote {len(CRITERIA)} QA prompts covering {n} images to {OUT}")


if __name__ == "__main__":
    main()
