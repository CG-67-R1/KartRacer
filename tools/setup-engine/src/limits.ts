import type { AdviceDirection, ChassisSetup, Lever, LimitState } from "./types.js";
import type { RuleGate } from "./rules/schema.js";

const LIMIT_ORDER: Record<LimitState, number> = {
  min: 0,
  mid: 1,
  max: 2,
  unknown: 1,
};

export function matchesGate(setup: ChassisSetup, gate?: RuleGate): boolean {
  if (!gate) return true;
  const checks: [keyof RuleGate, unknown][] = [
    ["wheelbase", setup.wheelbase],
    ["frontTrack", setup.frontTrack],
    ["rearTrack", setup.rearTrack],
    ["frontRideHeight", setup.frontRideHeight],
    ["rearRideHeight", setup.rearRideHeight],
    ["caster", setup.caster],
    ["axleStiffness", setup.axleStiffness],
    ["rearTorsion", setup.rearTorsion],
    ["frontTorsion", setup.frontTorsion],
    ["thirdBearing", setup.thirdBearing],
    ["seatStruts", setup.seatStruts],
    ["ballastForeAft", setup.ballastForeAft],
    ["ackermann", setup.ackermann],
    ["seatPosition", setup.seatPosition],
  ];
  for (const [key, value] of checks) {
    const allowed = gate[key];
    if (!allowed) continue;
    if (!(allowed as unknown[]).includes(value)) return false;
  }
  return true;
}

export function leverLimit(setup: ChassisSetup, lever: Lever): LimitState | null {
  switch (lever) {
    case "front_track":
    case "front_hubs":
      return setup.frontTrack;
    case "rear_track":
    case "rear_hubs":
      return setup.rearTrack;
    case "front_ride_height":
      return setup.frontRideHeight;
    case "rear_ride_height":
      return setup.rearRideHeight;
    case "caster":
      return setup.caster;
    case "axle":
      if (setup.axleStiffness === "soft") return "min";
      if (setup.axleStiffness === "stiff") return "max";
      return "mid";
    case "rear_torsion":
      if (setup.rearTorsion === "off") return "min";
      if (setup.rearTorsion === "tight") return "max";
      return "mid";
    case "front_torsion":
      return setup.frontTorsion === "fitted" ? "max" : "min";
    case "seat_struts":
      if (setup.seatStruts === "none") return "min";
      if (setup.seatStruts === "two_per_side" || setup.seatStruts === "tight") return "max";
      return "mid";
    case "third_bearing":
      if (setup.thirdBearing === "none") return "min";
      if (setup.thirdBearing === "tight") return "max";
      return "mid";
    case "ballast_fore_aft":
      if (setup.ballastForeAft === "front") return "max";
      if (setup.ballastForeAft === "rear") return "min";
      return "mid";
    case "ackermann":
      if (setup.ackermann === "inner") return "max";
      if (setup.ackermann === "outer") return "min";
      return "mid";
    case "seat_position":
      if (setup.seatPosition === "forward") return "max";
      if (setup.seatPosition === "back") return "min";
      return "mid";
    default:
      return null;
  }
}

export function isBlockedByLimit(
  setup: ChassisSetup,
  lever: Lever,
  direction: AdviceDirection,
): boolean {
  if (setup.thirdBearing === "none" && lever === "third_bearing") return true;

  const limit = leverLimit(setup, lever);
  if (!limit || limit === "unknown") return false;

  if (direction === "increase" || direction === "fit") {
    return LIMIT_ORDER[limit] >= LIMIT_ORDER.max;
  }
  if (direction === "decrease" || direction === "remove") {
    return LIMIT_ORDER[limit] <= LIMIT_ORDER.min;
  }
  return false;
}

export function actionApplies(setup: ChassisSetup, gate: {
  when?: RuleGate;
  skipWhen?: RuleGate;
  requires?: RuleGate;
}): boolean {
  if (gate.when && !matchesGate(setup, gate.when)) return false;
  if (gate.requires && !matchesGate(setup, gate.requires)) return false;
  if (gate.skipWhen && matchesGate(setup, gate.skipWhen)) return false;
  return true;
}
