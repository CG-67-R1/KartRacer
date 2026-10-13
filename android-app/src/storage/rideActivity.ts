export type RideActivity = 'race' | 'intermediate' | 'track_days' | 'just_love_karts' | 'race_one_day';

/** Answers saved before the kart rename. */
const LEGACY_JUST_LOVE_BIKES = 'just_love_bikes';

const RIDE_ACTIVITIES: readonly RideActivity[] = [
  'race',
  'intermediate',
  'track_days',
  'just_love_karts',
  'race_one_day',
];

/** Map a stored activity onto the current union. Legacy `just_love_bikes` becomes `just_love_karts`. */
export function normalizeRideActivity(value: unknown): RideActivity | undefined {
  if (value === LEGACY_JUST_LOVE_BIKES) return 'just_love_karts';
  if (typeof value === 'string' && (RIDE_ACTIVITIES as readonly string[]).includes(value)) {
    return value as RideActivity;
  }
  return undefined;
}
