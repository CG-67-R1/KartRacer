# Track data review — 2026-09-13

Corner-count audit of every catalog layout. A kart detector profile was added and the 53 fail layouts were rebaked the same day.

## Fix applied (same day)

`KART_PROFILE` is a separate unlock from the frozen motorcycle `RIDER_PROFILE`. It drops the 500 m lap floor (220 m), nudges a Start/Finish waypoint off a corner instead of throwing, and rejects false return-splits shorter than 55% of catalog length.

`detectForTrackDetails` now uses `KART_PROFILE`. `node scripts/build-track-details-corners.mjs` rebuilt the **53** former fails (app + android). Hands stay `null`. The other 75 overlays are still the J1.6 skeleton.

| Metric | Morning | After bake |
|--------|--------:|-----------:|
| Fail (&lt; 4 numbered turns) | 53 | **7** |
| Dummy Turn 1 only | 29 | **0** |
| Kart-profile throws | 117 (rider) | **0** |
| Eastern Creek National | 1 | **12** |

Still under 4 (all detector-baked, 3 turns, short layouts): `barossa_ccw`, `bhkc`, `cairnsk_var1`, `indy800_sh`, `mtgambierk_s`, `orangek_a`, `silhouettek`.

Do **not** rebuild Impala or Mega Fast Cockburn with the kart profile yet — they would drop from skeleton 10–12 to 3.

## Racing line (same day)

The “racing line” on every layout was the GPS centreline with brake/throttle paint (`generateRacingLineFromMap`). `LINES` was empty. Max offset from the ribbon was **0**. That is why the guide sat in the middle with no apex.

J1.7: `KARTS.sprint` filled in `quasi_steady_line.py` (docs §4.3, no lean model). `build-racing-lines.py` baked **128/128** overlays. The grey ribbon was widened (`SURFACE_UNITS` 1.2 → 4.2) so an apex can actually move across the painted road (was ~1.7 px on a phone).

`prove-track-maps.mjs`: PASS 128; racing-line-missing warnings gone (30 closing-gap warns remain). Hands still unset. Not a lap-time claim.

| Check | Result |
|-------|--------|
| Baked lines | 128 / 128 |
| Still on centreline (max offset &lt; 0.15) | 0 |
| Visible apex (max offset ≥ 1.2 map units) | 128 |
| Weak hard-brake colour | 11 layouts (line still leaves the middle) |

## Morning verdict (before the bake)

**The locked GPX corner detector had not produced the Track Details corner lists.** Every numbered overlay in `app/src/data/trackDetailsCorners/` (and the android-app copy) was written by `scripts/build-kart-corner-skeletons.mjs`. That script never calls `gpx-corner-detector.mjs`. It still stamps `countSource: "autonomous"`.

Using the owner rule — **fewer than 4 numbered corners is a failure** — **53 of 128 layouts** failed that morning. Every layout had at least one numbered turn (usually a dummy Turn 1). None were missing a details file.

## Structural gates

| Check | Result |
|-------|--------|
| `node scripts/validate-track-data.mjs` | PASS — 128 catalog, 128 geofences, 128 Track Details IDs. WARN: planned `newcastle_nkrc` not in catalog. |
| `node scripts/prove-track-maps.mjs` | PASS — 128/128 GPX maps. 158 warnings (no racing-line overlay on all layouts; several large closing gaps). |
| Catalog vs details vs bake GPX | 128 / 128 / 128. `TRACK_DETAILS_EXCLUSIONS` is empty. |
| `data/gpx/` import pack | 129 files. Extra: `GeraldtonK.gpx` (catalog only has `geraldtonk_2`). |
| Turn hands | `verifiedHands` is empty. Skeleton bake left every hand `null` (correct — GPX must not invent L/R). |

## What actually numbered the corners

J1.6 (`CURSOR_BUILD_JOBS.md`) asked for skeleton Track Details. `build-kart-corner-skeletons.mjs` says why:

- The motorcycle detector (`scripts/lib/gpx-corner-detector.mjs`, frozen 2026-09-08) rejects laps under **500 m**.
- Short kart straights trip **“Start/Finish snaps inside a corner”**.

The skeleton baker walks the **0–100 map polyline** (not GPX metres), picks heading-change peaks, and if it finds none it plants a single apex at ~28% of the lap. Metrics are stubs: `headingChangeDeg`, `minimumRadiusM`, and `lengthM` are **0** on every corner of every track. `classification` is always `"corner"`.

`tracks.json` is also a stub: every layout is **T1 + T-Finish** only. Catalog `confirmedCorners()` is therefore **1** for all 128, so it cannot judge the bake.

## Live re-run of the locked detector

Same options as `build-track-details-corners.mjs` (`detectForTrackDetails` + rider profile + catalog length + start/finish shifts), against `scripts/track-memory-gpx/<id>.gpx`:

| Outcome | Count |
|---------|------:|
| Threw | 117 |
| Completed | 11 |
| S/F marker inside a corner | 70 |
| Closed lap too short (&lt; 500 m measured) | 46 |
| Repaired trace too short | 1 (`chkrc_d`, 21 points) |

The 11 that completed do **not** match the skeleton counts (e.g. `kartequip` baked 1 / live 6; `lismorek` baked 2 / live 7; `east_crk_nsw` still throws). Re-running `build-track-details-corners.mjs` today would fail before writing.

Several GPX traces measure far below catalog length (`ballarat_2` 74 m, `sapphire_nsw` 95 m, `tamworth` 100 m, `silhouettek` 107 m). Those are geometry problems, not just detector thresholds.

## Numbered-corner histogram (Track Details)

| Numbered turns | Layouts |
|---------------:|--------:|
| 1 | 29 |
| 2 | 15 |
| 3 | 9 |
| 4 | 2 |
| 5 | 1 |
| 7–9 | 14 |
| 10–14 | 58 |

**Fail (&lt; 4): 53. Pass (≥ 4): 75.** Watch (exactly 4 or 5): `orangek_c`, `bolivark`, `gladstonek`.

Fail layouts are shorter on average (638 m vs 829 m) and sit on sparser polylines (118 vs 168 points). That does **not** make a 1-corner National layout believable.

## Sibling proof these are tool failures

Same venue, different layout count — the short/variant sibling collapses:

| Venue | Pass sibling | Fail sibling |
|-------|--------------|--------------|
| Eastern Creek | — | National / Var 1 / Var 3 / Var 4 all **1** (830–1001 m) |
| Hume International | National **10** | Short **1** (835 m) |
| Canberra Pialligo | Long **11** | Short **1** |
| Indy 800 | Club **14** | Short **1** |
| Emerald | CW **8** | ACW **3** (970 m) |
| Extreme Gold Coast | Long **12** | Short **3** (1127 m) |
| Bolivar | Long **10** | Short **1**; National **4** (watch) |
| Coffs C.ex | A / A3 / B1 / D = 10–13 | C **2**, E1 **1** |
| Monarto | A CCW/CW = 8–11 | B CW **2**, C CCW **2** |
| Albury-Wodonga | (1) **8**, (2) **9** | (3) **1**, Kart Equip **1** |
| Wanneroo | B **10**, National **8** | C **1** |
| Hedland | (2) **10** | (1) **1** |
| Bunbury | (2) **11** | (1) **1** |
| Launceston | — | both **3** and **1** |
| Cairns | — | all three **1 / 3 / 3** |

Highest-confidence P0 fails (full-length club Nationals with one numbered turn):

- `east_crk_nsw` — SIKR National, 994 m, 1 turn (map also has a 39.9 closing gap)
- `spkp_var1` / `spkp_var3` / `spkp_var4` — same venue, 1 turn each
- `waggak` — 808 m, 1 turn
- `elkc_short` — 835 m, 1 turn
- `canberrak` — 723 m, 1 turn vs long 11

## Fail list (&lt; 4 numbered corners)

| ID | Layout | State | Length | Turns |
|----|--------|-------|-------:|------:|
| a_wodongak3 | Albury-Wodonga (3) | VIC | 584 | 1 |
| kartequip | Albury-Wodonga (Kart Equip) | VIC | 577 | 1 |
| barossa_ccw | Barossa (CCW) | SA | 482 | 3 |
| bendigok | Bendigo (Marong) | VIC | 610 | 1 |
| bhkc | Broken Hill | NSW | 385 | 1 |
| bunburyk | Bunbury (1) | WA | 671 | 1 |
| cairnsk_acw | Cairns (ACW) | QLD | 394 | 1 |
| cairnsk_var1 | Cairns (Var 1) | QLD | 399 | 3 |
| cairnsk_var2 | Cairns (Var 2) | QLD | 424 | 3 |
| canberrak | Canberra (Short) | ACT | 723 | 1 |
| towerskart | Charters Towers (1) | QLD | 548 | 2 |
| towerskart2 | Charters Towers (2) | QLD | 498 | 2 |
| chkrc_c | Coffs (C) | NSW | 575 | 2 |
| chkrc_e1 | Coffs (E1) | NSW | 638 | 1 |
| cdkc | Combined Districts | NSW | 721 | 2 |
| dalbyk | Dalby | QLD | 536 | 2 |
| elkc_short | Hume International (Short) | VIC | 835 | 1 |
| emerald_acw | Emerald (ACW) | QLD | 970 | 3 |
| esperancek | Esperance | WA | 646 | 1 |
| exmouth | Exmouth | WA | 640 | 1 |
| extremek_s | Extreme Karting (Short) | QLD | 1127 | 3 |
| geelongk | Geelong | VIC | 734 | 3 |
| clubsa_b_cw | Monarto (B CW) | SA | 786 | 2 |
| clubsa_c_ccw | Monarto (C CCW) | SA | 749 | 2 |
| gvkc | Goulburn Valley | VIC | 514 | 1 |
| indy800_sh | Indy 800 (Short) | NSW | 504 | 1 |
| hamiltonk | Hamilton | VIC | 674 | 3 |
| hedlandkart | Hedland (1) | WA | 670 | 1 |
| wundowie_wa | Hurricane (Wundowie) | WA | 728 | 2 |
| lakekingk | Lake King | WA | 657 | 1 |
| launcestonk | Launceston (1) | TAS | 753 | 3 |
| lkc | Launceston (2) | TAS | 757 | 1 |
| lismorek | Lismore | NSW | 639 | 2 |
| megafastc | Wanneroo (C) | WA | 768 | 1 |
| moranbahk | Moranbah | QLD | 522 | 2 |
| mt_isa | Mount Isa | QLD | 463 | 2 |
| mtgambierk_s | Mt Gambier (Short) | SA | 359 | 1 |
| orangek_a | Orange (A) | NSW | 354 | 1 |
| orangek_b | Orange (B) | NSW | 696 | 3 |
| pictionk | Picton | NSW | 603 | 1 |
| pdkc_short | Portland (Short) | VIC | 475 | 2 |
| silhouettek | Silhouette | VIC | 534 | 2 |
| bolivark_sh | Bolivar (Short) | SA | 620 | 1 |
| east_crk_nsw | SIKR National | NSW | 994 | 1 |
| spkp_var1 | SIKR Var 1 | NSW | 1001 | 1 |
| spkp_var3 | SIKR Var 3 | NSW | 830 | 1 |
| spkp_var4 | SIKR Var 4 | NSW | 830 | 1 |
| waggak | Wagga | NSW | 808 | 1 |
| warrnamboolk | Warrnambool | VIC | 706 | 1 |
| whyallak | Whyalla | SA | 498 | 1 |
| wimmerak | Wimmera (1) | VIC | 501 | 1 |
| wimmerak2 | Wimmera (2) | VIC | 606 | 2 |
| wollongongk | Wollongong | NSW | 511 | 2 |

## Cursor handoff (do not do until asked)

1. **P0** — Do not treat `countSource: "autonomous"` as a detector bake. Either retune/unlock a kart profile (drop the 500 m floor; kart S/F on short straights) or stop labelling skeleton peaks as autonomous.
2. **P0** — Rebuild the 53 fail layouts (start with Eastern Creek family, Hume Short, Wagga, Canberra Short). Club maps / rider counts before trusting any new number. Hands stay unverified.
3. **P1** — Catalog is still T1 + T-Finish. Until official counts land in `tracks.json`, `confirmedCorners()` cannot constrain or score a bake.
4. **P1** — Probe GPX length vs catalog on traces that measure &lt; 200 m (`ballarat_2`, `sapphire_nsw`, `tamworth`, `silhouettek`, `chkrc_d`).
5. **P2** — Map or drop unused `data/gpx/GeraldtonK.gpx`. Racing-line overlays are a separate J1.7 job.

Do **not** run `build-track-details-corners.mjs` as-is — 117 layouts throw. Do **not** infer turn hands from GPX or circuit direction.
