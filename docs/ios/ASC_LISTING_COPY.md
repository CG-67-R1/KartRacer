# App Store Connect — listing copy (en-AU)

Paste-ready values for **KartRacer - Motorsport_Is_Life** (`com.milkartracer.app`, ASC `6815476086`).

Do not paste RoadRacer / Send-It URLs or `com.milroadracer.app`.

## App Privacy

| Field | Value |
|--------|--------|
| Privacy Policy URL | `https://github.com/CG-67-R1/KartRacer/blob/main/docs/legal/PRIVACY.md` |

Also complete the **App Privacy** questionnaire to match reality:

- Data linked to user: generally **No** (no account).
- Data used to track: **No**.
- Collected / processed types that apply: **User Content** (chat/messages you send to AI — disclosed as processed by API/OpenAI, not stored after response); **Photos or Videos** (on-device; AI attachments only when user sends); **Product Interaction** optional; **Diagnostics** if Sentry is on; **Precise Location** only if track-arrival is used (on-device).
- When unsure, match [`docs/legal/PRIVACY.md`](../legal/PRIVACY.md) and the in-app Settings privacy text.

## App Information

| Field | Value |
|--------|--------|
| Primary Category | **Sports** |
| Secondary Category (optional) | **Utilities** (setup sheets, track notes). **Not News.** |
| Copyright | Paste exactly as below (no URL; Apple adds ©). |
| Content Rights | Does your app contain, display, or access third-party content? → **Yes**. Cited reference material — Karting Australia class/rules text behind Q&A Official rule check, and circuit layouts from GPX. Confirm your rights basis before answering. |
| Age Rating | Complete the questionnaire (no unrestricted web, mild competition themes — typically 4+ or 12+ depending on answers). |
| Social media capabilities | **No.** Track Walk Private/Team/Community is a local device label only. |

### Copyright (required)

Paste into the **Copyright** field (matches Individual membership **CHRISTOPHER CRAIG GREENE**):

```
2026 Christopher Craig Greene
```

Trading-name alternative (if you prefer): `2026 Motorsport Is Life`

## App Encryption Documentation

KartRacer only uses **standard HTTPS/TLS** via the OS (API, OpenAI, Sentry). It does **not** ship proprietary or custom crypto. No CCATS or French encryption declaration upload is required.

Already set in [`app/app.json`](../../app/app.json):

```json
"ITSAppUsesNonExemptEncryption": false
```

### Answers in App Store Connect

If ASC asks under **App Encryption Documentation** or a build shows **Missing Compliance** → **Manage**:

| Question (wording varies) | Answer |
|---------------------------|--------|
| Does your app use encryption? | **Yes** (HTTPS/TLS) — or follow Apple’s flow; the next answers mark it exempt |
| Is encryption limited to that within the Apple operating system / exempt uses (HTTPS, authentication)? | **Yes** |
| Does your app use, contain, or incorporate proprietary or non-standard encryption? | **No** |
| Do you need to upload app encryption documentation? | **No** — none required |

Then **Save**. You should **not** upload a document for this app.

If a build still asks every upload, confirm the production Info.plist includes `ITSAppUsesNonExemptEncryption` = `NO` (Expo sets this from `app.json` above).

## Version 1.0 — English (Australia)

### Description

```
KartRacer is your Australian kart-racing companion from Motorsport Is Life — circuit study, race calendar, track notes, and AI coaching in one place.

Learn a circuit before you drive it. Track Details draws layouts from real GPX traces, with numbered turns and a suggested racing line where we have one. Tap a turn to zoom that corner. Walk the track with typed or spoken notes and photos, then send them to your coach.

Check the calendar and add reminders. Keep Kart Setup Tool sheets, gearing, and session notes on your device. Ask Driver Coach or Kart Setup AI for practical guidance, or use Q&A and trivia.

Your profile, avatar, setups, and track notes stay private on your device. AI chats you send go to the KartRacer API and may be processed by OpenAI; chat history is not kept on our server after the reply.

Everything here is informational: the suggested line is a suggestion, not instruction, and we do not model lap times for you.

Built for club racers and kart fans who live motorsport.
```

### Keywords (max 100 characters, comma-separated, no trademark abuse)

```
kart,karting,racing,AKC,Rotax,IAME,coach,calendar
```

(Character count: 49)

### URLs

| Field | Value |
|--------|--------|
| Support URL | `https://github.com/CG-67-R1/KartRacer` |
| Marketing URL (optional) | `https://kartracer.vercel.app/promo` |
| Privacy Policy URL | `https://github.com/CG-67-R1/KartRacer/blob/main/docs/legal/PRIVACY.md` |
| Terms of Use URL | `https://github.com/CG-67-R1/KartRacer/blob/main/docs/legal/TERMS.md` |

### Promotional Text (optional, 170 chars)

```
Kart maps, calendar, track walk, and AI coach for Australian karting — setups stay on your device.
```

### What’s New (release notes)

```
First iOS TestFlight of KartRacer. Australian kart companion: circuit study, calendar, track notes, Kart Setup Tool, and Driver Coach. No accounts. Setups stay on your device.
```

## Version 1.0 — United Kingdom localization (English / en-GB)

**Primary App Store locale remains English (Australia).** AU-first launch. Add a UK localization only if you want the UK storefront; do not claim UK circuits as the default catalog.

### Description (UK)

```
KartRacer is an Australian kart-racing companion from Motorsport Is Life — circuit study, calendar, track notes, and AI coaching. AU-first launch; the same app, kart data instead of motorcycle road race.

Learn a circuit from GPX layouts, numbered turns, and a suggested racing line where we have one. Walk the track with notes and photos. Keep Kart Setup Tool sheets on your device. Ask Driver Coach or Kart Setup AI, or use Q&A and trivia.

Profile and setups stay on your device. AI chats may be processed by OpenAI; chat history is not kept on our server after the reply. The suggested line is a guide only; no modelled lap times.
```

### Keywords (UK — max 100 characters)

```
kart,karting,racing,Rotax,IAME,coach,calendar,club
```

(Character count: 50)

### Promotional Text (UK, optional, 170 chars)

```
Kart maps, calendar, track walk, and AI coach — AU-first launch, setups stay on your device.
```

UK review contact: same as AU (`projectapex@outlook.com.au`; phone may remain +61).

## Contact Information (App Review)

Use a real person Apple can reach:

| Field | Suggested |
|--------|-----------|
| First name | (your first name) |
| Last name | (your last name) |
| Phone | (your mobile with country code, e.g. +61…) |
| Email | `projectapex@outlook.com.au` (same as privacy contact) |

Demo account: not required (no login). Full Guideline 2.1 Notes, shot list, and resubmit steps: [`APP_REVIEW_NOTES.md`](APP_REVIEW_NOTES.md).

## Build

You must select a build under **Build** on the version page. That appears only after a successful EAS iOS upload:

```powershell
cd C:\KartRacer\app
npx eas-cli@latest build -p ios --profile production --auto-submit --no-wait
```

First build needs an interactive Apple login so EAS can create the Distribution cert and App Store profile for `com.milkartracer.app`. Then in ASC: Build → **+** → select the processed build.

## Screenshots (iPhone 6.5")

Required sizes include:

- **1242 × 2688** or **1284 × 2778** (portrait)
- Landscape equivalents if you upload landscape

Upload **at least 3** screenshots for iPhone 6.5" Display. Capture them from the **KartRacer TestFlight** binary. Do **not** reuse RoadRacer / Send-It screenshots (bike setup, News, motorcycle maps).

Suggested order once you have captures:

| Order | Screen |
|-------|--------|
| 1 | Track Details GPX map (numbered turns + suggested line) |
| 2 | Track Walk |
| 3 | Kart Setup Tool |
| 4 | Home / Driver Coach |

In ASC: **App Store** → version → **iPhone 6.5" Display** → upload at least three.

## Screenshots (iPad 12.9" / 13")

Accepted sizes: **2064 × 2752**, **2752 × 2064**, **2048 × 2732**, or **2732 × 2048**.

Same KartRacer screens as iPhone. `supportsTablet` is true — either upload iPad shots or uncheck tablet.

## Screenshots (Apple Watch)

KartRacer iOS alone does **not** require Watch screenshots. Do not upload Watch slots unless ASC shows a Watch companion target.
