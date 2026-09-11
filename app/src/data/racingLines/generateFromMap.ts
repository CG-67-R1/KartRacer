import type { GpxTrackMap } from '../gpxTrackMaps/types';
import { racingLineBandIndex, racingLinePalette } from './colors';
import type { RacingLine } from './types';

const SMOOTH_WIN = 15;
const AVAIL_FLOOR = 0.5;

/** Sprint-kart starting envelope from docs/KR_TOOLS_AND_RESEARCH.md §4.3. */
const KART = {
  ayMax: 1.6 * 9.81,
  axBrake: 1.4 * 9.81,
  axAccel0: 4.5,
  kDrag: 0.0025,
  vMax: 32,
};

function smooth(values: number[], win: number): number[] {
  const n = values.length;
  if (n < 3) return values.slice();
  const half = Math.max(1, Math.floor(win / 2));
  return values.map((_, i) => {
    let sum = 0;
    let count = 0;
    for (let k = -half; k <= half; k++) {
      sum += values[(i + k + n) % n];
      count += 1;
    }
    return sum / count;
  });
}

function axRemaining(peak: number, ay: number, ayMax: number): number {
  const used = Math.min(1, (ay / ayMax) ** 2);
  return peak * Math.sqrt(Math.max(0, 1 - used));
}

/**
 * Colour the GPS lap as a suggested line (red brake → blue release → green
 * throttle → yellow drive). Overlay only — not a modelled lap time.
 */
export function generateRacingLineFromMap(map: GpxTrackMap): RacingLine {
  const pts = map.polyline;
  const n = pts.length;
  if (n < 3) {
    return { trackId: map.trackId, name: map.name, polyline: pts, palette: racingLinePalette(), bands: pts.map(() => 4) };
  }

  const ds: number[] = [];
  const heading: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    ds.push(Math.hypot(dx, dy) || 1e-4);
    heading.push(Math.atan2(dy, dx));
  }

  const kappa: number[] = [];
  for (let i = 0; i < n; i++) {
    let dH = heading[i] - heading[(i - 1 + n) % n];
    while (dH > Math.PI) dH -= 2 * Math.PI;
    while (dH < -Math.PI) dH += 2 * Math.PI;
    kappa.push(dH / ds[(i - 1 + n) % n]);
  }

  const vCorner = kappa.map((k) => Math.min(KART.vMax, Math.sqrt(KART.ayMax / Math.max(Math.abs(k), 1e-4))));

  const v = vCorner.slice();
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      const drive = Math.max(0.15, KART.axAccel0 - KART.kDrag * v[i] ** 2);
      const vAcc = Math.sqrt(v[i] ** 2 + 2 * drive * ds[i]);
      v[next] = Math.min(v[next], vAcc, KART.vMax);
    }
    for (let i = n - 1; i >= 0; i--) {
      const prev = (i - 1 + n) % n;
      const vBrk = Math.sqrt(v[i] ** 2 + 2 * KART.axBrake * ds[prev]);
      v[prev] = Math.min(v[prev], vBrk, KART.vMax);
    }
  }

  const u = v.map((speed, i) => {
    const next = (i + 1) % n;
    const ax = (v[next] ** 2 - speed ** 2) / (2 * ds[i]);
    const ay = speed ** 2 * Math.abs(kappa[i]);
    const avail =
      ax < 0
        ? axRemaining(KART.axBrake, ay, KART.ayMax)
        : axRemaining(Math.max(0.15, KART.axAccel0 - KART.kDrag * speed ** 2), ay, KART.ayMax);
    return Math.max(-1, Math.min(1, ax / Math.max(avail, AVAIL_FLOOR)));
  });

  return {
    trackId: map.trackId,
    name: map.name,
    polyline: pts,
    palette: racingLinePalette(),
    bands: smooth(u, SMOOTH_WIN).map(racingLineBandIndex),
  };
}
