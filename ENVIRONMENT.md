# KartRacer — Environments

| Service | URL | Notes |
|---------|-----|--------|
| GitHub | https://github.com/CG-67-R1/KartRacer | New repo. Do not use `CG-67-R1/Send-It` |
| API (Render) | *(none yet)* | Do not use `https://send-it-ke7r.onrender.com`. Local: `http://localhost:3001` |
| Web (Vercel) | https://kartracer.vercel.app | Project `kartracer` (`prj_I3BzypiPi0B0M9Hp17Rkk5w2nudl`), team `cg-67-r1s-projects`, root `app/`. Promo: https://kartracer.vercel.app/promo. Do not use the Send-It Vercel project |
| Expo iOS / web | https://expo.dev/accounts/motorsport-is-life/projects/kartracer | EAS project id `35684a13-12fc-4ec6-b561-553ee80c550a`. Slug `kartracer`. Bundle `com.milkartracer.app` |
| Expo Android / Play | https://expo.dev/accounts/motorsport-is-life/projects/kartracer-android | EAS project id `0a94c0fe-79b2-46b3-a8f6-5001cd234926`. Slug `kartracer-android`. Package `com.milkartracer.app` |

Local API: `http://localhost:3001` (`app/constants/api.ts`). Calendar, Coach, and Q&A on the Vercel web build still call localhost until a KartRacer API is hosted.

EAS / ASC / Play: new apps only. Do not reuse Send-It EAS or ASC `6799806571`.

Health: `node scripts/health-check.mjs`.
