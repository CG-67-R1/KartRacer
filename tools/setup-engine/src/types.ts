/** Shared chassis, analysis, and snapshot types for the KartRacer setup engine. */

export type Wheelbase = "950" | "1050" | "bambino";
export type GripLevel = "green" | "normal" | "rubbered";
export type TrackDirection = "clockwise" | "anticlockwise";
export type RimMaterial = "aluminium" | "magnesium";
export type AxleStiffness = "soft" | "medium" | "stiff";
export type LimitState = "min" | "mid" | "max" | "unknown";
export type TyreType = "slick" | "wet";
export type TyreCorner = "fl" | "fr" | "rl" | "rr";

export type Symptom =
  | "understeer_entry"
  | "oversteer_entry"
  | "understeer_mid"
  | "oversteer_mid"
  | "understeer_exit"
  | "oversteer_exit"
  | "hop"
  | "chatter"
  | "four_wheel_slide"
  | "too_much_side_bite"
  | "darty"
  | "push_kick"
  | "one_direction_only";

export type Lever =
  | "front_track"
  | "rear_track"
  | "front_ride_height"
  | "rear_ride_height"
  | "caster"
  | "camber"
  | "toe"
  | "ackermann"
  | "front_hubs"
  | "rear_hubs"
  | "axle"
  | "rear_torsion"
  | "front_torsion"
  | "seat_struts"
  | "sidepods"
  | "third_bearing"
  | "rear_pressure"
  | "front_pressure"
  | "pressures"
  | "ballast_fore_aft"
  | "ballast_vertical"
  | "seat_position"
  | "chassis_check"
  | "driving_style"
  | "gearing"
  | "tyre_type";

export type AdviceDirection =
  | "increase"
  | "decrease"
  | "fit"
  | "remove"
  | "check"
  | "change";

export type PolarityNote = "950_may_invert";

export type Advice = {
  id: string;
  lever: Lever;
  direction: AdviceDirection;
  magnitude?: string;
  title: string;
  why: string;
  kbSource: string;
  kbSourceId: string;
  polarityNote?: PolarityNote;
  priority: number;
  oneChange: true;
};

export type ChassisSetup = {
  id: string;
  name: string;
  wheelbase: Wheelbase;
  chassisBrand: string;

  frontRideHeight: LimitState;
  rearRideHeight: LimitState;
  frontTrack: LimitState;
  rearTrack: LimitState;

  frontHubLength: LimitState;
  rearHubLength: LimitState;
  frontHubSpacers: number;

  /** Positive = toe-out, millimetres total or per side as recorded. */
  toeMm: number;
  /** Negative = tops in, mm per side. */
  camberMm: number;
  caster: LimitState;
  ackermann: "inner" | "mid" | "outer";

  axleStiffness: AxleStiffness;
  rearTorsion: "off" | "loose" | "fitted_flat" | "tight";
  frontTorsion: "off" | "fitted";
  fourthTorsion: boolean;
  seatStruts: "none" | "one_per_side" | "two_per_side" | "tight";
  sidepods: "loose" | "tight";
  thirdBearing: "none" | "loose" | "tight";
  frontBumper: "loose" | "tight";
  rearBumper: "loose" | "tight";

  seatPosition: "forward" | "mid" | "back";
  seatHeight: LimitState;
  rainMeister: boolean;

  tyreType: TyreType;
  /** Compound key into pressure rules `compounds` (e.g. "lecont_lh03"), or "unknown". */
  tyreCompound: string;
  rimMaterial: RimMaterial;

  driverWeightKg: number;
  ballastKg: number;
  ballastForeAft: "front" | "mid" | "rear";
  ballastVertical: "low" | "mid" | "high";

  notes: string;
};

export type Conditions = {
  grip: GripLevel;
  wet: boolean;
  trackDirection: TrackDirection;
  airTempC: number | null;
  trackTempC: number | null;
  /** Default 80 — ANGRI band 75–85 °C. */
  targetTyreTempC: number;
  /** Catalog track id (geofence auto-detect or picker), null = not set. */
  trackId: string | null;
  /** Display name for the venue at save time. */
  trackName: string | null;
  /** Relative humidity %, from imported weather. Null = not imported. */
  humidityPct: number | null;
  /** Surface pressure hPa, from imported weather. Null = not imported. */
  pressureHpa: number | null;
};

export type CornerMap<T> = Record<TyreCorner, T>;

export type TyrePressures = {
  cold: CornerMap<number | null>;
  hot: CornerMap<number | null>;
};

export type TreadTemps = {
  outside: number | null;
  middle: number | null;
  inside: number | null;
};

export type TyreTemps = CornerMap<TreadTemps>;

/** Compact lap evidence stored on a snapshot — not the raw logger samples. */
export type SnapshotLapSummary = {
  bestS: number | null;
  medianS: number | null;
  consistencyPct: number | null;
  lapCount: number;
};

export type SetupSnapshot = {
  id: string;
  createdAt: string;
  label: string;
  note: string;
  setup: ChassisSetup;
  conditions: Conditions;
  pressures: TyrePressures;
  temps: TyreTemps;
  lapSummary?: SnapshotLapSummary;
};

export type AnalysisKind = "driving" | "pressure" | "temperature";

export type AnalysisResult = {
  kind: AnalysisKind;
  reminder: string;
  advice: Advice[];
  blocked: Advice[];
  warnings: string[];
};

export type WetChecklistItem = {
  id: string;
  label: string;
  target: string;
  current: string;
  matched: boolean;
  kbSource: string;
};

export const TYRE_CORNERS: TyreCorner[] = ["fl", "fr", "rl", "rr"];

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  understeer_entry: "Understeer on entry",
  oversteer_entry: "Rear sliding on entry",
  understeer_mid: "Understeer mid-corner",
  oversteer_mid: "Oversteer mid-corner",
  understeer_exit: "Tight / understeer on exit",
  oversteer_exit: "Oversteer on exit",
  hop: "Violent hop",
  chatter: "Tyre chatter",
  four_wheel_slide: "Not enough side bite",
  too_much_side_bite: "Too much side bite",
  darty: "Darty on straights",
  push_kick: "Push / kick at apex",
  one_direction_only: "Only wrong in one direction",
};

export const LEVER_LABELS: Record<Lever, string> = {
  front_track: "Front track",
  rear_track: "Rear track",
  front_ride_height: "Front ride height",
  rear_ride_height: "Rear ride height",
  caster: "Caster",
  camber: "Camber",
  toe: "Toe",
  ackermann: "Ackermann",
  front_hubs: "Front hubs / spacers",
  rear_hubs: "Rear hubs",
  axle: "Rear axle",
  rear_torsion: "Rear torsion bar",
  front_torsion: "Front torsion bar",
  seat_struts: "Seat struts",
  sidepods: "Side pods",
  third_bearing: "Third bearing",
  rear_pressure: "Rear tyre pressure",
  front_pressure: "Front tyre pressure",
  pressures: "Tyre pressures",
  ballast_fore_aft: "Ballast (fore / aft)",
  ballast_vertical: "Ballast height",
  seat_position: "Seat position",
  chassis_check: "Chassis / scales",
  driving_style: "Driving",
  gearing: "Gearing",
  tyre_type: "Tyre type",
};
