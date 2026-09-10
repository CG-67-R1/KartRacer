/**
 * Runnable tests for Gearing Guide math + coach seed.
 * Run: npm run test:gearing (from app/)
 */
import {
  driveSpeedPercents,
  finalDriveRatio,
  formatGearingForCoach,
  formatRatio,
  matchBikePowerbandRef,
  nearbyPairs,
  parseSprocketPair,
  parseTeethInRange,
  sprocketTeethError,
  resolveBikeProvenance,
} from '../index';

let failed = 0;

function assert(name: string, pass: boolean, detail?: string): void {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  if (!pass) failed += 1;
}

assert('80/10 ratio 8.00', formatRatio(finalDriveRatio(10, 80)) === '8.00');
assert('84/10 ratio 8.40', formatRatio(finalDriveRatio(10, 84)) === '8.40');
assert('80/11 ratio 7.27', formatRatio(finalDriveRatio(11, 80)) === '7.27');

{
  const pct = driveSpeedPercents(finalDriveRatio(10, 80), finalDriveRatio(10, 83));
  assert('drive% and speed% opposite sign', Math.abs(pct.drivePct + pct.speedPct) < 1e-9);
  assert('shorter gearing raises drive%', pct.drivePct > 0);
}

assert('parse 10/80', (() => {
  const parsed = parseSprocketPair('10/80');
  return parsed?.front === 10 && parsed?.rear === 80;
})());
assert('parse rejects junk', parseSprocketPair('sprockets') == null);
assert('parse rejects out-of-range front', parseSprocketPair('16/80') == null);

{
  assert('parseTeethInRange accepts 10', parseTeethInRange('10', 10, 11) === 10);
  assert('parseTeethInRange rejects 16', parseTeethInRange('16', 10, 11) == null);
  assert('sprocketTeethError empty is null', sprocketTeethError('', 10, 11, 'New front') == null);
  assert(
    'sprocketTeethError out of range',
    sprocketTeethError('16', 10, 11, 'New front') === 'New front must be 10–11 teeth.'
  );
}

{
  const rows = nearbyPairs(10, 80);
  const current = rows.find((row) => row.kind === 'current');
  assert('nearby includes current', current?.front === 10 && current?.rear === 80);
  assert('nearby includes +1 rear', rows.some((row) => row.front === 10 && row.rear === 81));
  assert('nearby includes +1 front', rows.some((row) => row.front === 11 && row.rear === 80));
}

{
  const x30 = matchBikePowerbandRef('x30');
  assert('alias matches X30', x30?.id === 'iame_x30');
  assert('unknown engine does not invent a row', matchBikePowerbandRef('random trike 99') == null);
}

{
  const x30 = matchBikePowerbandRef('X30');
  const seed = formatGearingForCoach({
    manufacturer: 'IAME',
    family: 'X30',
    yearFrom: '2010',
    yearTo: '2026',
    capacityCc: '125',
    engineConfig: 'other',
    peakTorqueRpm: '10250',
    peakPowerRpm: '11000',
    powerbandRpmFrom: '9000',
    powerbandRpmTo: '16000',
    provenance: 'catalog',
    catalog: x30,
    front: 10,
    rear: 80,
    newFront: null,
    newRear: null,
    goalId: 'limiter_early',
    requestText: 'Keep drive for Bolivar',
    trackName: 'Southern Go Kart Club (Bolivar Raceway)',
  });
  assert('seed has current ratio', seed.includes('10/80') && seed.includes('8.00'));
  assert('seed has goal', seed.includes('Hitting the limiter too early'));
  assert('seed has verbatim request', seed.includes('Keep drive for Bolivar'));
  assert('seed has catalog provenance', seed.includes('Identity provenance: catalog'));
}

{
  const x30 = matchBikePowerbandRef('X30');
  const provenance = resolveBikeProvenance({
    manufacturer: 'IAME',
    family: 'X30',
    yearFrom: '2010',
    yearTo: '2026',
    capacityCc: '125',
    engineConfig: 'other',
    peakTorqueRpm: '11000',
    peakPowerRpm: '11000',
    powerbandRpmFrom: '9000',
    powerbandRpmTo: '16000',
    catalog: x30,
    front: 10,
    rear: 80,
    newFront: null,
    newRear: null,
    goalId: 'more_drive',
    requestText: '',
    trackName: '',
  });
  assert('override wins over catalog', provenance === 'user_override');
}

{
  const seed = formatGearingForCoach({
    manufacturer: 'Homebuilt',
    family: 'Special',
    yearFrom: '',
    yearTo: '',
    capacityCc: '125',
    engineConfig: 'other',
    peakTorqueRpm: '',
    peakPowerRpm: '',
    powerbandRpmFrom: '',
    powerbandRpmTo: '',
    provenance: 'manual',
    catalog: null,
    front: 10,
    rear: 82,
    newFront: null,
    newRear: null,
    goalId: 'more_drive',
    requestText: '',
    trackName: '',
  });
  assert('missing RPM is labelled unknown', seed.includes('Peak power RPM: unknown — do not invent'));
  assert('manual provenance in seed', seed.includes('Identity provenance: manual'));
}

if (failed) {
  console.error(`\n${failed} failing assertion(s)`);
  process.exit(1);
}
console.log('\nAll gearing tests passed');
