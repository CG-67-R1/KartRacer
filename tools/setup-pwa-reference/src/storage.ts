import {
  CURRENT_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  defaultChassisSetup,
  defaultConditions,
  emptyCornerPressures,
  emptyTyreTemps,
  type ChassisSetup,
  type Conditions,
  type CurrentSession,
  type SetupSnapshot,
} from "@kartracer/setup-engine";

export type SessionState = CurrentSession & {
  history: SetupSnapshot[];
};

export function defaultSession(): SessionState {
  return {
    setup: defaultChassisSetup(),
    conditions: defaultConditions(),
    pressures: emptyCornerPressures(),
    temps: emptyTyreTemps(),
    history: [],
  };
}

export function loadSession(): SessionState {
  const fallback = defaultSession();
  try {
    const raw = localStorage.getItem(CURRENT_STORAGE_KEY);
    const hist = localStorage.getItem(HISTORY_STORAGE_KEY);
    const current = raw ? (JSON.parse(raw) as CurrentSession) : null;
    const history = hist ? (JSON.parse(hist) as SetupSnapshot[]) : [];
    if (!current?.setup) return { ...fallback, history };
    return {
      setup: { ...fallback.setup, ...current.setup } as ChassisSetup,
      conditions: { ...fallback.conditions, ...current.conditions } as Conditions,
      pressures: current.pressures ?? fallback.pressures,
      temps: current.temps ?? fallback.temps,
      history: Array.isArray(history) ? history : [],
    };
  } catch {
    return fallback;
  }
}

export function saveSession(state: SessionState): void {
  const current: CurrentSession = {
    setup: state.setup,
    conditions: state.conditions,
    pressures: state.pressures,
    temps: state.temps,
  };
  localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(current));
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(state.history));
}

export function newSheet(state: SessionState): SessionState {
  return {
    ...state,
    setup: { ...defaultChassisSetup(), name: "New sheet" },
    pressures: emptyCornerPressures(),
    temps: emptyTyreTemps(),
  };
}
