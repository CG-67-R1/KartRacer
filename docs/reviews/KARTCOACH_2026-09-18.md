# KartCoach review — 2026-09-18

VERDICT: NEEDS WORK

This week's rotated surface: **coach prompts / Q&A end-to-end** (roadraceAi.js
prompt assembly, rider_ai_faqs.json, rules mode, chat screens), as planned last
week. No live API call was possible — api/ has no .env and OPENAI_API_KEY is
not set on this machine, so the "run a real KA3 Junior session" part is a
static review of exactly what the model would be sent (system prompts, skill
layers, FAQ injection, rules retrieval chain). That is stated honestly, not
papered over. Repo has had no commits since 2026-09-13 (last: 591e3d6), so two
of last week's recommendations are still open, and the 09-13 map rebuild
introduced a visible regression.

## Coach's view (plain language)

- **The coach prompts are genuinely kart-correct.** COACH_SYSTEM, CHASSIS
  (BIKESETUP_SYSTEM), ASK and RULES prompts all carry the lines I care about:
  rear-brakes-only (KZ2 adds front), never advise car/bike trail-braking,
  ≤0.1 bar steps, stop-list before numeric setup (950-vs-1050 chassis, class,
  tyre spec), no invented pressures, parent/guardian sign-off in the exact
  sign-off string, plain text for a phone bubble. Rules mode answers ONLY from
  KA Manual excerpts with a forced Answer/Quote/Citation/Note format and
  refuses when nothing matches. As a coach I'd let a junior's parent read
  these prompts and they'd nod.
- **The FAQ pack is cited and sound.** 11 coach + 8 setup FAQs + 4 global
  principles; pressures quote the KA compound windows (LH03 9.5–11.0 psi, LOH
  8.5–10, LPM 8.0–9.5, Maxxis Cadet 0.6 bar) with named sources; licence and
  class-ladder answers match the KA structure. No motorcycle residue in the
  FAQ content (grep clean).
- **P1 gap: the skill layer has no idea the driver is a child.** instructions.md
  promises a cadet/junior/senior skill layer, but the app derives skill purely
  from onboarding activity: "I race" → **advanced** (race-engineer depth,
  axle/caster/gearing detail, 1400 tokens). A 10-year-old Cadet 12 racer picks
  "I race 🏁" — because they do race — and gets the advanced layer. Onboarding
  never asks age or class. The junior-safety lines still apply, but the wording
  depth routing is exactly backwards for our core users.
- **Regression: 15 track outlines no longer close.** prove-track-maps now warns
  "large closing gap" (18–52 map units) on 15 layouts (lkc 52.1, indy800c 51.8,
  bolivark_sh 43.9, east_crk_nsw 39.9, spkp_var1 39.2, esperancek 35.4,
  rockhamptonk 35.3, portgawlerk 34.5, launcestonk 28.9, lismorek 28.5,
  mackayk 27.7, a_wodongak3 25.3, spkp_var3 18.8, canberralong 18.3,
  wollongongk 30.2). Last week only wollongongk was flagged. The raw GPX all
  close cleanly (my audit), and the gpxTrackMaps were rebuilt wholesale in
  05f58a4 — so the map build pipeline is dropping the closing segment, not the
  data. A track outline with a visible gap is the first thing a parent notices.
- **Two last-week items not actioned** (no commits since): the four stub KB
  files the live BEGIN prompt cites are still SKELETON (kart_geometry_australia.json,
  session-learning-v1.json, instructions-extended.md, driving-techniques-combined.md —
  10 of 20 files still stubs), and the cadet wet-tyre data fix has not landed:
  kb-au-rules still says "Maxxis MW21" only in **three** places
  (data/tyres-fuel-oils.json cadet + 4ss_cadet, data/classes.json Cadet 9/12
  entries, national/classes.md tyre line). Correct spec: MW21 front + MW22
  rear (KA competition-tyre FAQ). This corpus feeds the RULES retrieval — the
  rule-check mode can now cite the wrong wet tyre with a straight face.
- **Rider/bike brand leaks survive in user-facing copy.** Settings: "Rider
  name", "Rider photo", activity option "Intermediate rider"; TrackdayPrep:
  "Rider level", "Bike"; TrackWalk: "Rider experience (optional)". Internal ids
  (bikesetup mode, just_love_bikes) are fine to keep, but a karting parent
  reading "Bike" on a prep sheet loses trust. The 3384f9d leak-fix pass missed
  these.

## Junior-communication practice (before/after)

Real strings from this week's surface, said the way I'd say them to a
12-year-old Cadet driver (and the parent reading over their shoulder).

**1. FAQ "What do the licence grades mean?" — "High to low: A / E-A, B / E-B,
C / E-C, D, E (social), 8-Day (one try-a-meeting per year). D→C after 4
endorsed meetings. C→B after 6 meetings or a listed National top-5…"**
> After: "Licence grades are steps on a ladder. Nearly everyone starts at D.
> Race 4 club meetings and you move up to C — that lets you enter bigger
> events. Keep racing and you keep climbing. Your club secretary can tell you
> exactly which step you're on."

(The full grade alphabet belongs in the KA Manual link, not the first answer.
Lead with the step the kid is actually on.)

**2. FAQ "What cold pressure should I start with?" — "Use the cited starting
window for your compound, then adjust. LeCont LH03 9.5–11.0 psi (KA3/KA4/TaG
Restricted/DD2/Jr Max); LOH 8.5–10 psi (KA2/TaG 125); LPM 8.0–9.5 psi…"**
> After: "First, check which tyre your class runs — it's printed on the
> sidewall. Cadets on Maxxis start around 8.7 psi. KA3 on LeCont LH03 start
> between 9.5 and 11. Set pressures in the pits while the tyres are cold, and
> only change them 0.1 bar at a time. Not sure which tyre you have? Ask your
> mechanic before you touch the valve."

(One class at a time. A junior needs their number, not the whole table.)

**3. CoachChat handoff — "Switched to Kart Setup. Tell me your kart, what feels
off (tyres, width, caster, gearing), and we will dig in."**
> After: "This is Kart Setup. Tell me your kart and your class, and what it's
> doing that you don't like — sliding, hopping, or slow out of corners — and
> we'll fix one thing at a time."

(Name the feelings a driver has — slide, hop, slow exit — not the component
list. "Caster" means nothing until the coach introduces it.)

Pattern check: these FAQ answers are injected into the system prompt for all
skill levels; once the skill layer knows the driver is a junior (see rec 2),
the novice variants above should be what a cadet/junior actually receives.

## Technical findings

- **Gates run:** `prove-track-maps.mjs` — 128 layouts pass, **30 warnings: 15
  layouts with large closing gaps** (list above; was 1 last week). Racing lines
  now ship and all close (gap ≤ 0.5 gate passes) and stay on the asphalt —
  good. `validate-track-data.mjs` — pass, 1 warning (newcastle_nkrc planned/no
  GPX, unchanged). `check-hand-convention.mjs` — clean, no kart hands set (P0
  discipline holding). `enforce-turn-verification.mjs` — clean.
  `test-onboarding-facts.mjs` — pass (46 drivers, 36 karts). homeMode tests —
  pass. `npx tsc --noEmit` in app/ — exit 0.
  `tools/kartcoach_gpx_audit.py` — 129/129 parse, 1 flag (GeraldtonK 244 m,
  still correctly excluded from catalog).
- **Closing-gap root cause is the builder, not the GPX.** Audit shows loop
  closure good on all 129 source files; the 15 open outlines appeared after
  the 05f58a4 rebuild of app+android gpxTrackMaps. Fix belongs in
  build-gpx-track-maps.mjs (close the ring / append first point after
  simplification), not in re-tracing.
- **Live coach session not run:** no OPENAI_API_KEY on this box (api/.env
  absent — correct, secrets don't belong in the repo). Prompt assembly reviewed
  statically end-to-end: getSystemPrompt() = mode system + shared rules +
  skill layer + FAQ injection; rules mode = keyword rewrite → lexical retrieve
  → LLM rerank → excerpt-only answer. Chain is sound; add a scripted smoke
  test that runs one COACH and one RULES question when a key is present.
- **Skill routing:** riderAiSkillFromActivity: race→advanced,
  intermediate→intermediate, else novice. No age/class input exists in
  onboarding (verified — steps are kart, driver, avatar, activity,
  future-racer). instructions.md's cadet/junior/senior layer is not
  implemented in the app path.
- **MW21-only wet-tyre spec confirmed at 3 locations in kb-au-rules** (grep):
  tyres-fuel-oils.json lines 19/23, classes.json lines 31/57/259,
  national/classes.md line 43. gpt-knowledge markdown files were corrected
  last week and remain correct; kb-au-rules is app/rules data, so it stays
  Cursor's fix — now escalated because rules mode retrieves from it.

## Recommendations for Cursor (numbered, priority)

1. **P1 — Fix outline closure in build-gpx-track-maps.mjs and rebuild both
   map sets.** 15 layouts (list above) draw with an open outline; source GPX
   all close, so close the polyline ring in the builder (snap/append first
   point post-simplification), rebuild app + android-app gpxTrackMaps
   together, and re-run prove-track-maps until 0 closing-gap warnings.
   Ref: scripts/build-gpx-track-maps.mjs, app/src/data/gpxTrackMaps,
   android-app/src/data/gpxTrackMaps; J1.3.
2. **P1 — Give the skill layer an age/class input.** Add one onboarding step
   ("What do you race?" Cadet 9 / Cadet 12 / Junior / Senior / not racing yet)
   and map cadet+junior racers to junior-depth wording regardless of "I race".
   Until then a 10-year-old who races gets the advanced race-engineer layer.
   The three rewrites above are candidate junior copy.
   Ref: app/src/screens/OnboardingScreen.tsx, app/src/navigation/homeMode.ts
   (riderAiSkillFromActivity), api/roadraceAi.js RIDER_SKILL_LAYERS; J2.1/J5.1.
3. **P1 — Correct the cadet wet-tyre spec in kb-au-rules (3 files)** to
   "Maxxis MW21 front + MW22 rear" (KA competition-tyre FAQ): 
   data/tyres-fuel-oils.json (cadet, 4ss_cadet), data/classes.json (Cadet 9,
   Cadet 12, tyre summary block), national/classes.md tyre line — then re-seed
   the Q&A corpus so RULES mode stops certifying the wrong wet tyre.
   Carried over from 2026-09-11 rec 3; escalated P2→P1 because this corpus
   backs the official-rule-check mode.
4. **P2 — Populate the four stub KB files the live BEGIN prompt cites**
   (kart_geometry_australia.json, session-learning-v1.json,
   instructions-extended.md, driving-techniques-combined.md). Carried over
   from 2026-09-11 rec 2, unactioned. Ref: gpt-knowledge/README.md; J3.5.
5. **P2 — Sweep the remaining rider/bike strings in user-facing copy:**
   "Rider name" / "Rider photo" / "Intermediate rider" (HeadlinesSettingsScreen
   + homeMode.ts RIDE_ACTIVITY_OPTIONS), "Rider level" / "Bike"
   (TrackdayPrepScreen), "Rider experience" (TrackWalkScreen). Say "Driver"
   and "Kart". Internal ids (bikesetup, just_love_bikes) may stay.
6. **P2 — Add a coach-smoke script** (scripts/smoke-coach-api.mjs) that, when
   OPENAI_API_KEY is set, sends one MODE:COACH junior question and one RULES
   question and asserts the sign-off line, no-Markdown rule, and a KA citation
   appear. This review could not exercise the live path; a smoke script makes
   that a gate instead of a gap.

## Next week's focus

Rotate to **onboarding/trivia + calendar/headlines sources** (facts accuracy,
junior tone in trivia, Superkarts-exclusion in calendar keywords). Standing
items: re-run prove-track-maps after the closure fix (expect 0 gap warnings);
verify the MW21/MW22 correction landed in kb-au-rules and the Q&A corpus was
re-seeded; check whether an age/class step reached onboarding. If Cursor adds
an API key to a test environment, run the deferred live KA3 Junior session
end-to-end.
