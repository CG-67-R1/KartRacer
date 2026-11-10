# UI Design Weekly Review — 2026-10-09

## Executive Summary

**Scope:** KartRacer iOS app (`app/`) + Send-It (`Send-It/app/`) — Kart Setup Tool cluster (new since Aug 2026), shared navigation chrome, and Home/hub screens.

| Severity | Count |
|---|---|
| P0 (unusable / harmful) | 1 |
| P1 (hurts the experience) | 6 |
| P2 (polish) | 5 |

**One-line verdict:** The Setup Tool cluster delivers strong functional depth but is still a long form masquerading as a paddock tool — juniors and glove-wearing engineers both need quick-glance results that are buried below the fold. Fix the notice text size and the "Run analysis" scroll distance; the rest is progressive polish.

---

## Prior Reviews

None — this is the first weekly run. No carry-over items.

---

## Trend / Competitor Watch

### Platform: iOS 26 Liquid Glass (Apple HIG, WWDC25 "Meet Liquid Glass")
**SKIP (now) / WATCH (Q1 2027)**
Liquid Glass is live in iOS 26. Core rule: Liquid Glass belongs to the *functional layer* (tab bars, nav bars, action sheets) — not the content layer. Our dark Slate (#0f172a) content backgrounds are correct and should not adopt Glass effects. Tab bars and nav bars built on React Navigation will eventually pick this up via Expo SDK when RN updates its UIKit bridging. No action needed until Expo SDK 58+. Monitor: if users report visual glitches at the tab bar on iOS 26 devices, flag to Cursor.
- **Applicable note:** iOS 26 replaces hard `borderTopColor` divider lines on tab bars with scroll-edge blur. Our current `borderTopColor: '#1e293b'` hairline will remain functional but will look slightly dated on iOS 26 devices. Low urgency.

### Platform: Material 3 Expressive (Android 16 / Google I/O 2026)
**WATCH**
M3 Expressive ships springy, physics-based motion on dismiss/fling gestures and volume-slider fidget. Our `android-app/` uses React Navigation — we get none of the native spring physics automatically. Not an adoption blocker today but worth noting: M3 Expressive's emphasis on "glanceable, helpful information" aligns directly with our paddock-tool doctrine. Worth reviewing when RN adopts M3 Expressive components in ~2027. Garmin Connect's 2026 redesign (noted in their newsroom) shifts toward a summary-card-first layout — reinforces our own P1 finding about buried analysis results.

### Competitor: F1 app / MotoGP app paddock data tools
**WATCH**
Searched; no specific new UX patterns found in public 2026 tooling data beyond card-first, progressive-disclosure layouts for session data (confirmed pattern). Strava's activity summary card puts the most important stat (time/distance) at top in a single bold number — the same principle we're failing on in the Setup Tool (the result is at the bottom after scroll). **ADOPT** the summary-stat-first card model on the Advice panel.

### Competitor: Duolingo (junior gamification)
**WATCH**
Duolingo's 2026 streak / progress system continues to show that: (a) immediate success feedback (green flash, sound) keeps juniors coming back; (b) one clear win per session. Our Kart Setup Tool gives advice as plain text below the fold after pressing "Run analysis" — junior users will not scroll to find it. Not proposing Duolingo gamification wholesale, but the **immediate result visibility** principle applies directly. See F1 below.

### Hype flag: Liquid Glass in third-party apps
**SKIP**
Numerous Dribbble concepts apply Liquid Glass to full-screen content cards. This violates Apple's own HIG ("don't use Liquid Glass in the content layer"). Do not follow these trends — our solid-panel cards (`#1e293b`, `borderRadius: 10`) are correct per HIG.

---

## Per-Screen Findings

### 1. `KartSetupToolScreen` (main advisor tool)

**Walked as:** (a) First-time user — a junior or their parent opening the app for race day. (b) Returning engineer mid-session (gloves, sunlight, 30 s between heats). (c) Junior (8-16) self-using.

---

#### 1.1 Notice text below size minimum — **P0**
**What's wrong:** The advisory notice text at the top of `KartSetupToolScreen` uses `fontSize: 14` and `color: '#93c5fd'` (a mid-brightness blue on a near-black `#0f172a` background). At 14px/pt this is below the 15-16pt minimum for body text (doctrine point 3) and below WCAG AA for body text.

**Contrast check:** `#93c5fd` on `#0f172a` = approximately 5.3:1 which passes AA for large text (≥18pt or 14pt bold) but this is 14pt regular weight — it technically falls just inside normal text WCAG AA (4.5:1) only if we treat it as a UI label. However on a real device at race-track brightness (bright sun = screen dims / eyes dilate), this will fail in practice.

**Why it matters:** This notice contains safety-critical advice ("Confirm it is not the driver before rewriting the chassis. Change one thing"). If a junior or a gloved engineer misses this, they may misuse the tool. Doctrine §3 (hierarchy: size first) + §6 (juniors, sunlight readability).

**Fix:** Increase to `fontSize: 15`, `lineHeight: 22`. Either keep the blue at brighter `#bfdbfe` or change to near-white `#e2e8f0` for true sunlight safety. Same fix applies to all `notice`-style text across all setup screens and `KartSetupHistoryScreen`. Effort: **S**

---

#### 1.2 "Run analysis" button buried below the fold — **P1**
**What's wrong:** The "Run analysis" `TouchableOpacity` appears after the mode tabs + the full symptom chip grid (on 'driving' mode, this is 8-12+ chips) or the full 8-field pressure grid. On a standard 390pt-wide iPhone, the button sits 60-80% down a very long scroll. A user mid-session must: fill symptoms → scroll down → tap → scroll back up to see the result panel. Three scrolls for one analysis.

**Why it matters:** A paddock tool used in gloves, under time pressure, should have its primary action (Run analysis) persistently visible, not scroll-to-reach. Compare: Strava's "Save Activity" button uses a sticky footer. RaceChrono's analysis trigger is fixed at the bottom. Doctrine §2 (taps-to-goal, thumb reach) + §6 (gloves, sunlight, 30 s between heats).

**Fix:** Make "Run analysis" a **sticky bottom bar** (fixed above the tab bar using `position: 'absolute'`, `bottom: 0`, respecting the tab bar height via `useBottomTabBarHeight` from React Navigation). The result panel `<KartSetupAdviceList>` then sits at the top of the scroll after tapping — consider scrolling the `ScrollView` to `y=0` after `setRan(true)`. Effort: **M** (sticky CTA + scroll-reset). Verify with `npx tsc --noEmit` + on-device check (iOS + Android).

---

#### 1.3 Symptom chips: touch target too small for gloves — **P1**
**What's wrong:** The symptom `chip` style has `paddingVertical: 8, paddingHorizontal: 10` and `fontSize: 13`. For chips without art (`chipArt` class), the touch area is approximately 34-36pt tall. iOS HIG requires ≥44pt; Android 48dp. In the symptom grid, chips without art images are sub-44pt.

**Why it matters:** Junior using setup tool in the paddock, possibly in karting gloves or in a hurry between heats. Doctrine §6 (juniors, bigger targets) + iOS HIG 44pt minimum.

**Fix:** Add `minHeight: 44` to the `chip` style unconditionally (currently only `chipArt` has `paddingVertical: 10`; plain chip relies on `paddingVertical: 8`). Apply same fix to `ChipRow` component base `chip` style in `KartSetupForm.tsx`. Also applies to the `roleChip` in `BikeSetupHubScreen`. Effort: **S** — one line per style. Verify with `npx tsc --noEmit` + on-device check.

---

#### 1.4 Mode tabs (Driving / Pressures / Temps) width too narrow on small phones — **P1**
**What's wrong:** The `tabs` style uses `flexDirection: 'row', gap: 8` and each `tab` has `flex: 1`. On a 375pt iPhone SE screen, three equal-flex tabs give each ~117pt wide. At `fontSize` not set in tab (inherits or falls back), text may be truncated. More critically the tab text is `fontSize: 13` (from nearby `tabText`) and on Android the `KartSetupCalculatorsScreen` has five tabs in a `flexWrap: 'wrap'` row — 'Jet / RAD', 'Premix', 'Scales', 'Caster', 'Units' — which wraps unpredictably.

**Why it matters:** A two-line or wrapped tab row is disorienting. The currently selected state (amber border only, no background fill) is hard to read in sunlight. Doctrine §3 (hierarchy: colour is last, not only), §6 (sunlight readability).

**Fix (two parts):**
1. KartSetupToolScreen 3-tab row: currently OK on width but add `backgroundColor: '#0f172a'` (same as `#0f172a`) as a fill on the selected tab (not just a border) so it reads under glare.
2. KartSetupCalculatorsScreen 5-tab row: keep `flexWrap: 'wrap'` but add `minWidth: 80` to `tab` style to prevent squishing below 80pt. Consider icon + label on each to reduce reliance on word recall.
Effort: **S/S**.

---

#### 1.5 Wet checklist items use emoji-free plain text — **P2**
**What's wrong:** `wetPresetChecklist` items render as `"Matched · Seat height (now stiff, target soft)"` — dense, scan-unfriendly. The 'ok'/'warn' colour distinction is the only signal, violating doctrine §5 (colour never the only signal).

**Why it matters:** A wet-weather session is exactly the moment a junior or parent reads this under stress. Missing a warning because the text is dense = safety/performance risk.

**Fix:** Prefix each warn item with a ⚠️ character and each ok item with ✓. Or — preferably — use a left-border accent on warn items (`borderLeftWidth: 3, borderLeftColor: '#fbbf24'`) so colour is redundant with shape. Effort: **S**.

---

#### 1.6 No loading / empty state for the Advice panel — **P1**
**What's wrong:** Before "Run analysis" is pressed, the advice panel is simply absent. There is no visual cue that analysis output will appear *below* after pressing. A first-time user cannot know where to look. After pressing, there is also no loading state — the result appears synchronously (`useMemo`) but a future async analysis would have no spinner.

**Why it matters:** Doctrine §2 (all states designed: loading/empty/error/success). First-time user flow: they see a form with no obvious "what happens next" signal below the button.

**Fix:** Add a placeholder panel below "Run analysis" that says "Tap 'Run analysis' to get advice" in `#475569` text. After `ran = false` → shows placeholder. After `ran = true` → shows advice. Also matches the 3-user test: a first-time user scanning the screen will see a preview of where results appear. Effort: **S**.

---

### 2. `KartSetupCalculatorsScreen`

#### 2.1 Stat output at 16pt bold is correct but source text is too small — **P2**
**What's wrong:** `styles.source` is `fontSize: 11, color: '#64748b'`. The contrast of `#64748b` on `#1e293b` (the panel background) is approximately 3.3:1 — below WCAG AA (4.5:1) for body text.

**Why it matters:** Source attribution for KB formulas matters — juniors' parents need to know where the number came from. Doctrine §5 (WCAG AA 4.5:1).

**Fix:** Either raise to `#94a3b8` (≈ 4.6:1 on `#1e293b`) or increase `fontSize` to 12. Effort: **S**.

#### 2.2 UnitsPanel has no "why is this here" context — **P2**
**What's wrong:** The Units tab opens to a raw converter (bar↔psi, °C↔°F, kg↔lb, mm↔in) with no context. A junior opening this has no idea when to use it.

**Why it matters:** Doctrine §2 (can a first-time user orient in 5 s?).

**Fix:** Add a one-line hint at the top: `"Quick conversions for pyro readings, tyre gauges, and setup tables."` Effort: **S**.

---

### 3. `KartSetupHistoryScreen`

#### 3.1 `hint` text is 12pt — **P1**
**What's wrong:** `styles.hint` in `KartSetupHistoryScreen` uses `fontSize: 12, lineHeight: 17`. This is the smallest text in the codebase and it is used for snapshot metadata (when saved, wheelbase, grip, track name, note). Across the app, the equivalent `hint` style in `setupFormStyles` uses 13pt — this screen is inconsistent and below the readable minimum for a racer holding a phone at arm's length.

**Why it matters:** Doctrine §3 (hierarchy: body text ≥15-16pt; functional labels ≥13pt). 12pt is below the functional label floor even for de-emphasised text.

**Fix:** Raise `fontSize` from 12 → 13 in `KartSetupHistoryScreen`'s `styles.hint` and `styles.diffRow`. Effort: **S**.

---

### 4. `RiderCoachScreen` (Driver Coach hub)

#### 4.1 Hub is a list of identical `navButton` blocks — **P1**
**What's wrong:** The Driver Coach hub renders four identically-styled amber-bordered rectangles: "KartRacer Coach", "Track Prep", "Kart Setup Basics", "Track Details". There is no visual differentiation — no icon, no subtext, no art thumb. All buttons read the same weight. A first-time user has no idea which is most important.

**Why it matters:** Doctrine §2 (one primary action per screen). Doctrine §3 (hierarchy: if everything is bold, nothing is). Compare: `BikeSetupHubScreen` already does this correctly — it has one large primary `Kart Setup Tool` button with art + description, then secondary rows with smaller art + subtitle text.

**Fix:** Mirror the `BikeSetupHubScreen` pattern. Make "KartRacer Coach" a primary card (large, with `ArtThumb`). Make Track Prep, Kart Setup Basics, and Track Details secondary rows (art thumb + title + subtitle). The RaceSport font on all four `navButtonText` currently over-emphasises every option equally. Effort: **M** — layout restructure, no logic change. Verify `npx tsc --noEmit` + on-device check.

*Note:* This fix affects RiderCoachScreen in KartRacer only. The equivalent `RiderCoachScreen` in Send-It uses the same four-button list for different features. Before implementing, flag the fork cost: if we change the hub layout in one app, we should update both for parity unless the KartRacer junior audience specifically demands the divergence (which it does — simpler hierarchy for juniors is more valuable here).

---

### 5. `BikeSetupHubScreen` (Kart Setup tab hub)

#### 5.1 Role picker ("Advisor" / "Engineer") has no accessibility label — **P2**
**What's wrong:** `roleChip` buttons have `accessibilityRole="button"` and `accessibilityState={{ selected: ... }}` but no `accessibilityLabel`. VoiceOver reads "button, selected" without context.

**Why it matters:** Doctrine §5 (VoiceOver/TalkBack labels on interactive elements).

**Fix:** Add `accessibilityLabel="Advisor mode"` / `accessibilityLabel="Engineer mode"` to each chip. Effort: **S**.

---

## Send-It Cross-Check

Send-It recently shipped Track Details (UK circuits) and the `08d0947e` bake, plus `TyreWearAnalysisScreen` (new screen). Not reviewed in detail this week but one flag:

- **Send-It `HomeHeader` vs KartRacer `HomeHeader`:** KartRacer's settings button uses `accessibilityRole="button"` and `accessibilityLabel="Profile and settings"` ✓. Send-It's equivalent uses `hitSlop={8}` but has neither `accessibilityRole` nor `accessibilityLabel` on the settings `TouchableOpacity` (line 79-85 in Send-It `App.tsx`). **P2 parity gap.** Fix in Send-It to match KartRacer.

---

## Top 5 Fixes for Cursor — Ordered by Impact / Effort

| # | Fix | Screen(s) | Effort | Priority |
|---|---|---|---|---|
| 1 | **Raise all `notice` text to `fontSize: 15`, `color: '#bfdbfe'` or `'#e2e8f0'`** — sunlight-safe sizing for safety-critical advice | All setup screens | S | P0 |
| 2 | **Make "Run analysis" a sticky bottom CTA; scroll-reset to top after tap** — removes 3-scroll pattern, critical for glove use | `KartSetupToolScreen` | M | P1 |
| 3 | **Add `minHeight: 44` to base `chip` style** in `KartSetupForm.tsx` `ChipRow` + `roleChip` in `BikeSetupHubScreen` | KartSetupForm, BikeSetupHubScreen | S | P1 |
| 4 | **Restructure `RiderCoachScreen` hub** — 1 primary card + secondary rows, matching `BikeSetupHubScreen` pattern | KartRacer RiderCoachScreen (flag Send-It fork cost) | M | P1 |
| 5 | **Raise `hint` in `KartSetupHistoryScreen` to 13pt; raise `source` text to `#94a3b8`** — contrast + readability | KartSetupHistoryScreen, KartSetupCalculatorsScreen | S | P1/P2 |

---

## Out of Scope This Week

- `TrackMapView`, `TrackCornerSheet`, `TrackMemoryHubScreen` — track map rendering; reserved for a dedicated Track Details review.
- `HeadlinesScreen` avatar / kart photo feature — extensive; needs its own session.
- `GearingGuideScreen`, `KartSessionUploadScreen` — not recently changed; deferred.
- Android `android-app/` screens — identical to `app/` by design; findings above apply but not separately reviewed.
- `TyreWearAnalysisScreen` (Send-It) — new screen; deserves dedicated review pass once usage data is available.
- `CoachChatScreen` — chat UI has its own review considerations; deferred.

---

*Report only. No source edits outside `docs/reviews/`. Cursor implements.*
*Gates: `npx tsc --noEmit` (in `app/` and `android-app/`) + on-device manual check for any layout change.*
