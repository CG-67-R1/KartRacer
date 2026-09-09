import type { TrackMemoryLayout } from './types';

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
