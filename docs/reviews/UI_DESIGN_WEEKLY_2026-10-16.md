# UI Design Weekly Review — 2026-10-16

**Scope:** KartRacer `app/` — Kart Setup Tool cluster re-review after commit `b2af953` (2026-10-13), plus Kart Session Upload lap table. Send-It: no app-code changes in the last 21 days (only landing page/site, calendar, API) — no screen review this week.
**Method:** Read code and diffs only. Hermes cannot run simulators. Contrast ratios computed from the hex values in the code (WCAG 2.x formula).

## Executive summary

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 6 (F1, F2, F3, F4, F6, F9) |
| P2 | 4 (F5, F7, F8, F10) |

**Verdict:** Cursor fixed the touch-target and colour-only-signal items from 10-09, which was good progress. The remaining P1s are all about glanceability. The Run-analysis button is still below a long form, the result has no empty-state cue, and small or low-contrast text is still in several places. The 10-09 P0 is downgraded (see correction below).

## Carry-over from 2026-10-09

| Item | Status |
|---|---|
| 1.3 Chips < 44pt (`KartSetupForm` chip) | **RESOLVED** — `minHeight: 44` and `justifyContent: 'center'` added in `b2af953`. `roleChip` already had 44. |
| History Restore/Delete small targets (new find in same screen) | **RESOLVED** — `linkBtn`/`dangerBtn` minHeight 44, a11y labels added. |
| Lap table colour-only selection (Kart Session Upload) | **RESOLVED** — ✓ prefix, 3px left border, a11y label/state, and hint copy no longer says "Yellow". |
| Calculators lose typed input on tab switch | **RESOLVED** — `ToolPane` keeps panes mounted; hidden panes are removed from the a11y tree. |
| 1.1 Notice text 14pt | **OPEN, severity corrected P0→P1.** Correction: `#93c5fd` on `#0f172a` is **9.9:1**, not ~5.3:1 as stated on 10-09. Contrast is fine. The only issue is 14pt vs the 15-16pt body floor. |
| 1.2 Run analysis below the fold | OPEN (P1) |
| 1.6 No empty state for Advice | OPEN (P1) |
| 1.5 Wet checklist colour-only | OPEN (P1, raised, see F3) |
| 1.4 Selected-tab fill | OPEN (P2). Note: the 10-09 fix text suggested `#0f172a` fill, which is identical to the screen background. Use `#422006`, matching `chipOn`. |
| 2.1 `source` `#64748b` on `#1e293b` | OPEN. Measured **3.07:1**, fails AA. |
| 3.1 History `hint`/`diffRow` 12pt | OPEN |
| 4.1 RiderCoach hub identical buttons | OPEN |
| 5.1 Role chip a11y label | OPEN. `BikeSetupHubScreen` has no `accessibilityLabel` on the role chips (lines 107/115). |
| Send-It HomeHeader a11y parity | Not re-checked (no Send-It app changes). |

## Trend / competitor watch

- **Material 3 Expressive (Android 16)** — **WATCH.** Google's own launch copy stresses "glanceable, helpful information" and spring motion. We are on React Navigation, so we get none of it for free. No action until the RN/Expo M3 component story matures. Do not hand-roll it.
- **NN/G sticky UI guidance** — **ADOPT (principle).** The current NN/G sticky-header guidance says persistent elements work when unobtrusive, high-contrast and minimally animated. That supports a sticky "Run analysis" bar on the setup form (F1). Constraint: keep it one row, no animation.
- **iOS 26 Liquid Glass** — **WATCH (unchanged).** Content layer stays solid slate. Sticky CTA bar should be a solid panel (`#0f172a`, top hairline), not glass.
- **Strava / Whoop / Garmin summary-first cards** — **WATCH.** Carried from 10-09. The principle (headline stat first) maps to F2.
- **Hype flag:** Dribbble Liquid Glass content-card concepts — **SKIP**. They break Apple's HIG layering rule.

Nothing new found this week beyond the above, and I did not dig deeper into F1 TV or MotoGP.

## Per-screen findings

### `KartSetupToolScreen`

**F1 (P1, M). Run analysis is below the fold.**
- *Wrong:* `run` button (line 454) sits after the symptom grid or pressure/temp grids. The advice panel then renders below it, so the result may be off-screen.
- *Why:* Doctrine §2 (taps-to-goal) and §6 (gloves, 30 s between heats). NN/G supports persistent, high-contrast action elements.
- *Fix:* Pull the `run` button out of the `ScrollView` into a bottom bar. The bar is a sibling view with `paddingBottom` set from `useSafeAreaInsets()`, `backgroundColor: '#0f172a'`, `borderTopColor: '#1e293b'`. Keep `minHeight: 52`. Give the `ScrollView` `paddingBottom` of at least the bar height. After `setRan(true)`, use a `ScrollView` ref to scroll to the Advice panel (via `onLayout` y), not to y=0 as 10-09 suggested. The form is long, so y=0 would hide the result.
- *Verify:* `npx tsc --noEmit` in `app/` and `android-app/`, then on-device check: iPhone SE size, Android gesture nav, keyboard open (bar must not float over inputs).

**F2 (P1, S). No empty state for Advice.**
- *Wrong:* Before analysis, nothing marks where results will appear.
- *Why:* Doctrine §2 (all states designed).
- *Fix:* When `!ran`, render a panel with `Text` "Advice appears here after you tap Run analysis." in `#94a3b8` 14pt. Use `#94a3b8`, not the `#475569` suggested on 10-09, which is only about 2.4:1 on `#1e293b` and would fail AA.

**F3 (P1, S). Wet checklist matched/warn differ only by colour (line 282).**
- *Wrong:* `ok` `#86efac` vs `warn` `#fbbf24`, both 13pt, same shape. Raised from P2 because the wet checklist is a safety-adjacent paddock cue.
- *Why:* Doctrine §5 (colour never the only signal).
- *Fix:* Prefix `✓ ` / `⚠ ` in the text, raise to 14pt/`lineHeight: 20`, and add `borderLeftWidth: 3` in the matching colour (same pattern Cursor already used for the lap table).

**F4 (P1, S). Notice text 14pt (line 471).**
- *Fix:* `fontSize: 15`, `lineHeight: 22`. Colour stays. Apply the same to `KartSetupHistoryScreen` `notice` (line 360).

**F5 (P2, S). Selected tab fill.** Add `backgroundColor: '#422006'` to the selected `tab` style (match `chipOn`). The selected state is currently border-only.

### `KartSetupHistoryScreen` / `KartSetupCalculatorsScreen` / `KartSessionUploadScreen`

**F6 (P1, S). Sub-13pt text.**
- *Where:* History `hint` and `diffRow` (12pt). Session Upload `hint`, `cell` (12pt) and a 11pt header style (lines 360/435/446). Calculators `source` (11pt).
- *Why:* Doctrine §3. Lap times and diffs are the data a racer reads at arm's length.
- *Fix:* Lap `cell` → 14pt (it is the core data of the table). Other hints → 13pt, matching `setupFormStyles.hint`. Verify the table does not wrap at 375pt width.

**F7 (P2, S). `source` colour `#64748b` on `#1e293b` is 3.07:1 (Calculators line 411, Upload line 452).** Change to `#94a3b8` (5.71:1).

**F8 (P2, S). Units tab has no context line.** Add: "Quick conversions for tyre gauges, pyrometers and setup tables." (Carried from 10-09.)

### `RiderCoachScreen` and `BikeSetupHubScreen`

**F9 (P1, M). Four identical `navButton`s (RiderCoachScreen lines 108-122).**
- *Why:* Doctrine §2 and §3, with one primary action per screen. `BikeSetupHubScreen` already uses a primary card plus secondary rows.
- *Fix:* Make "KartRacer Coach" the primary card. Make the other three secondary rows with a subtitle.
- *Fork cost:* Send-It's `RiderCoachScreen` has the same four-button pattern. Flag before implementing. Divergence is justified for KartRacer (junior audience), but note it in the parity docs.

**F10 (P2, S). Role chips lack `accessibilityLabel`** (`BikeSetupHubScreen` lines 107/115). Add "Advisor mode" and "Engineer mode".

## Top 5 fixes for Cursor (impact / effort)

1. **F1.** Sticky "Run analysis" bar plus scroll-to-Advice (M).
2. **F6 + F4.** Raise all sub-13pt data/hint text and the notice to 15pt (S, several files).
3. **F3.** Wet checklist: ✓/⚠ prefix, left border, 14pt (S).
4. **F2.** Advice empty-state panel (S).
5. **F9.** RiderCoach hub hierarchy (M, flag Send-It fork cost).

## Out of scope this week

- Send-It app screens (no app-code commits in the last 21 days; Send-It `docs/reviews/SITE_DESIGN_2026-10-15.md` covers the web landing page).
- `OnboardingScreen`. The `b2af953` diff only renamed an activity type. The 1168-line file needs its own dedicated review. Note: the "I race 🏁" and "Practice / club days 🛞" options rely on emoji. Check these with VoiceOver in that review.
- `TrackMapView`, `TrackCornerSheet`, `CoachChatScreen`, `HeadlinesScreen`.
- `android-app/` is a mirror of `app/`, so findings apply to both. Not separately reviewed.
- No simulator or device run was possible. All findings are from code and computed contrast only.

*Report only. Gates for any layout change: `npx tsc --noEmit` in `app/` and `android-app/` plus an on-device manual check.*
