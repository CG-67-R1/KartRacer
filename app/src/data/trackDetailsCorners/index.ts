import type { TrackDetailsCorners } from './types';

/** Empty until J1.3 / J1.6 run the locked detector on kart GPX. */
const LAYOUTS: Record<string, TrackDetailsCorners> = {};

export const TRACK_DETAILS_CORNER_IDS = Object.keys(LAYOUTS);

export function getTrackDetailsCorners(trackId: string): TrackDetailsCorners | undefined {
  return LAYOUTS[trackId];
}
