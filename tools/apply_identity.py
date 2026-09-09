from pathlib import Path

ROOT = Path(r"C:\KartRacer")


def replace(path: Path, pairs: list[tuple[str, str]]) -> None:
    if not path.exists():
        print("skip", path)
        return
    text = path.read_text(encoding="utf-8")
    for a, b in pairs:
        text = text.replace(a, b)
    path.write_text(text, encoding="utf-8", newline="\n")
    print("patched", path)


def main() -> None:
    perm = [
        ("RoadRacer - Motorsport_Is_Life", "KartRacer - Motorsport_Is_Life"),
        ('"slug": "roadracer"', '"slug": "kartracer"'),
        ("com.milroadracer.app", "com.milkartracer.app"),
        ("RoadRacer uses your calendar", "KartRacer uses your calendar"),
        (
            "RoadRacer uses your photos to set your bike photo and rider avatar",
            "KartRacer uses your photos to set your kart photo and driver avatar",
        ),
        (
            "RoadRacer uses your camera to place your face in the rider avatar.",
            "KartRacer uses your camera to place your face in the driver avatar.",
        ),
        ("RoadRacer uses the microphone", "KartRacer uses the microphone"),
        ("RoadRacer uses speech recognition", "KartRacer uses speech recognition"),
        ("RoadRacer uses your location", "KartRacer uses your location"),
        (
            "https://github.com/CG-67-R1/Send-It/blob/main/docs/legal/PRIVACY.md",
            "",
        ),
        (
            "https://github.com/CG-67-R1/Send-It/blob/main/docs/legal/TERMS.md",
            "",
        ),
        ('"projectId": "c3447188-53ab-4806-96af-6eb1b5417de3"', ""),
    ]
    replace(ROOT / "android-app/app.json", perm)

    api = [
        ("https://send-it-ke7r.onrender.com", "http://localhost:3001"),
        (
            "https://github.com/CG-67-R1/Send-It/blob/main/docs/legal/PRIVACY.md",
            "",
        ),
        (
            "https://github.com/CG-67-R1/Send-It/blob/main/docs/legal/TERMS.md",
            "",
        ),
        (
            "RoadRace AI – Rider Coach & Technical Assistant (configure when ready)",
            "KartRacer AI – Driver Coach (local until KR-HOST)",
        ),
        (
            "// Default dev (Expo Go, iOS testers): hosted API — no local `npm start` required.",
            "// Default: local KartRacer API. Do not call the RoadRacer Render host.",
        ),
        ("fetch() for RoadRacer API routes.", "fetch() for KartRacer API routes."),
    ]
    replace(ROOT / "app/constants/api.ts", api)
    replace(ROOT / "android-app/constants/api.ts", api)

    ui = [
        (">RoadRacer</Text>", ">KartRacer</Text>"),
        ('Home headline: "RoadRacer"', 'Home headline: "KartRacer"'),
        ("title: 'Rider Coach'", "title: 'Driver Coach'"),
        ("title: 'Bike Setup'", "title: 'Kart Setup'"),
        ("title: 'Bike Setup Sheet'", "title: 'Kart Setup Sheet'"),
        ("title: 'Bike Balance Setup'", "title: 'Kart Balance (placeholder)'"),
        ("title: 'Bike Setup Basics'", "title: 'Kart Setup Basics'"),
    ]
    replace(ROOT / "app/App.tsx", ui)
    replace(ROOT / "android-app/App.tsx", ui)

    keys = [("@roadrace_", "@kartrace_")]
    replace(ROOT / "app/src/constants/storageKeys.ts", keys)
    replace(ROOT / "android-app/src/constants/storageKeys.ts", keys)

    replace(ROOT / "app/package.json", [('"name": "roadrace-app"', '"name": "kartracer-app"')])
    replace(
        ROOT / "android-app/package.json",
        [('"name": "roadracer-android"', '"name": "kartracer-android"')],
    )
    replace(
        ROOT / "api/package.json",
        [
            ('"name": "roadrace-headlines-api"', '"name": "kartracer-api"'),
            ("Rider Coach", "Driver Coach"),
        ],
    )
    replace(
        ROOT / "android-app/android/app/src/main/res/values/strings.xml",
        [("RoadRacer - Motorsport_Is_Life", "KartRacer - Motorsport_Is_Life")],
    )

    for f in (
        ROOT / "app/src/avatar/presets.ts",
        ROOT / "android-app/src/avatar/presets.ts",
    ):
        replace(f, [(" leathers'", " race suit (placeholder art)'")])

    eas = ROOT / "app/eas.json"
    dest = ROOT / "android-app/eas.json"
    if dest.exists() or True:
        dest.write_text(eas.read_text(encoding="utf-8"), encoding="utf-8", newline="\n")
        print("copied eas.json")


if __name__ == "__main__":
    main()
