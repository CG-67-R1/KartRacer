import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultChassisSetup,
  defaultConditions,
  emptyCornerPressures,
  emptyTyreTemps,
  type ChassisSetup,
  type Conditions,
  type CurrentSession,
  type TyrePressures,
  type TyreTemps,
} from '../lib/setupEngine';
import { logStorageError } from './logStorageError';

const KEY = '@kartrace_setup_current_v1';

export type KartSetupSession = CurrentSession;

export function defaultKartSetupSession(): KartSetupSession {
  return {
    setup: defaultChassisSetup(),
    conditions: defaultConditions(),
    pressures: emptyCornerPressures(),
    temps: emptyTyreTemps(),
  };
}

function mergeSession(raw: Partial<CurrentSession> | null): KartSetupSession {
  const fallback = defaultKartSetupSession();
  if (!raw?.setup) return fallback;
  return {
    setup: { ...fallback.setup, ...raw.setup } as ChassisSetup,
    conditions: { ...fallback.conditions, ...raw.conditions } as Conditions,
    pressures: (raw.pressures ?? fallback.pressures) as TyrePressures,
    temps: (raw.temps ?? fallback.temps) as TyreTemps,
  };
}

export async function loadKartSetupSession(): Promise<KartSetupSession> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultKartSetupSession();
    return mergeSession(JSON.parse(raw) as Partial<CurrentSession>);
  } catch (e) {
    logStorageError('loadKartSetupSession', e);
    return defaultKartSetupSession();
  }
}

export async function saveKartSetupSession(session: KartSetupSession): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
  } catch (e) {
    logStorageError('saveKartSetupSession', e);
  }
}

export async function clearKartSetupSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    logStorageError('clearKartSetupSession', e);
  }
}
