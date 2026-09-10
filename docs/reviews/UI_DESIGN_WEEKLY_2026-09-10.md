# UI Design Review — Weekly — 2026-09-10

Scope: **KartRacer Expo app (`app/`)** — first UI review since the app shipped
(`0531995 feat: ship AU kart product data for a testable app`). Focus: onboarding,
navigation shell, Kart Setup hub + sheet + gearing screens (the Bike* placeholders
the J2.1 setup-tool spec will replace). Send-It checked only for parity on shared
patterns (tab bar). No prior UI_DESIGN report exists in either repo — nothing to
carry over.

## Executive summary

**P0: 1 | P1: 5 | P2: 3.** The app is structurally sound and consistent with the
Send-It design system, but it ships a **RoadRace brand leak in user-facing
onboarding copy** (P0 — a parent signing a junior up is told their email goes to
"the RoadRace team") plus a visible "(placeholder)" screen title and a prefill
bug that writes the literal onboarding fallback into the setup sheet. All top
fixes are S-effort copy/guard changes; one M-effort hierarchy improvement to the
Kart Setup hub is backed by Google's M3 Expressive eye-tracking research and
should land with the J2.1 screen rebuild rather than before it.

---

## Trend / competitor watch

| Item | Verdict | Notes |
|---|---|---|
| **Apple Liquid Glass (iOS 26 HIG)** | **WATCH** | Apps built with native nav components inherit the new material when compiled against the iOS 26 SDK; Apple's guidance is "let the system handle it" (developer.apple.com "Adopting Liquid Glass"). We use React Navigation native-stack with a **custom dark header** — nothing breaks, but the custom `HomeHeader` and hard-coded `#0f172a` bars won't pick up system materials. Revisit when Expo SDK ships full iOS 26 support; don't chase betas (doctrine: adoption timing). No action now. |
| **Material 3 Expressive** | **ADOPT (principle only)** | Google's published eye-tracking research (design.google, "Expressive Design: Google's UX Research"): participants located the key action **up to 4× faster** when the primary CTA is larger, contained, and colour-differentiated vs. rows of equal-weight controls; preference strongest in younger users — exactly our junior audience. Adopt the *principle* on the Kart Setup hub (see finding 4): one prominent primary card, rest demoted. Do **not** adopt the full M3 Expressive re-theme — it would fork the shared Send-It look for no flow gain. |
| **Duolingo streak mechanics** | **SKIP (hype flag)** | Streak-retention stats circulating (e.g. "12%→55% next-day retention") are vendor-marketing numbers, not controlled evidence. More importantly: KartRacer is a paddock tool, not a daily-habit app, and pressure loops aimed at 8–16-year-olds skirt dark-pattern territory (doctrine 6: zero dark patterns for juniors). What *is* worth keeping from Duolingo is instant, plain-worded feedback per action — already in the J2.1 spec ("one 'do this next' card"). |

---

## Per-screen findings

### 1. OnboardingScreen — P0: RoadRace brand leak in visible copy

- **What's wrong:** `app/src/screens/OnboardingScreen.tsx` lines ~430 and ~486
  render *"Would you like to receive more information from RoadRace?"* and
  *"We'll email your answers to the RoadRace team at…"*. Lines ~158–160 build the
  enquiry email with subject "RoadRace – Future racer enquiry" and body "A
  RoadRace user wants to learn how to go racing."
- **Why it matters:** Brand trust is the whole game for the parent persona — a
  kart app for their kid asking to send their email to a *different product's*
  team reads as sketchy or broken. Also an App Review metadata-consistency risk
  (app name vs. in-app brand), and AGENTS.md is explicit: no Send-It identity
  reuse.
- **Fix:** Replace every user-visible "RoadRace" with "KartRacer"; email
  subject/body → "KartRacer – Future racer enquiry" / "A KartRacer user…".
  Sweep: `grep -rn "RoadRace" app/src android-app/src` and fix all *rendered*
  strings (internal identifiers like `RoadRacerAiFaqsScreen` can wait for the
  J-rename job, but its rendered FAQ body must be checked too). Mirror to
  `android-app`. — **Effort: S**

### 2. App.tsx — P1: "(placeholder)" shipped as a screen title

- **What's wrong:** `App.tsx` line ~241: `options={{ title: 'Kart Balance (placeholder)' }}`
  on the BikeBalanceSetup route.
- **Why it matters:** Doctrine 2 — every state designed, never accidental.
  Internal status markers in a shipped nav bar tell users (and Apple reviewers)
  the feature is unfinished.
- **Fix:** Title → `'Chassis Balance'`. If the screen genuinely isn't ready,
  give it a designed coming-soon state ("Chassis balance maths is being retuned
  for karts — use the Setup Sheet meanwhile") or remove its hub button until
  J2.1 replaces it with KartAnalysisScreen. — **Effort: S**

### 3. Onboarding → Setup Sheet — P1: placeholder value prefills as kart identity

- **What's wrong:** Onboarding's `handleFinish` defaults
  `favouriteBike: 'my kart'` (OnboardingScreen.tsx ~112), but
  `BikeSetupSheetScreen.tsx` (~105) only guards against the *old* fallback:
  `favourite.toLowerCase() !== 'my bike'`. A user who skips the question gets
  the literal string "my kart" parsed by `parseFavouriteBike` and written into
  their setup sheet as their kart's make/model — then persisted (line ~117).
- **Why it matters:** State clarity + data quality: the first thing a skipping
  user sees on the flagship setup screen is junk they didn't enter, and it
  self-heals only by manual deletion. Classic fork-drift bug (copy renamed the
  fallback, guard didn't follow).
- **Fix:** Guard both fallbacks — `const f = favourite.toLowerCase(); if (f && f !== 'my bike' && f !== 'my kart')`
  — or better, centralise the sentinel in one exported constant used by both
  files. Same check in `android-app`. Verify with `npx tsc --noEmit` in both
  app trees + manual on-device: fresh install → skip kart question → open Kart
  Setup Sheet → identity fields must be empty. — **Effort: S**

### 4. BikeSetupHubScreen — P1: six equal-weight buttons, no hierarchy

- **What's wrong:** The hub renders six visually identical full-width
  amber-bordered buttons (Kart Setup AI, Setup Sheet, Chassis Balance, Gearing,
  Tyre Wear, Basics) in the RaceSport display font with no descriptions.
- **Why it matters:** Doctrine 3 — "if everything is bold, nothing is"; one
  primary action per screen. M3 Expressive research (cited above) shows a single
  visually dominant CTA is found up to 4× faster — and our returning racer has
  30 s between heats in sunlight. A junior can't tell "Setup Sheet" from "Setup
  Basics" without tapping both. Display fonts at 17pt also degrade legibility
  vs. the system font (HIG: reserve display faces for large titles).
- **Fix:** Fold into the J2.1 KartSetupHubScreen build (spec already calls for
  hub *cards*): 1 large primary card — **Kart Setup Sheet** (the every-session
  tool) with a one-line description; below it a list of secondary rows (icon +
  title + 1-line description, system font ≥15pt, chevron). Keep the amber accent
  for the primary card only. Same layout in Send-It's Bike Setup hub to preserve
  parity (identical component, different copy) — flagging fork cost: zero if
  built once and copied per repo rule. — **Effort: M** (part of J2.1). Verify
  with `npx tsc --noEmit` + on-device check.

### 5. Tab bar (both apps) — P1: text-only tabs, no icons

- **What's wrong:** Neither KartRacer nor Send-It sets `tabBarIcon` on any
  `Tab.Screen` (verified in both App.tsx files) — five 11pt text labels are the
  entire bottom nav.
- **Why it matters:** HIG tab bars pair SF Symbols with short labels; Material
  navigation bars require icons. Icons are the fastest scan cue for juniors,
  low-literacy users, and gloved thumbs; 11pt-only labels ("Driver Coach",
  "Kart Setup") are also the most truncation-prone element on small devices at
  larger Dynamic Type sizes (doctrine 5).
- **Fix:** Add `tabBarIcon` per tab via `@expo/vector-icons` (Ionicons ships
  with Expo — no new dependency): home / calendar / school (coach) / construct
  (setup) / help-circle. Apply to **both apps in the same PR** — this is a
  shared-shell change, so parity is preserved, not forked. — **Effort: M**
  (4 App.tsx files: app + android-app × 2 repos). Verify `npx tsc --noEmit` +
  on-device.

### 6. Residual bike/rider copy — P1 (bundled sweep)

- **What's wrong (user-visible only):** HeadlinesScreen alerts "…set a picture
  of your bike." / "Remove the photo of your bike…" (~88, ~115); QAScreen quiz
  copy "5 right = track rider" (~703); BikeSetupSheetScreen change-note
  placeholder "How did the change affect the bike?" (~518); CoachChat title
  flips between "AI Coach" and "Kart Setup" while the tab says "Driver Coach" —
  pick one coach name ("Driver Coach") everywhere.
- **Why it matters:** Doctrine 6 — plain, correct words for juniors; every
  "bike" in a kart app costs credibility, and inconsistent feature names break
  orientation ("is AI Coach the same thing I tapped?").
- **Fix:** kart/driver copy sweep across rendered strings only (identifiers
  stay until the rename job): `your bike`→`your kart`, `track rider`→`track
  driver`, `the bike`→`the kart`, unify coach title to "Driver Coach". Mirror
  android-app. — **Effort: S**

### 7. Tab labels & titles — P2 polish

"Q & A" (spaces) → "Q&A" to match the route name and save width; audit
"Driver Coach" / "Kart Setup" labels at max font scaling for truncation.
— **Effort: S**

### 8. GearingGuide TeethDropdown — P2

The teeth picker modal opens a full list (front 10T–?, rear range is long)
always scrolled to the top and doesn't auto-scroll to the current selection;
sheet has no bottom safe-area inset. Minor: add `initialScrollIndex`-style
scroll-to-selected and `paddingBottom: insets.bottom`. Racer-in-paddock benefit:
one flick less between heats. — **Effort: S**

### 9. Home header "Settings" affordance — P2

Text-only amber "Settings" button (~32–36pt effective height incl. hitSlop) is
below the 44pt iOS target and reads as a link, not a button. Swap for a gear
icon at 44pt (pairs naturally with finding 5's icon pass). — **Effort: S**

---

## Top 5 fixes for Cursor (impact ÷ effort)

1. **[P0, S]** Replace all rendered "RoadRace" strings in KartRacer onboarding
   (copy + enquiry email subject/body) with KartRacer; grep-sweep both app trees.
2. **[P1, S]** Remove "(placeholder)" from the Chassis Balance nav title; give
   the screen a designed interim state or pull its hub button.
3. **[P1, S]** Fix the `'my kart'` / `'my bike'` sentinel mismatch so skipped
   onboarding never prefills the setup sheet; centralise the constant.
4. **[P1, S]** Kart/driver copy sweep (findings 6 + QA quiz line) and unify the
   coach feature name to "Driver Coach".
5. **[P1, M]** Tab bar icons in both apps (shared change, parity preserved);
   fold the hub-hierarchy redesign (finding 4) into the J2.1 KartSetupHubScreen
   build rather than touching the doomed placeholder.

All layout-touching fixes: gate with `npx tsc --noEmit` in `app/` and
`android-app/` + manual on-device check (Hermes cannot run simulators):
fresh-install onboarding walkthrough, hub → each tool and back, tab bar at
max Dynamic Type / font scale, outdoors-brightness glance test.

## Out of scope this week

- The J2.1 Kart Setup tool screens (KartSetupSheet / KartAnalysis / History)
  aren't built yet — reviewed the shipped placeholders instead. The spec's UX
  rules (one highlighted "do this next" card, amber warning banners, greyed
  blocked-advice with reasons, bar-primary units) are **endorsed as written**;
  they match doctrine 6–7. Next week's review should walk the built screens.
- Send-It full screen review (only tab-bar parity checked this week).
- Track Details / map screens — pending KartRacer J1 bake.
- Internal identifier renames (Bike* file/route names) — cosmetic to users,
  already tracked in CURSOR_BUILD_JOBS.
