import { describe, expect, it } from "vitest";
import {
  analyzePressures,
  analyzeTemps,
  classifyTread,
  defaultChassisSetup,
  defaultConditions,
  diagnoseDriving,
  emptyCornerPressures,
  emptyTyreTemps,
  wetGearingDelta,
  wetPresetChecklist,
} from "./index.js";
import type { ChassisSetup, TreadTemps, TyreTemps } from "./types.js";

function setup(overrides: Partial<ChassisSetup> = {}): ChassisSetup {
  return { ...defaultChassisSetup(), ...overrides };
}

function temps(partial: Partial<TyreTemps>): TyreTemps {
  const even: TreadTemps = { outside: 80, middle: 80, inside: 80 };
  return {
    fl: { ...even, ...partial.fl },
    fr: { ...even, ...partial.fr },
    rl: { ...even, ...partial.rl },
    rr: { ...even, ...partial.rr },
  };
}

describe("diagnoseDriving", () => {
  it("recommends front hubs out first for understeer on entry", () => {
    const result = diagnoseDriving(setup(), defaultConditions(), ["understeer_entry"]);
    expect(result.advice[0]?.id).toBe("us_entry_hubs_out");
    expect(result.advice[0]?.oneChange).toBe(true);
    expect(result.advice[0]?.kbSource).toContain("angriracing.com");
    expect(result.reminder).toMatch(/One change at a time/i);
  });

  it("skips widen-front when already max and recommends caster instead", () => {
    const result = diagnoseDriving(
      setup({ frontTrack: "max" }),
      defaultConditions(),
      ["understeer_entry"],
    );
    expect(result.advice.find((a) => a.id === "us_entry_hubs_out")).toBeUndefined();
    expect(result.advice[0]?.id).toBe("us_entry_max_wide_caster");
    expect(result.advice.find((a) => a.id === "us_entry_caster")).toBeUndefined();
  });

  it("flags 950 axle polarity on stiffer-axle advice", () => {
    const result = diagnoseDriving(
      setup({ wheelbase: "950" }),
      defaultConditions(),
      ["oversteer_entry"],
    );
    const axle = result.advice.find((a) => a.lever === "axle");
    expect(axle?.polarityNote).toBe("950_may_invert");
  });

  it("does not flag axle polarity on a 1050", () => {
    const result = diagnoseDriving(setup({ wheelbase: "1050" }), defaultConditions(), [
      "oversteer_entry",
    ]);
    const axle = result.advice.find((a) => a.lever === "axle");
    expect(axle?.polarityNote).toBeUndefined();
  });

  it("treats one-direction faults as a chassis check, not a setup lever", () => {
    const result = diagnoseDriving(setup(), defaultConditions(), ["one_direction_only"]);
    expect(result.advice.every((a) => a.lever === "chassis_check")).toBe(true);
    expect(result.advice[0]?.id).toBe("dir_scales");
  });

  it("distinguishes violent hop from tyre chatter", () => {
    const hop = diagnoseDriving(setup(), defaultConditions(), ["hop"]);
    const chatter = diagnoseDriving(setup(), defaultConditions(), ["chatter"]);
    expect(hop.advice[0]?.id).toBe("hop_ballast");
    expect(chatter.advice[0]?.id).toBe("chatter_p");
    expect(chatter.advice[0]?.magnitude).toBe("+0.1 bar");
  });

  it("skips third-bearing advice when none is fitted", () => {
    const result = diagnoseDriving(
      setup({ thirdBearing: "none" }),
      defaultConditions(),
      ["oversteer_entry"],
    );
    expect(result.advice.find((a) => a.lever === "third_bearing")).toBeUndefined();
  });

  it("blocks a lever already at the recorded limit", () => {
    const result = diagnoseDriving(
      setup({ rearTrack: "min" }),
      defaultConditions(),
      ["understeer_exit"],
    );
    expect(result.advice.find((a) => a.id === "exit_rear_track")).toBeUndefined();
    expect(result.blocked.some((a) => a.id === "exit_rear_track")).toBe(true);
  });

  it("warns if no symptom is selected", () => {
    const result = diagnoseDriving(setup(), defaultConditions(), []);
    expect(result.advice).toEqual([]);
    expect(result.warnings[0]).toMatch(/symptom/i);
  });
});

describe("analyzeTemps", () => {
  it("classifies a cold middle", () => {
    expect(classifyTread({ outside: 82, middle: 70, inside: 82 })).toBe("cold_middle");
  });

  it("raises rear pressure for a cold-middle rear", () => {
    const result = analyzeTemps(
      setup(),
      defaultConditions(),
      temps({
        rl: { outside: 82, middle: 70, inside: 82 },
        rr: { outside: 82, middle: 71, inside: 83 },
      }),
    );
    expect(result.advice.some((a) => a.id === "rear_cold_middle")).toBe(true);
    expect(result.advice.find((a) => a.id === "rear_cold_middle")?.direction).toBe("increase");
  });

  it("calls less negative camber when both front inners are hot", () => {
    const result = analyzeTemps(
      setup(),
      defaultConditions(),
      temps({
        fl: { outside: 72, middle: 78, inside: 88 },
        fr: { outside: 73, middle: 79, inside: 89 },
      }),
    );
    expect(result.advice.some((a) => a.id === "front_hot_inner")).toBe(true);
  });

  it("warns on a huge left/right split instead of chasing camber first", () => {
    const result = analyzeTemps(
      setup(),
      defaultConditions(),
      temps({
        fl: { outside: 70, middle: 70, inside: 70 },
        rl: { outside: 70, middle: 70, inside: 70 },
        fr: { outside: 90, middle: 90, inside: 90 },
        rr: { outside: 90, middle: 90, inside: 90 },
      }),
    );
    expect(result.advice[0]?.id).toBe("lr_split");
    expect(result.advice[0]?.lever).toBe("chassis_check");
  });

  it("raises a danger warning at or above 95 °C", () => {
    const result = analyzeTemps(
      setup(),
      defaultConditions(),
      temps({
        rr: { outside: 96, middle: 94, inside: 90 },
      }),
    );
    expect(result.warnings.some((w) => /95/i.test(w))).toBe(true);
  });

  it("refuses incomplete pyrometer data", () => {
    const result = analyzeTemps(setup(), defaultConditions(), emptyTyreTemps());
    expect(result.advice).toEqual([]);
    expect(result.warnings[0]).toMatch(/incomplete/i);
  });
});

describe("analyzePressures", () => {
  it("asks for hot pressures when they are missing", () => {
    const result = analyzePressures(setup(), defaultConditions(), emptyCornerPressures());
    expect(result.warnings[0]).toMatch(/Hot pressures/i);
  });

  it("drops cold when hot average is above the window", () => {
    const pressures = emptyCornerPressures();
    pressures.hot = { fl: 1.7, fr: 1.7, rl: 1.7, rr: 1.7 };
    const result = analyzePressures(setup(), defaultConditions(), pressures);
    expect(result.advice[0]?.id).toBe("hot_high");
    expect(result.advice[0]?.direction).toBe("decrease");
  });

  it("mentions magnesium rims heating faster", () => {
    const pressures = emptyCornerPressures();
    pressures.hot = { fl: 1.2, fr: 1.2, rl: 1.2, rr: 1.2 };
    const result = analyzePressures(
      setup({ rimMaterial: "magnesium" }),
      defaultConditions(),
      pressures,
    );
    expect(result.warnings.some((w) => /Magnesium/i.test(w))).toBe(true);
  });
});

describe("wet preset", () => {
  it("does not silently rewrite the sheet — unmatched front track stays unmatched", () => {
    const items = wetPresetChecklist(setup({ frontTrack: "mid", tyreType: "slick" }));
    const front = items.find((i) => i.id === "front_track");
    expect(front?.matched).toBe(false);
    expect(front?.target).toMatch(/maximum/i);
    expect(wetGearingDelta()).toBe(3);
  });

  it("marks rain tyres and max front as matched when already set", () => {
    const items = wetPresetChecklist(setup({ tyreType: "wet", frontTrack: "max" }));
    expect(items.find((i) => i.id === "tyres")?.matched).toBe(true);
    expect(items.find((i) => i.id === "front_track")?.matched).toBe(true);
  });
});
