import { getGpxTrackMap } from '../gpxTrackMaps';
import { generateRacingLineFromMap } from './generateFromMap';
import type { RacingLine } from './types';

/** Optional baked solver lines; otherwise colour the GPS lap with the kart generator. */
const LINES: Record<string, RacingLine> = {};

export const RACING_LINE_IDS = Object.keys(LINES);

export function getRacingLine(trackId: string): RacingLine | undefined {
  if (LINES[trackId]) return LINES[trackId];
  const map = getGpxTrackMap(trackId);
  return map ? generateRacingLineFromMap(map) : undefined;
}
