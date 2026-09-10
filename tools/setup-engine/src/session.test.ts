import { describe, expect, it } from "vitest";
import {
  JETTING_EXAMPLE,
  analyzeLogger,
  composeLoggerBriefing,
  createSnapshot,
  defaultChassisSetup,
  defaultConditions,
  diffSnapshots,
  emptyCornerPressures,
  emptyTyreTemps,
  nextMainJet,
  parseLoggerCsv,
  radPercentFromWeather,
} from "./index.js";

describe("snapshot diff", () => {
  it("lists only fields that changed", () => {
    const base = {
      setup: defaultChassisSetup(),
      conditions: defaultConditions(),
      pressures: emptyCornerPressures(),
      temps: emptyTyreTemps(),
    };
    const a = createSnapshot({ ...base, label: "A" });
    const bSetup = { ...base.setup, caster: "max" as const, frontTrack: "max" as const };
    const b = createSnapshot({ ...base, setup: bSetup, label: "B" });
    const rows = diffSnapshots(a, b);
    expect(rows.some((r) => r.path === "setup.caster")).toBe(true);
    expect(rows.some((r) => r.path === "setup.frontTrack")).toBe(true);
    expect(rows.find((r) => r.path === "setup.axleStiffness")).toBeUndefined();
  });
});

describe("RAD jetting", () => {
  it("matches the ANGRI 60 @ 94% → 57 @ 86% example", () => {
    const result = nextMainJet({
      baselineStamp: JETTING_EXAMPLE.jet_base_stamp,
      radBasePct: JETTING_EXAMPLE.rad_base_percent,
      radNewPct: JETTING_EXAMPLE.rad_new_percent,
    });
    expect(result.suggestedStamp).toBe(JETTING_EXAMPLE.nearest_stamp);
    expect(result.direction).toBe("smaller");
    expect(result.kbSource).toContain("jetting-and-air-density");
  });

  it("reports ~100% RAD at ISA dry sea level", () => {
    expect(radPercentFromWeather({ tempC: 15, pressureHpa: 1013.25, relativeHumidityPct: 0 })).toBeCloseTo(100, 0);
  });
});

describe("logger CSV", () => {
  it("parses a Race Studio-style CSV and splits laps", () => {
    const header = "Time,GPS Speed,RPM,Water Temp,GPS LonAcc,GPS LatAcc,Lap";
    const rows = [header];
    let t = 0;
    for (let lap = 1; lap <= 2; lap++) {
      for (let i = 0; i < 250; i++) {
        const frac = i / 250;
        const speed = 80 - 25 * Math.sin(frac * Math.PI);
        const lon = lap === 1 ? -0.8 * Math.exp(-((frac - 0.22) ** 2) / 0.004) : -0.8 * Math.exp(-((frac - 0.38) ** 2) / 0.004);
        const lat = 0.6 + 0.2 * Math.sin(frac * Math.PI);
        rows.push(`${t.toFixed(3)},${speed.toFixed(2)},${(9000 + i).toFixed(0)},52,${lon.toFixed(3)},${lat.toFixed(3)},${lap}`);
        t += 0.1;
      }
    }
    const parsed = parseLoggerCsv(rows.join("\n"));
    expect(parsed.samples.length).toBe(500);
    const analysis = analyzeLogger(parsed.samples);
    expect(analysis.laps.length).toBe(2);
    expect(analysis.bestLapIndex).not.toBeNull();
    const lateBrake = analysis.verdicts.some((v) => v.kind === "driver");
    expect(lateBrake).toBe(true);
  });

  it("parses semicolon / comma-decimal exports", () => {
    const csv = "Time;GPS Speed;RPM\n0,00;40,5;8000\n0,10;41,0;8100";
    const parsed = parseLoggerCsv(csv);
    expect(parsed.delimiter).toBe(";");
    expect(parsed.samples[0]?.speedKmh).toBeCloseTo(40.5, 1);
  });

  it("builds a grounded briefing that does not invent tenths at a named corner", () => {
    const csv = ["Time,GPS Speed,RPM,Lap", ...Array.from({ length: 220 }, (_, i) => `${(i * 0.1).toFixed(2)},70,8000,1`)].join("\n");
    const analysis = analyzeLogger(parseLoggerCsv(csv).samples);
    const briefing = composeLoggerBriefing({ fileName: "session.csv", analysis });
    expect(briefing.llmPrompt).toMatch(/Use ONLY the facts/i);
    expect(briefing.llmPrompt).not.toMatch(/T3/);
    expect(briefing.sources.some((s) => s.includes("angriracing.com"))).toBe(true);
  });
});
