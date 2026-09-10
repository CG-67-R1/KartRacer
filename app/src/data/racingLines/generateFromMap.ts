import type { GpxTrackMap } from '../gpxTrackMaps/types';
import type { RacingLine } from './types';

/** Same ramp as scripts/lib/racing_line_colors.py — brake, release, throttle, drive. */
const STOPS: [number, [number, number, number]][] = [
  [-1.0, [0xdc, 0x26, 0x26]],
  [-0.25, [0x25, 0x63, 0xeb]],
  [0.2, [0x16, 0xa3, 0x4a]],
  [1.0, [0xfa, 0xcc, 0x15]],
];

const BAND_COUNT = 8;
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

function hex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function colorAt(u: number): [number, number, number] {
  if (u <= STOPS[0][0]) return STOPS[0][1];
  if (u >= STOPS[STOPS.length - 1][0]) return STOPS[STOPS.length - 1][1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [u0, c0] = STOPS[i];
    const [u1, c1] = STOPS[i + 1];
    if (u0 <= u && u <= u1) {
      const f = (u - u0) / (u1 - u0);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * f),
        Math.round(c0[1] + (c1[1] - c0[1]) * f),
        Math.round(c0[2] + (c1[2] - c0[2]) * f),
      ];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

function bandU(band: number): number {
  return -1 + (2 * band) / (BAND_COUNT - 1);
}

function palette(): string[] {
  return Array.from({ length: BAND_COUNT }, (_, b) => hex(colorAt(bandU(b))));
}

function bandIndex(u: number): number {
  const t = (Math.max(-1, Math.min(1, u)) + 1) * 0.5;
  return Math.max(0, Math.min(BAND_COUNT - 1, Math.round(t * (BAND_COUNT - 1))));
}

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
    return { trackId: map.trackId, name: map.name, polyline: pts, palette: palette(), bands: pts.map(() => 4) };
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
    palette: palette(),
    bands: smooth(u, SMOOTH_WIN).map(bandIndex),
  };
}
