import type { ChassisSetup, Conditions } from "./types.js";
import type { LoggerAnalysis } from "./logger/analyze.js";
import { formatLapTime } from "./logger/analyze.js";
import type { DriverChassisVerdict } from "./logger/analyze.js";

export type SessionBriefing = {
  paragraphs: string[];
  facts: { label: string; value: string }[];
  sources: string[];
  llmPrompt: string;
};

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function setupOneLiner(setup?: ChassisSetup, conditions?: Conditions): string | null {
  if (!setup) return null;
  const grip = conditions?.wet ? "wet" : conditions?.grip ?? "unknown grip";
  return `${setup.wheelbase} mm, ${setup.tyreType}, caster ${setup.caster}, axle ${setup.axleStiffness}, front track ${setup.frontTrack}, rear track ${setup.rearTrack}, ${grip}.`;
}

export function composeLoggerBriefing(input: {
  fileName: string;
  analysis: LoggerAnalysis;
  setup?: ChassisSetup;
  conditions?: Conditions;
}): SessionBriefing {
  const { analysis, fileName } = input;
  const sources = unique([
    "https://www.angriracing.com/kart-setup",
    "https://www.angriracing.com/eyeballing-the-temperatures",
    "https://www.angriracing.com/chains-sprockets-and-ratios",
    ...analysis.verdicts.map((v) => v.kbSource),
  ]);

  const facts: { label: string; value: string }[] = [
    { label: "File", value: fileName },
    { label: "Samples", value: String(analysis.sampleCount) },
    { label: "Laps timed", value: String(analysis.laps.length) },
  ];

  if (analysis.bestLapIndex != null) {
    const best = analysis.laps[analysis.bestLapIndex];
    facts.push({ label: "Best lap", value: `${formatLapTime(best.timeS)} (lap ${best.index})` });
    if (best.minSpeedKmh != null) facts.push({ label: "Best min speed", value: `${best.minSpeedKmh.toFixed(1)} km/h` });
    if (best.maxRpm != null) facts.push({ label: "Best peak RPM", value: best.maxRpm.toFixed(0) });
    if (best.avgWtC != null) facts.push({ label: "Best avg WT", value: `${best.avgWtC.toFixed(0)} °C` });
  }
  if (analysis.compareLapIndex != null && analysis.compareLapIndex !== analysis.bestLapIndex) {
    const cmp = analysis.laps[analysis.compareLapIndex];
    const best = analysis.bestLapIndex != null ? analysis.laps[analysis.bestLapIndex] : null;
    facts.push({ label: "Compare lap", value: `${formatLapTime(cmp.timeS)} (lap ${cmp.index})` });
    if (best) facts.push({ label: "Delta vs best", value: `+${(cmp.timeS - best.timeS).toFixed(3)} s` });
  }

  const paragraphs: string[] = [];
  paragraphs.push(
    `Parsed ${analysis.sampleCount} samples from ${fileName}. Lap times and deltas below are computed from this file. Do not invent sector names or “tenths at T3”.`,
  );

  const sheet = setupOneLiner(input.setup, input.conditions);
  if (sheet) paragraphs.push(`Current sheet: ${sheet}`);

  for (const warning of analysis.warnings) paragraphs.push(warning);

  for (const verdict of analysis.verdicts) {
    paragraphs.push(`${verdict.title}. ${verdict.why}`);
  }

  paragraphs.push(
    "One change at a time. Confirm it is not the driver. Slide = add grip; hop = reduce grip. On a 950, axle polarity can invert versus 1050 literature.",
  );

  const llmPrompt = buildLlmPrompt({ fileName, facts, verdicts: analysis.verdicts, sheet, sources });

  return { paragraphs, facts, sources, llmPrompt };
}

function buildLlmPrompt(input: {
  fileName: string;
  facts: { label: string; value: string }[];
  verdicts: DriverChassisVerdict[];
  sheet: string | null;
  sources: string[];
}): string {
  const factLines = input.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n");
  const verdictLines = input.verdicts.map((v) => `- [${v.kind}] ${v.title}: ${v.why}`).join("\n");
  return `You are a karting coach for KartRacer. Use ONLY the facts below. Do not invent lap times, corner names, or tenths. If a number is missing, say so. One change at a time. Confirm it may be the driver. Cite the source URLs given.

Facts:
${factLines}
${input.sheet ? `Setup sheet: ${input.sheet}` : ""}

Computed verdicts:
${verdictLines || "- none"}

Sources:
${input.sources.join("\n")}

Write a short paddock briefing (parent/mechanic). Do not recommend more than one chassis change.`;
}
