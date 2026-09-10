import { clone, createId } from "./ids.js";
import type {
  ChassisSetup,
  Conditions,
  SetupSnapshot,
  TyrePressures,
  TyreTemps,
} from "./types.js";

export const HISTORY_STORAGE_KEY = "kartracer.setup.history.v1";
export const CURRENT_STORAGE_KEY = "kartracer.setup.current.v1";

export type CurrentSession = {
  setup: ChassisSetup;
  conditions: Conditions;
  pressures: TyrePressures;
  temps: TyreTemps;
};

export function createSnapshot(input: {
  setup: ChassisSetup;
  conditions: Conditions;
  pressures: TyrePressures;
  temps: TyreTemps;
  label?: string;
  note?: string;
  createdAt?: string;
}): SetupSnapshot {
  return {
    id: createId("snap"),
    createdAt: input.createdAt ?? new Date().toISOString(),
    label: input.label?.trim() || snapshotLabel(input.setup, input.conditions),
    note: input.note ?? "",
    setup: clone(input.setup),
    conditions: clone(input.conditions),
    pressures: clone(input.pressures),
    temps: clone(input.temps),
  };
}

export function snapshotLabel(setup: ChassisSetup, conditions: Conditions): string {
  const grip = conditions.wet ? "wet" : conditions.grip;
  const track = conditions.trackName ? ` · ${conditions.trackName}` : "";
  return `${setup.name}${track} · ${setup.wheelbase} · ${grip}`;
}

export function restoreSnapshot(snapshot: SetupSnapshot): CurrentSession {
  return {
    setup: { ...clone(snapshot.setup), id: createId("setup") },
    conditions: clone(snapshot.conditions),
    pressures: clone(snapshot.pressures),
    temps: clone(snapshot.temps),
  };
}

export function sortSnapshotsNewestFirst(items: SetupSnapshot[]): SetupSnapshot[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function upsertSnapshot(
  history: SetupSnapshot[],
  snapshot: SetupSnapshot,
): SetupSnapshot[] {
  const rest = history.filter((item) => item.id !== snapshot.id);
  return sortSnapshotsNewestFirst([snapshot, ...rest]);
}

export function removeSnapshot(history: SetupSnapshot[], id: string): SetupSnapshot[] {
  return history.filter((item) => item.id !== id);
}

/**
 * Previous setups at a venue, newest first — the "what did we run here last
 * time?" list. trackId matches exactly; when trackId is null (venue typed by
 * hand or unset), fall back to a case-insensitive trackName match so hand-
 * tagged sessions still group. Returns [] when neither is set.
 */
export function snapshotsForTrack(
  history: SetupSnapshot[],
  trackId: string | null,
  trackName?: string | null,
): SetupSnapshot[] {
  const name = trackName?.trim().toLowerCase() ?? "";
  const matches = history.filter((snap) => {
    if (trackId) return snap.conditions.trackId === trackId;
    if (name) return (snap.conditions.trackName ?? "").trim().toLowerCase() === name;
    return false;
  });
  return sortSnapshotsNewestFirst(matches);
}
