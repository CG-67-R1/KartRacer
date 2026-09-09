#!/usr/bin/env node
/**
 * Repo health check for Hermes / CI / pre-deploy.
 * Usage (from repo root): node scripts/health-check.mjs
 * Env: API_URL (default http://localhost:3001), SKIP_TSC=1
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'app');
const ANDROID_APP_DIR = path.join(ROOT, 'android-app');
const API_DIR = path.join(ROOT, 'api');
const AU_CALENDAR_CACHE = path.join(API_DIR, 'data', 'au-kart-events.json');

const API_URL = process.env.API_URL || 'http://localhost:3001';
// The hosted API sleeps on Render's free tier and takes 15-30 s to wake, so a
// shorter probe reports a live API as unreachable.
const HEALTH_TIMEOUT_MS = 45_000;
const failures = [];

function pass(msg) {
  console.log(`  OK  ${msg}`);
}

function fail(msg) {
  console.error(` FAIL ${msg}`);
  failures.push(msg);
}

function run(cmd, args, cwd, label) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' });
  if (r.status === 0) {
    pass(label);
    return true;
  }
  fail(`${label}${r.stderr ? `: ${r.stderr.trim().slice(0, 200)}` : ''}`);
  return false;
}

function checkAuCalendarCacheFile() {
  if (!fs.existsSync(AU_CALENDAR_CACHE)) {
    fail('api/data/au-kart-events.json missing (placeholder until J3.2)');
    return;
  }
  const data = JSON.parse(fs.readFileSync(AU_CALENDAR_CACHE, 'utf8'));
  const events = Array.isArray(data) ? data : (data.events || []);
  if (!Array.isArray(events) || events.length === 0) {
    pass('AU kart calendar cache present but empty (J3.2)');
    return;
  }
  if (events.length < 10) {
    pass(`AU kart calendar cache: ${events.length} events (below 10 until J3.2 fills it)`);
    return;
  }
  pass(`AU kart calendar cache: ${events.length} events (updated ${data.updatedAt || 'unknown'})`);
}

async function checkCalendarModule() {
  const calendarPath = pathToFileURL(path.join(API_DIR, 'calendar.js')).href;
  const { getCalendarEvents } = await import(calendarPath);
  const events = await getCalendarEvents(true);
  if (!Array.isArray(events)) {
    fail('calendar aggregation did not return an array');
    return;
  }
  if (events.length === 0) {
    pass('calendar aggregation empty (kart sources not wired — J3.1)');
    return;
  }
  pass(`calendar aggregation: ${events.length} events`);
}

async function checkLiveApi() {
  try {
    const health = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    if (!health.ok) {
      fail(`API /health HTTP ${health.status} at ${API_URL}`);
      return;
    }
    pass(`API /health at ${API_URL}`);
    try {
      const healthData = await health.json();
      if (healthData.roadraceAi === true) {
        pass('API roadraceAi enabled (OPENAI_API_KEY set)');
      } else {
        fail('API roadraceAi disabled — set OPENAI_API_KEY on Render (Coach/Ask will fail)');
      }
    } catch {
      fail('API /health response not valid JSON');
    }

    const calendarRes = await fetch(`${API_URL}/calendar`, { signal: AbortSignal.timeout(30000) });
    if (!calendarRes.ok) {
      fail(`API /calendar HTTP ${calendarRes.status}`);
      return;
    }
    const calData = await calendarRes.json();
    if (!Array.isArray(calData.events) || calData.events.length < 20) {
      fail(`API /calendar count low: ${calData.events?.length ?? 0}`);
    } else {
      pass(`API /calendar: ${calData.events.length} events`);
    }
  } catch (e) {
    console.log(`  --  API not reachable at ${API_URL} (${e.message}) — start with: cd api && npm start`);
  }
}

console.log('KartRacer health check\n');

console.log('App');
if (process.env.SKIP_TSC !== '1') {
  run('npx', ['tsc', '--noEmit'], APP_DIR, 'TypeScript (app)');
  run('npx', ['tsc', '--noEmit'], ANDROID_APP_DIR, 'TypeScript (android-app)');
} else {
  console.log('  skip tsc (SKIP_TSC=1)');
}

async function checkAskRetrieval() {
  const qaPath = pathToFileURL(path.join(API_DIR, 'qa.js')).href;
  const { retrieveForAsk } = await import(qaPath);
  const { chunks, fromKb } = await retrieveForAsk('kart racing');
  if (!Array.isArray(chunks)) {
    fail('retrieveForAsk did not return chunks array');
    return;
  }
  pass(`retrieveForAsk: ${chunks.length} chunk(s), fromKb=${fromKb}`);
}

/** KA Manual not ingested yet — motorcycle MoMS must not be required. */
function checkKartRulesCorpus() {
  const qaDir = path.join(ROOT, 'Q&A');
  if (!fs.existsSync(qaDir)) {
    pass('Q&A/ missing — motorcycle PDFs were not copied (J3.4 / J3.6)');
    return;
  }
  const files = fs.readdirSync(qaDir).filter((f) => /\.(json|pdf)$/i.test(f));
  if (files.length === 0) {
    pass('Q&A/ empty placeholder — ingest KA Manual in J3.4');
    return;
  }
  pass(`Q&A/ has ${files.length} file(s)`);
}


console.log('\nAPI modules');
run('node', ['--check', 'server.js'], API_DIR, 'server.js syntax');
run('node', ['--check', 'qa.js'], API_DIR, 'qa.js syntax');
run('node', ['--check', 'roadraceAi.js'], API_DIR, 'roadraceAi.js syntax');
try {
  await checkAskRetrieval();
} catch (e) {
  fail(`retrieveForAsk: ${e.message}`);
}

console.log('\nKart rules corpus');
checkKartRulesCorpus();

console.log('\nAU calendar cache');
checkAuCalendarCacheFile();

console.log('\nCalendar module');
try {
  await checkCalendarModule();
} catch (e) {
  fail(`calendar module: ${e.message}`);
}

console.log('\nLive API (optional)');
await checkLiveApi();

console.log('');
if (failures.length > 0) {
  console.error(`Health check FAILED (${failures.length} issue(s))`);
  process.exit(1);
}
console.log('Health check passed');
