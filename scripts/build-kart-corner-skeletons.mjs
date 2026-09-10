/**
 * J1.6 skeleton Track Details corners for kart layouts.
 *
 * The motorcycle detector rejects kart-length laps (500 m floor) and treats
 * short kart straights as "S/F inside a corner". This bake places turns from
 * the committed map polyline only. Hands stay null — GPX never sets turn
 * direction (P0).
 *
 * Usage: node scripts/build-kart-corner-skeletons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRACK_DETAILS_IDS } from './lib/track-details-ids.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT, 'app', 'src', 'data', 'tracks.json');
const MAP_DIR = path.join(ROOT, 'app', 'src', 'data', 'gpxTrackMaps');
const APP_OUT = path.join(ROOT, 'app', 'src', 'data', 'trackDetailsCorners');
const ANDROID_OUT = path.join(ROOT, 'android-app', 'src', 'data', 'trackDetailsCorners');

function round(n) {
  return Math.round(n * 100) / 100;
}

function clampMap(n) {
  return Math.min(98, Math.max(2, n));
}

function dropClosed(pts) {
  if (pts.length < 2) return pts;
  const a = pts[0];
  const b = pts[pts.length - 1];
  if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.08) return pts.slice(0, -1);
  return pts;
}

function heading(a, b) {
  return Math.atan2(b[1] - a[1], b[0] - a[0]);
}

function angDelta(a, b) {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function centroid(pts) {
  const ring = dropClosed(pts);
  let x = 0;
  let y = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
  }
  return [x / ring.length, y / ring.length];
}

function outward(point, centre, distance) {
  const dx = point[0] - centre[0];
  const dy = point[1] - centre[1];
  const n = Math.hypot(dx, dy) || 1;
  return [round(clampMap(point[0] + (dx / n) * distance)), round(clampMap(point[1] + (dy / n) * distance))];
}

function at(ring, i) {
  const n = ring.length;
  return ring[((i % n) + n) % n];
}

function findTurns(polyline) {
  const ring = dropClosed(polyline);
  const n = ring.length;
  if (n < 16) return [Math.floor(n / 3)];

  const window = Math.max(2, Math.round(n / 40));
  const scores = [];
  for (let i = 0; i < n; i += 1) {
    const h0 = heading(at(ring, i - window), at(ring, i));
    const h1 = heading(at(ring, i), at(ring, i + window));
    scores.push(Math.abs(angDelta(h0, h1)));
  }

  const threshold = 0.55;
  const minSep = Math.max(6, Math.round(n / 18));
  const peaks = [];
  for (let i = 0; i < n; i += 1) {
    if (scores[i] < threshold) continue;
    const prev = scores[atIndex(i - 1, n)];
    const next = scores[atIndex(i + 1, n)];
    if (scores[i] < prev || scores[i] < next) continue;
    peaks.push({ i, score: scores[i] });
  }
  peaks.sort((a, b) => b.score - a.score);

  const picked = [];
  for (const peak of peaks) {
    if (picked.some((j) => circDist(peak.i, j, n) < minSep)) continue;
    picked.push(peak.i);
    if (picked.length >= 16) break;
  }

  if (!picked.length) picked.push(Math.floor(n * 0.28));
  picked.sort((a, b) => a - b);

  // Start/finish is index 0; drop a peak sitting on the join.
  return picked.filter((i) => Math.min(i, n - i) > 3);
}

function atIndex(i, n) {
  return ((i % n) + n) % n;
}

function circDist(a, b, n) {
  const d = Math.abs(a - b);
  return Math.min(d, n - d);
}

function toCamel(id) {
  return id.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function writeIndex(outDir, ids) {
  const imports = ids.map((id) => `import ${toCamel(id)} from './${id}.json';`).join('\n');
  const entries = ids.map((id) => `  ${id}: ${toCamel(id)} as TrackDetailsCorners,`).join('\n');
  const body = `${imports}
import type { TrackDetailsCorners } from './types';

const LAYOUTS: Record<string, TrackDetailsCorners> = {
${entries}
};

export const TRACK_DETAILS_CORNER_IDS = Object.keys(LAYOUTS);

export function getTrackDetailsCorners(trackId: string): TrackDetailsCorners | undefined {
  return LAYOUTS[trackId];
}
`;
  fs.writeFileSync(path.join(outDir, 'index.ts'), body);
}

function writeTypes(outDir) {
  const types = `export type TrackDetailsCorner = {
  id: string;
  number: number;
  apex: [number, number];
  label: [number, number];
  entry: [number, number];
  exit: [number, number];
  classification: string;
  headingChangeDeg: number;
  minimumRadiusM: number;
  lengthM: number;
  previousStraightM: number;
  /** Verified hand only, and only when the official count still matches. */
  direction: 'left' | 'right' | null;
  summary: string;
  approachFrom: string;
};

export type TrackDetailsCorners = {
  trackId: string;
  name: string;
  lengthM: number;
  startFinish: [number, number];
  countSource: 'autonomous' | 'constrained_to_target';
  corners: TrackDetailsCorner[];
};
`;
  fs.writeFileSync(path.join(outDir, 'types.ts'), types);
}

function buildOne(id, catalog) {
  const mapPath = path.join(MAP_DIR, `${id}.json`);
  if (!fs.existsSync(mapPath)) throw new Error(`missing map ${id}.json`);
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const track = (catalog.tracks || []).find((t) => t.id === id);
  const polyline = map.polyline;
  const ring = dropClosed(polyline);
  const centre = centroid(polyline);
  const startFinish = [round(polyline[0][0]), round(polyline[0][1])];
  let idxs = findTurns(polyline);
  if (!idxs.length) idxs = [Math.floor(ring.length * 0.28)];

  const lengthM = track?.lengthM || Math.round(Number(String(track?.lengthKm || '').match(/([\d.]+)/)?.[1] || 0) * 1000);

  const corners = idxs.map((idx, n) => {
    const apex = [round(at(ring, idx)[0]), round(at(ring, idx)[1])];
    const entry = [round(at(ring, idx - 4)[0]), round(at(ring, idx - 4)[1])];
    const exit = [round(at(ring, idx + 4)[0]), round(at(ring, idx + 4)[1])];
    const number = n + 1;
    return {
      id: `${id}_t${number}`,
      number,
      apex,
      label: outward(apex, centre, 5.2),
      entry,
      exit,
      classification: 'corner',
      headingChangeDeg: 0,
      minimumRadiusM: 0,
      lengthM: 0,
      previousStraightM: 0,
      direction: null,
      summary:
        `Turn ${number} — hand not verified yet. Use a club map or walk the track before you treat this as left or right.`,
      approachFrom: number === 1 ? 'start/finish straight' : `T${number - 1} exit`,
    };
  });

  return {
    trackId: id,
    name: track?.name || map.name || id,
    lengthM,
    startFinish,
    countSource: 'autonomous',
    corners,
  };
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const ids = TRACK_DETAILS_IDS;
  fs.mkdirSync(APP_OUT, { recursive: true });
  fs.mkdirSync(ANDROID_OUT, { recursive: true });

  const layouts = [];
  for (const id of ids) {
    layouts.push(buildOne(id, catalog));
  }

  writeTypes(APP_OUT);
  writeTypes(ANDROID_OUT);
  for (const layout of layouts) {
    const json = `${JSON.stringify(layout, null, 2)}\n`;
    fs.writeFileSync(path.join(APP_OUT, `${layout.trackId}.json`), json);
    fs.writeFileSync(path.join(ANDROID_OUT, `${layout.trackId}.json`), json);
  }
  writeIndex(APP_OUT, ids);
  writeIndex(ANDROID_OUT, ids);
  const counts = layouts.map((l) => l.corners.length);
  console.log(
    `Wrote ${layouts.length} skeleton corner overlays (min ${Math.min(...counts)} / max ${Math.max(...counts)} turns, hands-open)`
  );
}

main();
