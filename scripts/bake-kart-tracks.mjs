/**
 * J1.1–J1.6: import kart GPX, write catalog + geofences + Track Details ids.
 *
 * Usage: node scripts/bake-kart-tracks.mjs
 *
 * Does not bake polylines or corner overlays — run build-gpx-track-maps.mjs
 * then build-track-details-corners.mjs after this.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HOLD_STEMS,
  VENUES,
  catalogLayoutLabel,
  displayName,
  multiLayoutGroups,
  stemToId,
  timezoneForState,
} from './lib/kart-venues.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_GPX = path.join(ROOT, 'data', 'gpx');
const DEST_GPX = path.join(ROOT, 'scripts', 'track-memory-gpx');
const SF_SNAP_STEMS = new Set([
  'GoldfieldsK',
  'SPKP Var3',
  'SPKP Var4',
  'LismoreK',
  'OrangeK B',
  'OrangeK C',
  'WollongongK',
  'MegaFastKart',
]);

function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function parseGpx(xml) {
  const desc = /<desc>([\s\S]*?)<\/desc>/.exec(xml)?.[1] || '';
  const declared = /Declared length (\d+)\s*m/.exec(desc);
  const stateMatch = /,\s*([A-Z]{2,3})\s+AU/.exec(desc);
  const wpt = /<wpt\s+lat="([^"]+)"\s+lon="([^"]+)"/.exec(xml);
  const pts = [];
  const ptRe = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"/gi;
  let m;
  while ((m = ptRe.exec(xml))) {
    pts.push({ lat: Number(m[1]), lon: Number(m[2]) });
  }
  let lengthM = 0;
  for (let i = 1; i < pts.length; i += 1) {
    lengthM += haversineM(pts[i - 1].lat, pts[i - 1].lon, pts[i].lat, pts[i].lon);
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (const p of pts) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }
  return {
    desc,
    declaredM: declared ? Number(declared[1]) : Math.round(lengthM),
    state: stateMatch ? stateMatch[1] : '',
    sf: wpt ? { lat: Number(wpt[1]), lon: Number(wpt[2]) } : pts[0] || null,
    pts,
    lengthM,
    bbox: { minLat, maxLat, minLon, maxLon },
  };
}

function nearestPt(sf, pts) {
  let best = pts[0];
  let bestD = Infinity;
  for (const p of pts) {
    const d = haversineM(sf.lat, sf.lon, p.lat, p.lon);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return { pt: best, distM: bestD };
}

function snapStartFinish(xml, stem) {
  const parsed = parseGpx(xml);
  if (!parsed.sf || !parsed.pts.length) return { xml, note: null };
  const { pt, distM } = nearestPt(parsed.sf, parsed.pts);
  if (distM <= 30 && !SF_SNAP_STEMS.has(stem)) return { xml, note: null };
  const next = xml.replace(
    /<wpt\s+lat="[^"]+"\s+lon="[^"]+"/,
    `<wpt lat="${pt.lat.toFixed(7)}" lon="${pt.lon.toFixed(7)}"`
  );
  return {
    xml: next,
    note: `S/F snapped to nearest polyline point (${Math.round(distM)} m off)`,
  };
}

function fixCanberraLong(xml) {
  return xml.replace('Kart track,  AU.', 'Kart track, ACT AU.');
}

function skeletonCorners(trackId) {
  return [
    {
      id: `${trackId}_t1`,
      number: 1,
      label: 'T1',
      direction: 'complex',
      approachFrom: 'main straight / start-finish',
    },
    {
      id: `${trackId}_t_finish`,
      number: null,
      label: 'T-Finish',
      shape: 'Straight',
      direction: 'straight',
      approachFrom: 'final corner exit onto main straight',
      isFinish: true,
    },
  ];
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeTrackDetailsIds(ids) {
  const body = `/**
 * Track Details layouts drawn from repo GPX.
 */
export const TRACK_DETAILS_IDS = [
${ids.map((id) => `  '${id}',`).join('\n')}
];

/**
 * Catalog tracks with no Track Details map on purpose, and why. Anything in the
 * catalog but absent from both lists is an accident, so validate-track-data
 * fails it; these warn instead, staying visible until the blocker clears.
 */
export const TRACK_DETAILS_EXCLUSIONS = {};
`;
  fs.writeFileSync(path.join(ROOT, 'scripts', 'lib', 'track-details-ids.mjs'), body);
}

function geofenceRadiusM(bbox, sf) {
  const diag = haversineM(bbox.minLat, bbox.minLon, bbox.maxLat, bbox.maxLon);
  const fromSf = Math.max(
    haversineM(sf.lat, sf.lon, bbox.minLat, bbox.minLon),
    haversineM(sf.lat, sf.lon, bbox.maxLat, bbox.maxLon),
    haversineM(sf.lat, sf.lon, bbox.minLat, bbox.maxLon),
    haversineM(sf.lat, sf.lon, bbox.maxLat, bbox.minLon)
  );
  return Math.max(800, Math.round(Math.max(diag / 2, fromSf) + 250));
}

function main() {
  const files = fs.readdirSync(SRC_GPX).filter((f) => f.toLowerCase().endsWith('.gpx'));
  if (files.length !== 129) {
    console.warn(`Expected 129 GPX in data/gpx, found ${files.length}`);
  }

  fs.mkdirSync(DEST_GPX, { recursive: true });
  for (const leftover of fs.readdirSync(DEST_GPX)) {
    if (leftover.endsWith('.gpx')) fs.unlinkSync(path.join(DEST_GPX, leftover));
  }

  const imported = [];
  const held = [];
  const notes = [];

  for (const file of files.sort((a, b) => a.localeCompare(b))) {
    const stem = path.basename(file, '.gpx');
    const srcPath = path.join(SRC_GPX, file);
    let xml = fs.readFileSync(srcPath, 'utf8');

    if (stem === 'CanberraLong') {
      xml = fixCanberraLong(xml);
      fs.writeFileSync(srcPath, xml);
      notes.push('CanberraLong: tagged state ACT');
    }

    const snap = snapStartFinish(xml, stem);
    if (snap.note) {
      xml = snap.xml;
      fs.writeFileSync(srcPath, xml);
      notes.push(`${stem}: ${snap.note}`);
    }

    if (HOLD_STEMS[stem]) {
      held.push(`${stem}: ${HOLD_STEMS[stem]}`);
      continue;
    }

    const venue = VENUES[stem];
    if (!venue) throw new Error(`No venue mapping for stem "${stem}"`);

    const parsed = parseGpx(xml);
    const state = parsed.state || (stem === 'CanberraLong' ? 'ACT' : '');
    if (!state) throw new Error(`${stem}: missing state tag after import fixes`);
    if (!parsed.sf) throw new Error(`${stem}: missing Start/Finish`);

    const id = stemToId(stem);
    const destName = `${id}.gpx`;
    fs.writeFileSync(path.join(DEST_GPX, destName), xml);

    imported.push({
      id,
      stem,
      venue,
      state,
      parsed,
    });
  }

  imported.sort((a, b) => displayName(a.venue).localeCompare(displayName(b.venue)) || a.id.localeCompare(b.id));

  const tracks = imported.map(({ id, venue, state, parsed }) => {
    const lengthM = parsed.declaredM || Math.round(parsed.lengthM);
    return {
      id,
      name: displayName(venue),
      layout: catalogLayoutLabel(venue),
      direction: 'unknown',
      lengthKm: `${(lengthM / 1000).toFixed(3)} km`,
      isOther: false,
      club: venue.club,
      state,
      lengthM,
      lat: Number(parsed.sf.lat.toFixed(6)),
      lon: Number(parsed.sf.lon.toFixed(6)),
      timezone: timezoneForState(state),
      corners: skeletonCorners(id),
      group: venue.group || undefined,
    };
  });

  const catalogTracks = tracks.map(({ group: _group, ...rest }) => rest);
  const catalog = { version: 1, tracks: catalogTracks };

  const groupIds = multiLayoutGroups(tracks);
  const centreByGroup = new Map();
  for (const ids of groupIds) {
    const members = tracks.filter((t) => ids.includes(t.id));
    const lat = members.reduce((s, t) => s + t.lat, 0) / members.length;
    const lon = members.reduce((s, t) => s + t.lon, 0) / members.length;
    const radius = Math.max(...members.map((t) => geofenceRadiusM(imported.find((i) => i.id === t.id).parsed.bbox, { lat: t.lat, lon: t.lon })));
    for (const id of ids) centreByGroup.set(id, { lat, lon, radius });
  }

  const features = tracks.map((t) => {
    const shared = centreByGroup.get(t.id);
    const parsed = imported.find((i) => i.id === t.id).parsed;
    const lat = shared ? shared.lat : t.lat;
    const lon = shared ? shared.lon : t.lon;
    const radius = shared ? shared.radius : geofenceRadiusM(parsed.bbox, parsed.sf);
    return {
      type: 'Feature',
      properties: {
        trackId: t.id,
        name: t.name,
        radius_m: radius,
      },
      geometry: {
        type: 'Point',
        coordinates: [Number(lon.toFixed(6)), Number(lat.toFixed(6))],
      },
    };
  });

  const geofences = {
    type: 'FeatureCollection',
    name: 'KartRacer_Catalog_Track_Geofences',
    metadata: {
      version: 1,
      feature_count: features.length,
      detection: 'haversine_point_radius',
      source: 'data/gpx bounding boxes + Start/Finish',
    },
    features,
  };

  const verification = {
    version: 2,
    policy:
      'left|right only with handSources evidence. Never set turn hand from GPX. See CURSOR_BUILD_JOBS.md J1.5.',
    updated: '2026-09-10',
    allowedSourceMethods: ['official_map', 'authoritative_preview'],
    bannedSourceMethods: ['gpx_bearing', 'ccw_inference', 'clockwise_inference'],
    forceAllComplex: [],
    trackDirection: {},
    lengthKm: Object.fromEntries(tracks.map((t) => [t.id, Number((t.lengthM / 1000).toFixed(3))])),
    verifiedHands: {},
  };

  const facts = Object.fromEntries(
    tracks.map((t) => [
      t.id,
      {
        surface: 'asphalt',
        weatherUsual: 'Not recorded yet — check the club and local forecast before you go.',
      },
    ])
  );

  const ids = tracks.map((t) => t.id);
  writeTrackDetailsIds(ids);

  const catalogTargets = [
    'app/src/data/tracks.json',
    'android-app/src/data/tracks.json',
    'app/src/packs/bundled/au/tracks/tracks.json',
    'android-app/src/packs/bundled/au/tracks/tracks.json',
    'packs/regions/au/tracks/tracks.json',
  ];
  for (const rel of catalogTargets) {
    const dest = path.join(ROOT, rel);
    if (rel.startsWith('packs/') && !fs.existsSync(path.dirname(dest))) continue;
    writeJson(dest, catalog);
  }

  for (const rel of ['app/src/data/catalog_track_geofences.json', 'android-app/src/data/catalog_track_geofences.json']) {
    writeJson(path.join(ROOT, rel), geofences);
  }
  for (const rel of ['app/src/data/track_turn_verification.json', 'android-app/src/data/track_turn_verification.json']) {
    writeJson(path.join(ROOT, rel), verification);
  }
  for (const rel of ['app/src/data/trackInfo/facts.json', 'android-app/src/data/trackInfo/facts.json']) {
    writeJson(path.join(ROOT, rel), facts);
  }

  const placeholder = path.join(DEST_GPX, 'PLACEHOLDER.md');
  if (fs.existsSync(placeholder)) fs.unlinkSync(placeholder);

  console.log(`Imported ${imported.length} layouts (${held.length} held)`);
  for (const line of held) console.log(`  HOLD  ${line}`);
  for (const line of notes) console.log(`  FIX   ${line}`);
  console.log(`Catalog ${catalog.tracks.length} tracks, ${features.length} geofences`);
  console.log(`Wrote TRACK_DETAILS_IDS (${ids.length})`);
}

main();
