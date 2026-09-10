import { describe, expect, it } from "vitest";
import {
  airDensity,
  analyzeCornerWeights,
  barToPsi,
  casterFromSweep,
  cToF,
  createSnapshot,
  defaultChassisSetup,
  defaultConditions,
  emptyCornerPressures,
  emptyTyreTemps,
  fuelMix,
  gearing,
  kgToLb,
  planBallast,
  psiToBar,
  restoreSnapshot,
  TARGET_FRONT_PCT,
} from "./index.js";

describe("corner weights", () => {
  it("computes 43/57 and 50/50 on a balanced kart", () => {
    const result = analyzeCornerWeights({ fl: 21.5, fr: 21.5, rl: 28.5, rr: 28.5 });
    expect(result.totalKg).toBe(100);
    expect(result.frontPct).toBeCloseTo(43, 1);
    expect(result.rearPct).toBeCloseTo(57, 1);
    expect(result.leftPct).toBeCloseTo(50, 1);
    expect(result.crossPct).toBeCloseTo(50, 1);
    expect(TARGET_FRONT_PCT).toBe(0.43);
  });

  it("plans ballast forward when the rear is heavy", () => {
    const plan = planBallast({ fl: 18, fr: 18, rl: 32, rr: 32 });
    expect(plan.foreAft).toBe("forward");
    expect(plan.moveForeAftKg).toBeLessThan(0);
    expect(plan.kbSource).toContain("chassis-straightening");
  });
});

describe("air density", () => {
  it("matches ISA sea-level dry air", () => {
    const result = airDensity({ tempC: 15, pressureHpa: 1013.25, relativeHumidityPct: 0 });
    expect(result.densityKgM3).toBeCloseTo(1.225, 2);
    expect(result.relativeAirDensity).toBeCloseTo(1, 2);
    expect(result.densityAltitudeM).toBeCloseTo(0, -1);
  });
});

describe("fuel mix", () => {
  it("computes 50 ml/L at 20:1", () => {
    const result = fuelMix(10, 20);
    expect(result.oilMl).toBe(500);
  });
});

describe("gearing", () => {
  it("computes ratio and wet +3 suggestion", () => {
    const result = gearing({ frontTeeth: 11, rearTeeth: 78, tyreCircumferenceMm: 860 });
    expect(result.ratio).toBeCloseTo(7.091, 3);
    expect(result.wetSuggestion).toMatch(/\+3/);
    expect(result.kbSource).toContain("chains-sprockets");
  });
});

describe("caster sweep", () => {
  it("treats ~4 mm as about 1 degree", () => {
    const result = casterFromSweep(10, 6);
    expect(result.approxDegrees).toBeCloseTo(1, 2);
    expect(result.matched).toBe(false);
  });

  it("matches within 2 mm", () => {
    expect(casterFromSweep(8, 7).matched).toBe(true);
  });
});

describe("units", () => {
  it("round-trips bar and psi", () => {
    expect(psiToBar(barToPsi(1))).toBeCloseTo(1, 6);
    expect(cToF(0)).toBe(32);
    expect(kgToLb(1)).toBeCloseTo(2.2046, 3);
  });
});

describe("history snapshots", () => {
  it("clones setup so later edits do not mutate history", () => {
    const chassis = defaultChassisSetup();
    const snap = createSnapshot({
      setup: chassis,
      conditions: defaultConditions(),
      pressures: emptyCornerPressures(),
      temps: emptyTyreTemps(),
      note: "Session 1",
    });
    chassis.name = "changed";
    expect(snap.setup.name).toBe("Baseline dry");
    const restored = restoreSnapshot(snap);
    expect(restored.setup.id).not.toBe(snap.setup.id);
    expect(restored.setup.name).toBe("Baseline dry");
  });
});
