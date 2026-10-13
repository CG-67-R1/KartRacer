# App Review notes — Guideline 2.1 (Information Needed)

Paste-ready answers for **KartRacer - Motorsport_Is_Life** (`com.milkartracer.app`, ASC `6815476086`), version **1.0.0**.

Do **not** bump the marketing version. Keep `1.0.0`. Demo account: leave blank / “No account required”. Contact email: `projectapex@outlook.com.au` (see [`ASC_LISTING_COPY.md`](ASC_LISTING_COPY.md)).

Record on the **same TestFlight build** attached to 1.0.0 (or a newer production IPA if you uploaded one first). Do not record the Vercel web app or a simulator. Do not record RoadRacer.

---

## Facts (keep notes accurate)

- **No accounts, login, or account deletion.** On-device profile only. Closest analog: **Profile & settings → Your data & privacy → Delete all local data**.
- **No IAP / subscriptions / paid unlocks.**
- **No App Tracking Transparency** prompt (no tracking).
- **No public social feed.** Track Walk “Private / Team / Community” is a **local label** on device storage — nothing is published to other users, so there is no report/block UI. Leave visibility on **Private** in the video.
- **There is no News feature in this build.** The first tab is **Home** (identity and shortcuts only). Do not describe news anywhere in the notes.
- **Track Details is in this build** (route name `TrackMemoryHub`). Driver Coach → **Track Details** → pick a catalog circuit. Zoomable circuit picture drawn from a GPX trace (not a game): numbered turns and a red **suggested** racing line on layouts that have one. Tap a number to open a zoomed view of that corner. No Play mode, no throttle/brake, no `@shopify/react-native-skia`. On-device only (no account, not multiplayer). The line is a suggestion, never instruction, and no modelled lap time is shown.
- **Permissions that can appear:** camera (avatar), photos (kart / notes / avatar library), calendar (Events → Add reminder), location (Settings → track arrival), speech/mic (Track Walk voice note if the native module is present). The app no longer requests notifications, so no notification prompt appears.
- **Network:** hosted KartRacer API is **not live yet**. Coach / Kart Setup AI / Q&A default to `http://localhost:3001`. On a phone that cannot reach that host, those features will time out — wait or skip. Do **not** point this app at `https://send-it-ke7r.onrender.com`.
- **`expo-speech-recognition` is pinned at `56.0.1`.** Expo SDK 57’s `~57.0.x` package is not published yet; keep 56 until a 57 release exists.
- **Regions:** AU-first (`packs` active `["au"]`). UK pack exists in the tree but is not the launch catalog. Not a regulated industry.

---

## Shot list (physical iPhone, latest iOS)

Aim for **3–5 minutes**. Pause briefly on each screen.

### Setup

1. Install the **TestFlight** build that is on version 1.0.0 (or the new production build if you uploaded one).
2. Optional but useful: **Settings → Your data & privacy → Repeat onboarding** so launch shows first-run.
3. iPhone: Control Center → **Screen Recording** (microphone off unless you narrate).
4. Force-quit KartRacer. Start recording on the **Home Screen**, then tap the KartRacer icon.

### Record this path

| # | Show | Why Apple asked |
|---|------|-----------------|
| 1 | Cold launch from Home Screen | “Recording must begin with launching the app” |
| 2 | Onboarding: Welcome → favourite kart/driver → activity → nickname. If avatar **Take photo** appears, **Allow Camera**, then Cancel/Align enough to show the prompt | Camera purpose string |
| 3 | Home: tap kart photo area → **Allow Photos** (or Don’t Allow if already granted — still tap the control) | Photos prompt |
| 4 | **Settings** → scroll the profile and **Your data & privacy** section | Settings is reached from Home; there is no News to show |
| 5 | Tab **Events** → scroll calendar → **Add reminder** on one event → **Allow Calendar** | Calendar prompt |
| 6 | Tab **Driver Coach** → **Track Prep** or **Track Walk** (pick a catalog track, add one short note, keep **Private**) → **Driver Coach** chat, send e.g. “How should I approach a slow hairpin?” and wait or show the timeout if the API is not hosted | Core coach flow |
| 6b | Driver Coach → **Track Details** → pick a circuit. Zoom the map; show numbered turns and the suggested line if present. Tap a number. Do **not** look for Play / throttle / landscape lock | Track Details is the headline feature |
| 7 | Tab **Kart Setup** → open **Kart Setup Tool** (scroll fields). Optional: switch Advisor / Engineer | Core setup tools; data stays on device |
| 8 | Tab **Q & A** → Ask e.g. “What is a club day?” → wait or show timeout → open **Trivia**, start one question | Q&A core |
| 9 | **Settings** → enable **track arrival** → **Allow Location While Using** | Location prompt |
| 10 | **Settings → Your data & privacy**: show Privacy Policy link, **Delete all local data** (you do not have to confirm delete on camera) | No-account “access” story |
| 11 | Stop recording. Trim to launch → end. Export **.mov** or **.mp4**. | Attach in Resolution Center |

**Do not** invent login, payments, a report/block screen, or a News feature.

Replace `[MODEL]` and `[VERSION]` in the notes below with the phone you used, e.g. `iPhone 16, iOS 26.6`.

---

## Paste into Notes and Resolution Center

Fill the device line first, then paste this entire block.

```
KartRacer — App Review notes (version 1.0.0)

1) SCREEN RECORDING
Attached in this Resolution Center reply: physical-device recording starting at app launch, then onboarding/Home, Settings, Events, Driver Coach (Track Walk + AI Coach + Track Details), Kart Setup, Q&A, and permission prompts (camera/photos/calendar/location as they appear).

No account registration, login, or account deletion — there is no user account.
No paid content, IAP, or subscriptions.
No App Tracking Transparency prompt — the app does not track users.
User-created track notes and photos are stored only on the device. The Track Walk Private/Team/Community control is a local label only; sessions are not published to other users. There is no public feed, so there is no content reporting or blocking UI.

2) DEVICES AND OS TESTED BEFORE SUBMISSION
- iPhone [MODEL], iOS [VERSION] (physical device; this recording)
Minimum iOS: 16.4. iPad is supported (same binary); primary testing is iPhone.

3) WHAT THE APP DOES AND WHO IT IS FOR
KartRacer is an Australian kart-racing companion for club racers and fans.
It solves scattered prep: circuit study from GPX traces, a race calendar, on-device track notes and Kart Setup Tool sheets, and optional AI coaching.
Target audience: adults interested in kart racing (not children). Informational only — not professional race or mechanical advice.

4) HOW TO ACCESS MAIN FEATURES (NO LOGIN)
- No demo account. Open the app; complete or skip through onboarding (any kart/driver names; choose how you race).
- Home: identity (kart photo/avatar) and shortcuts. Settings is reached from Home.
- Events: race calendar. Add reminder uses the device calendar (permission).
- Driver Coach: AI Coach, Track Prep/Walk, Track Details. Track Details is on-device: pick a circuit to see a zoomable GPX map, a suggested racing line where we have one, and corner notes. Not a game and not multiplayer. The line is a suggestion only and no lap times are modelled.
- Kart Setup: Kart Setup AI, Kart Setup Tool (Advisor / Engineer). Data stays on device. Network only for AI.
- Q & A: Ask, Official rule check, Trivia, FAQs. Network for Ask/rules.
- Settings → track arrival: optional foreground location near a known circuit.
- Settings → Your data & privacy: export/delete local data; Privacy Policy and Terms.
Hosted API is not live yet. Coach / Kart Setup AI / Q&A may time out unless a KartRacer API is reachable. Privacy: https://kartracer.vercel.app/privacy
Terms: https://kartracer.vercel.app/terms

5) EXTERNAL SERVICES
- KartRacer API: not hosted yet (local default http://localhost:3001) — calendar, Q&A, Coach/Kart Setup proxy when reachable
- OpenAI — AI replies when the API is up; chat is not kept on our server after the response
- Sentry — crash diagnostics only if configured in the build
- Apple: calendar, camera, photos, location, speech recognition as the user enables them
No authentication provider. No payment processor. Do not use the RoadRacer Render host.

6) REGIONAL DIFFERENCES
AU-first launch. Same features worldwide. Bundled launch pack is Australia (calendar series, track catalog). No geo-locked paid features. Primary listing locale: English (Australia).

7) REGULATED INDUSTRY / PROTECTED MATERIAL
Not a regulated industry (not finance, health, gambling, or legal practice).
Not official championship software. Series and class names are used for identification only.
Circuit maps are drawn from GPX traces of the layouts.
Driver Coach, Kart Setup, and Official rule check are informational aids, not a licensed Karting Australia Manual substitute. The suggested racing line is a suggestion, not instruction.
No extra credentials to attach.
```

---

## App Store Connect steps

1. Open [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **KartRacer - Motorsport_Is_Life** (Apple ID `6815476086`).
2. The version must be out of review before you can change the build or the screenshots. From **Waiting for Review**, **In Review**, or **Pending Developer Release**, click “remove this version from review” in the banner, or go **General → App Review → Submissions**, open the iOS submission, hover the version row and click the red **−**. Status becomes **Developer Rejected**, which is self-inflicted and not a real rejection.
3. Version **1.0.0** → **App Review Information** → **Notes**: paste the block. Sign-in required: **No**.
4. **Resolution Center** (only if Apple opened a 2.1 thread): **Reply**, paste the same notes, **attach the video**.
5. Confirm the **Build** is the one you recorded. Do not create 1.0.1. To change it, scroll to **Build**, hover the attached build until a red **−** appears, click it, then use **+** to add the build you want and **Save**.
6. For **TestFlight** only, stop after the build is processed and testers are invited. Do **not** click Submit for Review until a hosted API exists and you have KartRacer screenshots.

A new EAS build is **not required** to answer 2.1. Only rebuild if you want newer code — then record **that** TestFlight and keep version `1.0.0` in [`app/app.json`](../../app/app.json) (`autoIncrement` already bumps the build number).

Photos and speech purpose strings in [`app/app.json`](../../app/app.json) cover kart photo, avatar, Track Walk notes, Coach attachments, and Track Walk voice notes. Those strings bake into Info.plist — a new binary is required after changing them. `expo-speech-recognition` stays on **56.0.1**.
