# KA class reference (bias only — NO numeric fallbacks)

> STATUS: POPULATED v1.0 — 2026-09. Source: `kb-au-rules/` snapshot of the
> 2026 Australian Karting Manual — Update 1 (2 March 2026), 59th edition.
> Machine tables: `kb-au-rules/data/classes.json`, `restrictors.json`, `licences.json`.
> Weights are kart + driver + equipment unless stated. State/Supplementary Regulations
> can change weights and eligible divisions — always confirm the meeting Supp Regs.

## Pathway (typical Australian club)

**4SS** (sealed Torini, cheap) or **Cadet 9** (Mini Rok + 16 mm) → **Cadet 12**
(Mini Rok open) → **KA3 Junior** (KA100 + 22 mm) → **KA3 Senior** or **TaG Restricted**
→ **TaG 125 / X30 / Rotax 125 / Rok GP** → **DD2 / KZ2**. **KA2** is the faster junior
(Rok DVS). Yamaha (KT100) remains a club option. MicroMax / MiniMax = social only.
KA4 = state/club class in the 2026 book.

## Cadet 9 / Cadet 12

- Cadet 9: race from 7th birthday to 10th (practice from 6th). Mini Rok +16 mm
  restrictor / Comer / KT100J with AKA1 13.02 mm. Min 100 / 90 / 100 kg by engine.
- Cadet 12: 9th–13th birthday. Mini Rok unrestricted / KT100J AKA2A 16 mm.
  Min 110 / 105 kg.
- Tyres: Maxxis 190D Cadet-KA dry (10x4.00-5 / 11x5.00-5), Maxxis MW21 wet.
- Plates: white/red. Coaching bias: momentum driving, tiny inputs; chassis windows
  are narrow (rear track max 1100 mm cadet).

## KA4 Junior (state/club)

- Junior 11–16; KA100 with 19 mm IAME restrictor. Min Jr 128/148 kg (Light/Heavy);
  Senior 148/163; Masters 163.
- Tyres: LeCont LH03 AUS dry + SV1 wet.

## KA3 Junior / KA3 Senior

- KA3 Junior: 11–16, KA100 + 22 mm Type 3 restrictor. Min 137 champ / 132 Light / 150 Heavy.
- KA3 Senior: senior licence; Masters 40+. KA100 unrestricted.
  Min 160 Champ / 150 Light / 170 Medium / 190 Heavy / 170 Masters.
- Tyres: LeCont LH03 AUS dry + SV1 wet.

## KA2 Junior

- 12–16, B-grade Junior licence. Rok DVS Junior. Min 142 kg.
- Tyres: LeCont **LOH** dry (+ bead retention) + SV1 wet.

## Junior Max / Rotax 125

- Junior Max: 12–16, B Jr licence, Rotax with SR4 23.5 mm restrictor. Min 145 kg.
- Rotax 125 (senior): Max 125. Min 160/180 (165/180 in the National Series).
- Mojo tyres apply in Rotax Pro Tour contexts — confirm series regs (not in the KA
  approved-tyre spec list; series-specific).

## X30 (Light/Heavy)

- Senior B licence. IAME X30 unrestricted. Min 162 Light / 176 Heavy.
- Tyres: LeCont **LPM** dry + SV1 wet.

## TaG 125 / TaG Restricted

- TaG 125: senior B, open 125s. Champ 172; Light 160 (Fireball 150). LeCont LOH.
- TaG Restricted: seniors; Masters 40+. Restricted 125s (AKA SR2 24.5 mm /
  SR3 23.5 mm for Rotax Max, etc. — see `restrictors.json`). Min 160/180/200
  (+5 kg for Rotax SR2/SR4). LeCont LH03 (class list) + SV1.

## DD2 / Rok GP

- DD2: senior B; Masters 32+. Rotax DD2 two-speed. Min 173 / 180 Masters.
- Rok GP: senior B; Masters 32+ (under-32 allowed if driver+kit >= 85 kg).
  Min 162 / 180 / 180. LeCont LPM dry.

## KZ2 (gearbox)

- Senior licence. KZ 125 gearbox. Min 177 kg. Highest cornering load and
  physical demand; front brakes fitted (unlike sprint classes).

## 4SS (4-stroke)

- Cadet / Junior / Senior on Torini Clubmaxx 210 (sealed). Min 100 / 130 / 140–170.
- 4SS Super: Supermaxx 250, max B senior. Min 155 / 170 / 185. PULP fuel only.
- Tyres: Maxxis 190D (cadet) / Maxxis Sport (Jr/Sr).

## Vintage

- Vintage licence; pre-2001 classes, 15 years off the book. No racing — parade,
  demo, time trial, regularity only.

## Age ladder + licence grades (2026 Manual)

- Grades high→low: A / E-A, B / E-B, C / E-C, D, E (social/recreational), 8-Day.
- D Grade and 8-Day display a **P plate** at all times.
- Cadet: practice 6th birthday, race 7th; Cadet 12 from 9th; junior licence from
  11th (KA2 / Jr Max / Jr Performance from 12th); senior from 15th (junior may
  move up from 14th). Masters: 40+ for KA3/TaG Restricted; 32+ for DD2/Rok GP.
- Upgrades: D→C after 4 meetings + endorsements; C→B 6 meetings or top-5 national
  junior; B→A top-3 state championship. Under-18 requires a Participant's
  Licence holder (parent/guardian).
- Portal: portal.karting.net.au (KOMP). Join an affiliated club first.

## Meeting rules that shape coaching advice

- Two engines allowed from first qualifying. One dry + one wet tyre set from
  first qualifying (+1 replacement each if approved).
- Wets only after the Clerk of the Course declares Wet.
- Plates: Cadet white/red, Junior white/black, Senior yellow/black.

## Anti-hallucination rule

No pressures, jetting numbers, or gear ratios live in this file on purpose.
Setup numbers come only from `chassis-setup-and-tyre-kb.md` and
`tyre-pressure-weather-troubleshooting-guide.md` with their cited ranges.
