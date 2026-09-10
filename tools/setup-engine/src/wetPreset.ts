import { wetRules } from "./rules/load.js";
import type { ChassisSetup, WetChecklistItem } from "./types.js";

export function wetPresetChecklist(setup: ChassisSetup): WetChecklistItem[] {
  const source = wetRules.sources?.[0] ?? "https://www.angriracing.com/kart-setup";
  return wetRules.items.map((item) => {
    const current = String(setup[item.field]);
    return {
      id: item.id,
      label: item.label,
      target: item.targetLabel,
      current,
      matched: current === item.target,
      kbSource: source,
    };
  });
}

export function wetPaddockReminders(): string[] {
  return [...(wetRules.paddockReminders ?? []), wetRules.gearing.why];
}

export function wetGearingDelta(): number {
  return wetRules.gearing.rearTeethDelta;
}
