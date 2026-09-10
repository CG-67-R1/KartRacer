import { round } from "./units.js";

export type CornerWeights = {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
};

export type WeightAnalysis = {
  totalKg: number;
  frontKg: number;
  rearKg: number;
  leftKg: number;
  rightKg: number;
  frontPct: number;
  rearPct: number;
  leftPct: number;
  rightPct: number;
  /** (FL + RR) / total. Target ~50%. */
  crossPct: number;
  targetFrontPct: number;
  targetRearPct: number;
  frontErrorPct: number;
  leftErrorPct: number;
  crossErrorPct: number;
  notes: string[];
};

export const TARGET_FRONT_PCT = 0.43;
export const TARGET_REAR_PCT = 0.57;
export const TARGET_LEFT_PCT = 0.5;
export const TARGET_CROSS_PCT = 0.5;

export function analyzeCornerWeights(
  weights: CornerWeights,
  targetFrontPct = TARGET_FRONT_PCT,
): WeightAnalysis {
  const { fl, fr, rl, rr } = weights;
  const totalKg = fl + fr + rl + rr;
  if (totalKg <= 0) {
    return {
      totalKg: 0,
      frontKg: 0,
      rearKg: 0,
      leftKg: 0,
      rightKg: 0,
      frontPct: 0,
      rearPct: 0,
      leftPct: 0,
      rightPct: 0,
      crossPct: 0,
      targetFrontPct,
      targetRearPct: 1 - targetFrontPct,
      frontErrorPct: 0,
      leftErrorPct: 0,
      crossErrorPct: 0,
      notes: ["Enter all four pad readings."],
    };
  }

  const frontKg = fl + fr;
  const rearKg = rl + rr;
  const leftKg = fl + rl;
  const rightKg = fr + rr;
  const frontPct = frontKg / totalKg;
  const rearPct = rearKg / totalKg;
  const leftPct = leftKg / totalKg;
  const rightPct = rightKg / totalKg;
  const crossPct = (fl + rr) / totalKg;
  const notes: string[] = [];

  notes.push(
    `Target about ${Math.round(targetFrontPct * 100)}% front / ${Math.round((1 - targetFrontPct) * 100)}% rear, 50/50 left-right. Confirm class minimum weight.`,
  );

  const frontErrorPct = (frontPct - targetFrontPct) * 100;
  const leftErrorPct = (leftPct - TARGET_LEFT_PCT) * 100;
  const crossErrorPct = (crossPct - TARGET_CROSS_PCT) * 100;

  if (Math.abs(frontErrorPct) >= 1) {
    notes.push(
      frontErrorPct > 0
        ? `Front is heavy by ~${frontErrorPct.toFixed(1)} points. Move ballast rearward or the seat back.`
        : `Rear is heavy by ~${Math.abs(frontErrorPct).toFixed(1)} points. Move ballast forward or the seat forward.`,
    );
  }
  if (Math.abs(leftErrorPct) >= 1) {
    notes.push(
      leftErrorPct > 0
        ? `Left is heavy by ~${leftErrorPct.toFixed(1)} points. Move ballast right.`
        : `Right is heavy by ~${Math.abs(leftErrorPct).toFixed(1)} points. Move ballast left.`,
    );
  }
  if (Math.abs(crossErrorPct) >= 1.5) {
    notes.push(
      "Cross-weight is off 50/50. Small yoke shims or rear carrier holes take weight off that corner and send it diagonally. Do not re-bend a straight chassis to chase cross.",
    );
  }

  return {
    totalKg: round(totalKg, 2),
    frontKg: round(frontKg, 2),
    rearKg: round(rearKg, 2),
    leftKg: round(leftKg, 2),
    rightKg: round(rightKg, 2),
    frontPct: round(frontPct * 100, 2),
    rearPct: round(rearPct * 100, 2),
    leftPct: round(leftPct * 100, 2),
    rightPct: round(rightPct * 100, 2),
    crossPct: round(crossPct * 100, 2),
    targetFrontPct,
    targetRearPct: 1 - targetFrontPct,
    frontErrorPct: round(frontErrorPct, 2),
    leftErrorPct: round(leftErrorPct, 2),
    crossErrorPct: round(crossErrorPct, 2),
    notes,
  };
}

export type BallastPlan = {
  moveForeAftKg: number;
  moveLeftRightKg: number;
  foreAft: "forward" | "rearward" | "hold";
  leftRight: "left" | "right" | "hold";
  summary: string;
  kbSource: string;
};

/** Approximate kg to relocate, treating the kart as two axles. Not a moment-arm model. */
export function planBallast(
  weights: CornerWeights,
  targetFrontPct = TARGET_FRONT_PCT,
): BallastPlan {
  const analysis = analyzeCornerWeights(weights, targetFrontPct);
  const moveForeAftKg = round((analysis.frontErrorPct / 100) * analysis.totalKg, 2);
  const moveLeftRightKg = round((analysis.leftErrorPct / 100) * analysis.totalKg, 2);

  const foreAft: BallastPlan["foreAft"] =
    Math.abs(moveForeAftKg) < 0.3 ? "hold" : moveForeAftKg > 0 ? "rearward" : "forward";
  const leftRight: BallastPlan["leftRight"] =
    Math.abs(moveLeftRightKg) < 0.3 ? "hold" : moveLeftRightKg > 0 ? "right" : "left";

  const bits: string[] = [];
  if (foreAft === "hold" && leftRight === "hold") {
    bits.push("Corner weights are close to target. Keep the driver comfortable before chasing tenths.");
  } else {
    if (foreAft !== "hold") {
      bits.push(`Move about ${Math.abs(moveForeAftKg).toFixed(1)} kg ${foreAft}.`);
    }
    if (leftRight !== "hold") {
      bits.push(`Move about ${Math.abs(moveLeftRightKg).toFixed(1)} kg to the ${leftRight}.`);
    }
    bits.push("Keep the driver comfortable. Do not re-bend a straight chassis to shift cross.");
  }

  return {
    moveForeAftKg,
    moveLeftRightKg,
    foreAft,
    leftRight,
    summary: bits.join(" "),
    kbSource: "https://www.angriracing.com/chassis-straightening",
  };
}
