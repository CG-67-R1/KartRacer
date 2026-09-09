import type { RacingLine } from './types';

/** Empty until J1.7 retunes the quasi-steady solver for karts. Missing line is a warning. */
const LINES: Record<string, RacingLine> = {};

export const RACING_LINE_IDS = Object.keys(LINES);

export function getRacingLine(trackId: string): RacingLine | undefined {
  return LINES[trackId];
}
