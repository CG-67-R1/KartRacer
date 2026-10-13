import { round } from "./units.js";

export type FuelMixResult = {
  oilMl: number;
  oilOz: number;
  fuelLitres: number;
  ratio: number;
  summary: string;
};

/** Premix: oil millilitres = fuel litres × 1000 / ratio. 20:1 → 50 ml/L. */
export function fuelMix(fuelLitres: number, ratio: number): FuelMixResult {
  if (!(ratio > 0) || !(fuelLitres > 0)) {
    return {
      oilMl: 0,
      oilOz: 0,
      fuelLitres: 0,
      ratio: 0,
      summary: "Ratio and fuel amount must be above 0.",
    };
  }
  const oilMl = (fuelLitres * 1000) / ratio;
  return {
    oilMl: round(oilMl, 1),
    oilOz: round(oilMl / 29.5735, 2),
    fuelLitres: round(fuelLitres, 2),
    ratio,
    summary: `${fuelLitres.toFixed(2)} L fuel at ${ratio}:1 needs ${round(oilMl, 1)} ml oil. Confirm class fuel rules.`,
  };
}
