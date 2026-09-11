/** Same ramp as scripts/lib/racing_line_colors.py — brake, release, throttle, drive. */
export const RACING_LINE_STOPS: [number, [number, number, number]][] = [
  [-1.0, [0xdc, 0x26, 0x26]],
  [-0.25, [0x25, 0x63, 0xeb]],
  [0.2, [0x16, 0xa3, 0x4a]],
  [1.0, [0xfa, 0xcc, 0x15]],
];

export const RACING_LINE_BAND_COUNT = 8;

export type RacingLinePhaseId = 'brake' | 'release' | 'throttle' | 'drive';

export type RacingLinePhase = {
  id: RacingLinePhaseId;
  label: string;
  color: string;
};

function hex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export const RACING_LINE_PHASES: readonly RacingLinePhase[] = [
  { id: 'brake', label: 'Brake', color: hex(RACING_LINE_STOPS[0][1]) },
  { id: 'release', label: 'Release', color: hex(RACING_LINE_STOPS[1][1]) },
  { id: 'throttle', label: 'Throttle', color: hex(RACING_LINE_STOPS[2][1]) },
  { id: 'drive', label: 'Drive', color: hex(RACING_LINE_STOPS[3][1]) },
];

function colorAt(u: number): [number, number, number] {
  if (u <= RACING_LINE_STOPS[0][0]) return RACING_LINE_STOPS[0][1];
  if (u >= RACING_LINE_STOPS[RACING_LINE_STOPS.length - 1][0]) {
    return RACING_LINE_STOPS[RACING_LINE_STOPS.length - 1][1];
  }
  for (let i = 0; i < RACING_LINE_STOPS.length - 1; i++) {
    const [u0, c0] = RACING_LINE_STOPS[i];
    const [u1, c1] = RACING_LINE_STOPS[i + 1];
    if (u0 <= u && u <= u1) {
      const f = (u - u0) / (u1 - u0);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * f),
        Math.round(c0[1] + (c1[1] - c0[1]) * f),
        Math.round(c0[2] + (c1[2] - c0[2]) * f),
      ];
    }
  }
  return RACING_LINE_STOPS[RACING_LINE_STOPS.length - 1][1];
}

export function racingLinePalette(): string[] {
  return Array.from({ length: RACING_LINE_BAND_COUNT }, (_, b) =>
    hex(colorAt(-1 + (2 * b) / (RACING_LINE_BAND_COUNT - 1)))
  );
}

export function racingLineBandIndex(u: number): number {
  const t = (Math.max(-1, Math.min(1, u)) + 1) * 0.5;
  return Math.max(
    0,
    Math.min(RACING_LINE_BAND_COUNT - 1, Math.round(t * (RACING_LINE_BAND_COUNT - 1)))
  );
}
