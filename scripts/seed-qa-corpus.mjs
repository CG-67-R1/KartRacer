/**
 * Build Q&A JSON corpus from kb-au-rules + gpt-knowledge (no ingest-qa delete).
 * Run: node scripts/seed-qa-corpus.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QA_DIR = path.join(ROOT, 'Q&A');

function toBlocks(text) {
  const blocks = [];
  for (const p of String(text).split(/\n\n+/)) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    const first = trimmed.split('\n')[0] || '';
    const heading =
      first.length < 100 &&
      (/^[#\d.]+\s/.test(first) || /^[A-Z][A-Z\s]+$/.test(first) || first.endsWith(':'));
    blocks.push({ type: heading ? 'heading' : 'paragraph', text: trimmed });
  }
  return blocks;
}

function writeDoc(basename, title, content, extra = {}) {
  const dest = path.join(QA_DIR, `${basename}.json`);
  const doc = {
    origin: extra.origin || basename,
    title,
    edition: extra.edition || '2026 Australian Karting Manual Update 1 snapshot',
    effectiveDate: extra.effectiveDate || '2026-03-02',
    corpus: extra.corpus || 'ka',
    content,
    contentBlocks: toBlocks(content),
    qa: extra.qa || [],
    metadata: {
      source: extra.source || 'kb-au-rules',
      builtAt: new Date().toISOString(),
    },
  };
  fs.writeFileSync(dest, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`  wrote Q&A/${basename}.json`);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

fs.mkdirSync(QA_DIR, { recursive: true });
const placeholder = path.join(QA_DIR, 'PLACEHOLDER.md');
if (fs.existsSync(placeholder)) fs.unlinkSync(placeholder);

const mdFiles = [
  ['kb-au-rules/README.md', 'ka-rules-readme', 'Karting Australia rules snapshot — readme'],
  ['kb-au-rules/INDEX.md', 'ka-rules-index', 'Karting Australia rules snapshot — index'],
  ['kb-au-rules/national/overview.md', 'ka-national-overview', '2026 KA Manual — national overview'],
  ['kb-au-rules/national/licences.md', 'ka-national-licences', '2026 KA Manual — licences'],
  ['kb-au-rules/national/classes.md', 'ka-national-classes', '2026 KA Manual — classes'],
  ['kb-au-rules/national/technical.md', 'ka-national-technical', '2026 KA Manual — technical'],
  ['kb-au-rules/national/flags-driving.md', 'ka-national-flags', '2026 KA Manual — flags and driving'],
  ['kb-au-rules/national/competition.md', 'ka-national-competition', '2026 KA Manual — competition'],
  ['kb-au-rules/national/fees-penalties.md', 'ka-national-fees', '2026 KA Manual — fees and penalties'],
  ['kb-au-rules/national/2026-changes.md', 'ka-national-2026-changes', '2026 KA Manual — changes'],
  ['kb-au-rules/playbooks/licence-path.md', 'ka-playbook-licence', 'Licence path playbook'],
  ['kb-au-rules/playbooks/class-picker.md', 'ka-playbook-class', 'Class picker playbook'],
  ['kb-au-rules/clubs.md', 'ka-clubs', 'Australian kart clubs'],
  ['kb-au-rules/states/nsw.md', 'ka-state-nsw', 'Karting NSW notes'],
  ['kb-au-rules/states/vic.md', 'ka-state-vic', 'Karting Victoria notes'],
  ['kb-au-rules/states/qld.md', 'ka-state-qld', 'Karting Queensland notes'],
  ['kb-au-rules/states/sa.md', 'ka-state-sa', 'Karting SA notes'],
  ['kb-au-rules/states/wa.md', 'ka-state-wa', 'Karting WA notes'],
  ['kb-au-rules/states/tas.md', 'ka-state-tas', 'Karting Tasmania notes'],
  ['gpt-knowledge/instructions.md', 'kr-coach-instructions', 'KartRacer coach instructions'],
  ['gpt-knowledge/chassis-setup-and-tyre-kb.md', 'kr-chassis-tyre-kb', 'Chassis setup and tyre KB'],
  ['gpt-knowledge/kart-class-reference.md', 'kr-class-reference', 'Kart class reference'],
  ['gpt-knowledge/control-tyre-data-extract.md', 'kr-tyre-extract', 'KA control tyre data extract'],
  ['gpt-knowledge/kart-tyre-wear-patterns.md', 'kr-tyre-wear', 'Kart tyre wear patterns'],
];

for (const [rel, id, title] of mdFiles) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.warn(`  skip missing ${rel}`);
    continue;
  }
  writeDoc(id, title, read(rel), { origin: rel, source: rel.startsWith('gpt-knowledge') ? 'gpt-knowledge' : 'kb-au-rules' });
}

for (const name of [
  'classes.json',
  'licences.json',
  'restrictors.json',
  'tyres-fuel-oils.json',
  'clubs.json',
]) {
  const rel = `kb-au-rules/data/${name}`;
  writeDoc(
    `ka-data-${name.replace('.json', '')}`,
    `KA structured data — ${name}`,
    read(rel),
    { origin: rel, source: 'kb-au-rules/data' }
  );
}

const pathway = `# Motorsport pathway facts (karting origin)

Karting is the usual first step toward Formula 1, Supercars, IndyCar, F1 Academy, GT and endurance racing.

A common single-seater path is karting → Formula 4 → F3 → F2 → Formula 1.
A common Australian touring-car path is karting → Super3 / Super2 → Supercars.
IndyCar paths often go karting → US junior open-wheel → Indy NXT → IndyCar.
F1 Academy is a single-seater series aimed at developing women toward Formula 1.
FIA WEC includes the 24 Hours of Le Mans. NASCAR Cup is the top US stock-car series.

Australian and New Zealand drivers who started in karts include Oscar Piastri, Daniel Ricciardo, Jack Doohan, Will Power, Scott McLaughlin, Broc Feeney, Will Brown, Cam Waters, Shane van Gisbergen, Matt Campbell and Marcos Ambrose.

Confirm current race seats each season. Do not invent championship years that are not in this file.
The 2026 Penrite Australian Kart Championship is the national kart title (Karting Australia).
`;

writeDoc('motorsport-pathway', 'Karting to pro pathway', pathway, {
  origin: 'Q&A/motorsport-pathway',
  source: 'research-handoff-2026-09-10',
  qa: [
    { q: 'Where do most Formula 1 drivers start?', a: 'In karts.' },
    { q: 'What is a common path from karts to Formula 1?', a: 'Karting, then Formula 4, F3, F2, then Formula 1.' },
    { q: 'What is a common path from karts to Supercars?', a: 'Karting, then Super3 or Super2, then Supercars.' },
  ],
});

writeDoc('AUS_Q&A', 'Australian karting Q&A index', 'Australian karting trivia extras are merged at runtime from api/triviaAuExtra.js.', {
  origin: 'Q&A/AUS_Q&A',
  source: 'kart-trivia',
});
fs.writeFileSync(
  path.join(QA_DIR, 'AUS_Q&A.json'),
  `${JSON.stringify({ 'Q&A': { easy: [], hard: [] } }, null, 2)}\n`
);

fs.writeFileSync(
  path.join(QA_DIR, 'README.md'),
  `# KartRacer Q&A corpus

Built from \`kb-au-rules/\` (2026 Australian Karting Manual Update 1 snapshot) and
\`gpt-knowledge/\` extracts. Tyre spec PDFs were not present under
\`kb/sources/tyre-spec-pdfs/\` at seed time — numbers come from
\`control-tyre-data-extract.md\`.

Do not run \`npm run ingest-qa\` unless you intend to delete ingested files.
`
);

console.log('Q&A corpus seeded');
