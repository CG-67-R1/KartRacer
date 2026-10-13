/**
 * Run: npx tsx src/navigation/__tests__/homeMode.ts
 */
import { homeModeFromActivity, riderAiSkillFromActivity, type RideActivity } from '../homeMode';
import { normalizeRideActivity } from '../../storage/rideActivity';

let failed = 0;

function assert(name: string, pass: boolean, detail?: string): void {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  if (!pass) failed += 1;
}

const simpleActivities: RideActivity[] = ['track_days', 'race_one_day', 'just_love_karts'];

for (const activity of simpleActivities) {
  assert(`${activity} → novice AI`, riderAiSkillFromActivity(activity) === 'novice');
  assert(`${activity} → learn home`, homeModeFromActivity(activity) === 'learn');
}

assert('intermediate → intermediate AI', riderAiSkillFromActivity('intermediate') === 'intermediate');
assert('intermediate → learn home', homeModeFromActivity('intermediate') === 'learn');
assert('racer → advanced AI', riderAiSkillFromActivity('race') === 'advanced');
assert('racer → setup home', homeModeFromActivity('race') === 'setup');
assert('missing activity → novice', riderAiSkillFromActivity(undefined) === 'novice');
assert('missing activity → learn home', homeModeFromActivity(null) === 'learn');
assert('legacy just love bikes migrates', normalizeRideActivity('just_love_bikes') === 'just_love_karts');
assert('just love karts stays', normalizeRideActivity('just_love_karts') === 'just_love_karts');

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll homeMode tests passed');
