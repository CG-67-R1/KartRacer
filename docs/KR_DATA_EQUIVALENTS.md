# KartRacer — RR -> KR data equivalents and curation sources

Every data asset Send-It (RoadRace) uses, its kart-racing equivalent, and where to curate it.
Status: DONE = exists in C:\KartRacer; BUILD = to create; N/A = drops out.

## 1. Track data

| RR asset | KR equivalent | Status | Source |
|---|---|---|---|
| scripts/track-memory-gpx/ (RR circuits) | 129 kart track GPX, 1 lap + S/F wpt | DONE `C:\KartRacer\data\gpx` | AiM Aus_Kart.ztracks (converter kept in tools/) |
| app/src/data/tracks.json catalog | Kart venue catalog (club, state, length, S/F coords) | BUILD | GPX metadata (name/state/length already decoded) + club websites for full venue names/addresses |
| gpxTrackMaps/ | same, rebuilt from kart GPX | BUILD (scripted) | build-gpx-track-maps.mjs |
| catalog_track_geofences.json | kart geofences | BUILD (scripted) | GPX bounds |
| track_turn_verification.json (P0 hands) | kart turn hands | BUILD | Club track maps/PDFs, satellite imagery, onboard videos. Same P0: never from GPX alone |
| trackDetailsCorners/ + trackInfo/ facts | corner names, surface, pit side, direction | BUILD | Club sites (e.g. GoKartClubSA, CDKC), track guides in KartSportNews, onboard laps on YouTube |
| racingLines/ (solver) | kart racing lines | BUILD later | Retune quasi-steady solver: kart mass ~160-180kg with driver, lat grip up to ~2g slicks, no lean model |
| track_geometry_australia.json (GPT pack) | kart_geometry_australia.json | SKELETON in gpt-knowledge | Derive from GPX per layout; verify direction per club |

## 2. Vehicle domain (bike -> kart)

| RR asset | KR equivalent | Status | Source |
|---|---|---|---|
| bikeSetupBasics.ts (suspension, geometry) | kartSetupBasics (front width, caster, camber, toe, Ackermann, axle stiffness, hubs, seat, ride height, torsion bars) | BUILD | ANGRI Racing kart setup guide (angriracing.com/kart-setup), OTK chassis setup guide, Paradigm Shift Racing setup series, chassis maker manuals (Tony Kart, Birel ART, CRG) |
| gearing/bikePowerbandRef.json | kartEngineRef.json (X30, KA100/KA3/KA4, Rotax Max/Junior/Senior, KZ2, 4SS) | BUILD | Karting Australia engine tech specs PDFs (karting.net.au/administration/technical), IAME + Rotax official docs |
| onboardingBikes.json | onboardingKarts.json (chassis: Tony Kart, Kosmic, Exprit (OTK); Birel ART; CRG; Arrow; EOS; Parolin; FA Kart + engine packages) | BUILD | Manufacturer sites, AU importers (Patrizi Corse=Birel, Remo Racing=IAME, Parolin Australia, Alpha Motorsport=EOS) |
| onboardingRiders.json (racer blurbs) | onboardingDrivers.json — DECIDED 2026-09: themed on the karting-to-pro pathway: Formula 1 (e.g. Ricciardo, Piastri, Hamilton, Verstappen — all ex-karters), V8 Supercars/Supercars champions who began in AU karting, IndyCar Series (e.g. Power, McLaughlin, Palou), F1 Academy drivers. Verify every blurb; aliases + characteristics format kept | BUILD | Official F1/Supercars/IndyCar/F1 Academy sites + driver bios; KartSportNews archive for their AU karting origins |
| Suspension KB (Ohlins/WP/Nitron...) | Chassis tuning KB (no suspension; axle/torsion/seat tuning) | SKELETON in gpt-knowledge | ANGRI + OTK + chassis manuals as above |
| Tyre KB (Pirelli/Michelin/Bridgestone/Dunlop road-race) | Control kart tyres: MG (AKC slick), LeCont SV1 wet, Maxxis MW22 wet, Dunlop DFM/DGM, Bridgestone YLC/YDS, Mojo (Rotax) | SKELETON in gpt-knowledge | Karting Australia tyre spec PDFs (karting.net.au/administration/technical), tyre maker sites, class regs |
| tyre pressure guides | kart pressures (typical 8-14 psi slicks, class/tyre-specific) | BUILD | Tyre importer guidance, club tech notes, MG/LeCont official docs. No invented numbers |
| tyre-wear-patterns / photo recognition | kart slick wear atlas (graining, blistering, hot tear, cold graining, flat spots, inner/outer shoulder wear from camber/width) | SKELETON | TKART technical articles, tyre maker tech notes, Paradigm Shift Racing |

## 3. Rules, licensing, organisations

| RR asset | KR equivalent | Status | Source |
|---|---|---|---|
| MoMS (Manual of Motorcycle Sport) ingestion | 2026 Australian Karting Manual (KA National Competition Rules + updates) | BUILD | karting.net.au/administration/rules (PDF set, updated annually + mid-year updates) |
| MA licensing pathways | KA licence grades (C Grade Junior/Senior, D Grade, E Grade practice, endorsements) | BUILD | karting.net.au licensing pages, KA Manual chapters |
| Organisations: MA + state MCs + clubs | Karting Australia + state assocs (KANSW kansw.com.au, Karting SA kartingsa.com.au, KA Vic, KA Qld, KA WA, KA Tas, KA NT) + ~90 clubs | BUILD | karting.net.au club finder, state body sites; club list also derivable from the 129 GPX venue names |
| Competitions: ASBK classes/series | KA classes: Cadet 9/12, KA4 Jnr, KA3 Snr, KA2, X30, TaG 125/Restricted, KZ2, Victorian Combined etc. Series: Australian Kart Championship (AKC), Rotax Pro Tour, state championships, club champs | BUILD | 2026 AKC Sporting Regulations PDF, KA Manual class rules, rotaxaustralia |
| Rulebook quick-refs (flags, penalties) | kart flags/penalties/weights (same KA Manual) | BUILD | KA Manual |

## 4. Calendar + headlines (API)

| RR asset | KR equivalent | Status | Source |
|---|---|---|---|
| au-road-race-sources.json (Timely ICS + club scrapes) | au-kart-sources.json | BUILD | Karting Australia event calendar; KANSW calendar (kansw.com.au/calendar); Karting SA calendar (kartingsa.com.au/calendar); other state calendars; Rotax Pro Tour |
| calendar-static.json (ASBK rounds) | 2026 AKC rounds (R1 Coffs Harbour Mar 13-15 ... finale Bolivar SA Oct 16-18) + Rotax Pro Tour + state title dates | BUILD | karting.net.au/national-level-events/australian-kart-championship |
| Headlines RSS (MCNews etc.) | KartSportNews (kartsportnews.com), Karting Australia news feed, FIA Karting (fiakarting.com), TKART magazine (tkart.it/en) | BUILD | Feed URLs to verify at build time |
| include/exclude keywords | include: Kart, AKC, Rotax, Club Day, State Titles, Cup; exclude: Motocross, Speedway, Road Race, Superkart | BUILD | DECIDED 2026-09: Superkarts are OUT of scope (MA-sanctioned, different discipline) |

## 5. Q&A knowledge base (PDF corpus)

RR used MoMS + race history books + technique books. KR equivalents to acquire/ingest:

- 2026 Australian Karting Manual (rules corpus) — karting.net.au [primary]
- KA class technical regulations + engine spec PDFs — karting.net.au/administration/technical
- 2026 AKC Sporting Regulations — kartingaustralia media
- Kart setup/technique books (own copies required, same as RR book set): e.g. "Kart Driving Techniques" (Jim Hall), "Karting: Everything You Need to Know" (Memo Gidley/Jeff Grist), "Learn How to Master the Art of Kart Driving" (Terence Dove)
- TKART technical article set (subscription) — tkart.it/en
- History / general info: DECIDED 2026-09 — general-interest KB corpus is Formula 1, V8 Supercars, IndyCar Series, F1 Academy, GT Cup, GT World Challenge, NASCAR, and FIA World Endurance Championship (incl. Le Mans), replacing RR's MotoGP/TT book set. Coverage brief: histories and champions; karting origins of drivers; new-generation racers (current grids, rookies, junior-pathway graduates) AND older greats; standout teams, drivers, and cars of the last 50 years (~1976-present: e.g. F1 dynasties Ferrari/McLaren/Williams/Red Bull/Mercedes; Le Mans icons Porsche 917 lineage-956/962, Audi R8-R18, Toyota GR010; NASCAR greats Petty/Earnhardt/Johnson; Supercars Brock/Lowndes/Whincup + Bathurst; IndyCar Unser/Andretti families to Dixon/Power/Palou; GT3 era teams). Australian karting history (KA 60-years content, KartSportNews archives) stays as the local layer

Pipeline unchanged: drop PDFs in Q&A/, `npm run scrape-pdfs`.

## 6. Coach / GPT knowledge pack

RR pack at Send-It docs/gpt-knowledge -> KR pack skeleton at `C:\KartRacer\gpt-knowledge\` (this delivery).
File-by-file mapping in its README.md. Populate order: instructions -> core diagnostic -> class reference ->
chassis+tyre KB -> track geometry -> track bias.

## 7. Misc app data

| RR asset | KR equivalent | Source |
|---|---|---|
| rider_ai_faqs | kart FAQs (get licence, first club day, buy first kart, class ladder by age, transponders, race weights) + general-info FAQs on the pro pathway (karting -> Formula 4 -> F3/F2 -> F1; karting -> Supercars; F1 Academy route) | KA site, state body FAQs, club new-member pages; official series sites |
| trivia bank | DECIDED 2026-09: trivia themed on Formula 1, V8 Supercars, IndyCar Series, F1 Academy, GT Cup, GT World Challenge, NASCAR, and FIA WEC/Le Mans — new-generation racers and older greats; standout teams, drivers, and cars of the last 50 years; karting-origin angles (which champions started in AU karting, AKC history feeding those series) | Official series stats pages (formula1.com, supercars.com, indycar.com, f1academy.com, gt-world-challenge, gtcup.com.au, nascar.com, fiawec.com, 24h-lemans.com), KartSportNews archive, FIA Karting history |
| emergency.json (packs) | unchanged concept; kart club emergency/med info | club sites |
| suppliers.json | kart shops/importers per state | state body partner pages, importer list above |
| weather | unchanged (same providers) | — |

## Primary curation source register (verified live 2026-09)

1. karting.net.au — Karting Australia: rules manual, tech specs (engines/tyres), licensing, AKC calendar, club finder [AUTHORITATIVE]
2. State bodies: kansw.com.au, kartingsa.com.au, + Vic/Qld/WA/Tas equivalents — state calendars, club champs
3. kartingaustralia.mymedia.delivery — official PDF store (AKC sporting regs, specs)
4. kartsportnews.com — AU kart news + track guides [headlines primary]
5. fiakarting.com — international results/news
6. tkart.it/en — technical/setup articles
7. angriracing.com/kart-setup — free, thorough chassis setup theory (terminology, front/rear adjustments, troubleshooting)
8. paradigmshiftracing.com — setup + CG theory series
9. OTK/Tony Kart, Birel ART, CRG manufacturer setup guides (PDF)
10. Engine: IAME (via Remo Racing AU), Rotax (BRP), KA tech PDFs
11. Tyres: MG Tires, LeCont, Maxxis, Dunlop, Bridgestone, Mojo — spec sheets via KA technical page
12. AiM Race Studio 3 track DB — future track additions (.ztracks -> tools/tkk2gpx.py)

Rule carried over from RR: coaching prose = bias (Medium/Low authority); manufacturer/KA tables = fact; never invent pressures or numbers not in a cited file.
