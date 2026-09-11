/**
 * Central AsyncStorage key registry.
 * Keep string values stable — changing a value orphans existing device data.
 */
export const STORAGE_KEYS = {
  ONBOARDING_DONE: '@kartrace_onboarding_done',
  ONBOARDING_ANSWERS: '@kartrace_onboarding_answers',
  TRACK_WALK_SESSIONS: '@kartrace_track_walk_sessions',
  BIKE_SETUP_DAY_SHEET: '@kartrace_bike_setup_day_sheet',
  BIKE_SETUP_SESSION_HISTORY: '@kartrace_bike_setup_session_history',
  BIKE_BALANCE_STATE: '@kartrace_bike_balance_state',
  BIKE_PHOTO_URI: '@kartrace_bike_photo_uri',
  BIKE_PHOTO_REV: '@kartrace_bike_photo_rev',
  AVATAR_FACE_URI: '@kartrace_avatar_face_photo_uri',
  AVATAR_FACE_REV: '@kartrace_avatar_face_photo_rev',
  TRACK_ARRIVAL_ENABLED: '@kartrace_track_arrival_enabled',
  TRACK_ARRIVAL_STATE: '@kartrace_track_arrival_state',
  TRIVIA_BEST_SCORE: '@kartrace_trivia_best',
  TRIVIA_USED_AU: '@kartrace_trivia_used_au',
  TRIVIA_USED_GLOBAL: '@kartrace_trivia_used_global',
  TRACK_MEMORY_BEST_LAP: '@kartrace_track_memory_best_lap',
  TRACK_PREP_SELECTED_TRACK: '@kartrace_track_prep_selected_track',
  TRACKDAY_PREP_DRAFT: '@kartrace_trackday_prep_draft',
  TRACKDAY_PREP_HISTORY: '@kartrace_trackday_prep_history',
  GEARING_GUIDE_STATE: '@kartrace_gearing_guide_state',
  TYRE_WEAR_ANALYSIS: '@kartrace_tyre_wear_analysis',
  KART_SETUP_CURRENT: '@kartrace_setup_current_v1',
  KART_SETUP_HISTORY: '@kartrace_setup_history_v1',
} as const;

/** Pre-prefix trivia best-score key — migrate once then delete. */
export const LEGACY_TRIVIA_BEST_SCORE_KEY = 'ROADRACER_TRIVIA_BEST';

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
