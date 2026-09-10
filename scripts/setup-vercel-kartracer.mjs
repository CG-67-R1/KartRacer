/**
 * Create / link a new Vercel project for Expo web (app/).
 * Reads local Vercel CLI auth.json. Does not print tokens.
 *
 * Usage: node scripts/setup-vercel-kartracer.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PROJECT_NAME = 'kartracer';
const ROOT_DIRECTORY = 'app';
const GITHUB_REPO = 'CG-67-R1/KartRacer';
const API = 'https://api.vercel.com';

function loadToken() {
  const fromEnv = process.env.VERCEL_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const candidates = [
    path.join(process.env.APPDATA || '', 'com.vercel.cli', 'auth.json'),
    path.join(process.env.APPDATA || '', 'xdg.data', 'com.vercel.cli', 'auth.json'),
    path.join(os.homedir(), '.local', 'share', 'com.vercel.cli', 'auth.json'),
  ];
  for (const file of candidates) {
    if (!file || !fs.existsSync(file)) continue;
    try {
      const auth = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (auth.token) return String(auth.token);
    } catch {
      /* try next */
    }
  }
  throw new Error('No Vercel token. Set VERCEL_TOKEN or run: npx vercel login');
}

async function vercel(token, method, urlPath, body, teamId) {
  const url = new URL(API + urlPath);
  if (teamId) url.searchParams.set('teamId', teamId);
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 200) };
  }
  if (!res.ok) {
    const err = new Error(data.error?.message || data.message || `Vercel ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function writeLink(project) {
  const destDir = path.join(process.cwd(), 'app', '.vercel');
  fs.mkdirSync(destDir, { recursive: true });
  const payload = {
    projectId: project.id,
    orgId: project.accountId,
    projectName: project.name,
  };
  fs.writeFileSync(path.join(destDir, 'project.json'), `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

async function main() {
  const token = loadToken();
  const user = await vercel(token, 'GET', '/v2/user');
  const username = user.user?.username || user.username || '(user)';
  console.log(`Vercel user: ${username}`);

  const teams = await vercel(token, 'GET', '/v2/teams').catch(() => ({ teams: [] }));
  const teamList = teams.teams || [];
  for (const t of teamList) {
    console.log(`  team: ${t.slug} (${t.id})`);
  }
  const preferred =
    teamList.find((t) => /motorsport|mil/i.test(`${t.slug} ${t.name || ''}`)) || null;
  const teamId = preferred?.id || process.env.VERCEL_TEAM_ID || null;
  if (preferred) console.log(`Using team: ${preferred.slug}`);

  let project = null;
  try {
    project = await vercel(token, 'GET', `/v9/projects/${PROJECT_NAME}`, null, teamId);
    console.log(`Existing project: ${project.name} (${project.id})`);
  } catch (e) {
    if (e.status !== 404) throw e;
  }

  if (!project) {
    const body = {
      name: PROJECT_NAME,
      framework: null,
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      installCommand: 'npm install --legacy-peer-deps',
      rootDirectory: ROOT_DIRECTORY,
    };
    try {
      body.gitRepository = { type: 'github', repo: GITHUB_REPO };
      project = await vercel(token, 'POST', '/v11/projects', body, teamId);
      console.log(`Created project with GitHub: ${project.name} (${project.id})`);
    } catch (e) {
      console.warn(`GitHub link skipped: ${e.message}`);
      delete body.gitRepository;
      project = await vercel(token, 'POST', '/v11/projects', body, teamId);
      console.log(`Created project (no git): ${project.name} (${project.id})`);
    }
  } else if (!project.rootDirectory) {
    await vercel(
      token,
      'PATCH',
      `/v9/projects/${project.id}`,
      { rootDirectory: ROOT_DIRECTORY },
      teamId
    );
    console.log('Set rootDirectory to app/');
  }

  const link = writeLink(project);
  console.log(`Linked app/.vercel/project.json → ${link.projectId}`);
  const host = project.alias?.[0]?.domain || `${PROJECT_NAME}.vercel.app`;
  console.log(`Dashboard: https://vercel.com/${preferred?.slug || username}/${PROJECT_NAME}`);
  console.log(`Hint host: https://${host}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
