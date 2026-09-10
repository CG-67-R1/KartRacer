import type {
  AxleStiffness,
  ChassisSetup,
  LimitState,
  Lever,
  AdviceDirection,
} from "../types.js";

export type RuleGate = {
  wheelbase?: ChassisSetup["wheelbase"][];
  frontTrack?: LimitState[];
  rearTrack?: LimitState[];
  frontRideHeight?: LimitState[];
  rearRideHeight?: LimitState[];
  caster?: LimitState[];
  axleStiffness?: AxleStiffness[];
  rearTorsion?: ChassisSetup["rearTorsion"][];
  frontTorsion?: ChassisSetup["frontTorsion"][];
  thirdBearing?: ChassisSetup["thirdBearing"][];
  seatStruts?: ChassisSetup["seatStruts"][];
  ballastForeAft?: ChassisSetup["ballastForeAft"][];
  ackermann?: ChassisSetup["ackermann"][];
  seatPosition?: ChassisSetup["seatPosition"][];
};

export type HandlingAction = {
  id: string;
  lever: Lever;
  direction: AdviceDirection;
  magnitude?: string;
  title: string;
  why: string;
  priority: number;
  polarityNote?: "950_may_invert";
  when?: RuleGate;
  skipWhen?: RuleGate;
  requires?: RuleGate;
};

export type HandlingRule = {
  id: string;
  symptoms: string[];
  title: string;
  failingEnd: "front" | "rear" | "both" | "chassis";
  actions: HandlingAction[];
};

export type HandlingRulesFile = {
  version: string;
  id: string;
  reminder: string;
  sources?: string[];
  rules: HandlingRule[];
};

export type TempPatternRule = {
  id: string;
  pattern: string;
  lever: Lever;
  direction: AdviceDirection;
  magnitude?: string;
  title: string;
  why: string;
};

export type TyreTempRulesFile = {
  version: string;
  id: string;
  bandC: { min: number; max: number; danger: number };
  deltaC: number;
  lrSplitWarnC: number;
  frontRearSplitC: number;
  sources?: string[];
  rearPatterns: TempPatternRule[];
  frontPatterns: TempPatternRule[];
};

export type WetItem = {
  id: string;
  field: keyof ChassisSetup;
  label: string;
  target: string;
  targetLabel: string;
  why: string;
};

export type WetRulesFile = {
  version: string;
  id: string;
  sources?: string[];
  note: string;
  gearing: { rearTeethDelta: number; why: string };
  items: WetItem[];
  paddockReminders: string[];
};

export type CompoundWindow = {
  label: string;
  coldBar: { min: number; max: number };
  coldPsi: { min: number; max: number };
  /** "slick" or "wet" — kept as string so JSON imports stay assignable. */
  type: string;
  source: string;
};

export type PressureRulesFile = {
  version: string;
  id: string;
  sources?: string[];
  windowBar: { min: number; max: number; start: number };
  stepBar: number;
  evenToleranceBar: number;
  rise: { aluminiumBar: number; magnesiumBar: number; note: string };
  compoundsNote?: string;
  compounds?: Record<string, CompoundWindow | null>;
};
