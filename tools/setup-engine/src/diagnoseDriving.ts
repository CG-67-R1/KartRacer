import { isBlockedByLimit, actionApplies } from "./limits.js";
import { handlingRules } from "./rules/load.js";
import type { HandlingAction } from "./rules/schema.js";
import type {
  Advice,
  AnalysisResult,
  ChassisSetup,
  Conditions,
  Symptom,
} from "./types.js";

const SOURCE = handlingRules.sources?.[0] ?? "https://www.angriracing.com/kart-setup";

function toAdvice(
  action: HandlingAction,
  setup: ChassisSetup,
  extraWhy?: string,
): Advice {
  const polarity =
    action.polarityNote && (setup.wheelbase === "950" || setup.wheelbase === "bambino")
      ? "950_may_invert"
      : undefined;
  return {
    id: action.id,
    lever: action.lever,
    direction: action.direction,
    magnitude: action.magnitude,
    title: action.title,
    why: extraWhy ? `${action.why} ${extraWhy}` : action.why,
    kbSource: SOURCE,
    kbSourceId: handlingRules.id,
    polarityNote: polarity,
    priority: action.priority,
    oneChange: true,
  };
}

function gripNote(conditions: Conditions): string | null {
  if (conditions.wet) {
    return "Wet: extra caster and a wide front are usually the first chassis moves; rain tyres first.";
  }
  if (conditions.grip === "green") {
    return "Green / low grip: more caster, ride height up, torsion and struts on are typical starting moves.";
  }
  if (conditions.grip === "rubbered") {
    return "High grip / rubbered-in: less caster, lower rear, softer rear, struts and torsion off.";
  }
  return null;
}

export function diagnoseDriving(
  setup: ChassisSetup,
  conditions: Conditions,
  symptoms: Symptom[],
): AnalysisResult {
  const warnings: string[] = [];
  const unique = [...new Set(symptoms)];

  if (unique.length === 0) {
    return {
      kind: "driving",
      reminder: handlingRules.reminder,
      advice: [],
      blocked: [],
      warnings: ["Pick at least one handling symptom."],
    };
  }

  if (unique.length > 1) {
    warnings.push("Several symptoms selected — still change only one lever, starting with the first card.");
  }

  const grip = gripNote(conditions);
  if (grip) warnings.push(grip);

  if (conditions.wet && setup.tyreType !== "wet") {
    warnings.push("Wet selected but the sheet still says slicks. Rain tyres first.");
  }

  const advice: Advice[] = [];
  const blocked: Advice[] = [];

  for (const symptom of unique) {
    const rule = handlingRules.rules.find((item) => item.symptoms.includes(symptom));
    if (!rule) {
      warnings.push(`No rule encoded for ${symptom}.`);
      continue;
    }

    for (const action of rule.actions) {
      const card = toAdvice(action, setup);
      const atLimit = isBlockedByLimit(setup, action.lever, action.direction);
      if (!actionApplies(setup, action)) {
        if (atLimit) blocked.push(card);
        continue;
      }
      if (atLimit) {
        blocked.push(card);
        continue;
      }
      advice.push(card);
    }
  }

  advice.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));

  if (advice.length === 0 && blocked.length > 0) {
    warnings.push("Every listed lever is already at the recorded limit. Recheck the sheet or look at the blocked list.");
  }

  return {
    kind: "driving",
    reminder: handlingRules.reminder,
    advice,
    blocked,
    warnings,
  };
}
