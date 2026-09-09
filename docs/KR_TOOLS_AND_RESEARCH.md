# KartRacer — existing tools, coaching resources, textbooks, and core maths

Research register for Cursor + KB curation. Verified via web search 2026-09.
Purpose: (a) know what already exists before building our setup/coaching features,
(b) source list for the chassis/coach KB, (c) the maths the app's calculators and
racing-line solver retune will need.

## 1. Existing kart chassis setup / tuning tools

Competitor + reference landscape for our Kart Setup hub (J2.1/J2.2):

| Tool | Platform | What it does | Relevance |
|---|---|---|---|
| Kart Chassis Setup Pro (JetLab) | Android/iOS | Setup entry + analysis; tracks current chassis config against conditions | Closest analogue to our Setup Sheet; study field list |
| KartSetups (kartsetups.co.uk) | Web app | Setup storage + analytics for drivers/teams; session-linked | Model for setup history / session compare |
| Kart Track App (karttrackapp.com) "Speed Lab" | iOS/Android | Setup storage, on-track session logging, AI karting assistant, MyChron data analysis + AI coaching report | Direct feature overlap with our Coach + Setup + session-learning; benchmark it |
| ANGRI Racing Academy kart-setup pages | Web (free) | Full setup theory: terminology, baseline settings, front/rear adjustments, troubleshooting tables | Primary curation source for chassis-setup-and-tyre-kb.md (already registered) |
| OTK / Tony Kart chassis setup guide | PDF | Manufacturer baseline + adjustment guide (axles, hubs, bars) | Manufacturer-fact authority for OTK karts |
| TKART "tips & tuning" | Web (subscription) | Deep-dive setup articles, interactive guides | Paid curation source |
| Circle Track App (Wehrs) / Performance Trends Circle Track Analyzer | iOS/Android/Win | Oval-car setup tools | NOT kart-specific — ignore (kart chassis theory differs: no diff, no suspension) |

Data/telemetry tools (the real "tuning tools" ecosystem karters use):

| Tool | What it does |
|---|---|
| AiM MyChron 6 + Race Studio 3 | De-facto standard kart dash/logger; RS3 desktop analysis; Track Manager uses the same .ztracks/.tkk track DB we already convert (tools/tkk2gpx.py) |
| Alfano 7 / ADA software | Logger + analysis alternative |
| Unipro Unigo | Logger + analysis alternative |
| OTK Dekton | OTK factory logger system |
| Kart Track Speed Lab | Cross-logger analysis + AI coaching layer on MyChron data |

App opportunity note: none of the setup apps tie setup -> track map -> coaching diagnostics
in one place; that combination (Send-It architecture with kart data) is the differentiator.

## 2. Driver coaching tools / instruction (new, old, young drivers)

| Resource | Form | Audience | Notes |
|---|---|---|---|
| KartClass (kartclass.com, Omar coaching) | Online video course + track guides | Cadet -> senior; strong junior focus | #1 structured online program; beginner to advanced + setup modules; free starter e-book |
| Terence Dove coaching (terencedove.com) | Book + 1:1 coaching | Junior + senior racers | Author of the standout technique book (below) |
| ANGRI Racing Academy | Free web curriculum | New racers | Driving + setup theory combined |
| Kart Smarter (YouTube) | Free video | Data-driven improvement | MyChron/Race Studio coaching tutorials |
| K1 Circuit Winchester coaching (US) | Paid 1:1 on-track | All | Example of leveled programs (L1-L3) |
| SBR Motorsports cadet/junior schools (US) | On-track school | Cadets 8-12 | Program-structure reference for junior content tone |
| K1 Speed Karting Academy | Group lessons | Kids/rental-to-owner pathway | Entry-funnel reference |
| AU-local: Karting Australia club come-and-try days + state coaching endorsements | On-track | New AU licence holders | Ties into licensing pathway content (KA Manual) |
| Kart Track Speed Lab AI reports | Software | Data-based coaching | The automated-coach competitor |

Use: structure our COACH mode content levels like these programs (cadet / junior /
senior-novice / experienced already in driver-skill-interaction-layer.json).

## 3. Textbooks / books (research corpus candidates)

Kart-specific (buy for Q&A ingestion — own copies, same as RR book policy):

1. "Learn How to Master the Art of Kart Driving" — Terence Dove (180+ pp; the modern standard; techniques + racecraft + mindset)
2. "Bob Bondurant on Race Kart Driving" — Bondurant & Ross Bentley (fundamentals, lines, braking)
3. "Karting: Everything You Need to Know" — Memo Gidley & Jeff Grist (overview: kart, setup, driving, racing)
4. "Kart Driving Techniques" — Jim Hall Jr. (cornering priorities, braking, racecraft)
5. "The Karting Manual: The Complete Beginner's Guide to Competitive Kart Racing" — Joao Diniz Sanches (Haynes; entry-level)
6. KTips "Go Karting for Beginners" e-book series (light, beginner FAQ material)

General race-driving theory that transfers cleanly to karts:

7. "Speed Secrets" series — Ross Bentley (esp. vol 1 and "Ultimate Speed Secrets"; vision, line theory, mental game)
8. "The Perfect Corner" / "The Science of the Racing Line" — Paradigm Shift Racing (Adam Brouillard) — line optimisation maths at accessible level

Engineering references (for solver retune + chassis-calculations.md):

9. "Race Car Vehicle Dynamics" — Milliken & Milliken (tyre friction, load transfer; the reference)
10. "Performance Vehicle Dynamics" — James Balkwill (mu vs load curves; cited by Racecar Engineering)
11. "The Racing & High-Performance Tire" — Paul Haney (tyre grip physics, load sensitivity)
12. Academic papers (free/indexed):
    - "Multi-body elastic simulation of a go-kart: correlation between frame stiffness and dynamic performance" (frame-flex = the kart's 'suspension')
    - MDPI Appl. Sci. 13(20):11312 — electric go-kart chassis vehicle-dynamics/COG modelling
    - IJRTI 2504089 — go-kart CG placement and load distribution optimisation
    - Gatech "Steady-State Cornering Equilibria..." (steady-state cornering model foundation — matches our quasi-steady solver approach)

## 4. Core maths — kart cornering grip and gearing

For chassis-calculations.md (illustrative authority) + GearingGuideScreen calc + racing-line
solver retune (J1.7). Standard vehicle-dynamics results, kart-specialised.

### 4.1 Cornering grip

Max cornering speed on radius r (steady state, flat track):
  v_max = sqrt(mu * g * r)
  a_lat = v^2 / r          (require a_lat <= mu * g)
  mu for kart slicks ~ 1.4-2.0 (surface, temp, compound dependent — never hardcode; calibrate per tyre)

Friction circle (combined grip budget):
  sqrt(F_x^2 + F_y^2) <= mu * F_z
  (solver already uses this; karts bias to ellipse — lateral > longitudinal capability)

Tyre load sensitivity (why weight transfer costs total grip):
  mu(F_z) is decreasing in F_z  =>  loaded outside tyre gains less grip than
  the unloaded inside loses. Kart consequence: minimise unnecessary transfer, but
  NOTE the kart paradox below.

Lateral load transfer (total, front+rear):
  dF_z = m * a_lat * h_cg / t
  m = kart+driver mass (~160-185 kg class-dependent), h_cg = CG height, t = track width.
  Karts: h_cg/t is large and there's no suspension, so transfer is fast and direct.

Inside-rear lift condition (the kart-specific result — live axle NEEDS the inside
rear unloaded to corner without scrub):
  Inside rear lifts when load transfer at the rear >= static rear inside load:
  m * a_lat * h_cg / t_r  >=  m * g * (1 - w_f) / 2
  =>  a_lat/g  >=  (1 - w_f) * t_r / (2 * h_cg)
  w_f = front weight fraction (~0.43), t_r = rear track.
  Tuning levers in the formula: raise h_cg (seat/ballast up, ride height up) or narrow
  t_r -> lifts earlier (more rotation); widen t_r or lower CG -> lifts later (more stable).
  This inequality IS the mathematical heart of kart setup.

Jacking from steering geometry (caster-driven vertical displacement):
  dz ~ x_spindle * sin(theta_caster) * sin(delta_steer)   (per side, opposite signs)
  More caster or wider front track => more inside-rear unloading per degree of steering.

Cornering weight on outside rear (drives rear grip while inside rear is airborne):
  F_z,outer_rear ~ m*g*(1-w_f)  (whole rear axle load on one tyre mid-corner)

Slip angle / cornering stiffness (for solver tyre model):
  F_y = C_alpha * alpha   (linear range), saturating at mu*F_z
  Kart slicks: high C_alpha, small optimal alpha (~3-6 deg); frame flex substitutes
  for suspension compliance (see multi-body paper).

### 4.2 Gearing (single-speed sprocket classes; KZ2 adds a 6-speed box)

Ratio:
  R = N_axle / N_engine        (e.g. 78/11 = 7.09)

Rollout (distance per engine rev):
  rollout = pi * D_tyre / R    (D_tyre ~ 0.28 m loaded dia for kart slicks; measure it)

Speed from rpm:
  v = (rpm / 60) * pi * D_tyre / R
  v[km/h] = rpm * pi * D_tyre * 3.6 / (60 * R)
  Example: X30 @ 14000 rpm, D=0.28 m, R=7.09  ->  v = (14000/60)*0.8796/7.09 = 28.9 m/s = 104 km/h

Choosing a sprocket for a track:
  R_needed = rpm_target * pi * D_tyre / (60 * v_max_track)
  rpm_target = just below peak-power rpm at the end of the longest straight
  (X30 ~ 14000-15000; KA100 ~ 13500-14500; Rotax Max ~ 13500-14000 — confirm per
  engine spec sheet before shipping numbers; KA tech PDFs are the authority).
  Rule of thumb: +1 rear tooth = more acceleration, lower top speed; tight track
  -> bigger rear sprocket; fast track -> smaller.

Axle-tooth change effect on rpm at fixed speed:
  rpm2 = rpm1 * R2/R1     (one rear tooth on 78 ~ 1.3% rpm shift)

KZ2 (gearbox): per-gear ratio R_i = (N_axle/N_engine) * gearbox_ratio_i; same rollout
formula per gear. Internal ratios homologated — cite manufacturer tables only.

Chain length (sanity check for sprocket swaps):
  L ~ 2*C + (N1+N2)/2 + ((N2-N1)/(2*pi))^2 / C    (pitches; C = centre distance in pitches)

### 4.3 Racing-line solver retune constants (J1.7)

Replace RR bike params with:
  mass: 160-185 kg (class min weights from KA Manual, kart+driver)
  mu_lat: calibrate 1.4-1.8 start; no lean-angle model (delete bike lean constraint)
  power: class-dependent (X30 ~ 30 hp, KA100 ~ 22 hp, KZ2 ~ 48 hp) — cite spec sheets
  braking: rear-only for sprint classes (lower decel limit ~1.2-1.6 g); KZ2 has front brakes
  track half-width: kart tracks ~ 3.5-4.5 m real asphalt half-width vs solver's 0.6 map units — keep map-unit stroking invariant from Send-It

All numeric constants above are ENGINEERING STARTING POINTS for the solver and
calculators, not coaching facts. The coach KB cites only KA Manual / manufacturer
values (no-invent rule unchanged).
