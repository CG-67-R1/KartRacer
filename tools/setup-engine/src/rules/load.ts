import handlingJson from "../../../../kb/rules/handling.json";
import pressureJson from "../../../../kb/rules/pressure.json";
import tyreTempJson from "../../../../kb/rules/tyre-temps.json";
import wetJson from "../../../../kb/rules/wet-weather.json";
import type {
  HandlingRulesFile,
  PressureRulesFile,
  TyreTempRulesFile,
  WetRulesFile,
} from "./schema.js";

export const handlingRules = handlingJson as HandlingRulesFile;
export const pressureRules = pressureJson as PressureRulesFile;
export const tyreTempRules = tyreTempJson as TyreTempRulesFile;
export const wetRules = wetJson as WetRulesFile;

export const RULES_VERSION = {
  handling: handlingRules.version,
  tyreTemps: tyreTempRules.version,
  wet: wetRules.version,
  pressure: pressureRules.version,
} as const;
