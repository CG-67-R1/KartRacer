export type HotspotKind = 'measure' | 'adjust';

export type BikeSetupHotspot = {
  id: string;
  kind: HotspotKind;
  xPct: number;
  yPct: number;
  title: string;
  summary: string;
  roadBase: string;
  trackBase: string;
  capabilityNote: string;
  aiPrompt: string;
};

/** Motorcycle fork/shock hotspots removed. Kart Setup fields: J2.1 in docs/CURSOR_BUILD_JOBS.md */
export const BIKE_SETUP_INTRO = {
  whyBase:
    'Kart Setup is not motorcycle suspension. RoadRacer listed fork/shock sag here. KartRacer will use front width, caster, camber, toe, axle, hubs, seat, and pressures — see docs/CURSOR_BUILD_JOBS.md J2.1 and gpt-knowledge/chassis-setup-and-tyre-kb.md.',
  capabilityCaveat:
    'This screen is a placeholder. Do not use leftover motorcycle clicker advice on a kart.',
};

export const BIKE_SETUP_HOTSPOTS: BikeSetupHotspot[] = [];
