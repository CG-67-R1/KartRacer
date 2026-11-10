# UI Design Weekly Review — 2026-11-06

**Scope:** KartRacer `app/` — `CalendarScreen` (the "Events" tab, 528 lines). It has not been covered by any earlier weekly report. Its only commits are the initial ones (09-09, 09-10).
**Send-It:** no app-code changes. Its last commits (2026-10-16) are landing page only. I did not review Send-It's `CalendarScreen`. A diff shows it has extra World-series chips and a series picker, so the two screens have already diverged.
**Method:** Code read, plus contrast ratios computed this run with a small Python script. Data checks read `api/calendar.js` and `api/data/calendar-static.json`. Hermes cannot run simulators, so nothing here was seen on a device.

**Repo state:** KartRacer's last commit is 2026-10-13 (`84a95a2`). `app/` and `android-app/` have not changed since the 10-16 review. **Nothing from the 10-16, 10-27 or 10-30 reports has been implemented.** `CalendarScreen.tsx` in `app/` and `android-app/` are identical.

## Executive summary

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 4 (E1, E2, E3, E4) |
| P2 | 5 (E5, E6, E7, E8, E9) |

**Verdict:** The layout is clean: cards, a series colour edge, a 44pt reminder button, a retry on the error state, pull to refresh. The Send-It fork has left the screen offering filters that cannot work in KartRacer, error copy written for developers, and no screen reader support at all.

## Carry-over (all still OPEN, no code changed)

- **10-30:** C1–C4 are P1: chat accessibility, send key, error retry, silent spinner. C5–C9 are P2.
- **10-27:** O2 (onboarding email consent and parent line) is still the highest-priority item. O3–O8 are open. O1 and O9 were corrected on 10-30.
- **10-16:** F1–F10 are open.
- Nothing is resolved. This is the third week with no `app/` commits. The backlog is growing faster than it is being cleared. Top-5 below is deliberately short.

## Trend / competitor watch

- **Apple HIG, Materials (Liquid Glass).** WATCH. Read this run (developer.apple.com, HIG Materials page). Apple's own text says:
  - *"Don't use Liquid Glass in the content layer."*
  - Use it sparingly on custom controls.
  - Clear glass can change with the Reduce Transparency and Increase Contrast settings.

  This supports last week's hype flag. Our data cards are content-layer, so there is nothing to adopt. React Native's standard navigation bars pick it up on iOS 26 when built with the current SDK. The action is to check once on an iOS 26 device that the header and tab bar still contrast with the dark slate.
- **Official F1 "add the calendar to your device" feature.** ADOPT, pattern only. formula1.com offers a one-tap sync/download of the full season calendar, with session times converted to the user's time zone. Read from the formula1.com help article snippet. Our `+ Add reminder` is per event. A single "Add all to calendar" or `.ics` subscription for the user's state or favourite club is the equivalent. It is useful for a parent planning a season. It is behind the more urgent fixes below. See E9.
- **Android calendar-style "agenda" lists (month headers, sticky).** WATCH. This is a common calendar pattern. It would help once the list is more than about 15 events. Only 5 national rounds are in `calendar-static.json`. The club events come from the scraper cache, and I did not count them.
- **Not checked this week:** Strava, Whoop, Duolingo, MotoGP, Apple Fitness, NN/G, Mobbin. They rotate.
- **Hype flag:** Liquid Glass and Material 3 Expressive translucency. Still wrong for sunlight readability at a track.

## Per-screen findings — `CalendarScreen` ("Events")

Flow walked as three users:
- **First-time:** opens Events and sees the logo, "Events", and a grey subtitle. The default filter is the local one. They can orient in 5 s, but the tab bar and filter row both say "Australia"/"World"/"All" and one of those is empty (E1).
- **Returning racer mid-session:** wants "when is the next meeting near me". The list is date-sorted with past events hidden, which is good. There is no state filter, no "next up" highlight, and no days-to-go.
- **Junior/parent:** a parent adds a reminder. The wording works. If the API is down they see "Start the API server (in /api run: npm start)" on a native build (E2).

**E1 (P1, S). The "World" and "All" filters cannot show anything different from "Australia".**
- *Wrong:*
  - The filter row has three chips: local, World, All.
  - `isLocalEvent` returns true when `detailTier === 'full'`. In `api/calendar.js`, every event returned has `detailTier: 'full'` (club events are hardcoded to it; static events get it when `series` is `akc`, `au_club`, etc.).
  - `calendar-static.json` has `"motogp": []` and no world events. So "World" is always empty and shows "No events match this filter." "All" is identical to the local list.
  - The three chips are two dead controls, and the middle one is the "empty state" the user will land on if they tap it.
- *Why:* Doctrine §2 (state clarity, one primary action per screen). A control that always returns nothing reads as a bug, and the junior user will think the app is broken.
- *Fix:*
  - While the pack is AU-only (`active.json = ["au"]`), hide the filter row entirely when only one distinct group has events. In code: compute `hasWorld = events.some(e => !isLocalEvent(e))` and render the row only when `hasWorld`.
  - Replace it with a state filter, which is what an Australian racer actually needs: chips for `All`, `NSW`, `VIC`, `QLD` and so on, built from the distinct `event.state` values. The `state` field is already in the data.
  - Keep the Send-It code path (chips) behind `hasWorld` so the two screens stay close.
- *Parity note:* this diverges from Send-It's `CalendarScreen`, which has a World series picker. KartRacer's `hasWorld` guard is a small fork. State the fork cost in the commit.
- *Verify:* `npx tsc --noEmit` in `app/` and `android-app/`. On-device: open Events with the real API and confirm there is no empty chip.

**E2 (P1, S). Error copy is written for developers.**
- *Wrong:*
  - On native the hint says "Start the API server (in /api run: npm start)" (line 320). A parent or junior cannot act on this.
  - The first error line passes the raw server `error` string through for non-network failures (line 170).
  - The retry button has no role and its text is unsized (no `fontSize`), so it uses the platform default.
  - The `hint` text is `#64748b` on `#0f172a`, which I measured at **3.75:1**. That is below the 4.5:1 AA bar.
- *Why:* Doctrine §6 (junior-facing, plainer words, reassurance) and §5 (contrast).
- *Fix:*
  - Replace the native hint with: "Check your signal and try again. Events load from the internet."
  - Keep the developer line behind `__DEV__`.
  - Map any non-network error to "Couldn't load events right now."
  - Hint colour `#94a3b8` (5.7:1 on the card colour, similar on the page background).
  - Retry text `fontSize: 16`.
  - Add `accessibilityRole="button"` to Retry.
- *Verify:* turn on aeroplane mode on a device and open Events.

**E3 (P1, M). Cached events are not kept, so a track with no signal shows an empty error.**
- *Wrong:* `fetchCalendar` sets `events` to `[]` on any failure (line 172). `useFocusEffect` refetches on every tab focus, with a 15 s timeout. At a track with weak signal, the user who looked at the list five minutes ago now sees an error. I did not check whether `apiFetch` caches. The fetch also passes `cache: 'no-store'`.
- *Why:* Doctrine §2 (error and loading states designed) and §6 (sunlight/track reality). NN/G's error-state guidance is to preserve the user's context where possible. I did not read that article this run, so treat that clause as general practice, not a citation.
- *Fix:* Persist the last good list to AsyncStorage under `@kartrace_calendar_cache` (the prefix is already in AGENTS.md). On failure, show the cached list with a one-line banner: "Showing saved events. Couldn't refresh." and keep Retry in the banner. Only show the full-screen error when there is no cache.
- *Effort:* M (one storage key, one banner, a small hook). It touches `storageKeys.ts`.
- *Verify:* load the list online, switch to aeroplane mode, return to the tab.

**E4 (P1, S). No accessibility semantics anywhere on the screen.**
- *Wrong:* A search found no `accessibilityRole` or `accessibilityLabel` in the file. Specifically:
  - The filter chips do not say they are tabs or which is selected.
  - The event card is a button that opens a link, but it does not say so. "Tap to open link →" is the only cue and is read as part of the text.
  - "+ Add reminder" reads as "plus add reminder" and does not say which event.
  - The loading spinner has no label.
- *Why:* Doctrine §5 (VoiceOver and TalkBack labels). Platform: iOS expects selected state on segmented controls.
- *Fix:*
  - Chips: `accessibilityRole="tab"` and `accessibilityState={{ selected: filter === key }}`.
  - Event card: `accessibilityRole="link"` with `accessibilityLabel={`${eventTitle(item)}, ${formatDateRange(...)}, ${venue}`}`, and `accessibilityHint="Opens the event page"` when `item.url` exists.
  - Reminder button: `accessibilityRole="button"` and `accessibilityLabel={`Add ${item.title} to calendar`}`.
  - Loading text is already present. Add `accessibilityLiveRegion="polite"`.
  - Drop the `+` from the visible label, or mark it `importantForAccessibility="no"`.
- *Verify:* VoiceOver on iOS and TalkBack on Android.

**E5 (P2, S). Small text on the card, with a failing contrast pair.**
- *Measured this run:*

  | Element | Colours | Ratio |
  |---|---|---|
  | `venue` (14pt) | `#64748b` on `#1e293b` | **3.07:1, fails AA** |
  | `headerSubtitle` (14pt) | `#64748b` on `#0f172a` | **3.75:1, fails AA** |
  | `hint` | `#64748b` on `#0f172a` | 3.75:1, fails AA |
  | motogp series label (12pt) | `#e11d48` on `#1e293b` | **3.11:1, fails AA** |
  | `date` | `#94a3b8` on `#1e293b` | 5.71:1, passes |
  | `auDetail` | `#f59e0b` on `#1e293b` | 6.81:1, passes |
  | worldsbk label | `#0ea5e9` on `#1e293b` | 5.28:1, passes |
  | active chip | `#0f172a` on `#f59e0b` | 8.31:1, passes |

- *Also small:* `series`, `date` and `notes` are 12pt. `auDetail` and `tapHint` are 13pt. `filterChipText` is 14pt.
- *Why:* Doctrine §3 (body text ≥15–16pt) and §5 (4.5:1). Venue is the key fact on an event card, and it is the faintest text.
- *Fix:*
  - `venue` colour `#94a3b8` and 15pt.
  - `headerSubtitle` colour `#94a3b8`.
  - `date`, `series`, `notes` 13pt. `auDetail` and `tapHint` 14pt.
  - The `motogp` colour is unreachable in the AU pack. If it stays, use `#fb7185`, which I did not measure.
- *Verify:* outdoors at max brightness.

**E6 (P2, S). The whole card is not one tap target, and the link affordance is weak.**
- *Wrong:* The info area opens the event URL, and the reminder button sits below it. When `item.url` is null the area is `disabled` but looks the same. The first events in the static file all point to the same generic page, `https://www.karting.net.au/ka-calendar`, so the "Tap to open link →" promise often leads to a calendar page, not the event.
- *Why:* Doctrine §2 (one primary action, state clarity).
- *Fix:*
  - Only show "Tap to open link →" when the URL is event-specific. A simple rule is to hide it when it equals the generic calendar URL.
  - Or rename it to "Event details →" and use a chevron on the right of the title row.
  - I did not check how many club events have specific URLs.

**E7 (P2, S). No "next up" or time cue.**
- *Wrong:* Every card has the same weight. A racer mid-week wants to know the next meeting and how far away it is.
- *Why:* Doctrine §7 (one glanceable summary above the fold). Apple Weather and Fitness use one hero card on top. F1's official calendar pattern leads with the next race.
- *Fix:*
  - Give the first upcoming event an amber outline and a "Next up · in 9 days" pill in the header row.
  - Compute from `startDate` with the same local-midnight helpers already imported.
  - For events in progress show "On now".
- *Effort:* S, because the date helpers exist.

**E8 (P2, S). Success and errors for "Add reminder" are system alerts, and the iOS path is a form.**
- *Wrong:* After the system form saves, the app shows another `Alert` "Added". The user has just seen the system confirmation. Two modals for one action.
- *Why:* Doctrine §2 (taps-to-goal, no redundant confirmation).
- *Fix:* Remove the "Added" alert. Optionally flip the button to "✓ Added" for the session. The permission-denied alert is useful and should stay.
- *Note:* I did not check what the Android path does. `addEventWithForm` is cross-platform in `expo-calendar`, but behaviour was not verified.

**E9 (P2, M). Season-level sync is missing.**
- *Wrong:* A parent planning the season must tap Add reminder 5–20 times.
- *Why:* The official F1 site offers a one-link calendar sync (read this run). This is a tested pattern for long seasons.
- *Fix:* After the E1 state filter lands, add a footer row "Add all {state} events" that loops the existing ICS builder on web, and on native adds the events with one confirmation. Needs a product decision on native, so list as WATCH until the state filter is in.

**Brand/leak (P2, S, found in passing).** Two RoadRacer strings remain in the event export path:
- `CalendarScreen.tsx` line 120: `uid: ...@roadracer.app`.
- `eventIcs.ts` lines 81 and 89: fallback filename `roadracer-event.ics` and fallback uid `@roadracer.app`.

`PRODID` already says KartRacer. These are not shown in the UI, but they land in the user's calendar file. Change them to a KartRacer domain. AGENTS.md says not to reuse Send-It ids. Counted with E9 as P2 (not a separate score). This is a data-leak/branding item, not a layout one. Do both repos' copies (`app/` and `android-app/`).

## Top 5 fixes for Cursor (impact / effort)

1. **E1.** Hide dead World/All chips, add a state filter (S).
2. **E2 + E4.** Plain error copy, 4.5:1 hint colour, accessibility roles and labels on Events (S, one file; roles also feed 10-30 C1).
3. **10-30 C3 + C4.** Chat error retry and a "thinking…" state (S, one file). Still the best fix for the Coach and Kart Setup flow.
4. **E3.** Cache the last good event list (M).
5. **10-27 O2.** Onboarding email consent and a parent line for under-16s (M). This is the only privacy item.

**Parity note:**
- E2, E4, E5 and E8 apply to Send-It's `CalendarScreen` too. Do them in both repos.
- E1 is a KartRacer-specific fork (no world series in the AU pack). Flag the fork cost.
- `android-app/` mirrors `app/` (files are identical today), so every finding applies there.
- The `@roadracer.app` leak is KartRacer only.

## Out of scope this week

- Send-It's `CalendarScreen` and the rest of Send-It.
- `Headlines`, `QA`, `TrackWalk`, `GearingGuide` and `KartSessionUpload`. They have had no UI review yet and are the next candidates. `QAScreen` (1,176 lines) is the biggest.
- Whether `apiFetch` caches responses. The club events count in the scraper cache.
- No simulator or device run. Colour ratios were computed from the hex values in code. They have not been checked on a screen.

*Report only. Gates for any layout change: `npx tsc --noEmit` in `app/` and `android-app/` plus an on-device manual check (iPhone SE and a notched iPhone, Android gesture nav, VoiceOver and TalkBack, outdoors at max brightness, aeroplane mode for E2 and E3).*
