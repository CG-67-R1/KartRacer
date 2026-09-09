# KartCoach review — 2026-09-08

VERDICT: ON TRACK

First weekly review. The KartRacer repo does not exist yet (no git repo, Phase 0
unstarted in CURSOR_BUILD_JOBS.md) — so per procedure this review covers the build
assets in C:\KartRacer: the three planning docs, the 20-file gpt-knowledge pack,
and the 129-track GPX set. That is the job at this stage, not a failure.

## Coach's view (plain language)

- **The groundwork is genuinely good.** The build plan (CURSOR_BUILD_JOBS.md) is the
  right shape: data-only swap, same screens, gates preserved. The RR→KR file map in
  gpt-knowledge/README.md is coherent and the authority order is sound — track prose
  never overrides geometry JSON, pressures only from cited tyre files.
- **Every KB file is still a skeleton (20/20 carry the SKELETON marker, all sections
  TODO).** That's declared honestly and the "do not invent" fencing is exactly what I
  want as a coach — a stub that admits it's a stub is safer than a half-filled file.
  But there is zero coachable content yet; population order steps 1–3 are the
  blocker for everything downstream (coach prompts, setup hub, FAQ).
- **Track data is in strong shape.** 129/129 GPX parse cleanly; lengths min 244 m /
  median 737 m / max 1546 m, with 126/129 inside the typical 350–1100 m AU sprint
  band. State coverage is credible: NSW 31, VIC 32, QLD 23, WA 20, SA 12, TAS 5,
  NT 4, ACT 1 (+1 missing tag). Loop closure is good on all files.
- **Nine data flags need eyes** (details below): 8 tracks where the Start/Finish
  waypoint sits 32–43 m off the recorded polyline, and CanberraLong.gpx missing its
  state tag. None are showstoppers, but S/F position feeds the catalog lat/lon and
  geofences in J1.2/J1.4, so fix before import.
- **Junior/parent readability risk in track names.** File stems like `lkc`, `STKC`,
  `BHKC`, `CHKRC A3`, `MFastKartCoc` are fine as ids but hopeless as display names
  for a 12-year-old or a race-day parent scanning the app. J1.2 must carry proper
  club/venue display names, not the abbreviations.
- **Scope discipline is holding**: Superkarts excluded in the calendar keywords,
  AU-only, P0 turn-direction rule restated in J1.5. Good.

## Junior-communication practice (before/after)

Real strings from the pack, rewritten the way I'd say them to a 12-year-old Cadet
driver. Candidate copy for Cursor when these surfaces get built.

**1. Diagnostic problem type (core-diagnostic-pack-kart-v1.json plan): "mid-corner
bind/hopping"**
> After: "Does the kart hop or feel stuck in the middle of the corner? That's the
> back wheels fighting each other. Tell your coach — it's a setup fix, not a
> driving mistake."

**2. KB section heading (chassis-setup-and-tyre-kb.md): "Cold pressure guidance by
tyre+class (cited only)"**
> After: "Tyre pressures — set them in the pits while the tyres are cold. Find your
> class in the table and use those numbers. If your class isn't listed, ask your
> coach — don't guess."

**3. Session-learning escalation order (session-learning-v1.json plan): "escalation
order: pressures -> width/track -> caster/camber -> axle/hubs -> seat (cheap+reversible
first)"**
> After: "Change one thing at a time, easiest first: tyre pressures, then front
> width, then the trickier stuff. If a change makes the kart worse, put it back
> before trying the next one."

Note the pattern: short sentences, one instruction each, name the feeling the driver
has ("hop", "stuck"), and always route uncertainty to the coach instead of guessing.
That last point doubles as the anti-hallucination rule in kid language.

## Technical findings

- **No app gates exist yet** (no repo). Ran a read-only GPX audit instead
  (`tools/kartcoach_gpx_audit.py`, new — declared-vs-computed length, S/F waypoint
  distance to polyline, loop closure, state tag). 129/129 parse; declared lengths
  match computed within tolerance on all files.
- **S/F waypoint off the polyline (>30 m):** GoldfieldsK (43 m), SPKP Var4 (41 m),
  SPKP Var3 (40 m), LismoreK (39 m), OrangeK C (34 m), WollongongK (34 m),
  MegaFastKart (33 m), OrangeK B (32 m). Either the waypoint or the lap trace is
  off; whichever is wrong will misplace the pin and skew geofences.
- **CanberraLong.gpx** desc reads "Kart track,  AU" — state tag empty (CanberraK
  says ACT; likely a converter miss in tkk2gpx.py).
- **GeraldtonK: 244 m** (declared matches computed, so the trace is self-consistent)
  — well under typical sprint length. Plausibly a cadet/short layout (GeraldtonK 2
  is 664 m), but verify with the club before shipping; don't ship a wrong-length track.
- **AKC priority venue coverage** (per gpt-knowledge README): Bolivar ✓ (3 layouts),
  Ipswich ✓, Emerald ✓, GKCV/Todd Rd ✓. CHKRC A/A3/B1/C/D/E1 are NSW — almost
  certainly Coffs Harbour Kart Racing Club, but confirm. **Newcastle and Monarto:
  no identifiable match in the 129 files** (East Crk NSW = Eastern Creek, Sydney;
  MVKC 2024 is NSW, so not Monarto SA). If those AKC venues are truly absent,
  that's a gap for the app AND for the per-track diagnostic file.

## Recommendations for Cursor (numbered, priority)

1. **P1 — Fix the 9 flagged GPX files before J1.1/J1.2 import.** Files listed above.
   Re-derive S/F waypoint from the club map or snap to the nearest polyline point
   (state which was done); add ACT to CanberraLong.gpx desc (tkk2gpx.py likely has
   the bug — check other converter output too). A coach cares because the S/F pin is
   the first thing a family checks when navigating to a new track.
2. **P1 — Populate gpt-knowledge steps 1–3** (instructions.md, kart-class-reference.md
   from the 2026 KA Manual, chassis-setup-and-tyre-kb.md from ANGRI/OTK/KA tyre PDFs)
   per the README population order. Every content surface I'm meant to review next
   is blocked on this. Cite sources inline; leave pressures blank rather than invented.
3. **P1 — J1.2 track catalog must carry human display names**, not file stems.
   `lkc`, `STKC`, `BHKC`, `CHKRC A3` are unusable for juniors and parents. Add a
   stem → official club/venue name mapping table as part of the catalog build.
4. **P2 — Resolve AKC venue coverage:** confirm CHKRC = Coffs Harbour; establish
   whether Newcastle (NKRC) and Monarto layouts exist under another stem or are
   missing from Aus_Kart.ztracks; if missing, source traces before J1.2 (both are
   named AKC priority venues in the KB plan).
5. **P2 — Verify GeraldtonK 244 m with Geraldton City Kart Club** (short/cadet
   layout vs error). Keep it out of the catalog until confirmed, or label the layout.

## Next week's focus

Rotate to **coach prompts / instructions.md** if population has started (review the
BEGIN block, modes, and junior-safety rules as a coach); otherwise re-check Phase 0
progress and deep-dive the CURSOR_BUILD_JOBS Phase 1 outputs. Standing item: rerun
`python C:\KartRacer\tools\kartcoach_gpx_audit.py` after any GPX fixes.
