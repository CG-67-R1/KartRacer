# Australian karting rules KB

Standalone rule set for **Karting Australia** national competition and **2026 state regulations**. Separate from the setup/engine KB in `kb/`.

Source edition: **2026 Australian Karting Manual — Update 1 (2 March 2026)**, 59th edition, plus the state PDFs linked from the national rules page. Confirm current files before racing — the live Manual on the KA site overrides this snapshot.

Do not paste Manual prose. Use the structured notes and `data/*.json`.

## LLM entry

1. `index.json` — every topic/playbook/data file with aliases and tags
2. `lookup.json` — keyword → file map (class names, states, flags, licence grades)
3. `INDEX.md` — human catalog
4. `data/*.json` — numbers for tools (weights, restrictors, fees, state overrides)

## Hierarchy

| Path | Contents |
|---|---|
| `clubs.md` + `data/clubs.json` | Affiliated clubs by state: contact, website, calendar |
| `national/` | NCR structure: licences, competition, flags, technical, classes, fees/penalties, 2026 changes |
| `states/` | NSW, QLD, SA, VIC, TAS, WA extras (NT has no published 2026 state regs on the rules page) |
| `data/` | Machine tables |
| `playbooks/` | Class picker + licence path |

Weights are **kart + driver + equipment** unless marked kart-only max.
