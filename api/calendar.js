/**
 * Calendar aggregation: Australian kart racing (AKC + club/state).
 * Static seed + scraper cache. No MotoGP / WorldSBK fetch.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { dedupeEvents } from './calendarScrapers.js';
import {
  getCalendarStatic,
  getLocalSeriesIds,
  getPrimaryManifest,
} from './packLoader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_PATH = join(__dirname, 'data', 'calendar-static.json');
const AU_EVENTS_PATH = join(__dirname, 'data', 'au-kart-events.json');
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Lower number = higher prominence in the app.
const SERIES_PRIORITY = {
  akc: 1,
  au_club: 1,
  au_national: 1,
  au_club_day: 1,
  asbk: 1,
  bsb: 1,
  uk_club: 1,
  esbk: 1,
  es_club: 1,
  civ: 1,
  it_club: 1,
};

function localCountryLabel() {
  return getPrimaryManifest()?.displayName || 'Australia';
}

let cache = { data: null, ts: 0 };

function getSeriesPriority(series) {
  if (SERIES_PRIORITY[series] != null) return SERIES_PRIORITY[series];
  if (getLocalSeriesIds().has(series)) return 1;
  return 999;
}

function loadStatic() {
  try {
    const fromPack = getCalendarStatic();
    if (fromPack) {
      return {
        motogp: fromPack.motogp || [],
        australia: fromPack.national || fromPack.australia || [],
        australia_club: fromPack.club || fromPack.australia_club || [],
      };
    }
    const raw = readFileSync(STATIC_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Calendar: failed to load static data', e.message);
    return { motogp: [], australia: [] };
  }
}

function normalizeStaticEvent(series, ev) {
  const isLocal =
    getLocalSeriesIds().has(series) ||
    ['akc', 'asbk', 'au_club', 'au_national', 'australia'].includes(series);
  return {
    series,
    title: ev.title,
    venue: ev.venue || null,
    country: ev.country || null,
    startDate: ev.startDate,
    endDate: ev.endDate || ev.startDate,
    url: ev.url || null,
    seriesLabel: ev.seriesLabel || ev.series || series,
    state: ev.state || null,
    organiser: ev.organiser || null,
    notes: ev.notes || null,
    detailTier: isLocal ? 'full' : 'summary',
  };
}

/**
 * Load Australian kart events produced by the scraper / seed cache.
 */
function loadAuEvents() {
  try {
    const raw = readFileSync(AU_EVENTS_PATH, 'utf8');
    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : (data.events || []);
    if (!Array.isArray(list)) return [];
    const deduped = dedupeEvents(list);
    return deduped
      .filter((ev) => ['kart', 'karting', 'club_day'].includes((ev.discipline || 'kart').toLowerCase()))
      .map((ev) => {
        const name = ev.name || 'Kart meeting';
        const organiser = ev.organiser || '';
        const isAkc =
          /akc/i.test(name) ||
          /australian kart championship/i.test(name) ||
          /penrite/i.test(name);
        const series = isAkc ? 'akc' : 'au_club';
        return {
          series,
          seriesLabel: isAkc ? 'Australian Kart Championship' : organiser || 'AU club karting',
          title: name,
          venue: ev.venue || null,
          country: localCountryLabel(),
          startDate: ev.start_date,
          endDate: ev.end_date || ev.start_date,
          url: ev.entry_url || ev.source_url || null,
          state: ev.state || null,
          organiser: organiser || null,
          notes: ev.notes || null,
          detailTier: 'full',
          confidence: ev.confidence || 'high',
        };
      })
      .filter((ev) => ev.startDate);
  } catch {
    return [];
  }
}

/**
 * Returns kart calendar events sorted by startDate.
 */
export async function getCalendarEvents(bypassCache = false) {
  if (!bypassCache && cache.data && Date.now() - cache.ts < CACHE_TTL_MS) {
    return cache.data;
  }
  const staticData = loadStatic();
  const australia = (staticData.australia || []).map((e) =>
    normalizeStaticEvent(e.series || 'akc', {
      ...e,
      seriesLabel: e.seriesLabel || 'Australian Kart Championship',
    })
  );
  const auClubFromFile = loadAuEvents();
  const auClubStatic = (staticData.australia_club || []).map((e) =>
    normalizeStaticEvent(e.series || 'au_club', { ...e, seriesLabel: e.seriesLabel || 'AU club karting' })
  );
  const auClub = [...auClubFromFile, ...auClubStatic];
  const merged = [...auClub, ...australia].filter((e) => e.startDate);
  const seen = new Set();
  const all = [];
  for (const e of merged) {
    const key = `${(e.title || '').toLowerCase()}|${e.startDate}|${(e.venue || '').toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    all.push(e);
  }
  all.sort((a, b) => {
    if (a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate);
    }
    const pa = getSeriesPriority(a.series);
    const pb = getSeriesPriority(b.series);
    if (pa !== pb) return pa - pb;
    return (a.title || '').localeCompare(b.title || '');
  });
  cache = { data: all, ts: Date.now() };
  return all;
}
