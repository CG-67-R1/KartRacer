import { describe, expect, it } from "vitest";
import {
  applyWeather,
  conditionsAirDensity,
  defaultConditions,
  firstGpsFix,
  formatSnapshotLapSummary,
  lapTableRows,
  sessionConsistency,
  snapshotLapSummary,
  wmoImpliesWet,
} from "./index.js";
import { analyzeLogger } from "./logger/analyze.js";
import type { LoggerSample } from "./logger/parseCsv.js";

function sample(overrides: Partial<LoggerSample>): LoggerSample {
  return {
    t: 0,
    speedKmh: null,
    rpm: null,
    wtC: null,
    egtC: null,
    latG: null,
    lonG: null,
    lat: null,
    lon: null,
    distM: null,
    lap: null,
    ...overrides,
  };
}

/** Laps via the lap column: `lapTimes[i]` seconds each, 1 Hz samples with speed. */
function sessionSamples(lapTimes: number[]): LoggerSample[] {
  const out: LoggerSample[] = [];
  let t = 0;
  lapTimes.forEach((lapS, lapIdx) => {
    const n = Math.round(lapS);
    for (let i = 0; i < n; i++) {
      out.push(sample({ t, speedKmh: 60 + 30 * Math.sin((i / n) * Math.PI * 4), lap: lapIdx + 1 }));
      t += lapS / n;
    }
  });
  return out;
}

describe("applyWeather", () => {
  it("fills only unset fields by default", () => {
    const conditions = { ...defaultConditions(), airTempC: 31 };
    const next = applyWeather(conditions, { airTempC: 22, humidityPct: 55, pressureHpa: 1013 });
    expect(next.airTempC).toBe(31); // user value kept
    expect(next.humidityPct).toBe(55);
    expect(next.pressureHpa).toBe(1013);
  });

  it("force overwrites and flags wet from WMO rain codes", () => {
    const conditions = { ...defaultConditions(), airTempC: 31 };
    const next = applyWeather(conditions, { airTempC: 22, weatherCode: 63 }, true);
    expect(next.airTempC).toBe(22);
    expect(next.wet).toBe(true);
  });

  it("does not un-wet a session and ignores dry codes", () => {
    const wetConditions = { ...defaultConditions(), wet: true };
    expect(applyWeather(wetConditions, { weatherCode: 0 }, true).wet).toBe(true);
    expect(wmoImpliesWet(0)).toBe(false);
    expect(wmoImpliesWet(95)).toBe(true);
  });
});

describe("conditionsAirDensity", () => {
  it("returns null until temp, pressure, and humidity are all present", () => {
    expect(conditionsAirDensity(defaultConditions())).toBeNull();
    const full = { ...defaultConditions(), airTempC: 15, pressureHpa: 1013.25, humidityPct: 0 };
    const result = conditionsAirDensity(full);
    expect(result).not.toBeNull();
    // ISA-like reference: RAD ~100%
    expect(result!.relativeAirDensity).toBeGreaterThan(0.99);
    expect(result!.relativeAirDensity).toBeLessThan(1.01);
  });
});

describe("firstGpsFix", () => {
  it("skips null and 0,0 fixes", () => {
    const samples = [
      sample({ t: 0 }),
      sample({ t: 1, lat: 0, lon: 0 }),
      sample({ t: 2, lat: -34.75, lon: 138.6 }),
    ];
    expect(firstGpsFix(samples)).toEqual({ lat: -34.75, lon: 138.6 });
    expect(firstGpsFix([sample({ t: 0 })])).toBeNull();
  });
});

describe("sessionConsistency", () => {
  it("scores a consistent session high and suggests one change", () => {
    const analysis = analyzeLogger(sessionSamples([45.1, 45.0, 45.2, 45.1, 45.3]));
    const result = sessionConsistency(analysis);
    expect(result.lapCount).toBe(5);
    expect(result.consistencyPct).not.toBeNull();
    expect(result.consistencyPct!).toBeGreaterThan(85);
    expect(result.insights.some((i) => i.id === "consistent")).toBe(true);
  });

  it("flags fading lap times late in the run", () => {
    const analysis = analyzeLogger(sessionSamples([45.0, 45.1, 45.2, 45.9, 46.2, 46.5]));
    const result = sessionConsistency(analysis);
    expect(result.insights.some((i) => i.id === "fading")).toBe(true);
  });

  it("treats a single slow lap as an outlier, not inconsistency", () => {
    const analysis = analyzeLogger(sessionSamples([45.0, 45.1, 49.5, 45.2, 45.1, 45.0]));
    const result = sessionConsistency(analysis);
    expect(result.insights.some((i) => i.id === "spikes")).toBe(true);
  });

  it("needs two laps", () => {
    const analysis = analyzeLogger(sessionSamples([45.0]));
    const result = sessionConsistency(analysis);
    expect(result.insights[0]?.id).toBe("need_laps");
  });
});

describe("lapTableRows", () => {
  it("renders deltas against the best lap", () => {
    const analysis = analyzeLogger(sessionSamples([46.0, 45.0, 47.0]));
    const rows = lapTableRows(analysis);
    expect(rows).toHaveLength(3);
    const best = rows[analysis.bestLapIndex!];
    expect(best.deltaToBest).toBe("+0.000");
    expect(rows.every((r) => r.time.includes(":"))).toBe(true);
  });
});

describe("snapshotLapSummary", () => {
  it("stores counts not raw samples", () => {
    const analysis = analyzeLogger(sessionSamples([46.0, 45.0, 47.0]));
    const summary = snapshotLapSummary(analysis);
    expect(summary.lapCount).toBe(3);
    expect(summary.bestS).toBeTypeOf("number");
    expect(summary.medianS).toBeTypeOf("number");
    expect(summary.bestS ?? 0).toBeLessThanOrEqual(summary.medianS ?? 0);
    expect(summary.consistencyPct).not.toBeNull();
    expect(formatSnapshotLapSummary(summary)).toContain("3 laps");
    expect(formatSnapshotLapSummary(summary)).toContain("best");
  });
});
