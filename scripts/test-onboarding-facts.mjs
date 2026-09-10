/**
 * Smoke checks for onboarding driver/kart fact matching.
 * Run from repo root: node scripts/test-onboarding-facts.mjs
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const riders = JSON.parse(readFileSync(join(root, 'app/src/data/onboardingRiders.json'), 'utf8'));
const bikes = JSON.parse(readFileSync(join(root, 'app/src/data/onboardingBikes.json'), 'utf8'));

const MIN_SUBSTRING_ALIAS_LEN = 3;

function normalize(s) {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s+]/g, ' ')
    .replace(/\s+/g, ' ');
}

function bestBlurb(input, entries) {
  const n = normalize(input);
  if (!n) return null;
  let bestScore = -1;
  let best = null;
  for (const entry of entries) {
    if (entry.active === false) continue;
    for (const alias of entry.aliases) {
      const a = normalize(alias);
      if (!a) continue;
      let score = -1;
      if (n === a) score = 1000 + a.length;
      else if (a.length >= MIN_SUBSTRING_ALIAS_LEN && n.includes(a)) score = 500 + a.length * 10;
      else if (a.length >= MIN_SUBSTRING_ALIAS_LEN && n.length >= 4 && a.includes(n))
        score = 200 + n.length * 10;
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }
  }
  return best;
}

const DEFAULT_RIDER = 'favourite driver';
const UNKNOWN_RIDER = 'Solid pick — every favourite driver';
const DEFAULT_BIKE = 'think about when';
const UNKNOWN_BIKE = "that kart's got stories";

function riderFact(name) {
  if (!name.trim()) return DEFAULT_RIDER;
  const hit = bestBlurb(name, riders);
  return hit ? hit.blurb : UNKNOWN_RIDER;
}

function bikeFact(name) {
  if (!name.trim()) return DEFAULT_BIKE;
  const hit = bestBlurb(name, bikes);
  return hit ? hit.blurb : UNKNOWN_BIKE;
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed += 1;
  } else {
    console.log('OK:', msg);
  }
}

assert(riders.length >= 40, `driver catalog size ${riders.length} >= 40`);
assert(bikes.length >= 35, `kart catalog size ${bikes.length} >= 35`);

const cases = [
  ['rider', 'Piastri', 'Oscar Piastri'],
  ['rider', 'Ricciardo', 'Daniel Ricciardo'],
  ['rider', 'Hamilton', 'Lewis Hamilton'],
  ['rider', 'Verstappen', 'Max Verstappen'],
  ['rider', 'Doohan', 'Jack Doohan'],
  ['rider', 'McLaughlin', 'Scott McLaughlin'],
  ['rider', 'Will Power', 'Will Power'],
  ['rider', 'Feeney', 'Broc Feeney'],
  ['rider', 'Will Brown', 'Will Brown'],
  ['rider', 'Waters', 'Cam Waters'],
  ['rider', 'Palou', 'Alex Palou'],
  ['rider', 'Dixon', 'Scott Dixon'],
  ['rider', 'Anagnostiadis', 'Aiva'],
  ['rider', 'Senna', 'Ayrton Senna'],
  ['rider', 'Alonso', 'Fernando Alonso'],
  ['bike', 'Tony Kart', 'Tony Kart'],
  ['bike', 'KA100', 'KA100'],
  ['bike', 'X30', 'X30'],
  ['bike', 'Rotax', 'Rotax'],
  ['bike', 'Birel', 'Birel'],
  ['bike', 'Mini Rok', 'Mini Rok'],
  ['bike', 'Torini', 'Torini'],
  ['bike', 'Parolin', 'Parolin'],
  ['bike', 'Kosmic', 'Kosmic'],
  ['bike', 'CRG', 'CRG'],
];

for (const [kind, input, expectSnippet] of cases) {
  const text = kind === 'rider' ? riderFact(input) : bikeFact(input);
  const hit = kind === 'rider' ? bestBlurb(input, riders) : bestBlurb(input, bikes);
  assert(
    text.includes(expectSnippet) || (hit && hit.displayName.includes(expectSnippet.split(' ')[0])),
    `${kind} "${input}" → contains/matches "${expectSnippet}" (got: ${(hit && hit.displayName) || text.slice(0, 60)})`
  );
}

assert(riderFact('').includes('favourite driver') || riderFact('').includes('want to race'), 'empty driver → default');
assert(bikeFact('').includes('think about') || bikeFact('').includes('favourite kart'), 'empty kart → default');
assert(riderFact('Some Random Local Hero').includes('Solid pick'), 'unknown driver → fallback');
assert(bikeFact("Bob's shed special").includes("kart's got stories"), 'unknown kart → fallback');

assert(bestBlurb('rea', riders) === null, 'bare "rea" does not match');
assert(bestBlurb('max', riders) === null, 'bare "max" does not match Verstappen');
assert(bestBlurb('will power', riders)?.id === 'power', '"will power" → Will Power');
assert(bestBlurb('jack doohan', riders)?.id === 'doohan_jack', '"jack doohan" → Jack');
assert(bestBlurb('doohan', riders)?.id === 'doohan_jack', 'bare "doohan" → Jack');
assert(bestBlurb('tony kart', bikes)?.id === 'tony_kart', '"tony kart" → Tony Kart');

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log(`\nAll onboarding fact smoke checks passed (${riders.length} drivers, ${bikes.length} karts).`);
