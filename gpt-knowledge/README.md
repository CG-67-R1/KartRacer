# GPT Knowledge pack (KartRacer AI) — structure v0.1

Kart-racing replica of the Send-It RoadRacer pack (`Send-It/docs/gpt-knowledge/`).
Same engine, same authority model, kart domain. Files here are SKELETONS with section
structure + curation notes — populate before upload; never upload a stub as fact.

## Authority order

```text
User facts
  → instructions.md (modes, safety, anti-hallucination)
  → core-diagnostic-pack-kart-v1.json
  → driver-skill-interaction-layer.json  (detail level only)
  → TRACK_SPECIFIC_DIAGNOSTIC_AU_KART_v1.json + Track_Knowledge_Base_Australia_Kart_v1.md  (coaching bias)
  → kart_geometry_australia.json  (layout facts)
  → tyre markdown trio + kart-tyre-photo-recognition.md  (any pressure / wear / compound / photo class)
  → session-learning-v1.json  (hold / escalate / revert)
  → technique index / stubs  (Coach mode; only if content exists)
  → chassis-calculations.md  (chassis maths reference; illustrative, not prescriptive)
```

Never: invent pressures from `kart-class-reference.md`; never let track prose override geometry JSON.

## RR -> KR file map

| RoadRacer file | KartRacer file | Content shift |
|---|---|---|
| instructions.md | instructions.md | MODE:COACH / MODE:CHASSIS (was SUSPENSION) / MODE:FULL; rider->driver; same anti-hallucination + safety rules |
| instructions-extended.md | instructions-extended.md | full workflow text |
| core-diagnostic-pack-v2.1.json | core-diagnostic-pack-kart-v1.json | problem types: entry understeer/push, entry oversteer, mid-corner bind/hopping, exit slide/bog, inside-rear won't lift, chatter, darting. Fix axes: front width, caster, camber, toe, Ackermann, ride height F/R, axle stiffness, hubs, torsion bars, seat position/struts, rear track, pressures |
| rider-skill-interaction-layer.json | driver-skill-interaction-layer.json | cadet / junior / senior-novice / experienced bias |
| session-learning-v1.json | session-learning-v1.json | hold/escalate/revert unchanged; escalation order: pressures -> width/track -> caster/camber -> axle/hubs -> seat (cheap+reversible first) |
| track_geometry_australia.json | kart_geometry_australia.json | one entry per kart layout; derive lengths/turn counts from C:\KartRacer\data\gpx; direction verified per club (P0: not from GPX) |
| TRACK_SPECIFIC_DIAGNOSTIC_AU_v1.json | TRACK_SPECIFIC_DIAGNOSTIC_AU_KART_v1.json | per-track coaching bias, start with AKC venues: Bolivar, Coffs Harbour, Ipswich, Emerald, Newcastle, Todd Rd/GKCV, Monarto |
| Track_Knowledge_Base_Australia_v2.md | Track_Knowledge_Base_Australia_Kart_v1.md | track prose (bias authority Medium/Low) |
| race-setup-and-tyre-kb.md | chassis-setup-and-tyre-kb.md | combined upload: chassis tuning (replaces Ohlins/WP suspension) + control tyres (MG, LeCont SV1, Maxxis MW22, Dunlop, Bridgestone, Mojo) + wet setup + photo wear diagnosis |
| tire-pressure-weather-troubleshooting-guide.md | tyre-pressure-weather-troubleshooting-guide.md | kart slick cold pressures by class/tyre; wet crossover; scrub-in; no invented numbers |
| tire-wear-patterns-comprehensive.md | kart-tyre-wear-patterns.md | graining, blistering, hot tear, flat spot, shoulder wear vs camber/width, one-side wear vs toe |
| tyre-wear-photo-recognition.md | kart-tyre-photo-recognition.md | text atlas of photo classes; spatial band/zone first |
| bridgestone-race-tyre-data-extract.md | control-tyre-data-extract.md | KA homologated tyre spec extracts (from karting.net.au PDFs) |
| bike-category-reference.md | kart-class-reference.md | class bias only, NO numeric fallbacks: Cadet 9/12, KA4 Jnr, KA3 Snr, KA2, X30, TaG, KZ2, 4SS |
| geometry-calculations.md | chassis-calculations.md | jacking effect, caster->camber gain, Ackermann, CG height/seat maths, sprocket ratio + rollout |
| technique-by-improvement.md | technique-by-improvement.md | kart techniques: vision, braking (no front brake in sprint classes!), rotation, kerb use, wet lines, drafting |
| riding-techniques-combined.md | driving-techniques-combined.md | stub until book extracts ingested |
| coaching-knowledge-base-index.md | coaching-knowledge-base-index.md | master index (mirror of this README) |
| session-tracking-guide.md | session-tracking-guide.md | unchanged concept |
| instructions-uk.md / *_UK_* | (defer) | AU-only launch |
| legacy/ | legacy/ | quarantine as before |

## Population order (curation)

1. instructions.md + instructions-extended.md (adapt from RR — mostly rename + brake/chassis vocabulary)
2. kart-class-reference.md (KA Manual class table)
3. chassis-setup-and-tyre-kb.md (ANGRI/OTK/manufacturer guides + KA tyre PDFs)
4. core-diagnostic-pack-kart-v1.json (from chassis KB, mirror RR JSON schema)
5. kart_geometry_australia.json (from GPX set)
6. Track bias files (AKC venues first)
7. Wear/photo atlases
8. Technique files (needs book extracts)

## Missing / do not invent

Population status lives in `coaching-knowledge-base-index.md` (2026-09: chassis/tyre/
class/technique/diagnostic files POPULATED from the imported `kb/` + `kb-au-rules/`
trees; track files, session files, and instructions-extended still skeleton; control
tyre spec PDFs partial). Until a file has real content, the GPT must say the knowledge
is absent — never reconstruct from memory.

Backing sources in this repo: `kb/` (setup/engine/tyre topics, playbooks, machine
data), `kb-au-rules/` (2026 Australian Karting Manual Update 1 snapshot),
`tools/setup-engine/` (tested calculators). Cite them when populating further.
