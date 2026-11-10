# UI Design Review — KartRacer + Send-It
**Date:** 2026-10-01  
**Scope:** KartRacer Setup Tool screens (KartSetupToolScreen, KartSetupCalculatorsScreen, KartSetupSheetFields, KartSetupAdviceList, KartSetupVenuePanel, KartSetupWeatherImport, TrackCornerSheet) — first review since project inception; no prior reviews to carry forward.  
**Reviewer:** Hermes UI Designer (report-only; Cursor implements)

---

## Executive Summary

**P0: 0 | P1: 5 | P2: 6**

The kart setup tool is functionally solid — the engine logic, weather import, and history/snapshot system are all genuinely useful. The core UX problem is **information overload on a single long scroll**: `KartSetupToolScreen` is ~550 lines of JSX in one `<ScrollView>`, asking the user to scroll past setup inputs, weather, wet checklist, mode tabs, symptom pickers, pressure grids, and advice — before they can act on a result. A paddock user in gloves cannot reliably reach the Run Analysis button or find the advice section without extensive scrolling.

The **Calculators screen** has the opposite problem: 5 tab categories across a wrapping chip row that is easy to mis-tap at 40 dp and has no visible active affordance from a distance.

**Junior/parent user path** is undesigned — there is no progressive disclosure for a first-time Cadet parent; every field appears at once. Duolingo's proven pattern of "one question per screen" is not applied here.

No WCAG contrast failures were found in the dark palette. Touch targets are generally ≥ 44 pt. Brand consistency between KartRacer and Send-It is maintained (shared colour tokens, component shapes). No P0 issues found.

---

## Trend / Competitor Notes

### iOS 26 — Liquid Glass (WWDC 2025)
**WATCH** — Apple shipped Liquid Glass as the default material for tab bars, toolbars, sheets, and controls in iOS 26. RN/Expo does not yet auto-adopt it (requires native UIKit hosting). The KartRacer bottom-sheet pattern (`TrackCornerSheet` uses `Modal animationType="slide"` over a semi-transparent overlay) is directionally correct for iOS sheets, but the flat `#1e293b` panel background will look dated on iOS 26 devices. **Action when Expo SDK supports it:** add blurView (Expo BlurView) as a drop-in sheet background upgrade. Do not chase the beta — WATCH for Expo SDK 55/56 to expose `UISheetPresentationController` properly. Fork cost: same pattern used in Send-It; any upgrade applies to both.

### Android — Material 3 Expressive (Android 16, stable 2025)
**WATCH** — M3 Expressive adds spring-physics animations, variable-width floating menus, and tab shapes that morph to show selected state. The KartRacer mode-tab row (`Driving / Pressures / Temps`) uses a flat amber border to show selection — M3 Expressive would use a pill-shaped morph. No action now (RN not yet exposing these natively), but Cursor should **not** hard-code tab heights or border-radius in ways that block a future animated upgrade. Current 40 dp min-height tabs are already below Android's 48 dp target — see P1 finding #2.

### RaceChrono / AiM Race Studio 3 (direct comparator)
**ADOPT** — AiM Race Studio 3 mobile app uses a **two-pane pattern**: vehicle/session context always pinned at top, tool content below. KartRacer embeds track + venue context mid-scroll in `KartSetupVenuePanel`, causing it to disappear when the user reaches the symptom picker. Pinning a compact venue + compound header (sticky or in a collapsible card) is a direct lift from the category leader. Effort: M. See finding P1-1.

### Duolingo (junior/parent users)
**ADOPT (Cadet path only)** — Duolingo's pattern of presenting exactly one task per screen with a clear progress indicator reduces cognitive load for first-time and junior users. The current onboarding already uses step dots, but the setup tool itself presents all fields at once. A "Quick Advisor" entry path (ask one symptom at a time, like Duolingo's one-question-per-lesson) is applicable for parents of Cadets. This is a **new feature** not a layout change — flag to Cursor as J2.1 extension, scope L.

### Apple Fitness / Garmin Connect (data-dense dashboards)
**WATCH** — Both show a glanceable "today" stat block above the fold (one big number + context) before the detail view. The KartRacer advice result panel does have a "Do this first" kicker, but it only appears after scrolling past all inputs. The pattern to steal: surface the top advice result as a sticky summary card once analysis is run. Effort M (requires scroll coordination).

### Strava (segment/activity UX)
**SKIP** — Strava's UX is optimised for post-session review (beautiful charts, social). KartRacer's use case is pre-session and in-session data entry. Different flow, wrong model for this app.

---

## Per-Screen Findings

---

### KartSetupToolScreen

#### P1-1 — Venue context buried mid-scroll; no sticky header
**What:** `KartSetupVenuePanel` (track picker, snapshot tools, here-before history) is rendered in-flow between `notice` text and the Setup section. On a 390 dp phone with 20+ setup controls below it, the user loses venue context when they scroll to symptom selection or the Run Analysis button. The compound pressure window card also vanishes.

**Why it matters (doctrine 2, flow beats decoration):** A paddock user grabbing data between sessions cannot glance "Am I on the right track + compound?" without scrolling back. AiM Race Studio 3 pins session context at top.

**Fix:** Extract track name + selected compound into a 2-line sticky header (`position: absolute` or `stickyHeaderIndices` on the `ScrollView`). Format: `Wodonga K · MG Yellow · 1.05 bar cold window`. Tap to expand venue panel. The full `KartSetupVenuePanel` stays scrollable below.

**Effort: M** — new sticky header component, wire into existing state.  
Verify with: `npx tsc --noEmit` in `app/` + on-device scroll test.

---

#### P1-2 — "Run analysis" button position is unpredictable
**What:** The Run Analysis `TouchableOpacity` (line 454) sits after whichever mode panel is active (driving/pressure/temperature). In driving mode with many symptoms, it can be many screens below the fold. There is no fixed CTA position.

**Why it matters (doctrine 1, platform-native first; HIG: primary action should be consistently placed):** The primary action should have a stable position. Apple HIG recommends a persistent footer button for primary actions on forms. In gloves, the user should not have to hunt for it.

**Fix:** Move "Run analysis" to a fixed footer bar (absolutely positioned, above tab bar safe area). Show it only when the current mode has enough data to run. This mirrors the iOS HIG pattern for form CTAs (see Reminders, Health apps). On Android, this becomes a FAB-adjacent pattern.

**Effort: M** — wrapping layout change; must verify scroll content does not clip behind footer on iPhone SE.  
Verify with: `npx tsc --noEmit` + on-device bottom inset check (iPhone SE + iPhone 15 Pro Max + Android).

---

#### P1-3 — Mode tabs (Driving / Pressures / Temps) fall below Android 48 dp touch target
**What:** `tab` style sets `minHeight: 40` and `paddingVertical: 8`. On Android with font scaling, this can result in a touch target below Material 3's 48 dp minimum.

**Why it matters (doctrine 3, hierarchy; Android Material 3: minimum touch target 48 dp):** A mis-tap between Pressures and Temps in the paddock (gloves, sunlight) causes data entry in the wrong mode — a subtle, frustrating error.

**Fix:** Raise `minHeight` from 40 to 48 in `styles.tab`. Add `paddingVertical: 12` (currently 8). Match the chip pattern used in `KartSetupWeatherImport` which already hits 48 minimum.

**Effort: S**  
Verify with: `npx tsc --noEmit` + visual check that tabs don't clip label text on long-label locales.

---

#### P2-1 — Wet checklist items use plain `Text` with no tap affordance
**What:** Wet checklist items (line 282-291) render as `Text` nodes styled with `ok`/`warn` colour. A user reading "Check · Rear torsion bar" has no way to tap into detail or dismiss items.

**Why it matters (doctrine 2, states):** The checklist has no done/undone interaction — it reads as static copy, not an actionable list. Garmin Connect's pre-activity checklist uses checkmark toggles.

**Fix:** Wrap each item in a `TouchableOpacity` with a leading checkbox icon (Unicode `☐ / ☑` or an SF Symbol equivalent via a library) and a `checked` local state per item. Reset on wet toggle change.

**Effort: M** — new local state array; no setup-engine changes needed.

---

#### P2-2 — "More" / "Less" expand targets on AdviceCard are too small
**What:** `AdviceCard` uses a `Text` node (`styles.more`) for the expand/collapse toggle (line 91–93): `fontSize: 15, fontWeight: '700', paddingVertical: 6`. The 6 pt vertical padding gives an effective tap target of ~27 pt — below HIG 44 pt minimum.

**Why it matters (doctrine 3, touch targets ≥ 44 pt per HIG):** A 27 pt target on a card that the user may be tapping with a gloved thumb in a paddock tent is unreliable.

**Fix:** Wrap the "More" / "Less" `Text` inside a `View` with `minHeight: 44` and `justifyContent: 'center'`, or replace with a `TouchableOpacity` that has `hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}`.

**Effort: S**

---

### KartSetupCalculatorsScreen

#### P1-4 — 5-item tab row wraps unpredictably; selected state is amber border only
**What:** The `tabs` style uses `flexWrap: 'wrap', gap: 8`. On a 390 dp screen with 5 labels ("Jet / RAD", "Premix", "Scales", "Caster", "Units"), wrapping causes an asymmetric 3+2 layout where the bottom row is left-aligned. Selected state is `borderColor: '#f59e0b'` only — a 1 dp line that is nearly invisible in sunlight (doctrine 6, sunlight readability).

**Why it matters (doctrine 3, hierarchy; doctrine 6, sunlight readability):** The selected tab is identifiable only by border colour — a single visual channel. WCAG AA requires contrast ≥ 3:1 for UI component state indicators. Amber on `#1e293b` is approximately 4.5:1 but a 1 dp border at arm's length outdoors is insufficient signalling.

**Fix:** Replace wrapping chip row with a horizontal `ScrollView` (no wrap), each tab min-width auto. Add a background fill for selected state (`backgroundColor: '#1c2a0d'` amber-tinted) in addition to the border — matching the `chipOn` pattern already used in `KartSetupToolScreen`. This is exactly the `ChipRow` component in `KartSetupForm` — **use it** instead of the bespoke tab styles in this screen to enforce consistency.

**Effort: S** — swap to `ChipRow`, remove bespoke `tab` styles.  
Verify with: `npx tsc --noEmit`.

---

#### P2-3 — Weather import duplicated above Calculators tabs (always visible)
**What:** `KartSetupWeatherImport` renders at the top of `KartSetupCalculatorsScreen` unconditionally (line 73), then the Jetting panel also shows air/humidity/hPa override fields (lines 211–226). So weather inputs appear twice in Jetting mode.

**Why it matters (doctrine 2, one primary action per screen; no duplicated affordances):** Duplicate inputs confuse which value is authoritative. The hint "Import weather (or type air / humidity / hPa)" in Jetting implies inputs there override the weather import — but there is no visual connection.

**Fix:** Conditionally show `KartSetupWeatherImport` only when `tool === 'jetting'` (the only tool that uses weather data). For all other tools, hide it. Alternatively, demote it to a collapsible panel in Jetting mode. Also remove the duplicate override fields from `JettingPanel` — the weather import panel already has them.

**Effort: S–M**

---

### TrackCornerSheet

#### P2-4 — Three buttons stacked at bottom (Ask Coach / Edit Note / Close) with no visual separation
**What:** The bottom action area of `TrackCornerSheet` stacks "Ask coach about this corner" (primary CTA, amber fill), "Add a note in Track Walk" (secondary, border only), and "Close" (text link, muted grey). The spacing between secondary and Close is only `marginTop: 8`.

**Why it matters (doctrine 2, one primary action per screen; clear action hierarchy):** Three actions without visual grouping in a bottom sheet is a common pattern but here the destructive/neutral action (Close) is not visually separated from the secondary action (Edit note). On a small phone, the Close tap target (paddingVertical: 12 only, no minHeight) is exactly 44 pt — the bare minimum with no safety margin.

**Fix:** Add `minHeight: 44` to the Cancel style and increase `marginTop: 16` above it (from 8) to create a clear gap between "content actions" and "dismiss". This matches iOS sheet conventions (HIG: destructive/cancel actions have clear separation). Low-effort, high-polish.

**Effort: S**

---

### KartSetupVenuePanel

#### P2-5 — "Save snapshot" button uses `#334155` background (dark grey) — inadequate hierarchy
**What:** The Save Snapshot CTA (`styles.save`) uses `backgroundColor: '#334155'` with white text — identical in luminance to the input field background (`#1e293b` border). In sunlight, the button is nearly indistinguishable from a text field.

**Why it matters (doctrine 3, hierarchy; doctrine 6, sunlight readability):** The primary action on this panel (saving a snapshot) has lower visual weight than the "Ask coach" amber CTA in the corner sheet. Inconsistent primary CTA colour destroys hierarchy across screens.

**Fix:** Apply the same amber CTA pattern as other primary actions: `backgroundColor: '#f59e0b'`, `color: '#0f172a'` (matching `aiBtn` in `TrackCornerSheet` and `run` in `KartSetupToolScreen`). This is a one-line style change.

**Effort: S**

---

### OnboardingScreen — Residual Terminology

#### P2-6 — String residue: `activity === 'just_love_bikes'` and step labels use bike/rider vocabulary
**What:** `ACTIVITY_OPTIONS` (line 44-50 of OnboardingScreen) has `{ value: 'just_love_bikes', label: 'Just love karts' }` — the label says "karts" but the value is `'just_love_bikes'`. The step array has `'bike'` and `'rider'` (line 34-42). `handleFinish` references `favouriteKartOrUnset(favouriteBike)` (line 113) using a bike variable.

**Why it matters:** This is a J5.1 (string sweep) issue but it crosses into UX because the `activity` value stored in AsyncStorage as `'just_love_bikes'` could surface in debugging, crash logs, or future analytics unexpectedly. The AGENTS.md grep guard would catch these in a phase-done check.

**Fix:** Change the value string to `'just_love_karts'` (update `type Activity` union and any switch/if references); rename `favouriteBike` state variable to `favouriteKart`; rename step `'bike'` to `'kart'` and `'rider'` to `'driver'`. This is a search-and-replace within OnboardingScreen.tsx only.

**Effort: S**

---

## Top 5 Fixes for Cursor (ordered by impact/effort)

| # | Fix | Screen | Effort | Why first |
|---|-----|--------|--------|-----------|
| 1 | **Sticky venue + compound header** on KartSetupToolScreen — 2-line pinned context, tap to expand full venue panel | KartSetupToolScreen | M | Highest real-world friction; direct competitive gap vs AiM RS3 |
| 2 | **Fixed-position "Run analysis" footer CTA** — remove from scroll flow; persistent above safe area | KartSetupToolScreen | M | Primary action is lost on every scroll; HIG primary CTA pattern |
| 3 | **Calculators tabs → use ChipRow component** — removes wrapping, adds fill-state selection, enforces consistency | KartSetupCalculatorsScreen | S | Selected tab barely visible outdoors; duplicate component code |
| 4 | **Save Snapshot CTA colour** → amber `#f59e0b` to match all other primary CTAs | KartSetupVenuePanel | S | 1-line fix; brings colour-system coherence |
| 5 | **Mode tab minHeight 40 → 48; paddingVertical 8 → 12** — Android M3 touch target compliance | KartSetupToolScreen | S | Below Material 3 spec; mis-tap risk in gloves |

---

## Out of Scope This Week

- Screen parity audit between `app/` and `android-app/` (components appear mirrored; covered by tsc gate)
- Send-It Track Details rider marks (recently shipped in 1.0.2) — separate week
- Racing line colour / legend readability (separate track-data analyst scope)
- Avatar / kart suit art (J2.5 not yet complete; review when art ships)
- Onboarding full flow review (J2.3 content not yet populated; resume after `onboardingKarts.json` lands)

---

## Notes

All findings require `npx tsc --noEmit` in both `app/` and `android-app/` after any layout change, plus on-device checks (Hermes cannot run simulators). Android-specific changes (touch targets) should be verified in `android-app/` which mirrors the same component set.

No source edits made. Cursor implements from this report.
