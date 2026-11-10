# UI Design Weekly Review — 2026-10-30

**Scope:** KartRacer `app/` — `CoachChatScreen` (680 lines), the AI chat used for both Coach and Kart Setup. It was listed "out of scope" on 10-27. Plus corrections to two 10-27 onboarding findings (O1, O9).
**Send-It:** no app-code changes. Its last commits (2026-10-16) are landing page only.
**Method:** Code read only. Hermes cannot run simulators.
**Limits this run:**
- A Python contrast script was held for approval and not run, so no new contrast ratios were measured. The one ratio quoted below is carried from the 10-16 report. Everything else is "not measured".
- I did not read `utils/coachChat.ts`, so error strings and the reply format (plain text or markdown) are unverified.

**Repo state:** KartRacer's last commit is 2026-10-13 (`84a95a2`). There are no `app/` or `android-app/` changes since the 10-16 review. Nothing from 10-16 or 10-27 has been implemented. `OnboardingScreen` still has zero `accessibilityRole` uses.

## Executive summary

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 4 (C1, C2, C3, C4) |
| P2 | 5 (C5, C6, C7, C8, C9) |

**Verdict:** The chat layout is sound. Targets are 44pt, the input is 16pt, errors restore the user's text, and the Clear action has a confirmation. The gaps are in feedback and the paddock: a bare spinner while waiting, no retry, a send key that probably inserts a newline, and no accessibility semantics on bubbles or buttons.

## Carry-over and corrections

**Still OPEN (no code changed):**
- 10-16: F1 sticky Run analysis, F2 Advice empty state, F3 wet checklist ✓/⚠, F4 notice 15pt, F5 selected tab fill, F6/F7 sub-13pt text and `source` colour, F8 Units context line, F9 RiderCoach hub hierarchy, F10 role chip labels.
- 10-27: O2–O8. O2 (email consent and parent line) is still the highest-priority one.

**Corrections to 10-27:**
- **O1 downgraded P1 to P2.** I said onboarding had no keyboard handling. That was incomplete. `App.tsx` wraps everything in `KeyboardSafeView`, which pads iOS by the keyboard height and handles web. `app.json` sets Android `softwareKeyboardLayoutMode: "resize"`. So the Next button is not simply hidden. What remains:
  - On steps 5 and 6 the focused input may sit below the fold, and nothing scrolls it into view on native.
  - There is no `returnKeyType`.
  - There is no `textContentType="emailAddress"`.
  - Re-test on iPhone SE before treating it as a bug.
- **O9 partly resolved.** `SafeAreaProvider` is present in `App.tsx`. `OnboardingScreen` itself does not use `useSafeAreaInsets` or `SafeAreaView`. Whether the top padding is enough on a Dynamic Island iPhone is still unverified. It stays P2, pending an on-device check.

## Trend / competitor watch

- **Material 3 Expressive.** WATCH. Search results say Google's own apps now ship M3 Expressive, and Android 17 QPR betas extend blur and translucency. I read only snippets and headlines, not the guidelines. Our dark slate and amber palette is custom and consistent across both apps. Adopting it would break Send-It parity for no user gain. Revisit only if Play review or the Material You theming of system components starts to clash. Do not chase the blur effects.
- **NN/G, "Card View vs. List View" and "Data Visualizations for Dashboards" videos.** WATCH. The video descriptions say dashboards should use length and 2D position to carry quantities. That fits the setup-tool results and lap tables, which are still plain text rows (see the 10-16 F-series). I saw descriptions only, not full content. Not actionable until the F1/F3 fixes land.
- **ChatGPT / Gemini-style starter chips and a "thinking…" state.** ADOPT (pattern, not a copy of any one app). It is a common chat pattern, and I did not read any specific app's spec this run. It informs C4 and C5. The underlying principle is Doctrine §2, state clarity, so the recommendation does not depend on the citation.
- **Not checked this week:** F1 TV, MotoGP, Strava, Whoop, Duolingo, Apple Fitness. They rotate.
- **Hype flag:** Liquid Glass and M3 Expressive blur. Do not adopt for a data-dense paddock tool read in sunlight. Translucency reduces contrast.

## Per-screen findings — `CoachChatScreen`

Flow walked as three users:
- **First-time:**
  - Coach mode opens with a seeded goals prompt from `coachGoalsPrompt`. That is good orientation.
  - Kart Setup mode opens with a title and a two-line subtitle and nothing tappable (C5).
- **Returning, mid-session (gloves, 30 s between heats):** Typing a fault description is expensive, and there are no shortcuts.
- **Junior/parent:** The AI reply is shown as plain text. The wait is silent (C4).

**C1 (P1, S). No accessibility semantics on the chat controls or bubbles.**
- *Wrong:* Only the header Clear button has role, label and hint. These have none:
  - **Send button.** A `TouchableOpacity` showing "Send", with no role. While loading it shows only a spinner, so a screen reader has nothing to read.
  - **Attach button.** It has a label but no role. Its visible glyph is "+".
  - **Pending-attachment remove button.** It shows "×" and has no label.
  - **Suggest-mode bar.** Tappable, no role, no hint.
  - **Message bubbles.** Nothing marks who spoke, and new replies are not announced.
  - **Loading bubble.** Nothing is announced.
- *Why:* Doctrine §5 (VoiceOver/TalkBack labels on interactive elements).
- *Fix:*
  - Send: `accessibilityRole="button"`, `accessibilityLabel="Send message"`, and `accessibilityState={{ disabled: !canSend, busy: loading }}`.
  - Attach: add `accessibilityRole="button"`.
  - Remove button: `accessibilityLabel={`Remove ${att.name}`}`.
  - Suggest bar: `accessibilityRole="button"`.
  - Bubbles: `accessibilityLabel={`${m.role === 'user' ? 'You' : 'Coach'}: ${m.content}`}`, or add an invisible prefix.
  - Loading bubble: `accessibilityLiveRegion="polite"` and `accessibilityLabel="Coach is typing"`.
  - Error bar: `accessibilityRole="alert"` and `accessibilityLiveRegion="assertive"`.
- *Verify:* `npx tsc --noEmit` in `app/` and `android-app/`. On-device with VoiceOver and TalkBack.

**C2 (P1, S). The multiline input probably cannot send with the keyboard key.**
- *Wrong:*
  - The `TextInput` is `multiline` with `onSubmitEditing={sendMessage}` (lines 415–429).
  - In React Native, `onSubmitEditing` is not called for a multiline input on the default return behaviour. Return inserts a newline. The handler is therefore dead on native, and `Send` is the only way.
  - I could not run the app to confirm this. React Native's `submitBehavior` prop (RN 0.73+, in Expo 54) is the documented way to change it. Verify it on-device.
  - `returnKeyType` is not set, so the key shows "return".
- *Why:* Doctrine §2 (taps-to-goal). The user is in gloves at a track and the send affordance is the small button at the far end of the row.
- *Fix:*
  - Remove `onSubmitEditing` if it is confirmed dead.
  - Do not make Return send on iOS, because users also need newlines for setup notes.
  - Instead, keep `Send` as the primary action and make it ≥48pt wide. It is already 44pt high with 20pt padding.
  - Optionally on web only, add Enter to send and Shift+Enter for a newline.

**C3 (P1, S). The error bar has no retry, no live region, and small text.**
- *Wrong:*
  - `errorText` is 13pt `#fecaca` on `#7f1d1d` (lines 354–358, 591–594). I did not measure the ratio.
  - The bar is passive text. The user's text and attachments are restored on failure, which is good, but the user must work out for themselves that tapping Send again is the retry.
  - Nothing announces the error to a screen reader.
  - Network failures at a track are common. Signal at kart tracks is often poor.
- *Why:* Doctrine §2 (error states designed) and §3 (body text ≥15pt).
- *Fix:*
  - `errorText` 15pt with `lineHeight: 21`.
  - Add a trailing "Try again" button, `minHeight: 44`, that calls `sendMessage`. The restored input makes this safe.
  - Add a dismiss ×, 44pt.
  - Add `accessibilityRole="alert"`.
  - If `apiErrorMessage` is technical, plainer copy: "Couldn't reach the coach. Check your signal and try again." I did not read `apiErrorMessage`.

**C4 (P1, S). Waiting is a bare spinner with no words and no end.**
- *Wrong:* While `loading`, the only feedback is a 20pt grey `ActivityIndicator` in an empty assistant bubble (lines 347–351). There is no "thinking" text, no time cue, and no cancel. The Send button also becomes a spinner on amber, with the input locked (`editable={!loading}`). That is a reasonable lock, but together with a silent spinner it reads as frozen if the API is slow.
- *Why:* Doctrine §2 (loading state clarity) and §6 (junior reassurance, instant feedback).
- *Fix:*
  - Show "Coach is thinking…" (14–15pt, `#cbd5e1`) beside the spinner. Use "Checking the setup…" in Kart Setup mode.
  - After about 10 s, swap in "Still working — this can take a moment on weak signal."
  - The 10 s figure is my suggestion. I did not measure the API's typical latency.
  - A Cancel is optional. It would need an abort controller in `sendCoachChat`, which is a larger change, so leave it for later.

**C5 (P2, M). Kart Setup mode has no starter shortcuts.**
- *Wrong:*
  - Setup mode's empty state is a title and a subtitle (lines 306–314). Nothing is tappable.
  - Coach mode is seeded, but also has no chips.
  - The repo already has `riderAiFaqs` and `navigateToKartSetupWithDraft`, so draft-seeding exists elsewhere.
- *Why:* Doctrine §2 (taps-to-goal) and §7 (progressive disclosure). It is also hard for first-time users to know what to ask.
- *Fix:*
  - Show 3–4 chips in the empty state, each ≥44pt high:
    - "Kart pushes wide on corner entry"
    - "Gearing for this track"
    - "Tyre pressures for wet"
    - "Rear steps out on exit"
  - Tapping a chip puts the text in the input via `setInput`, without auto-sending, so the user can edit it.
  - Source the text from `riderAiFaqs` to keep one content source.
  - Effort is M because the content is needed from the KB. It is not a layout problem.

**C6 (P2, S). Disabled Send is almost indistinguishable from enabled.**
- *Wrong:* `sendBtnDisabled` is `opacity: 0.7` on amber (line 659). The enabled and disabled buttons look nearly the same, so the user taps it and nothing happens.
- *Why:* Doctrine §2 (state clarity) and §5 (not by opacity alone).
- *Fix:* The disabled state should use `backgroundColor: '#334155'` with `color: '#94a3b8'` text. That follows the "neutral surface, not faded accent" pattern used elsewhere. I did not measure the ratio. Check that the disabled text is not asked to meet 4.5:1, since disabled controls are exempt under WCAG, but it should still be legible.

**C7 (P2, S). Small text and targets.**
- *Where:*
  - `pendingName` 10pt (line 564).
  - `fileChip` text 12pt (lines 523, 528).
  - `errorText` 13pt (see C3).
  - `welcomeSubtitle` 14pt, `suggestText` 14pt, and the header Clear text 14pt.
  - `headerClearButton` `minHeight: 36`.
  - `pendingRemove` is a 20pt circle with `hitSlop` 8, which gives 36pt.
- *Why:* Doctrine §3 (≥44pt targets, body ≥15–16pt).
- *Fix:*
  - `pendingName` 12pt, `fileChip` text 13pt, `welcomeSubtitle` 15pt.
  - `headerClearButton` `minHeight: 44`.
  - `pendingRemove` 28pt with `hitSlop` 10, which gives 48pt.
  - Header chrome is shared with navigation, so confirm that `headerClearButton` does not overflow the nav bar.

**C8 (P2, S). The assistant's setup numbers cannot be copied.**
- *Wrong:* Bubble `Text` is not `selectable`. The coach returns values such as pressures, jetting or sprocket sizes, and the user will want to paste them into the setup sheet or notes. I did not read `coachChat.ts` to see whether replies are markdown. Plain-text lists with long lines are harder to scan on a 15pt bubble.
- *Why:* Doctrine §7 (data-dense but calm) and the paddock use case.
- *Fix:*
  - Add `selectable` to `bubbleTextAssistant`.
  - Optionally add a "Copy" icon, 44pt, on each assistant bubble.
  - If replies contain markdown, render it, for example with `react-native-markdown-display`. That is a new dependency. Raise it with the owner before adding it. It is not a recommendation yet, as I did not check the reply format.

**C9 (P2, S). Placeholder and hint contrast.**
- *Wrong:* `placeholderTextColor` is `#64748b` on `#1e293b` (line 422). The 10-16 report measured exactly this pair at 3.07:1, which is below the 4.5:1 AA bar. The placeholder is the only prompt telling the user what to ask.
- *Why:* Doctrine §5 and §6 (sunlight readability).
- *Fix:* `placeholderTextColor="#94a3b8"`. I did not measure that pair this run. It is lighter on the same background, so the ratio will be higher. Verify at max brightness outdoors.

## Top 5 fixes for Cursor (impact / effort)

1. **C3 + C4.** The error bar gets retry, 15pt and a live region. Loading gets "thinking…" text (S, one file).
2. **C1 + 10-27 O4.** Accessibility roles, labels and state across `CoachChatScreen` and `OnboardingScreen` (S, two files).
3. **10-27 O2.** Onboarding email step: consent copy and a parent line for under-16s (M). This is the only item with a privacy angle.
4. **10-16 F1, F3, F4, F6.** Sticky Run analysis bar, wet checklist ✓/⚠, 15pt notices, sub-13pt text (S–M). These are still the best impact/effort items for paddock tools.
5. **C6 + C9 + C7.** Disabled Send state, placeholder colour, small text and targets (S, one file).

**Parity note:**
- `CoachChatScreen` is forked from Send-It. C1–C4 and C6–C9 apply equally to Send-It. Do them in both repos.
- C5 is KartRacer-specific content. Its chips need kart wording.
- `android-app/` mirrors `app/`, so all findings apply there too.
- Internal names such as `bikesetup`, `BikeSetupHub` and `RoadRacerAiFaqsScreen` are RoadRacer carry-overs in code. They are not user-visible in this screen. A rename would break parity, so it is not recommended.

## Out of scope this week

- Send-It app screens (no app-code changes).
- `RoadRacerAiFaqsScreen` content, `KartSetupToolScreen` and the calculator screens (reviewed 10-16).
- `utils/coachChat.ts`, `apiErrorMessage` strings and reply format. These were not read.
- Contrast ratios not recomputed (script held for approval).
- No simulator or device run.

*Report only. Gates for any layout change: `npx tsc --noEmit` in `app/` and `android-app/` plus an on-device manual check (iPhone SE and a notched iPhone, Android gesture nav, VoiceOver and TalkBack, outdoors at max brightness).*
