import type { GpxTrackMap } from './types';

/** Empty until J1.3 bakes C:\\KartRacer\\data\\gpx via build-gpx-track-maps.mjs */
const MAPS: Record<string, GpxTrackMap> = {};

export const GPX_TRACK_MAP_IDS = Object.keys(MAPS);

export function getGpxTrackMap(trackId: string): GpxTrackMap | undefined {
  return MAPS[trackId];
}

export function listGpxTrackMaps(): { id: string; name: string }[] {
  return GPX_TRACK_MAP_IDS.map((id) => ({ id, name: MAPS[id].name }));
}
