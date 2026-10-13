# ASC submit checklist — KartRacer 1.0.0

App: **KartRacer - Motorsport_Is_Life** · Bundle `com.milkartracer.app` · ASC `6815476086` · Team `UAWP5NV4NQ`

Paste listing copy from [`ASC_LISTING_COPY.md`](ASC_LISTING_COPY.md). Review notes from [`APP_REVIEW_NOTES.md`](APP_REVIEW_NOTES.md).

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Bundle ID + ASC app | **Done** | `com.milkartracer.app` / Apple ID `6815476086` |
| 2 | EAS project + `ascAppId` | **Done** | `@motorsport-is-life/kartracer` in `app/eas.json` |
| 3 | Privacy Policy URL (ASC + in-app) | **Done** | https://kartracer.vercel.app/privacy |
| 4 | Terms of Use (in-app) | **Done** | https://kartracer.vercel.app/terms |
| 5 | Support URL | **Done** | https://github.com/CG-67-R1/KartRacer |
| 6 | Marketing URL | **Done** | https://kartracer.vercel.app/promo |
| 7 | Copyright | **Done** | `2026 Christopher Craig Greene` |
| 8 | Categories | **Done** | Sports + Utilities (`store.config.json`) |
| 9 | Description / keywords / What’s New | **Done** | Paste from listing copy into ASC version 1.0.0 |
| 10 | Export compliance | **Done** in binary | `ITSAppUsesNonExemptEncryption: false`. If Missing Compliance: HTTPS only, exempt, no document |
| 11 | Purpose strings | **Done** | Camera, photos, calendar, location, speech/mic in `app.json` |
| 12 | No IAP / no ATT / no accounts | **Done** | Notes say no demo account |
| 13 | Review contact | **Done** (paste) | Christopher Greene · `projectapex@outlook.com.au` · add your +61 mobile in ASC |
| 14 | Social media questionnaire | **You — ASC UI** | Answer **No** |
| 15 | App Privacy nutrition label | **You — ASC UI** | Linked to user: No. Track: No. User Content (AI chat) + Photos (on-device) + Location (when-in-use if used). Match this policy |
| 16 | Age rating questionnaire | **You — ASC UI** | No unrestricted web, no gambling. Mild competition. Typically 4+ or 12+ |
| 17 | Content rights | **You — ASC UI** | **Yes** — KA rules citations + GPX layouts. Not news publishers |
| 18 | EAS iOS Distribution cert + App Store profile | **You — once** | Interactive: `npx eas-cli@latest build -p ios --profile production --auto-submit --no-wait` from `app/`. Team `UAWP5NV4NQ` |
| 19 | Processed IPA on version 1.0.0 | **Blocked on 18** | ASC → Build → **+**. Keep marketing version `1.0.0` (buildNumber auto-increments; remote is at 2) |
| 20 | iPhone 6.5" screenshots (min 3) | **You — after TestFlight** | Track Details, Track Walk, Kart Setup Tool. Do not reuse RoadRacer shots |
| 21 | iPad 12.9"/13" screenshots **or** uncheck tablet | **You** | `supportsTablet: true` |
| 22 | Physical-device review recording | **You — after TestFlight** | Shot list in `APP_REVIEW_NOTES.md` |
| 23 | Hosted KartRacer API | **Not required to attach a build** | Coach/Q&A time out without it. Do **not** Submit for Review until API is hosted **or** notes/listing do not promise live AI |
| 24 | Submit for Review | **Do not click yet** | Finish 14–22. Prefer 23 if listing still describes AI coach as working |

## App Privacy answers (paste)

- Data used to track you: **No**
- Data linked to your identity: **No** (no account)
- Collected: **User Content** (messages you send to Coach/Q&A — processed by API/OpenAI, not stored after reply); **Photos** (on-device; sent only if you attach); **Precise Location** (optional track arrival, when in use); **Diagnostics** only if Sentry DSN is in that binary
- Purposes: App Functionality. Not used for tracking.

## First production build (you)

```powershell
cd C:\KartRacer\app
npx eas-cli@latest build -p ios --profile production --auto-submit --no-wait
```

Log in to Apple when prompted. After Processing, select that build on version **1.0.0**.
