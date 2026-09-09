"""Create compile-safe empty catalogs after the Send-It merge.

Does not touch data/gpx, gpt-knowledge, or existing KartRacer docs.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(r"C:\KartRacer")
JOBS = "docs/CURSOR_BUILD_JOBS.md"
EQUIV = "docs/KR_DATA_EQUIVALENTS.md"

PLACEHOLDER_MD = """# Placeholder — motorcycle data stripped

RoadRacer shipped motorcycle road-race content here.

KartRacer source already exists on disk:
- Track GPX: `C:\\\\KartRacer\\\\data\\\\gpx` (129 one-lap files) — import via {jobs} J1.1
- Coach pack skeletons: `C:\\\\KartRacer\\\\gpt-knowledge` — populate before upload
- Equivalents: `{equiv}`

Do not copy RoadRacer bike/car GPX or MoMS into this folder.
""".format(jobs=JOBS, equiv=EQUIV)


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def write_json(path: Path, obj) -> None:
    write(path, json.dumps(obj, indent=2) + "\n")


STUB_GPX_INDEX = '''import type { GpxTrackMap } from './types';

/** Empty until J1.3 bakes C:\\\\KartRacer\\\\data\\\\gpx via build-gpx-track-maps.mjs */
const MAPS: Record<string, GpxTrackMap> = {};

export const GPX_TRACK_MAP_IDS = Object.keys(MAPS);

export function getGpxTrackMap(trackId: string): GpxTrackMap | undefined {
  return MAPS[trackId];
}

export function listGpxTrackMaps(): { id: string; name: string }[] {
  return GPX_TRACK_MAP_IDS.map((id) => ({ id, name: MAPS[id].name }));
}
'''

STUB_LINE_INDEX = '''import type { RacingLine } from './types';

/** Empty until J1.7 retunes the quasi-steady solver for karts. Missing line is a warning. */
const LINES: Record<string, RacingLine> = {};

export const RACING_LINE_IDS = Object.keys(LINES);

export function getRacingLine(trackId: string): RacingLine | undefined {
  return LINES[trackId];
}
'''

STUB_CORNER_INDEX = '''import type { TrackDetailsCorners } from './types';

/** Empty until J1.3 / J1.6 run the locked detector on kart GPX. */
const LAYOUTS: Record<string, TrackDetailsCorners> = {};

export const TRACK_DETAILS_CORNER_IDS = Object.keys(LAYOUTS);

export function getTrackDetailsCorners(trackId: string): TrackDetailsCorners | undefined {
  return LAYOUTS[trackId];
}
'''

STUB_MEMORY_LAYOUTS = '''import type { TrackMemoryLayout } from './types';

const EMPTY: TrackMemoryLayout = {
  trackId: '_none',
  name: 'No kart layout baked yet',
  direction: 'unknown',
  lengthM: 0,
  points: [],
  corners: [],
};

const LAYOUTS: Record<string, TrackMemoryLayout> = {};

export const TRACK_MEMORY_TRACK_IDS = Object.keys(LAYOUTS);
export const TRACK_MEMORY_MISSING_GPX = [] as const;
export const TRACK_MEMORY_NEEDS_REBAKE = [] as const;

export function getTrackMemoryLayout(trackId: string): TrackMemoryLayout | undefined {
  return LAYOUTS[trackId];
}

export function getDefaultTrackMemoryLayout(): TrackMemoryLayout {
  const id = TRACK_MEMORY_TRACK_IDS[0];
  return (id ? LAYOUTS[id] : undefined) ?? EMPTY;
}

export function listTrackMemoryTracks(): { id: string; name: string }[] {
  return TRACK_MEMORY_TRACK_IDS.map((id) => ({ id, name: LAYOUTS[id].name }));
}
'''

STUB_BIKE_SETUP = '''export type HotspotKind = 'measure' | 'adjust';

export type BikeSetupHotspot = {
  id: string;
  kind: HotspotKind;
  xPct: number;
  yPct: number;
  title: string;
  summary: string;
  roadBase: string;
  trackBase: string;
  capabilityNote: string;
  aiPrompt: string;
};

/** Motorcycle fork/shock hotspots removed. Kart Setup fields: J2.1 in docs/CURSOR_BUILD_JOBS.md */
export const BIKE_SETUP_INTRO = {
  whyBase:
    'Kart Setup is not motorcycle suspension. RoadRacer listed fork/shock sag here. KartRacer will use front width, caster, camber, toe, axle, hubs, seat, and pressures — see docs/CURSOR_BUILD_JOBS.md J2.1 and gpt-knowledge/chassis-setup-and-tyre-kb.md.',
  capabilityCaveat:
    'This screen is a placeholder. Do not use leftover motorcycle clicker advice on a kart.',
};

export const BIKE_SETUP_HOTSPOTS: BikeSetupHotspot[] = [];
'''


def copy_types_from_sendit() -> None:
    src = Path(r"C:\Users\Administrator\.cursor\Send-It")
    pairs = [
        (src / "app/src/data/gpxTrackMaps/types.ts", "app/src/data/gpxTrackMaps/types.ts"),
        (src / "app/src/data/racingLines/types.ts", "app/src/data/racingLines/types.ts"),
        (src / "app/src/data/trackDetailsCorners/types.ts", "app/src/data/trackDetailsCorners/types.ts"),
        (src / "app/src/trackMemory/types.ts", "app/src/trackMemory/types.ts"),
    ]
    for a, b in pairs:
        dest = ROOT / b
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(a, dest)
        android = ROOT / "android-app" / Path(b).relative_to("app") if b.startswith("app/") else None
        if b.startswith("app/"):
            ad = ROOT / "android-app" / Path(b).relative_to("app")
            ad.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(a, ad)


def write_app_stubs(app: Path) -> None:
    write(app / "src/data/gpxTrackMaps/index.ts", STUB_GPX_INDEX)
    write(app / "src/data/gpxTrackMaps/PLACEHOLDER.md", PLACEHOLDER_MD)
    write(app / "src/data/racingLines/index.ts", STUB_LINE_INDEX)
    write(app / "src/data/racingLines/PLACEHOLDER.md", PLACEHOLDER_MD)
    write(app / "src/data/trackDetailsCorners/index.ts", STUB_CORNER_INDEX)
    write(app / "src/data/trackDetailsCorners/PLACEHOLDER.md", PLACEHOLDER_MD)
    write(app / "src/trackMemory/layouts.ts", STUB_MEMORY_LAYOUTS)
    write(app / "src/data/trackMemory/PLACEHOLDER.md", PLACEHOLDER_MD)
    write(app / "src/data/bikeSetupBasics.ts", STUB_BIKE_SETUP)
    write_json(app / "src/data/tracks.json", {"version": 1, "tracks": []})
    write_json(
        app / "src/data/track_turn_verification.json",
        {
            "version": 2,
            "policy": "left|right only with handSources evidence. Never set turn hand from GPX. See CURSOR_BUILD_JOBS.md J1.5.",
            "updated": "2026-09-09",
            "allowedSourceMethods": ["official_map", "authoritative_preview"],
            "bannedSourceMethods": ["gpx_bearing", "ccw_inference", "clockwise_inference"],
            "forceAllComplex": [],
            "trackDirection": {},
            "lengthKm": {},
            "verifiedHands": {},
        },
    )
    write_json(
        app / "src/data/catalog_track_geofences.json",
        {
            "type": "FeatureCollection",
            "name": "KartRacer_Catalog_Track_Geofences",
            "metadata": {
                "version": 1,
                "feature_count": 0,
                "note": "Empty until J1.4. Source GPX in C:/KartRacer/data/gpx",
            },
            "features": [],
        },
    )
    write_json(app / "src/data/trackInfo/facts.json", {})
    write(app / "src/data/trackInfo/PLACEHOLDER.md", PLACEHOLDER_MD)
    write_json(app / "src/data/onboardingBikes.json", [])
    write_json(app / "src/data/onboardingRiders.json", [])
    write(app / "src/data/PLACEHOLDER_ONBOARDING.md", PLACEHOLDER_MD + "\nJobs: J2.3 onboardingKarts.json / onboardingDrivers.json\n")
    write_json(
        app / "src/data/gearing/bikePowerbandRef.json",
        {
            "version": "0.0-placeholder",
            "note": "Motorcycle powerbands stripped. Kart engines: J2.2 kartEngineRef.json (X30, KA100, Rotax, KZ2, 4SS).",
            "bikes": [],
        },
    )
    write_json(
        app / "src/data/rider_ai_faqs.json",
        {
            "version": 0,
            "coach": [],
            "bikesetup": [],
            "global_principles": [
                "KartRacer FAQs are empty until J2.6. Do not invent pressures or class weights."
            ],
        },
    )
    write_json(app / "src/packs/bundled/au/tracks/tracks.json", {"version": 1, "tracks": []})
    write_json(app / "src/packs/bundled/uk/tracks/tracks.json", {"version": 1, "tracks": []})
    write_json(app / "src/packs/bundled/au/competitions/series.json", {"series": []})
    write_json(app / "src/packs/bundled/uk/competitions/series.json", {"series": []})
    write_json(app / "src/packs/bundled/au/onboarding/areas.json", {"areas": []})
    write_json(app / "src/packs/bundled/uk/onboarding/areas.json", {"areas": []})
    write_json(app / "src/packs/bundled/active.json", {"packs": ["au"], "notes": "AU-only KartRacer launch. UK pack inactive."})


def empty_pack_json(path: Path) -> None:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return
    if not isinstance(data, dict):
        return
    changed = False
    for key in (
        "tracks",
        "series",
        "areas",
        "features",
        "classes",
        "clubs",
        "federations",
        "events",
        "sources",
        "items",
        "pathways",
        "terms",
        "suppliers",
        "prompts",
    ):
        if isinstance(data.get(key), list) and data[key]:
            data[key] = []
            changed = True
    if path.name == "tracks.json" and "tracks" not in data:
        data["tracks"] = []
        changed = True
    if changed:
        data["_placeholder"] = True
        data["_explainer"] = (
            "Motorcycle pack content stripped. Refill from C:/KartRacer/docs/KR_DATA_EQUIVALENTS.md and CURSOR_BUILD_JOBS.md J4.1."
        )
        write_json(path, data)


def main() -> None:
    copy_types_from_sendit()
    write_app_stubs(ROOT / "app")
    write_app_stubs(ROOT / "android-app")

    write(ROOT / "scripts/track-memory-gpx/PLACEHOLDER.md", PLACEHOLDER_MD)
    write(ROOT / "tests/PLACEHOLDER.md", PLACEHOLDER_MD)
    write(ROOT / "Q&A/PLACEHOLDER.md", "Motorcycle Q&A PDFs were not copied. Ingest KA Manual + class regs per KR_DATA_EQUIVALENTS.md §5. Job J3.4.\n")
    write(ROOT / "api/data/au-kart-events.json", "[]\n")
    write(
        ROOT / "api/data/PLACEHOLDER.md",
        "au-road-race-events.json was not copied. New cache: au-kart-events.json (empty). Sources: J3.1–J3.2.\n",
    )
    write_json(ROOT / "api/data/au-road-race-events.json", [])
    write_json(ROOT / "api/data/calendar-static.json", {"events": []})
    write_json(
        ROOT / "api/data/au-road-race-sources.json",
        {
            "_placeholder": True,
            "_explainer": "Motorcycle ICS sources stripped. Replace with au-kart-sources.json (J3.1).",
            "sources": [],
        },
    )
    write_json(ROOT / "api/data/rider_ai_faqs.json", {"version": 0, "coach": [], "bikesetup": []})

    write_json(ROOT / "packs/active.json", {"packs": ["au"], "notes": "AU-only KartRacer launch."})
    registry = json.loads((ROOT / "packs/registry.json").read_text(encoding="utf-8"))
    registry["discipline"] = "karting"
    write_json(ROOT / "packs/registry.json", registry)
    write(ROOT / "packs/PLACEHOLDER.md", PLACEHOLDER_MD)

    for path in (ROOT / "packs/regions").rglob("*.json"):
        empty_pack_json(path)

    for extra in (
        ROOT / "docs/60yearGP.pdf",
        ROOT / "docs/motorcycle-road-racing-top-10-countries.csv",
        ROOT / "docs/ROADRACER_QUICK_RESPONSES.md",
        ROOT / "docs/RR.png",
        ROOT / "docs/SCALE_UP_PLAN.md",
        ROOT / "docs/HEADLINES-PAGE-BRIEF.md",
    ):
        if extra.exists():
            extra.unlink()

    print("placeholders written")


if __name__ == "__main__":
    main()
