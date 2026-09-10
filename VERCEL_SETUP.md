# Vercel setup for KartRacer (web app)

Phone preview is the Expo **web** build from `app/`. Do not use the Send-It Vercel project or `https://send-it-ke7r.onrender.com`.

## Live project

| Item | Value |
|------|--------|
| Team | `cg-67-r1s-projects` |
| Project | `kartracer` (`prj_I3BzypiPi0B0M9Hp17Rkk5w2nudl`) |
| Dashboard | https://vercel.com/cg-67-r1s-projects/kartracer |
| Production | https://kartracer.vercel.app |
| GitHub | https://github.com/CG-67-R1/KartRacer (connected; root directory `app`) |
| Node | 22.x |
| Deployment Protection | Off (so phone browsers are not asked to log in to Vercel) |

`android-app/` is Play-only. Do not verify it on Vercel.

## Settings (already applied)

In **Project → Settings → General**:

- **Root Directory:** `app`
- **Build Command:** `npm run build` (`expo export --platform web`, then copy `public/promo.html`)
- **Output Directory:** `dist`
- **Install Command:** `npm install --legacy-peer-deps`

`app/vercel.json` matches those commands and rewrites `/promo` → `/promo.html`.

## Environment variables

Do **not** set `EXPO_PUBLIC_API_URL` to the Send-It Render host.

When a KartRacer API exists (new Render service from `render.yaml`, name `kartracer-api`):

- **Key:** `EXPO_PUBLIC_API_URL`
- **Value:** that KartRacer API origin, no trailing slash
- Then redeploy production

Until then, calendar / Coach / Q&A on the phone web build will fail against `http://localhost:3001`.

## Deploy

GitHub `main` is connected, so a push rebuilds automatically. CLI from the **repo root** (not `app/`):

```powershell
npx vercel --prod --yes --scope cg-67-r1s-projects
```

Root Directory is already `app`. Deploying with `--cwd app` fails because Vercel then looks for `app/app`.

`.vercelignore` excludes sibling folders (`/android-app`, `/data`, `/packs`, …) using **leading slashes** so `app/src/data` and `app/src/packs` still upload.

## Public access

Production must serve the Expo web build, not a Vercel login page.

```powershell
node scripts/vercel-deploy-check.mjs
```

Or:

```powershell
Invoke-WebRequest -Uri "https://kartracer.vercel.app/" -UseBasicParsing |
  Select-Object StatusCode, @{n='Title';e={if($_.Content -match '<title>([^<]+)</title>'){$matches[1]}}}
```

Expect HTTP 200 and `_expo` in the HTML.
