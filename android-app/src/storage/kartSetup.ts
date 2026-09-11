import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultChassisSetup,
  defaultConditions,
  emptyCornerPressures,
  emptyTyreTemps,
  snapshotLabel,
  sortSnapshotsNewestFirst,
  type ChassisSetup,
  type Conditions,
  type CurrentSession,
  type SetupSnapshot,
  type SnapshotLapSummary,
  type TyrePressures,
  type TyreTemps,
} from '../lib/setupEngine';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { logStorageError } from './logStorageError';

const CURRENT_KEY = STORAGE_KEYS.KART_SETUP_CURRENT;
const HISTORY_KEY = STORAGE_KEYS.KART_SETUP_HISTORY;
const HISTORY_CAP = 80;

export type KartSetupSession = CurrentSession;

export function defaultKartSetupSession(): KartSetupSession {
  return {
    setup: defaultChassisSetup(),
    conditions: defaultConditions(),
    pressures: emptyCornerPressures(),
    temps: emptyTyreTemps(),
  };
}

export function mergeSession(raw: Partial<CurrentSession> | null): KartSetupSession {
  const fallback = defaultKartSetupSession();
  if (!raw?.setup) return fallback;
  return {
    setup: { ...fallback.setup, ...raw.setup } as ChassisSetup,
    conditions: { ...fallback.conditions, ...raw.conditions } as Conditions,
    pressures: mergePressures(fallback.pressures, raw.pressures),
    temps: mergeTemps(fallback.temps, raw.temps),
  };
}

function mergePressures(fallback: TyrePressures, raw?: TyrePressures | null): TyrePressures {
  if (!raw) return fallback;
  return {
    cold: { ...fallback.cold, ...raw.cold },
    hot: { ...fallback.hot, ...raw.hot },
  };
}

function mergeTemps(fallback: TyreTemps, raw?: TyreTemps | null): TyreTemps {
  if (!raw) return fallback;
  return {
    fl: { ...fallback.fl, ...raw.fl },
    fr: { ...fallback.fr, ...raw.fr },
    rl: { ...fallback.rl, ...raw.rl },
    rr: { ...fallback.rr, ...raw.rr },
  };
}

export function mergeSnapshot(raw: unknown): SetupSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Partial<SetupSnapshot>;
  if (typeof item.id !== 'string' || !item.id || !item.setup) return null;
  const fallback = defaultKartSetupSession();
  const setup = { ...fallback.setup, ...item.setup } as ChassisSetup;
  const conditions = { ...fallback.conditions, ...item.conditions } as Conditions;
  const lapSummary = mergeLapSummary(item.lapSummary);
  return {
    id: item.id,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    label: typeof item.label === 'string' && item.label.trim() ? item.label : snapshotLabel(setup, conditions),
    note: typeof item.note === 'string' ? item.note : '',
    setup,
    conditions,
    pressures: mergePressures(fallback.pressures, item.pressures),
    temps: mergeTemps(fallback.temps, item.temps),
    ...(lapSummary ? { lapSummary } : {}),
  };
}

function mergeLapSummary(raw: SetupSnapshot['lapSummary'] | unknown): SnapshotLapSummary | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const item = raw as Partial<SnapshotLapSummary>;
  if (typeof item.lapCount !== 'number' || !Number.isFinite(item.lapCount)) return undefined;
  return {
    lapCount: item.lapCount,
    bestS: typeof item.bestS === 'number' && Number.isFinite(item.bestS) ? item.bestS : null,
    medianS: typeof item.medianS === 'number' && Number.isFinite(item.medianS) ? item.medianS : null,
    consistencyPct:
      typeof item.consistencyPct === 'number' && Number.isFinite(item.consistencyPct)
        ? item.consistencyPct
        : null,
  };
}

export async function loadKartSetupSession(): Promise<KartSetupSession> {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_KEY);
    if (!raw) return defaultKartSetupSession();
    return mergeSession(JSON.parse(raw) as Partial<CurrentSession>);
  } catch (e) {
    logStorageError('loadKartSetupSession', e);
    return defaultKartSetupSession();
  }
}

export async function saveKartSetupSession(session: KartSetupSession): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(session));
  } catch (e) {
    logStorageError('saveKartSetupSession', e);
  }
}

export async function clearKartSetupSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_KEY);
  } catch (e) {
    logStorageError('clearKartSetupSession', e);
  }
}

export async function loadKartSetupHistory(): Promise<SetupSnapshot[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const merged = parsed
      .map((item) => mergeSnapshot(item))
      .filter((item): item is SetupSnapshot => item != null);
    return sortSnapshotsNewestFirst(merged);
  } catch (e) {
    logStorageError('loadKartSetupHistory', e);
    return [];
  }
}

export async function saveKartSetupHistory(history: SetupSnapshot[]): Promise<void> {
  try {
    const trimmed = sortSnapshotsNewestFirst(history).slice(0, HISTORY_CAP);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    logStorageError('saveKartSetupHistory', e);
  }
}

export async function clearKartSetupHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    logStorageError('clearKartSetupHistory', e);
  }
}

/** Wipe leftover motorcycle setup-sheet / chassis-balance keys. */
export async function clearLegacyBikeSetupStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.BIKE_SETUP_DAY_SHEET,
      STORAGE_KEYS.BIKE_SETUP_SESSION_HISTORY,
      STORAGE_KEYS.BIKE_BALANCE_STATE,
    ]);
  } catch (e) {
    logStorageError('clearLegacyBikeSetupStorage', e);
  }
}
