# UI Design Review — Weekly — 2026-09-18

Scope: **KartRacer Engineer-mode setup suite** shipped since the last review
(`b4c5351`, `3384f9d`, `30c082f`): `KartSetupCalculatorsScreen`,
`KartSetupHistoryScreen`, `KartSessionUploadScreen`, `KartSetupSheetScreen`,
and the rebuilt `BikeSetupHubScreen` — plus carry-over verification of every
finding from `UI_DESIGN_WEEKLY_2026-09-11.md`. Both trees checked: all six
screens + `KartSetupForm.tsx` are byte-identical between `app/` and
`android-app/` (parity confirmed). Send-It: recent commits are Events/Coach
copy + API fixes, no layout work needing design review this week.

## Executive summary

**P0: 0 | P1: 3 | P2: 5.** Best week yet: **every finding from 2026-09-11 is
resolved** — decimal entry now parses on commit (string state ✔), the RoadRace
brand leak is gone from both trees ✔, tab icons landed in both App.tsx ✔, the
hub now has a true primary card + secondary rows ✔, bar-before-psi hint ✔,
advice list collapses to "More" ✔, chips carry `accessibilityRole` +
`selected` state ✔, and the bike/rider copy sweep is clean ✔. The new
Engineer suite is a strong, on-brand build. The three P1s are all in the new
screens: calculator inputs are wiped when switching tool tabs, the lap table's
selected state is colour-only with no accessibility semantics, and History's
Restore/Delete are sub-44pt bare text links.

## Carry-over status (from 2026-09-11)

| Last week's finding | Status |
|---|---|
| 1. P0 decimal entry impossible (`OptionalNum`) | **RESOLVED ✔** — string state, commit on `onEndEditing`/`onBlur`, sentinel `'.'`/`'-'` handled (`KartSetupForm.tsx` 45–88). Identical in android-app. |
| 2. P0 RoadRace onboarding copy (week 2) | **RESOLVED ✔** — `grep RoadRace` over both OnboardingScreens returns nothing (`3384f9d`). |
| 3. P1 compound hint psi-first | **RESOLVED ✔** — now `bar cold (…psi)` (KartSetupToolScreen ~226). |
| 4. P1 hub equal-weight buttons | **RESOLVED ✔** — primary amber-border card (104pt, 72pt art, chevron) + 48pt-art secondary rows + Advisor/Engineer role gate. |
| 5. P1 tab bar icons | **RESOLVED ✔** — Ionicons on all five tabs, both App.tsx. |
| 6. P1 bike/rider copy sweep | **RESOLVED ✔** — no `your bike` / `track rider` / `my bike` hits in either tree. |
| 7. P2 advice cards all expanded | **RESOLVED ✔** — collapsed rest with More/Less, `accessibilityState.expanded` set. |
| 8. P2 chip accessibility | **RESOLVED ✔** — `ChipRow` and `ToggleRow` carry role + selected/checked state. |

## Trend / competitor watch (this week's rotation)

| Item | Verdict | Notes |
|---|---|---|
| **NN/g mobile data tables** (nngroup.com/articles/mobile-tables, data-tables) | **ADOPT** | Directly applicable to the new lap table: keep the row-identifier (Lap) column visually anchored and distinct ✔ (already `fontWeight 700`), support comparison by adjacency ✔ (+Best delta column already built — good). Gap it exposes: selected-row state must not be colour-only and row labels must survive scanning — drives findings 2 and P2-1 below. |
| **Material 3 Expressive** (m3.material.io/blog/building-with-m3-expressive; rolling out on Pixel/Android 16) | **WATCH** | Big visual refresh (springy motion, emphasized type, resized quick settings). Our dark slate + amber system already reads "expressive" enough; adopting M3E component skins now would fork the shared Send-It look for zero user benefit. Revisit only when Expo/React Navigation ship M3E-styled defaults. Hype risk: moderate — it's real and shipping, but chasing it is off-brand for a paddock tool. |
| **RaceChrono / AiM comparator note** | **ADOPT (pattern confirmed)** | The shipped lap-vs-lap speed-over-distance overlay is exactly the RaceChrono/Race Studio core pattern — right call. Their differentiator we should copy next: a delta-time trace (cumulative Δ vs distance) under the speed trace, which shows *where* the time was lost, not just that it was lost. Logged as P2-4, engine work first. |

## Per-screen findings

### KartSetupCalculatorsScreen

**1. P1 — Switching tool tabs wipes in-progress calculator inputs**

- **What's wrong:** Scales (`WeightsPanel`), Caster, and Units panels hold
  their inputs in local `useState` inside components that **unmount** when the
  tool tab changes (`{tool === 'weights' ? <WeightsPanel/> : null}`). Enter
  four corner weights, flip to Units to convert a figure, come back — all four
  weights are reset to defaults.
- **Why it matters:** Doctrine 2 (flow beats decoration): the realistic shed
  flow is bouncing between Scales and Units/Caster mid-measurement. Losing
  typed data is the classic NN/g input-preservation failure the OptionalNum
  fix just solved elsewhere.
- **Fix:** Keep all panels mounted and toggle visibility
  (`<View style={tool === 'weights' ? null : styles.hidden}>` with
  `hidden: { display: 'none' }`), or lift weights/caster/units state into
  `KartSetupCalculatorsScreen`. Jetting/Fuel already persist via the session —
  those are fine. Mirror in android-app. — **Effort: S**

### KartSessionUploadScreen

**2. P1 — Lap-table row selection is colour-only and invisible to screen readers**

- **What's wrong:** Selected laps get only a 12%-alpha amber background
  (`tableRowOn`), the helper copy literally says "Yellow is selected", and the
  row `TouchableOpacity`s have no `accessibilityRole` or
  `accessibilityState={{ selected }}`. The ★ marks best lap, not selection.
- **Why it matters:** Doctrine 5 / WCAG 1.4.1 (colour never the only signal)
  and the NN/g tables ADOPT above; a 12% tint is also marginal at track-side
  max brightness (doctrine 6).
- **Fix:** Add `accessibilityRole="button"` +
  `accessibilityState={{ selected: on }}` to each row; add a non-colour
  selected mark (e.g. `✓` prefix in the Lap cell or a 3pt amber left border
  via `borderLeftWidth`); reword hint to "Selected laps are ticked and
  highlighted." — **Effort: S**

### KartSetupHistoryScreen

**3. P1 — Restore / Delete are bare text links: sub-44pt targets, no roles, destructive adjacency**

- **What's wrong:** `rowActions` renders two plain `TouchableOpacity` texts
  (14pt, ~17pt tall) 16pt apart, with no `accessibilityRole="button"`,
  no `hitSlop`, and destructive **Delete** sitting directly beside
  **Restore**.
- **Why it matters:** Doctrine 3 (≥44pt iOS / 48dp Android touch targets);
  HIG explicitly warns against adjacent destructive actions with small
  targets — a gloved thumb between heats will fat-finger Delete. The confirm
  Alert saves the data but the near-miss still costs trust and time.
- **Fix:** Give both actions `minHeight: 44` + `paddingVertical` (or
  `hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}`), add
  `accessibilityRole="button"`, and push Delete to the far right
  (`justifyContent: 'space-between'`) so the pair aren't adjacent.
  — **Effort: S**

**P2-1 — Compare From/To pickers don't look tappable.** Dark rows with a
label + value, no chevron, no role. Add `accessibilityRole="button"` and a
`chevron-down`/`swap-vertical` Ionicon so the affordance matches the hub rows.
(Doctrine 2: state clarity.) — **S**

**P2-2 — 12pt metadata under snapshots and 12pt table cells.** `hint` (12pt)
carries real content here (date, wheelbase, grip, lap evidence) and the lap
table cells are 12pt too. At arm's length in sunlight that's below the
comfortable floor; lift both to 13pt (cells) / 13–14pt (snapshot meta).
(Doctrine 3/6.) — **S**

### KartSessionUploadScreen (P2)

**P2-3 — Comparison Δ sign depends on tap order and the trace colours are
colour-only.** `Δ time (second − first)` flips sign with selection order, and
amber-vs-white is the only differentiator (legend is a 12pt hint below).
Suggest: always anchor the comparison to the faster lap ("Lap 7 +0.312 s vs
lap 5"), and dash the second trace (`strokeDasharray`) so the pair survive
grayscale/glare. — **S**

**P2-4 — Speed overlay next step: cumulative delta-time trace** (RaceChrono
pattern, ADOPT note above) so drivers see *where* time is lost. Needs engine
support (`lapTableRows` trace alignment already exists) — park until J-series
slot. — **M**

### BikeSetupHubScreen (rebuilt — mostly praise)

**P2-5 — Two stacked helper paragraphs push the primary card down.** Role
explainer + privacy note (2 × 13pt paragraphs) sit above the Kart Setup Tool
card; on a 4.7–5.4″ phone the primary action lands near the fold. Merge into
one line ("Private on this device · Engineer adds the full sheet + maths") or
move the privacy note below the primary card. (Doctrine 7: one glanceable
summary above the fold.) — **S**

**Endorsements:** Advisor/Engineer gate is the right junior/parent split
(doctrine 6) with honest copy; primary card + chevroned secondary rows create
real hierarchy; every row ≥72pt with role + label ✔; History/Sheet privacy
copy ("stays on this device") is exactly the parent-reassurance tone; Session
upload's "raw file is never sent to a language model" notice is excellent
trust copy; no lap-time claims anywhere ✔ (spec + AGENTS invariant).

## Top 5 fixes for Cursor (impact ÷ effort)

1. **[P1, S]** Calculators: keep Scales/Caster/Units panels mounted (or lift
   state) so switching tabs never wipes typed weights — both trees.
2. **[P1, S]** Lap table: `accessibilityRole` + `selected` state + non-colour
   selected mark (✓ or amber left border); reword "Yellow is selected".
3. **[P1, S]** History Restore/Delete: 44pt targets, button roles, separate
   Delete to the far side of the row.
4. **[P2, S]** Lift 12pt table cells / snapshot metadata to 13–14pt; add
   chevron + role to the Compare From/To pickers.
5. **[P2, S]** Hub: collapse the two helper paragraphs so the primary card
   sits above the fold on small phones.

All fixes: apply identically in `app/` **and** `android-app/` (files are
currently byte-identical — keep it that way), then `npx tsc --noEmit` in both
trees. Manual on-device checks (Hermes cannot run simulators): enter corner
weights → flip to Units → return, values must persist; VoiceOver/TalkBack
over lap rows announces "selected"; glove-tap Restore vs Delete; small-phone
(SE-class) hub screenshot showing the primary card above the fold.

## Out of scope this week

- `KartSetupSheetFields` / `KartSetupVenuePanel` / `KartSetupWeatherImport`
  component internals — review next week with the Engineer sheet flow
  end-to-end (this week covered the screens that mount them).
- Send-It screen review (no layout changes; Events "add a missing series"
  flow worth a look next cycle).
- Track Details map screens — corner JSON baked (`05f58a4`) but screen review
  waits for the racing-line legend to settle.
- Internal `Bike*` route/identifier renames — already tracked in
  CURSOR_BUILD_JOBS; cosmetic only.
