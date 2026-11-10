# UI Design Weekly Review — 2026-10-27

**Scope:** KartRacer `app/` — `OnboardingScreen` (1168 lines), the first-run flow. It was deferred on 10-16 as "needs its own review". Send-It: no new app-code review this week. Its recent commits are landing page, calendar and API only.
**Method:** Code read only (`app/src/screens/OnboardingScreen.tsx`, all 8 steps plus styles). Hermes cannot run simulators.
**Limits this run:** One shell command was denied by the user environment. It was a SafeArea grep plus a contrast calculation. I did not retry it. So:
- No new contrast ratios were computed. Contrast figures below are reused from the 10-16 report, where the same hex pairs apply, or are marked "not measured".
- I did not verify safe-area handling (see O9).

**Repo state:** KartRacer's last commit is 2026-10-13 (`84a95a2`). `app/` and `android-app/` have no changes since the 10-16 review. All 10-16 open items are therefore still open (see carry-over).

## Executive summary

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 5 (O1, O2, O3, O4, O5) |
| P2 | 4 (O6, O7, O8, O9) |

**Verdict:** The onboarding flow is friendly and short per step. It is built for a mouse-and-eyes user and not yet for juniors, parents or screen readers. Selection state is colour-only, nothing has accessibility semantics, and no input handles the keyboard. The step that emails a stranger's address to a third party has no parent cue.

## Carry-over from 2026-10-16

No code changed, so all of these remain **OPEN**: F1 (sticky Run analysis), F2 (Advice empty state), F3 (wet checklist ✓/⚠), F4 (notice 15pt), F5 (selected tab fill `#422006`), F6/F7 (sub-13pt text, `source` colour), F8 (Units context line), F9 (RiderCoach hub hierarchy), F10 (role chip labels).

Priority note for Cursor: F1, F3, F4 and F6 are still the best impact/effort items for the paddock tools. This week's findings sit alongside them, not ahead of them. The exception is O2, which has a privacy angle.

## Trend / competitor watch

- **NN/G onboarding guidance ("Skip it when possible", "Mobile tutorials: wasted effort or efficiency boost?")** — **ADOPT (principle).** NN/G's mobile study guide lists these under the initial experience: most onboarding walkthroughs are wasted effort, and onboarding should be skipped when possible. Our flow has 8 steps. Steps 1–3 are optional taste questions and step 3 is a "fun fact" bridge. That supports giving users an obvious "Skip" and cutting step 3 (O6). I only saw the article index and descriptions this run, not the full text.
- **Duolingo-style junior onboarding** — **WATCH.** Progress that shows "step n of N" and one question per screen suits juniors. We already do one question per screen. Adopting the progress label is cheap (O6). Do not import streaks or XP: that is a dark-pattern risk for under-16s. Not researched in depth this week.
- **Material 3 Expressive / iOS 26 Liquid Glass** — **WATCH (unchanged from 10-16).** No action.
- Not checked this week: F1 TV, MotoGP, Strava, Whoop, Apple Fitness. Rotating subset.

Nothing else applicable found.

## Per-screen findings — `OnboardingScreen`

Flow walked as three users:
- **First-time:** Welcome → kart → driver → "Nice taste" → how do you race → (optional state info) → avatar/nickname → legal. Orientation is good: one question and one primary button per screen.
- **Returning/mid-session:** Not applicable (one-time flow).
- **Junior/parent:** The flow collects an email address, and the legal step is a 13pt checkbox with no parent cue.

**O1 (P1, M). No keyboard handling on any text-input step.**
- *Wrong:* The root is a plain `ScrollView` (line ~263) with no `KeyboardAvoidingView` and no `automaticallyAdjustKeyboardInsets`. Steps 1, 2, 5 (email) and 6 (nickname) have inputs. On step 6 the nickname `TextInput` is the last element, below the avatar carousel and the face-photo panel. The Next button sits further below it. With the keyboard open, the primary action is likely hidden behind it. Step 5's email field has the same risk.
- *Why:* Doctrine §2 (taps-to-goal, one primary action per screen). iOS HIG expects content to stay visible with the keyboard up.
- *Fix:*
  - Wrap in `KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}`. Android needs `softwareKeyboardLayoutMode: "resize"`, or just check the current default.
  - Add `returnKeyType="next"` / `"done"` and `onSubmitEditing={handleNext}` on the nickname and email inputs.
  - Add `textContentType="emailAddress"` and `autoComplete="email"` on the email input.
- *Verify:* `npx tsc --noEmit` in `app/` and `android-app/`. On-device: iPhone SE size, Android gesture nav, open the keyboard on steps 1, 5 and 6 and check Next stays reachable.

**O2 (P1, M). Email capture hands off to the Mail app with no consent beat. It is also aimed at a junior audience.**
- *Wrong:*
  - `handleNext` on step 5 (lines 154–172) builds a `mailto:` URL and opens it before advancing. The user is thrown into the Mail app mid-onboarding. If no mail client is configured, `safeOpenUrl` presumably fails and the user gets no clear outcome. I did not read `safeOpenUrl`.
  - The disclosure is a single 13pt line: "We'll email your answers to the KartRacer team at projectapex@outlook.com.au…". It gives no purpose or retention information and no "ask a parent" line.
  - It sits on a screen for a flow whose core users are juniors (8–16).
  - The email itself is not sent by us. The user's own mail app sends it, so the user sees and sends it. That is better than silent collection. The remaining problem is that the user is never told it is about to happen.
- *Why:* Doctrine §6 (junior-facing: plainer words, zero dark patterns). Doctrine §2 (state clarity).
- *Fix:*
  - Change the helper copy to: "Tapping Next opens your email app with a message to the KartRacer team. You choose whether to send it. Under 16? Ask a parent first."
  - Raise it to 14pt, `#cbd5e1`.
  - Rename the button on this branch to "Next — open email".
  - Do not change the privacy stance without checking `docs/legal/PRIVACY.md`. This is a UX copy fix, not a legal sign-off.

**O3 (P1, S). Selection state is colour-only on all option/yes-no/avatar controls.**
- *Wrong:*
  - `optionButtonActive` changes `borderColor` to amber but keeps `backgroundColor: '#1e293b'`, the same as the inactive state (lines 883–886). `yesNoButtonActive` is a border change only (line 909). `avatarChoiceActive` is a border plus a slight background change (line 1058).
  - The inactive border is `#334155` on `#1e293b`. That is a very faint edge and I did not measure it.
  - The 10-16 review resolved the same class of problem on the lap table and in the History screen.
- *Why:* Doctrine §5 (colour never the only signal) and §6 (sunlight readability at a track).
- *Fix:*
  - Active option buttons: `borderWidth: 2`, `backgroundColor: '#422006'` (same `chipOn` family as `KartSetupForm`), and a leading "✓ " in the label.
  - Yes/no buttons: same treatment.
  - Avatar tile: add a small "✓" badge top-right on the active tile.
  - Keep layout stable when borderWidth changes, for example by using `borderWidth: 2` with a transparent border on inactive.

**O4 (P1, S). No accessibility roles, labels or state on any control.**
- *Wrong:* A search for `accessibilityRole|accessibilityLabel` in the file returned nothing. That covers:
  - the `TouchableOpacity` options
  - the avatar tiles
  - the legal checkbox (a bare `View` with a "✓" `Text`, lines 693–695)
  - the progress dots (no "step 3 of 8")
  - the emoji labels "I race 🏁" and "Practice / club days 🛞", which VoiceOver will read aloud
- *Why:* Doctrine §5 (VoiceOver/TalkBack labels on interactive elements).
- *Fix:*
  - Options: `accessibilityRole="radio"` and `accessibilityState={{ selected }}`.
  - Legal row: `accessibilityRole="checkbox"` and `accessibilityState={{ checked: acceptedLegal }}`.
  - Legal links: `accessibilityRole="link"`.
  - Avatar tiles: `accessibilityRole="radio"` with the label `${preset.label}${preset.hasFaceHole ? ', has face slot' : ''}`.
  - Progress row: one element with `accessibilityLabel={`Step ${step + 1} of ${totalSteps}`}`, with the dots hidden from the a11y tree.
  - Move emoji out of the label strings, or add an `accessibilityLabel` without them.

**O5 (P1, S–M). Step 5 shows club/coach data as plain text bullets, and the copy says "road race".**
- *Wrong:*
  - Lines 394–424: clubs, classes and coaches render as `• name – location – website – email` in one 15pt paragraph per item. Website and email are plain text and cannot be tapped. A junior or parent must retype a URL from a bullet.
  - Line 394 says "Here are some of the **road race** clubs, classes and coaches…" in KartRacer. That is a Send-It copy leak. Line 287 still says "just love bikes" in a comment only, which is harmless.
  - Kart classes are shown for juniors, but the data source (`getRacingStateInfo`) was not inspected this run. If it still returns road-race data, this is a content P0 for Cursor to check.
- *Why:* Doctrine §2 (taps-to-goal) and §6 (plainer words). Shared-brand rule from AGENTS.md: the kart product must not show RoadRacer content.
- *Fix:*
  - Replace "road race" with "karting".
  - Render each club/coach as a small card: bold name, grey location, and two ≥44pt buttons ("Website", "Email") that call `safeOpenUrl`.
  - Check `getRacingStateInfo` returns kart (KA Manual) data, not RoadRacer data.

**O6 (P2, S). Eight steps, three of them optional, and no skip.**
- *Wrong:* Steps 1–3 (favourite kart, driver, "Nice taste" facts) are optional or filler, but Next is the only route forward. There is no "Skip". Progress dots give no count.
- *Why:* NN/G onboarding guidance (see watch): skip it when possible.
- *Fix:*
  - Add a "Skip for now" text link, ≥44pt tall, on steps 1–2 that jumps to step 4.
  - Make step 3 skippable or drop it.
  - Replace the dots with "Step n of N" (14pt) plus the existing bar.
  - The dots stay if the label is added.

**O7 (P2, S). Small text and touch targets in the avatar/face and legal blocks.**
- *Where:*
  - `avatarLabel` 12pt (line 1075).
  - `avatarFaceHoleHint` 10pt in `#64748b` (line 1084).
  - `faceUploadHint` and `legalIntro`/`legalCheckLabel` 13pt.
  - `legalLink` is text-only at 14pt with no `minHeight`.
  - `faceUploadButton`/`faceLibraryButton`/`faceRemoveButton` use `paddingVertical: 10` with 15pt text, which comes to roughly 38pt tall.
  - `avatarScrollButton` (web only) is also below the floor.
  - The legal checkbox box is 22pt, though the whole row is touchable.
- *Why:* Doctrine §3 (≥44pt targets, body ≥15–16pt).
- *Fix:*
  - Give all buttons and links `minHeight: 44`.
  - Raise the face-slot hint and avatar label to 13pt.
  - Raise the legal copy to 15pt with `lineHeight: 22`.
  - Make the checkbox 28pt.
  - The legal links need `paddingVertical: 12`.
  - Use `#94a3b8` or lighter for the hint. `#64748b` is the colour that measured 3.07:1 on `#1e293b` last week. Its ratio on the darker `#020617` was not measured.

**O8 (P2, S). Disabled Next gives no reason.**
- *Wrong:* `nextButtonDisabled` is `opacity: 0.5` only (line 1008). On step 4, Next is disabled until an option is chosen. On step 5 it depends on a chain of answers (state, email format). No text says what is missing. The email validity rule is `length > 3 && includes('@')`, which is very loose.
- *Why:* Doctrine §2 (states designed, never accidental).
- *Fix:*
  - Show one line above the buttons when disabled: "Pick one to continue." / "Enter a valid email to continue."
  - Set `accessibilityState={{ disabled }}`.
  - Tighten the email check to a simple regex.

**O9 (P2, S, unverified). Safe-area handling not confirmed.**
- *Wrong:* The container is a plain `View` with `padding: 24` on the `ScrollView`. I did not confirm whether the parent applies safe-area insets. If it does not, the progress row sits close to the notch/status bar on iPhones with a Dynamic Island.
- *Fix:* Check `App.tsx` for a `SafeAreaView` / `SafeAreaProvider` around onboarding. Add `useSafeAreaInsets()` top padding if absent. On-device check on a notched iPhone.

## Top 5 fixes for Cursor (impact / effort)

1. **O1.** Keyboard handling and `returnKeyType` on steps 1, 2, 5, 6 (M).
2. **O2.** Email step copy and consent beat; parent line for under-16s (M).
3. **O3 + O4.** Selection state beyond colour, plus a11y roles/labels/state (S, one file).
4. **O5.** Fix "road race" copy; make club/coach contacts tappable; check the data source is kart-specific (S–M).
5. **10-16 F1/F3/F4/F6** (carried): sticky Run analysis bar, wet checklist ✓/⚠, 15pt notices, sub-13pt text.

**Parity note:** `OnboardingScreen` is forked from Send-It. O1, O3, O4 and O7 apply equally to Send-It. Do them in both repos to keep the shared look. O2, O5 and the junior copy in O6 are KartRacer-specific. Say so in the parity docs.
`android-app/` mirrors `app/`, so every finding applies there too.

## Out of scope this week

- Send-It app screens (no app-code changes).
- `TrackMapView`, `TrackCornerSheet`, `CoachChatScreen`, `HeadlinesScreen`, `AvatarFaceCameraModal`, `AvatarFaceAlignModal`.
- Contrast ratios not recomputed this run (command denied; no retry).
- No simulator or device run. Findings are from code only.

*Report only. Gates for any layout change: `npx tsc --noEmit` in `app/` and `android-app/` plus an on-device manual check.*
