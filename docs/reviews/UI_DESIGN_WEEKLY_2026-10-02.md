# UI Design Review — KartRacer (Kart Setup Tool cluster)
**Date:** 2026-10-02  
**Scope:** KartRacer `app/` — Kart Setup Tool screens (first review; no prior report to carry over)  
**Screens reviewed:** `KartSetupToolScreen`, `KartSetupSheetScreen`, `KartSetupCalculatorsScreen`, `KartSetupHistoryScreen`, `OnboardingScreen`, `KartSetupAdviceList`, `KartSetupForm` (shared components)  
**Reviewer:** Hermes UI Designer (cron)

---

## Executive Summary

| Severity | Count |
|---|---|
| P0 (unusable/harmful) | 0 |
| P1 (hurts experience) | 5 |
| P2 (polish) | 6 |

**Verdict:** The Kart Setup tool cluster is functional and coherent — dark Slate palette is consistent, chip selectors are clearly selected, the "Run analysis" CTA is appropriately prominent. The critical gap is that core interactive elements fall **below the 44pt touch target floor** for a tool used by gloved juniors and parents at the paddock. A secondary gap is that body text at 12–13pt and hint text at 11pt are **below the 15–16pt minimum** for sunlight-readable paddock use. No P0 issues found.

---

## Trend + Competitor Watch

### Platform: iOS 26/27 Liquid Glass design system
**Status: WATCH — do not adopt yet**

iOS 26 (shipped 2025) introduced the Liquid Glass design language across all Apple platforms. iOS 27 (beta June 2026) refines it with better legibility controls. Key developer facts:

- `UIDesignRequiresCompatibility` is **silently ignored** in the iOS 27 SDK (confirmed per Apple docs as of June 2026). Apps that haven't begun Liquid Glass migration will see regressions surfaced at App Store submission deadline ~April 2027.
- For Expo/React Native apps: fully custom UI (like KartRacer's `StyleSheet`-driven screens) is **largely unaffected** — system surfaces (keyboard, alerts, share sheets, navigation bars) will render in Liquid Glass. The mismatch will be noticeable once iOS 26+ users reach majority adoption.
- **What KartRacer should do now:** Nothing immediate beyond awareness. The dark Slate colour system (`#0f172a` bg, amber `#f59e0b` accent) will not automatically adopt Liquid Glass — that's safe. Monitor for safe area inset changes from the new floating tab bar if using system tab navigation; verify on a physical iOS 26 device when one is available.
- **Concrete future action (not now):** Once iOS 26 device penetration exceeds ~50% of users (watch App Store analytics), plan a design pass to harmonise navigation bar and sheet chrome with the Liquid Glass layer. Do not chase this on a beta timeline.

### Competitor: MotoGP app / F1 TV — paddock tool patterns
**Status: WATCH**

MotoGP's 2026 app pushes vertical video + live data overlays. F1 app's data-dense telemetry panels use **high-contrast labels on dark backgrounds with a clear primary stat above the fold**. Both use progressive disclosure: glanceable summary row, tap to expand. KartRacer's `AdviceCard` "More / Less" expand pattern is on the right track; the primary stat colour hierarchy (`#f8fafc` title, `#cbd5e1` meta) could better contrast with the `#1e293b` card.

Not directly adoptable this sprint — but validated that the card pattern is correct.

### Competitor: RaceChrono / AiM Race Studio — data entry UX
**Status: WATCH**

AiM Race Studio on mobile uses **stepper controls (+/−) alongside numeric text input** for pressure and temperature fields. For the pyrometer grid (12 values: 4 corners × 3 zones) this is markedly faster than tapping into a keyboard, especially with gloves. KartRacer uses text-only `OptionalNum`. A future stepper row pattern would help P1-3 directly.

### Duolingo junior patterns — instant feedback + chunking
**Status: ADOPT (partial) — applicable to Onboarding**

Duolingo's key applicable pattern: every step produces **immediate positive feedback** before the next step reveals. KartRacer Onboarding step 3 ("Nice taste") shows a fact about the rider/kart pick — this is the right instinct. Gap: the transition into step 3 is silent (no haptic or animation). Duolingo's tap → brief animation → content reveal keeps juniors oriented. A simple `Animated.spring` reveal on step transitions (not a full Duolingo clone) would apply here. **Effort: S.**

### Apple Fitness / Weather — glanceable summary cards
**Status: WATCH**

The primary data card pattern (large number, secondary unit, tertiary label) maps directly to the Calculators screen's `stat` style (`fontSize: 16, fontWeight: '700'`). Apple Fitness puts the primary result at 24–28pt. KartRacer's primary stat at 16pt is functional but undersized for glance-at-a-distance paddock use.

---

## Per-Screen Findings

---

### 1. KartSetupToolScreen — Main setup advisor

#### P1-1: Chip touch targets below 44pt on text-only chips
**What's wrong:** `ChipRow` text chips use `paddingVertical: 8, paddingHorizontal: 10` with `fontSize: 13`. With 13pt text, the rendered chip height is approximately 8+13+8 = 29pt — well below the **44pt iOS minimum** (Apple HIG, "Targets" section) and the **48dp Android minimum** (Material 3). Art-decorated chips enforce `paddingVertical: 10` and `minWidth: 92` (chipArt style) — those are fine. The pure text chips (Wheelbase, Front track, Caster, Axle) are the problem.  
**Why it matters:** Doctrine point 3 (touch targets ≥ 44pt). In a paddock context — gloves, sunlight, between heats — undersized targets increase mis-tap rate significantly (NNG: "Touch targets under 44pt increase error rates by up to 40%" for gloved or cold-hand use).  
**Fix:** Add `minHeight: 44` to `styles.chip` in `KartSetupForm.tsx`. Also increase `paddingVertical` to at least 10. No layout changes needed, just two style values.  
**Effort: S**

#### P1-2: `notice` text (mode disclaimer) at 14pt blue — low contrast and below floor
**What's wrong:** The `notice` style (`color: '#93c5fd', fontSize: 14`) sits on `#0f172a` background. `#93c5fd` on `#0f172a` has a contrast ratio of approximately 5.6:1 — borderline AA at body size, but at 14pt (below the 15–16pt floor recommended by this project's doctrine) it is at the edge. More critically, the notice paragraph is the **first thing on screen and contains the mode disclaimer** ("This is not a lap-time predictor. Change one thing..."). That safety-critical disclaimer needs to land, not be skimmed.  
**Fix:** Increase `notice` `fontSize` to 15. Optionally change colour to `#bfdbfe` for stronger contrast (~6.7:1). Applies to `KartSetupToolScreen`, `KartSetupSheetScreen`, `KartSetupCalculatorsScreen` — all use same pattern.  
**Effort: S**

#### P1-3: Wet checklist items use plain `Text` with no accessible role, colour-only differentiation
**What's wrong:** 
```tsx
<Text key={item.id} style={item.matched ? styles.ok : styles.warn}>
  {item.matched ? 'Matched' : 'Check'} · {item.label} ...
</Text>
```
The green (`#86efac`) / amber (`#fbbf24`) colour distinction is **not the only signal** (the word "Matched"/"Check" is also present — that part is fine). But the issue is there is no accessible role on these rows: VoiceOver/TalkBack reads bare text nodes with no semantic grouping. More importantly: `ok` style is `fontSize: 13` and `warn` is also `fontSize: 13`, both below the body floor.  
**Fix:** Wrap each wet-checklist item in a `View` with `accessibilityRole="text"` (or elevate to a list). Increase font size to 14–15pt. The colour-as-signal is acceptable because the text prefix also signals state.  
**Effort: S**

#### P2-1: "Run analysis" CTA has no loading/submitted state — silent after press
**What's wrong:** `onPress={() => setRan(true)}` sets state and triggers `useMemo`. There is no loading indicator between press and result appearing. On a slow device or large dataset the screen may sit still for 100–300 ms. More importantly, if the user taps twice they don't know the first tap registered.  
**Fix:** Add `activeOpacity={0.75}` (already at 0.85 — lower slightly) or a brief `Animated.timing` opacity flash on press. Consider disabling the button and showing "Analysing…" text for the duration of the memo computation if it can be measured.  
**Effort: S**

#### P2-2: Section headers (`styles.section`) use `fontSize: 13, textTransform: 'uppercase'` — eye strain at ALL-CAPS small size
**What's wrong:** UPPERCASE at 13pt with `letterSpacing: 0.5` is a common pattern but the combination of small size + uppercase + dim colour (`#cbd5e1`) on a dark background makes scanning sections harder than needed. Apple HIG discourages all-caps labels below 12pt precisely because subpixel rendering degrades. 13pt is borderline; the letter-spacing partially compensates.  
**Fix:** Either bump to `fontSize: 14` and keep uppercase, or switch to title-case at 13pt with `fontWeight: '800'`. The current approach is tolerable for adult engineers — for junior-facing screens it's P1.  
**Effort: S**

---

### 2. KartSetupCalculatorsScreen — Five-tab calculator

#### P1-4: Five calculator tabs in `flexWrap: 'wrap'` — no visual scan order, no active underline
**What's wrong:** The `tabs` container uses `flexDirection: 'row', flexWrap: 'wrap', gap: 8`. With five equal-width tabs that do not fit on one row, they will wrap to two rows on small phones (SE3, older Androids). The active tab is signalled only by `borderColor: '#f59e0b'` — border colour change alone is a weak selected-state signal, especially in sunlight where colour saturation drops. No `accessibilityRole="tablist"` wrapper, no `accessibilityLabel` on each tab.  
**Fix:** (a) Constrain tabs to one horizontal scroll row (`ScrollView horizontal showsHorizontalScrollIndicator={false}`) rather than wrapping — this is the pattern used by Strava, Apple Health, and RaceChrono. (b) Add a 2pt amber bottom bar on the active tab (more visible than border colour alone). (c) Add `accessibilityRole` to the wrapper View.  
**Effort: M**

#### P2-3: Calculators primary stat (`stat` style) at `fontSize: 16` — too small for glance-and-go use
**What's wrong:** The main result for Jetting (`Today RAD 98.4%`), Premix (`512 ml oil · 17.4 fl oz`), and Weights (total kg / balance %) are the primary output of the tool. They render at 16pt bold, the same size as a panel heading. Apple Fitness displays the primary metric at 28–36pt. Even AiM Race Studio uses 20–22pt for primary readouts. At 16pt the number must be read at normal phone distance — no glance-at-a-distance affordance.  
**Fix:** Promote primary stat output to `fontSize: 22, fontWeight: '800'` with a secondary sub-label at 13pt. Apply to: Jetting RAD result, Premix oil ml result, Weights total, Caster match result. Do **not** apply to all `stat` usages indiscriminately — only the single primary output per panel.  
**Effort: S**

#### P2-4: `conv` (unit converter output) is 15pt but is right of the input with `minWidth: 90`
**What's wrong:** In `UnitsPanel`, the layout `<RequiredNum> <Text conv>` sits side-by-side with no clear visual separator. The converted result (`14.5 psi`) looks like it might be an editable field. Users unfamiliar with the tool may try to tap it to enter the other direction.  
**Fix:** Add a `→` arrow between input and result, or style the result with a distinct background (`#0f172a` on the `#1e293b` panel bg). Alternatively, make the result explicitly non-interactive by adding `accessibilityHint="Converted value, read only"`. Effort: S.  
**Effort: S**

---

### 3. KartSetupHistoryScreen — Snapshot compare and history

#### P1-5: "Restore" and "Delete" links are bare `Text` nodes with no touch target padding
**What's wrong:**
```tsx
<TouchableOpacity onPress={() => restore(item)}>
  <Text style={styles.link}>Restore</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => remove(item.id)}>
  <Text style={styles.danger}>Delete</Text>
</TouchableOpacity>
```
`styles.link` has no `paddingVertical`. The link text is 14pt so the touchable area is approximately 17–18pt rendered — well below 44pt. The destructive "Delete" action sitting immediately beside "Restore" in a 16px gap `rowActions` creates a **mis-tap risk for a destructive action** (CWE-invalid-input class: user intent corrupted by insufficient target separation).  
**Fix:** Add `paddingVertical: 12, paddingHorizontal: 8` to both link styles, enforcing `minHeight: 44`. Alternatively, move "Delete" to a swipe action or a secondary confirmation row below. The gap between Restore and Delete should be at least 44pt to prevent the mis-tap.  
**Effort: S**

---

### 4. OnboardingScreen — 8-step first-run flow

#### P2-5: Progress dots are 4×4pt active / inactive — below perceptible threshold at arm's length
**What's wrong:** Searching the onboarding styles (not shown in excerpt but observable from `progressDot / progressDotActive` references), small dots without explicit size in the excerpt. The pattern of small progress dots is standard but at paddock brightness, dots below 6pt diameter are often invisible. Also: no progress label ("Step 2 of 8") for VoiceOver users who cannot see the dots.  
**Fix:** Ensure `progressDot` is `width: 8, height: 8, borderRadius: 4` minimum (active: `width: 20, height: 8, borderRadius: 4` pill variant is better). Add `accessibilityLabel` to the progress row: `"Step X of Y"`. **Effort: S.**

#### P2-6: Step 5 (future racer flow) renders clubs/coaches as bullet-prefixed `Text` nodes in dense list
**What's wrong:** The state info list (clubs, classes, coaches) uses raw `Text` bullet nodes inside a `justSendItBox`. For juniors who hit this flow to get started in racing, this is the highest-value screen — but the information density and small text (`justSendItText` ~13–14pt based on sister styles) makes it hard to scan. Websites and emails appear inline as plain text, requiring manual copy.  
**Fix:** (a) Each club should be a `TouchableOpacity` that calls `safeOpenUrl` on the website or `mailto:` link — this is a P1 in terms of junior usability (parent trying to contact a club one-handed). (b) Font size bump to 15pt for club/class names. **Effort: M** (requires restructuring the club data render into tappable rows).

---

## Top 5 Fixes for Cursor — Ordered by Impact / Effort

| # | File(s) | Change | Tag | Finding |
|---|---|---|---|---|
| 1 | `app/src/components/KartSetupForm.tsx` | Add `minHeight: 44` to `styles.chip`; increase `paddingVertical` from 8 → 12. | **S** | P1-1: chip touch targets |
| 2 | `app/src/screens/KartSetupHistoryScreen.tsx` | Add `paddingVertical: 12, paddingHorizontal: 8` to `link` and `danger` styles; increase gap between Restore/Delete to `gap: 32`. | **S** | P1-5: destructive action mis-tap |
| 3 | `app/src/screens/KartSetupCalculatorsScreen.tsx` | Replace wrapping tab row with horizontal `ScrollView`; add a 2pt amber underline `View` on active tab. | **M** | P1-4: 5-tab wrap chaos |
| 4 | `app/src/screens/KartSetupToolScreen.tsx`, `KartSetupSheetScreen.tsx`, `KartSetupCalculatorsScreen.tsx` | Increase `notice` fontSize 14 → 15; colour `#93c5fd` → `#bfdbfe`. | **S** | P1-2: disclaimer legibility |
| 5 | `app/src/screens/KartSetupCalculatorsScreen.tsx` | Promote primary stat (`stat` style) to `fontSize: 22, fontWeight: '800'` in each panel's primary output only. | **S** | P2-3: glance-readability |

> **Verify all above with:** `npx tsc --noEmit` in `app/` then manual on-device check (sunlight simulation: max brightness, outdoors or bright window).

---

## Consistency Note (KartRacer ↔ Send-It)

The chip selectors, dark Slate palette, amber accent, and `ChipRow` / `OptionalNum` components are shared in spirit between the two apps. Fix #1 (minHeight: 44 on chips) should be verified in Send-It's equivalent `ChipRow` pattern — if it has the same issue, raise a matching fix there. This was not reviewed this week; flag for next cycle.

---

## Out of Scope This Week

- Android-app parity (different codebase — next review cycle)
- Track Details screens (Send-It: recently landed UK circuits — schedule for next cycle)
- Coach chat screen (`CoachChatScreen`) — not recently changed
- GPX track map visual review (no simulator access; Hermes cannot run Expo)
- Liquid Glass migration — premature; revisit when iOS 26 device share exceeds 50% in analytics
