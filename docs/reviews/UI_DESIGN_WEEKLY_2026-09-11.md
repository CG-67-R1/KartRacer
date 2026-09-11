# UI Design Review — Weekly — 2026-09-11

Scope: **KartRacer `app/` — new Kart Setup Tool screen** (`KartSetupToolScreen.tsx`
+ `KartSetupAdviceList.tsx`, shipped in `4ea0212 feat: place kart art and remove
bike setup sheet`) judged against `docs/KART_SETUP_TOOL_BUILD_SPEC.md`, plus
carry-over verification of every finding from `UI_DESIGN_WEEKLY_2026-09-10.md`.
Send-It: no `app/` UI changes since last review (recent commits are track-details
data bakes) — not re-reviewed this week.

## Executive summary

**P0: 2 | P1: 4 | P2: 3.** The new Kart Setup Tool is a faithful build of the
spec's Analysis screen — designed empty state, one highlighted "do this first"
card, greyed blocked advice with reasons, wet checklist — **but its numeric
inputs cannot accept decimal values**, which makes the Pressures mode (bar,
0.60–1.50 range, 0.05 steps) effectively unusable: typing `0.85` yields `85`.
That's a new P0. The other P0 is a week-2 escalation: the **RoadRace brand leak
in onboarding copy is still shipping in both app trees** despite being last
week's #1 fix. Everything else from last week is either resolved (placeholder
title gone ✔, setup-sheet prefill bug resolved by removing the sheet ✔) or
still open and re-listed below.

## Carry-over status (from 2026-09-10)

| Last week's finding | Status |
|---|---|
| 1. P0 RoadRace copy in onboarding | **STILL OPEN — week 2.** `OnboardingScreen.tsx` lines 158/160/430/486 in BOTH `app/` and `android-app/` still render "RoadRace". Escalating: this is a 10-minute copy fix blocking parent trust and store metadata consistency. |
| 2. "(placeholder)" nav title | **RESOLVED ✔** — route now titled "Kart Setup Tool", wired to the real `KartSetupToolScreen`. |
| 3. `'my kart'` prefill into setup sheet | **RESOLVED by removal ✔** — `BikeSetupSheetScreen` deleted. Residual P2: sentinel still inconsistent (`OnboardingScreen` falls back to `'my kart'`, `HeadlinesSettingsScreen` line 122 to `'my bike'`). |
| 4. Hub hierarchy (equal-weight buttons) | **OPEN** — now four buttons, still identical amber-bordered rows, still RaceSport 17pt. Fold into J2.1 KartSetupHubScreen as planned. |
| 5. Tab bar icons (both apps) | **OPEN** — no `tabBarIcon` anywhere in either App.tsx. |
| 6. Residual bike/rider copy | **OPEN** — HeadlinesScreen "your bike" (~84, ~111), QAScreen "track rider" (~703), CoachChat title still flips "AI Coach"/"Kart Setup" (App.tsx ~170). |
| 7–9. P2 polish items | Open, unchanged. |

## Trend / competitor watch (this week's rotation)

| Item | Verdict | Notes |
|---|---|---|
| **NN/g "A Checklist for Designing Mobile Input Fields"** (nngroup.com/articles/mobile-input-checklist) | **ADOPT** | Directly drives finding 1 below: numeric fields must never destroy in-progress input; parse on commit (blur/submit), not per keystroke. Also endorses our existing `decimal-pad` keyboard choice and placeholder step-hints — keep those. |
| **Material 3 segmented buttons** (m3.material.io/components/segmented-buttons) | **WATCH** | M3 recommends segmented buttons for 2–5 mutually exclusive options — exactly our Wheelbase/Front track/Caster/Axle rows. Current ChipRow is functionally fine (44pt+ targets, clear on-state); equal-width segments would only marginally improve scan. Not worth a component now; revisit if the J2.1 sheet build introduces a segmented control anyway. No hype risk. |
| **Apple Liquid Glass (iOS 26)** | **WATCH (unchanged)** | Carry-over from last week; still waiting on Expo SDK support. No action. |

## Per-screen findings — KartSetupToolScreen (new)

### 1. P0 — Decimal entry is impossible in every numeric field

- **What's wrong:** `OptionalNum` (KartSetupToolScreen.tsx ~81–113) is a
  controlled input that parses on every keystroke and renders
  `String(value)` back. Typing `0.` → `Number('0.')` = `0` → re-renders as
  `"0"`, eating the decimal point. Typing `.85` → `Number('.')` = NaN → field
  clears. Net effect: **no fractional value can ever be typed.** The Pressures
  mode labels its grid "Cold / hot pressures (bar)" with step hint `0.05` —
  every legal kart pressure (0.60–1.50 bar) is fractional, so the mode's core
  inputs are unusable. Temps (e.g. 55.5 °C) and Air/Track °C are degraded too.
- **Why it matters:** Doctrine 2 (flow beats decoration — the screen's one job
  fails) and NN/g mobile-input checklist (ADOPT above): the field must accept
  what the user types and validate on commit, not fight each keystroke. A
  racer between heats will type `0.85`, see `85`, and either distrust the tool
  or feed the advisor garbage (85 bar silently analysed).
- **Fix:** Keep a **string** in component state; parse only on `onEndEditing`/
  blur (or when "Run analysis" is pressed):
  `const [text, setText] = useState(value == null ? '' : String(value))` +
  `onChangeText={setText}` + commit `Number(text)` if finite else `null`; sync
  `text` from `value` prop via effect only when they differ numerically.
  Mirror the identical component in `android-app/src/screens/KartSetupToolScreen.tsx`
  (same code, line ~100). Verify: `npx tsc --noEmit` in both trees + on-device:
  type `0.85` into FL cold and confirm it displays and persists as 0.85 after
  app restart. — **Effort: S**

### 2. P1 — Compound-window hint leads with psi while inputs are bar

- **What's wrong:** The hint (~217) renders "LH03: 9.5–11 **psi** cold
  (0.66–0.76 bar)" but the pressure grid is labelled and entered in **bar**.
  Spec is explicit: "Units: bar primary, psi secondary in parentheses."
- **Why it matters:** Doctrine 7 (one glanceable summary): the user reads a
  psi target, then must mentally convert to type bar — a needless error source
  at the exact moment (between heats) the tool exists to protect. Spec
  non-compliance too.
- **Fix:** Swap order: `` {window.coldBar.min.toFixed(2)}–{coldBar.max.toFixed(2)} bar cold ({coldPsi.min}–{coldPsi.max} psi) ``.
  Same in android-app. — **Effort: S**

### 3. P2 — Advice list shows all cards expanded, spec asks for collapsed rest

- **What's wrong:** `KartSetupAdviceList` highlights `advice[0]` with the
  "Do this first" kicker (good) but renders every remaining card fully
  expanded. Spec UX rule: "ONE highlighted 'do this next' + collapsed rest."
- **Why it matters:** Doctrine 7 (progressive disclosure) and doctrine 6: the
  engine enforces one-change-at-a-time; a wall of equally detailed cards
  invites a junior to change three things. The blocked section and warnings
  are correctly built — this is the last gap versus spec.
- **Fix:** Cards after index 0 render title + lever/direction line only, with
  a "More" chevron expanding `why` + source (simple `useState<Set<string>>`
  of expanded ids). — **Effort: S/M**

### 4. P2 — Chips and inputs lack accessibility semantics

- **What's wrong:** ChipRow / symptom chips are `TouchableOpacity`s with no
  `accessibilityRole="button"` / `accessibilityState={{ selected }}`; ArtThumb
  images have no `accessible={false}` decoration marking; hint text is 12pt.
- **Why it matters:** Doctrine 5 — selected state is currently colour-only to
  a screen reader; WCAG/HIG require the state be programmatically exposed.
- **Fix:** Add role + selected state to chip components (one shared change:
  `ChipRow` here and `components/ChipRow.tsx`), mark art decorative, lift hint
  text to 13pt. — **Effort: S**

### 5. Endorsements (no action)

Designed empty state ("Pick at least one handling symptom" comes back through
the warnings channel — never a blank panel ✔); wet-vs-slicks amber warning ✔;
blocked cards greyed with "Already at the limit" reason ✔; 950/Bambino
polarity note badge ✔; kbSource line on every card ✔; Run button 52pt ✔.
This matches the spec's UX rules and doctrine 6–7 — good build.

## Top 5 fixes for Cursor (impact ÷ effort)

1. **[P0, S]** Fix `OptionalNum` decimal entry (string state, parse on commit)
   in both app trees — the Pressures mode is unusable until this lands.
2. **[P0, S — week 2]** Replace all rendered "RoadRace" strings in
   OnboardingScreen (copy + enquiry email subject/body), `app/` **and**
   `android-app/`. Ten-minute fix, brand-trust and store-review risk.
3. **[P1, S]** Compound hint: bar first, psi in parentheses (spec rule).
4. **[P1, S]** Copy sweep carry-over: HeadlinesScreen "your bike"→"your kart",
   QAScreen "track rider"→"track driver", unify coach title to "Driver Coach";
   align the `'my kart'`/`'my bike'` sentinel to one exported constant.
5. **[P1, M]** Tab bar icons in both apps (carry-over; shared-shell change,
   parity preserved) — pairs with the P2 gear-icon Settings affordance.

All layout-touching fixes: verify with `npx tsc --noEmit` in `app/` and
`android-app/` + manual on-device check (Hermes cannot run simulators): enter
`0.85` cold pressure and confirm display/persistence; run each analysis mode
empty and populated; VoiceOver/TalkBack pass over the chip rows; outdoor-
brightness glance test on the advice cards.

## Out of scope this week

- J2.1 KartSetupSheetScreen / KartSetupHistoryScreen — not built yet; review
  when they land (hub hierarchy fix rides with them).
- Send-It screen review (no UI changes since last week).
- Track Details / map screens — pending KartRacer J1 bake.
- Internal Bike* identifier renames — tracked in CURSOR_BUILD_JOBS.
