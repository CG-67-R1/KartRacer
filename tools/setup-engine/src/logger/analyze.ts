import type { LoggerSample } from "./parseCsv.js";

export type DistancePoint = { dist: number; speedKmh: number; rpm: number | null; latG: number | null; lonG: number | null };

export type LoggerLap = {
  index: number;
  timeS: number;
  minSpeedKmh: number | null;
  maxSpeedKmh: number | null;
  maxRpm: number | null;
  avgWtC: number | null;
  avgEgtC: number | null;
  peakLatG: number | null;
  peakBrakeG: number | null;
  brakePeakDist: number | null;
  sectorS: [number, number, number];
  trace: DistancePoint[];
};

export type DriverChassisVerdict = {
  kind: "driver" | "chassis" | "engine" | "gearing" | "mixed" | "insufficient";
  title: string;
  why: string;
  kbSource: string;
};

export type LoggerAnalysis = {
  sampleCount: number;
  laps: LoggerLap[];
  bestLapIndex: number | null;
  compareLapIndex: number | null;
  warnings: string[];
  verdicts: DriverChassisVerdict[];
};

const START_RADIUS_M = 18;
const AWAY_M = 70;
const MIN_LAP_S = 18;

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

function stats(values: number[]): { min: number; max: number; avg: number } | null {
  if (values.length === 0) return null;
  let min = values[0];
  let max = values[0];
  let sum = 0;
  for (const v of values) {
    min = Math.min(min, v);
    max = Math.max(max, v);
    sum += v;
  }
  return { min, max, avg: sum / values.length };
}

function integrateDistance(samples: LoggerSample[]): number[] {
  const dist = new Array(samples.length).fill(0);
  for (let i = 1; i < samples.length; i++) {
    const dt = samples[i].t - samples[i - 1].t;
    if (dt <= 0) {
      dist[i] = dist[i - 1];
      continue;
    }
    if (samples[i].distM != null && samples[i - 1].distM != null) {
      const d = samples[i].distM! - samples[i - 1].distM!;
      dist[i] = dist[i - 1] + (d > 0 ? d : 0);
      continue;
    }
    const a = samples[i - 1].speedKmh;
    const b = samples[i].speedKmh;
    if (a == null || b == null) {
      dist[i] = dist[i - 1];
      continue;
    }
    const mps = (((a + b) / 2) * 1000) / 3600;
    dist[i] = dist[i - 1] + mps * dt;
  }
  return dist;
}

function splitByLapColumn(samples: LoggerSample[]): LoggerSample[][] {
  const groups = new Map<number, LoggerSample[]>();
  for (const sample of samples) {
    if (sample.lap == null) continue;
    const list = groups.get(sample.lap) ?? [];
    list.push(sample);
    groups.set(sample.lap, list);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, list]) => list)
    .filter((list) => list.length > 8);
}

function splitByGps(samples: LoggerSample[]): LoggerSample[][] {
  const first = samples.find((s) => s.lat != null && s.lon != null);
  if (!first?.lat || first.lon == null) return [];
  const laps: LoggerSample[][] = [];
  let current: LoggerSample[] = [];
  let away = false;
  let lapStartT = samples[0].t;
  for (const sample of samples) {
    if (sample.lat == null || sample.lon == null) {
      current.push(sample);
      continue;
    }
    const d = haversineM(first.lat, first.lon, sample.lat, sample.lon);
    if (d > AWAY_M) away = true;
    current.push(sample);
    const elapsed = sample.t - lapStartT;
    if (away && d < START_RADIUS_M && elapsed >= MIN_LAP_S) {
      laps.push(current);
      current = [];
      away = false;
      lapStartT = sample.t;
    }
  }
  if (current.length > 8) laps.push(current);
  return laps;
}

function splitByTimeGap(samples: LoggerSample[]): LoggerSample[][] {
  const laps: LoggerSample[][] = [];
  let current: LoggerSample[] = [];
  for (let i = 0; i < samples.length; i++) {
    if (i > 0 && samples[i].t - samples[i - 1].t > 8) {
      if (current.length > 8) laps.push(current);
      current = [];
    }
    current.push(samples[i]);
  }
  if (current.length > 8) laps.push(current);
  return laps;
}

function resample(samples: LoggerSample[], dist: number[]): DistancePoint[] {
  const total = dist[dist.length - 1] || 1;
  const points: DistancePoint[] = [];
  let j = 0;
  for (let k = 0; k <= 100; k++) {
    const target = (k / 100) * total;
    while (j < dist.length - 1 && dist[j + 1] < target) j++;
    const s = samples[j];
    points.push({
      dist: k / 100,
      speedKmh: s.speedKmh ?? 0,
      rpm: s.rpm,
      latG: s.latG,
      lonG: s.lonG,
    });
  }
  return points;
}

function buildLap(index: number, samples: LoggerSample[]): LoggerLap | null {
  if (samples.length < 8) return null;
  const timeS = samples[samples.length - 1].t - samples[0].t;
  if (timeS < MIN_LAP_S) return null;
  const dist = integrateDistance(samples);
  const total = dist[dist.length - 1] || 1;
  const speeds = samples.map((s) => s.speedKmh).filter((v): v is number => v != null);
  const rpms = samples.map((s) => s.rpm).filter((v): v is number => v != null);
  const wts = samples.map((s) => s.wtC).filter((v): v is number => v != null);
  const egts = samples.map((s) => s.egtC).filter((v): v is number => v != null);
  const lat = samples.map((s) => (s.latG == null ? null : Math.abs(s.latG))).filter((v): v is number => v != null);
  const lon = samples.map((s) => s.lonG).filter((v): v is number => v != null);

  let peakBrakeG: number | null = null;
  let brakePeakDist: number | null = null;
  for (let i = 0; i < samples.length; i++) {
    const g = samples[i].lonG;
    if (g == null) continue;
    if (peakBrakeG == null || g < peakBrakeG) {
      peakBrakeG = g;
      brakePeakDist = dist[i] / total;
    }
  }

  const sectorS: [number, number, number] = [0, 0, 0];
  for (let i = 1; i < samples.length; i++) {
    const frac = dist[i] / total;
    const dt = samples[i].t - samples[i - 1].t;
    const bucket = frac < 1 / 3 ? 0 : frac < 2 / 3 ? 1 : 2;
    sectorS[bucket] += dt;
  }

  const speedStats = stats(speeds);
  const rpmStats = stats(rpms);
  const wtStats = stats(wts);
  const egtStats = stats(egts);
  const latStats = stats(lat);
  return {
    index,
    timeS,
    minSpeedKmh: speedStats?.min ?? null,
    maxSpeedKmh: speedStats?.max ?? null,
    maxRpm: rpmStats?.max ?? null,
    avgWtC: wtStats?.avg ?? null,
    avgEgtC: egtStats?.avg ?? null,
    peakLatG: latStats?.max ?? null,
    peakBrakeG,
    brakePeakDist,
    sectorS,
    trace: resample(samples, dist),
  };
}

function pickLaps(samples: LoggerSample[]): LoggerSample[][] {
  const byCol = splitByLapColumn(samples);
  if (byCol.length >= 1) return byCol;
  const gps = splitByGps(samples);
  if (gps.length >= 1) return gps;
  return splitByTimeGap(samples);
}

function verdicts(laps: LoggerLap[], best: LoggerLap, compare: LoggerLap): DriverChassisVerdict[] {
  const out: DriverChassisVerdict[] = [];
  const setupSrc = "https://www.angriracing.com/kart-setup";
  const tempSrc = "https://www.angriracing.com/eyeballing-the-temperatures";
  const gearSrc = "https://www.angriracing.com/chains-sprockets-and-ratios";

  if (compare.brakePeakDist != null && best.brakePeakDist != null) {
    const delta = compare.brakePeakDist - best.brakePeakDist;
    if (delta > 0.04) {
      out.push({
        kind: "driver",
        title: "Later peak braking than the best lap",
        why: `Peak brake on the compare lap is ${(delta * 100).toFixed(0)}% later in the lap than the best lap. That usually reads as a driving change (late brake / missed mark), not a spacer. Confirm it is not the driver before rewriting the chassis.`,
        kbSource: setupSrc,
      });
    }
  }

  if (
    compare.minSpeedKmh != null &&
    best.minSpeedKmh != null &&
    compare.minSpeedKmh < best.minSpeedKmh - 2
  ) {
    const latDown =
      compare.peakLatG != null && best.peakLatG != null && compare.peakLatG < best.peakLatG - 0.05;
    const brakeSimilar =
      compare.brakePeakDist == null ||
      best.brakePeakDist == null ||
      Math.abs(compare.brakePeakDist - best.brakePeakDist) <= 0.04;
    if (latDown && brakeSimilar) {
      out.push({
        kind: "chassis",
        title: "Lower min speed with less lateral G, similar brake mark",
        why: `Min speed ${compare.minSpeedKmh.toFixed(1)} vs ${best.minSpeedKmh.toFixed(1)} km/h on the best lap, with lower peak lateral G. That often matches push / understeer — work the failing end, one change at a time.`,
        kbSource: setupSrc,
      });
    }
  }

  const [b0, b1, b2] = best.sectorS;
  const [c0, c1, c2] = compare.sectorS;
  const entryLoss = c0 - b0;
  const exitLoss = c2 - b2;
  if (entryLoss > 0.15 && entryLoss > exitLoss + 0.08) {
    out.push({
      kind: "mixed",
      title: "Most of the loss is in the first third of the lap",
      why: `First-third time is +${entryLoss.toFixed(2)} s vs the best lap. That is a distance split, not a named corner. Pair it with how the kart felt on entry.`,
      kbSource: setupSrc,
    });
  } else if (exitLoss > 0.15 && exitLoss > entryLoss + 0.08) {
    out.push({
      kind: "mixed",
      title: "Most of the loss is in the last third of the lap",
      why: `Last-third time is +${exitLoss.toFixed(2)} s vs the best lap. Check exit rotation, rear grip, and whether RPM is peaking early (gearing).`,
      kbSource: setupSrc,
    });
  }

  const wts = laps.map((l) => l.avgWtC).filter((v): v is number => v != null);
  if (wts.length) {
    const avg = wts.reduce((a, b) => a + b, 0) / wts.length;
    if (avg > 65) {
      out.push({
        kind: "engine",
        title: "Water temp is high versus a typical Rotax target",
        why: `Average WT ~${avg.toFixed(0)} °C. ANGRI cites Rotax around 50 °C as an example; Micro/Mini often run hotter. Use flap/curtain, then pair with RAD/jetting. Temps are not a substitute for the stopwatch.`,
        kbSource: tempSrc,
      });
    }
  }

  const rpms = laps.map((l) => l.maxRpm).filter((v): v is number => v != null);
  if (rpms.length && compare.maxRpm != null && best.maxSpeedKmh != null && compare.maxSpeedKmh != null) {
    const peak = Math.max(...rpms);
    if (compare.maxRpm >= peak - 80 && compare.maxSpeedKmh + 1 < best.maxSpeedKmh && compare.timeS > best.timeS) {
      out.push({
        kind: "gearing",
        title: "RPM is high without matching top speed",
        why: `Peak RPM ~${compare.maxRpm.toFixed(0)} but top speed is down. Do not hide a handling problem with extra rear teeth. Wet + rain tyres: +3 or more rear teeth; drop teeth as it dries.`,
        kbSource: gearSrc,
      });
    }
  }

  if (out.length === 0) {
    out.push({
      kind: "insufficient",
      title: laps.length < 2 ? "Need at least two timed laps to compare" : "Traces are close — no strong driver/chassis split",
      why: "The logger is a second opinion. If the kart feels wrong, use the handling analysis with one change at a time.",
      kbSource: setupSrc,
    });
  }
  return out;
}

export function analyzeLogger(samples: LoggerSample[]): LoggerAnalysis {
  const warnings: string[] = [];
  if (samples.length < 10) {
    return { sampleCount: samples.length, laps: [], bestLapIndex: null, compareLapIndex: null, warnings: ["Not enough samples."], verdicts: [] };
  }

  const groups = pickLaps(samples);
  const laps = groups
    .map((group, i) => buildLap(i + 1, group))
    .filter((lap): lap is LoggerLap => lap != null);

  if (laps.length === 0) {
    warnings.push("Could not split laps. Export all channels, or include GPS Speed and a lap marker.");
  }

  let bestLapIndex: number | null = null;
  let compareLapIndex: number | null = null;
  if (laps.length) {
    bestLapIndex = laps.reduce((best, lap, i) => (lap.timeS < laps[best].timeS ? i : best), 0);
    compareLapIndex = laps.length === 1 ? 0 : laps.length - 1;
    if (compareLapIndex === bestLapIndex && laps.length > 1) {
      compareLapIndex = bestLapIndex === 0 ? 1 : 0;
    }
  }

  const verdictList =
    bestLapIndex != null && compareLapIndex != null
      ? verdicts(laps, laps[bestLapIndex], laps[compareLapIndex])
      : [];

  return {
    sampleCount: samples.length,
    laps,
    bestLapIndex,
    compareLapIndex,
    warnings,
    verdicts: verdictList,
  };
}

export function formatLapTime(s: number): string {
  const m = Math.floor(s / 60);
  const rem = s - m * 60;
  return `${m}:${rem.toFixed(3).padStart(6, "0")}`;
}
