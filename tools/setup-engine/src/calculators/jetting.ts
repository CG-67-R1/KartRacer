import jettingJson from "../../../../kb/data/jetting-rad.json";
import { airDensity } from "./airDensity.js";
import { round } from "./units.js";

type JettingData = {
  id: string;
  purpose: string;
  confirm: string;
  rad_standard: { altitude_m: number; temp_c: number; pressure_mb: number; rh_percent: number; note: string };
  direction: Record<string, string>;
  formula: { flow_factor: string; new_diameter_mm: string; old_diameter_mm: string; new_stamp: string };
  example: {
    rad_base_percent: number;
    jet_base_stamp: number;
    rad_new_percent: number;
    nearest_stamp: number;
  };
  power_af: { stoich_mass: number; peak_2stroke_lambda: number; micro_mini_nearer_lambda: number; note: string };
};

const DATA = jettingJson as JettingData;

export const JETTING_SOURCE = "https://www.angriracing.com/jetting-and-air-density";

export type JettingResult = {
  /** False when stamp or either RAD is not above 0. Do not show suggestedStamp. */
  valid: boolean;
  radBasePct: number;
  radNewPct: number;
  flowFactor: number;
  oldDiameterMm: number;
  newDiameterMm: number;
  suggestedStamp: number;
  deltaStamps: number;
  direction: "smaller" | "larger" | "hold";
  summary: string;
  confirm: string;
  kbSource: string;
};

export function radPercentFromWeather(input: {
  tempC: number;
  pressureHpa: number;
  relativeHumidityPct: number;
}): number {
  return round(airDensity(input).relativeAirDensity * 100, 1);
}

export function nextMainJet(input: {
  baselineStamp: number;
  radBasePct: number;
  radNewPct: number;
}): JettingResult {
  if (!(input.radBasePct > 0) || !(input.radNewPct > 0) || !(input.baselineStamp > 0)) {
    return {
      valid: false,
      radBasePct: 0,
      radNewPct: 0,
      flowFactor: 0,
      oldDiameterMm: 0,
      newDiameterMm: 0,
      suggestedStamp: 0,
      deltaStamps: 0,
      direction: "hold",
      summary: "Check your RAD inputs — baseline stamp and both RAD values must be above 0.",
      confirm: DATA.confirm,
      kbSource: JETTING_SOURCE,
    };
  }
  const radBasePct = input.radBasePct;
  const flowFactor = 1 + (input.radNewPct - radBasePct) / radBasePct;
  const oldDiameterMm = input.baselineStamp / 100;
  const newDiameterMm = Math.sqrt(Math.max(0, oldDiameterMm * oldDiameterMm * flowFactor));
  const suggestedStamp = Math.round(newDiameterMm * 100);
  const deltaStamps = suggestedStamp - input.baselineStamp;
  const direction: JettingResult["direction"] =
    deltaStamps < 0 ? "smaller" : deltaStamps > 0 ? "larger" : "hold";

  return {
    valid: true,
    radBasePct: round(radBasePct, 1),
    radNewPct: round(input.radNewPct, 1),
    flowFactor: round(flowFactor, 4),
    oldDiameterMm: round(oldDiameterMm, 3),
    newDiameterMm: round(newDiameterMm, 3),
    suggestedStamp,
    deltaStamps,
    direction,
    summary:
      direction === "hold"
        ? `RAD unchanged enough to keep stamp ${input.baselineStamp}. Confirm on the stopwatch.`
        : `Baseline ${input.baselineStamp} @ ${round(radBasePct, 1)}% RAD → stamp ${suggestedStamp} @ ${round(input.radNewPct, 1)}% (${direction} jet). ${DATA.confirm}`,
    confirm: DATA.confirm,
    kbSource: JETTING_SOURCE,
  };
}

export const JETTING_EXAMPLE = DATA.example;
export const JETTING_DIRECTION = DATA.direction;
