import { round } from "./units.js";

/** ANGRI: ~4 mm laser height split ≈ 1° caster. Approximate; scales with kart width / laser spacing. */
export const MM_PER_DEGREE = 4;

export type CasterSweepResult = {
  deltaMm: number;
  approxDegrees: number;
  matched: boolean;
  summary: string;
  kbSource: string;
};

export function casterFromSweep(leftMm: number, rightMm: number, matchTolMm = 2): CasterSweepResult {
  const deltaMm = round(leftMm - rightMm, 1);
  const approxDegrees = round(deltaMm / MM_PER_DEGREE, 2);
  const matched = Math.abs(deltaMm) <= matchTolMm;
  return {
    deltaMm,
    approxDegrees,
    matched,
    summary: matched
      ? `L/R split ${deltaMm.toFixed(1)} mm — within ~${matchTolMm} mm. Caster looks even.`
      : `L/R split ${deltaMm.toFixed(1)} mm ≈ ${Math.abs(approxDegrees).toFixed(2)}°. About 4 mm ≈ 1°. ~4 mm difference can also mean a twisted chassis. Approximate only.`,
    kbSource: "https://www.angriracing.com/caster-and-camber-adjusters",
  };
}
