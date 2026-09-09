"""KartCoach weekly audit: sanity-check all kart GPX files.

Checks per file: declared vs computed length, S/F waypoint presence,
loop closure (first vs last trackpoint), state tag in desc.
Read-only; prints a summary + flagged files. Not part of the app build.
"""
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"g": "http://www.topografix.com/GPX/1/1"}
GPX_DIR = Path(r"C:\KartRacer\data\gpx")


def haversine(lat1, lon1, lat2, lon2):
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def audit(path):
    root = ET.parse(path).getroot()
    desc_el = root.find("g:metadata/g:desc", NS)
    desc = desc_el.text if desc_el is not None else ""
    m = re.search(r"Declared length (\d+)\s*m", desc or "")
    declared = int(m.group(1)) if m else None
    state = None
    ms = re.search(r",\s*([A-Z]{2,3})\s+AU", desc or "")
    if ms:
        state = ms.group(1)

    wpts = [w for w in root.findall("g:wpt", NS)
            if (w.findtext("g:name", "", NS) or "").startswith("Start/Finish")]
    pts = [(float(p.get("lat")), float(p.get("lon")))
           for p in root.findall(".//g:trkpt", NS)]
    length = sum(haversine(*pts[i], *pts[i + 1]) for i in range(len(pts) - 1))
    gap = haversine(*pts[0], *pts[-1]) if len(pts) >= 2 else None
    sf_dist = None
    if wpts and pts:
        w = wpts[0]
        sf_dist = min(haversine(float(w.get("lat")), float(w.get("lon")), la, lo)
                      for la, lo in pts)
    return dict(name=path.stem, declared=declared, computed=length,
                n_pts=len(pts), gap=gap, sf_count=len(wpts), sf_dist=sf_dist,
                state=state)


def main():
    files = sorted(GPX_DIR.glob("*.gpx"))
    rows, flags = [], []
    for f in files:
        try:
            r = audit(f)
        except Exception as e:  # noqa: BLE001 - report and continue
            flags.append(f"{f.name}: PARSE ERROR {e}")
            continue
        rows.append(r)
        why = []
        if r["sf_count"] != 1:
            why.append(f"S/F waypoints={r['sf_count']}")
        if r["sf_dist"] is not None and r["sf_dist"] > 30:
            why.append(f"S/F {r['sf_dist']:.0f} m off track")
        if r["gap"] is not None and r["gap"] > 25:
            why.append(f"loop gap {r['gap']:.0f} m")
        if r["declared"] is None:
            why.append("no declared length")
        else:
            diff = abs(r["computed"] - r["declared"])
            if diff > max(0.10 * r["declared"], 40):
                why.append(f"declared {r['declared']} vs computed {r['computed']:.0f} m")
        if not (250 <= r["computed"] <= 1700):
            why.append(f"length {r['computed']:.0f} m outside kart range")
        if r["n_pts"] < 50:
            why.append(f"only {r['n_pts']} points")
        if why:
            flags.append(f"{r['name']}: " + "; ".join(why))

    lens = sorted(r["computed"] for r in rows)
    states = {}
    for r in rows:
        states[r["state"] or "?"] = states.get(r["state"] or "?", 0) + 1
    print(f"files={len(files)} parsed={len(rows)}")
    print(f"length m: min={lens[0]:.0f} median={lens[len(lens)//2]:.0f} max={lens[-1]:.0f}")
    print("states:", dict(sorted(states.items())))
    in_range = sum(1 for x in lens if 350 <= x <= 1100)
    print(f"350-1100 m (typical AU sprint): {in_range}/{len(rows)}")
    print(f"\nFLAGS ({len(flags)}):")
    for x in flags:
        print(" -", x)
    return 0


if __name__ == "__main__":
    sys.exit(main())
