/**
 * Fill remaining Hermes P1/P2 data files from cited sources.
 * Run: node scripts/fill-kart-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function writeJson(rel, value) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, `${JSON.stringify(value, null, 2)}\n`);
  console.log(`  wrote ${rel}`);
}

function driver(id, displayName, aliases, series, era, signature, blurb) {
  return {
    id,
    displayName,
    aliases,
    series,
    era,
    characteristics: { style: ['karters_pathway'], vibe: ['karting_origin'], signature },
    blurb,
    active: true,
  };
}

function kart(id, displayName, aliases, era, signature, blurb) {
  return {
    id,
    displayName,
    aliases,
    era,
    characteristics: { character: ['kart'], signature },
    blurb,
    active: true,
  };
}

const drivers = [
  driver('piastri', 'Oscar Piastri', ['oscar piastri', 'piastri', 'oscar'], ['f1'], 'current', 'Victorian karting to F1', 'Oscar Piastri started karting in Victoria as a kid. The same weekend-club habit you have — then Formula 1. Keep the dream close.'),
  driver('ricciardo', 'Daniel Ricciardo', ['daniel ricciardo', 'ricciardo', 'honey badger'], ['f1'], 'legend', 'Tiger Kart Club WA', 'Daniel Ricciardo learned to race at Tiger Kart Club in WA. Big smile, late braking — it started in a kart, not a grand prix car.'),
  driver('doohan_jack', 'Jack Doohan', ['jack doohan', 'doohan'], ['f1', 'akc'], 'current', 'AKC graduate', 'Jack Doohan came through Australian Kart Championship weekends before F1. AKC is the same series your club talks about.'),
  driver('hamilton', 'Lewis Hamilton', ['lewis hamilton', 'hamilton'], ['f1'], 'legend', 'Stevenage karting', 'Lewis Hamilton started in karts as a kid in Stevenage. Titles came later. First it was a small chassis and a lot of practice days.'),
  driver('verstappen', 'Max Verstappen', ['max verstappen', 'verstappen'], ['f1'], 'current', 'karting from age four', 'Max Verstappen was in karts from age four. The speed you see in F1 was built on tiny tracks first.'),
  driver('leclerc', 'Charles Leclerc', ['charles leclerc', 'leclerc'], ['f1'], 'current', 'Monaco karting', 'Charles Leclerc grew up karting around Monaco and France. Ferrari came after a lot of cadet and junior weekends.'),
  driver('norris', 'Lando Norris', ['lando norris', 'norris'], ['f1'], 'current', 'British karting', 'Lando Norris came through British karting before McLaren. The jokes are free. The lap craft started in a kart.'),
  driver('alonso', 'Fernando Alonso', ['fernando alonso', 'alonso'], ['f1'], 'legend', 'Asturias karting', 'Fernando Alonso started karting in Asturias as a little kid. Two F1 titles — and a karting origin like a lot of drivers in this list.'),
  driver('vettel', 'Sebastian Vettel', ['sebastian vettel', 'vettel', 'seb'], ['f1'], 'legend', 'Kerpen karting', 'Sebastian Vettel raced karts at Kerpen, the same German club scene that raised other champions. Four titles started small.'),
  driver('senna', 'Ayrton Senna', ['ayrton senna', 'senna'], ['f1'], 'legend', 'Brazilian karting', 'Ayrton Senna was a kart champion in Brazil long before Formula 1. The precision people still talk about was built on a kart track.'),
  driver('schumacher', 'Michael Schumacher', ['michael schumacher', 'schumacher'], ['f1'], 'legend', 'Kerpen karting', 'Michael Schumacher started at Kerpen kart club. Seven F1 titles. First job: learn the kart, then the rest.'),
  driver('russell', 'George Russell', ['george russell', 'russell'], ['f1'], 'current', 'British karting', 'George Russell came through British karting and the junior single-seater ladder. Mercedes F1 was not the first steering wheel.'),
  driver('sainz', 'Carlos Sainz', ['carlos sainz', 'sainz'], ['f1'], 'current', 'Spanish karting', 'Carlos Sainz grew up in Spanish karting. Same family name as rally — different craft, same start: a kart.'),
  driver('rosberg', 'Nico Rosberg', ['nico rosberg', 'rosberg'], ['f1'], 'legend', 'karting then F1 title', 'Nico Rosberg karted as a junior, then won the 2016 F1 title. Pathway first, champagne later.'),
  driver('button', 'Jenson Button', ['jenson button', 'button', 'jenson'], ['f1'], 'legend', 'Frome karting', 'Jenson Button started in karts around Frome. 2009 F1 champion — the smooth style was practiced on small tracks first.'),
  driver('raikkonen', 'Kimi Räikkönen', ['kimi raikkonen', 'raikkonen', 'kimi', 'iceman'], ['f1'], 'legend', 'Finnish karting', 'Kimi Räikkönen came out of Finnish karting. Few words. Lots of laps. The Iceman started small.'),
  driver('perez', 'Sergio Pérez', ['sergio perez', 'perez', 'checo'], ['f1'], 'current', 'Mexican karting', 'Sergio Pérez learned to race in Mexican karting. Checo’s F1 career started with a club chassis, not a factory car.'),
  driver('webber', 'Mark Webber', ['mark webber', 'webber'], ['f1'], 'legend', 'Queanbeyan then Europe', 'Mark Webber is a Queanbeyan racer who went to F1. Australian kids have used the same idea: karts, then Europe, then the big series.'),
  driver('mclaughlin', 'Scott McLaughlin', ['scott mclaughlin', 'mclaughlin'], ['supercars', 'indycar'], 'current', 'NZ karting to Supercars and Indy', 'Scott McLaughlin started in New Zealand karting, won Supercars, then IndyCar. Two series, one origin story: karts.'),
  driver('power', 'Will Power', ['will power', 'power'], ['indycar', 'supercars'], 'legend', 'Toowoomba karting', 'Will Power is from Toowoomba karting. Indy 500 winner. The first trophies were club kart plaques.'),
  driver('feeney', 'Broc Feeney', ['broc feeney', 'feeney'], ['supercars'], 'current', 'Gold Coast karting', 'Broc Feeney came through Gold Coast karting into Supercars. Triple Eight, Bathurst weekends — it started at a club track.'),
  driver('brown_will', 'Will Brown', ['will brown'], ['supercars'], 'current', 'Victorian karting', 'Will Brown raced karts in Victoria before Supercars titles. Club days first. Championship cars later.'),
  driver('waters', 'Cam Waters', ['cam waters', 'cameron waters', 'waters'], ['supercars'], 'current', 'Mildura karting', 'Cam Waters started in Mildura karting. Monster Mustang, Bathurst wins — same driver who once pushed a cadet kart.'),
  driver('svg', 'Shane van Gisbergen', ['shane van gisbergen', 'van gisbergen', 'svg'], ['supercars', 'nascar'], 'current', 'NZ karting', 'Shane van Gisbergen came through New Zealand karting into Supercars, then NASCAR. Three disciplines, one start line.'),
  driver('whincup', 'Jamie Whincup', ['jamie whincup', 'whincup'], ['supercars'], 'legend', 'karting then seven titles', 'Jamie Whincup started in karts and became a seven-time Supercars champion. The count started at club meetings.'),
  driver('lowndes', 'Craig Lowndes', ['craig lowndes', 'lowndes'], ['supercars'], 'legend', 'karting then Bathurst', 'Craig Lowndes came out of karting into touring cars and Bathurst folklore. The kid in the kart is the same racer.'),
  driver('mostert', 'Chaz Mostert', ['chaz mostert', 'mostert'], ['supercars'], 'current', 'WA karting', 'Chaz Mostert raced karts in WA before Supercars and Bathurst wins. Club origin, national Sundays.'),
  driver('depasquale', 'Anton De Pasquale', ['anton de pasquale', 'de pasquale'], ['supercars'], 'current', 'Melbourne karting', 'Anton De Pasquale came through Melbourne karting into Supercars. Shell Ford weekends started as club race days.'),
  driver('randle', 'Thomas Randle', ['thomas randle', 'randle'], ['supercars'], 'current', 'Victorian karting', 'Thomas Randle raced karts in Victoria, then Super2, then Supercars. The ladder is real. First rung is a kart.'),
  driver('kostecki', 'Brodie Kostecki', ['brodie kostecki', 'kostecki'], ['supercars'], 'current', 'WA karting', 'Brodie Kostecki came through WA karting into a Supercars title. Heavy cars, light origin.'),
  driver('courtney', 'James Courtney', ['james courtney', 'courtney'], ['supercars'], 'legend', 'karting then Bathurst', 'James Courtney started in karts, went to Europe, came home to Supercars and Bathurst. A classic AU pathway.'),
  driver('tander', 'Garth Tander', ['garth tander', 'tander'], ['supercars'], 'legend', 'karting then multiple Bathursts', 'Garth Tander raced karts before a stack of Bathurst wins. The endurance craft started on short tracks.'),
  driver('reynolds', 'David Reynolds', ['david reynolds', 'reynolds'], ['supercars'], 'current', 'Victorian karting', 'David Reynolds came through Victorian karting. The showman in Supercars was a club karter first.'),
  driver('palou', 'Alex Palou', ['alex palou', 'palou'], ['indycar'], 'current', 'Spanish karting', 'Alex Palou grew up in Spanish karting, then won IndyCar titles. Same idea as the AU kids: karts, then the big oval series.'),
  driver('dixon', 'Scott Dixon', ['scott dixon', 'dixon'], ['indycar'], 'legend', 'NZ karting', 'Scott Dixon started in New Zealand karting. Six-time IndyCar champion. The smooth style was practiced early.'),
  driver('herta', 'Colton Herta', ['colton herta', 'herta'], ['indycar'], 'current', 'US karting', 'Colton Herta came through US karting into IndyCar. Youngest pole at Indy — the hands were trained in a kart.'),
  driver('newgarden', 'Josef Newgarden', ['josef newgarden', 'newgarden'], ['indycar'], 'current', 'US karting', 'Josef Newgarden raced karts in the US before Indy 500 wins. Club chassis, then the Brickyard.'),
  driver('oward', 'Pato O’Ward', ['pato oward', 'oward', 'pato'], ['indycar'], 'current', 'Mexican karting', 'Pato O’Ward came out of Mexican karting into IndyCar. Fast, young, same first step as everyone here.'),
  driver('hartley', 'Brendon Hartley', ['brendon hartley', 'hartley'], ['wec', 'f1'], 'current', 'NZ karting', 'Brendon Hartley started in New Zealand karting, then F1 and Le Mans with Toyota. Endurance stars still begin in karts.'),
  driver('bamber', 'Earl Bamber', ['earl bamber', 'bamber'], ['wec'], 'current', 'NZ karting', 'Earl Bamber raced karts in New Zealand before Le Mans wins. GT and endurance — karting first.'),
  driver('campbell', 'Matt Campbell', ['matt campbell'], ['wec', 'gt'], 'current', 'Sunshine Coast karting', 'Matt Campbell is a Sunshine Coast karter who went to Porsche and Le Mans. Australian karting to world GT is a real path.'),
  driver('anagnostiadis', 'Aiva Anagnostiadis', ['aiva anagnostiadis', 'anagnostiadis', 'aiva'], ['f1_academy'], 'current', 'Australian karting', 'Aiva Anagnostiadis is an Australian who came through karting toward F1 Academy. Confirm the current grid each season — the karting origin is the point.'),
  driver('gordon', 'Jeff Gordon', ['jeff gordon'], ['nascar'], 'legend', 'quarter midgets and karts', 'Jeff Gordon started in quarter midgets and karts before NASCAR titles. The US stock-car path has a karting on-ramp too.'),
  driver('larson', 'Kyle Larson', ['kyle larson', 'larson'], ['nascar'], 'current', 'dirt and karts', 'Kyle Larson raced karts and midgets before NASCAR. Short-track craft, then the Cup series.'),
  driver('ambrose', 'Marcos Ambrose', ['marcos ambrose', 'ambrose'], ['nascar', 'supercars'], 'legend', 'Tasmanian karting', 'Marcos Ambrose started in Tasmanian karting, won Supercars, then raced NASCAR. Island club days to America.'),
  driver('briscoe', 'Ryan Briscoe', ['ryan briscoe', 'briscoe'], ['indycar'], 'legend', 'Sydney karting', 'Ryan Briscoe came out of Sydney karting into IndyCar. Another Australian who used karts as the first ticket.'),
];

const karts = [
  kart('tony_kart', 'Tony Kart', ['tony kart', 'tonykart', 'otk tony'], 'current', 'OTK Kart Group Australia', 'Tony Kart is the OTK flagship chassis. Importer: OTK Kart Group Australia. Same family as Kosmic and LN Kart.'),
  kart('kosmic', 'Kosmic', ['kosmic', 'kosmic kart'], 'current', 'OTK sister brand', 'Kosmic is an OTK chassis — same factory family as Tony Kart, sold in Australia through OTK Kart Group.'),
  kart('ln_kart', 'LN Kart', ['ln kart', 'lnk', 'lnkart'], 'current', 'OTK', 'LN Kart is the third OTK brand on the KA partner list. Same Australian importer group as Tony Kart and Kosmic.'),
  kart('exprit', 'Exprit', ['exprit', 'otk exprit'], 'classic', 'OTK family', 'Exprit is the OTK sister many Australians still race. Same group idea: one factory family, different colours.'),
  kart('otk', 'OTK Kart Group', ['otk', 'otk kart'], 'current', 'Tony / Kosmic / LN', 'OTK Kart Group Australia is the official importer for Tony Kart, Kosmic and LN Kart. Ask the dealer which badge fits your class.'),
  kart('birel_art', 'Birel ART', ['birel art', 'birel', 'birelart'], 'current', 'Patrizicorse / JDP', 'Birel ART is an Italian chassis imported here by Patrizicorse / JDP. Common in club and AKC paddocks.'),
  kart('lenzokart', 'Lenzokart', ['lenzokart', 'lenzo'], 'current', 'Patrizicorse', 'Lenzokart sits with Birel ART on the Patrizicorse importer list. Same shop, different badge.'),
  kart('crg', 'CRG', ['crg', 'crg kart'], 'current', 'Italian chassis', 'CRG is a long-running Italian chassis brand. You will see them at Australian club days next to OTK and Birel.'),
  kart('arrow', 'Arrow', ['arrow', 'arrow kart'], 'current', 'DPE Kart Superstore', 'Arrow is imported by DPE Kart Superstore with FA Kart, KR and DAP. Check the dealer for the current Australian kit.'),
  kart('fa_kart', 'FA Kart', ['fa kart', 'fakart'], 'current', 'DPE', 'FA Kart is on the DPE Kart Superstore importer set. Italian chassis, Australian parts support.'),
  kart('kart_republic', 'Kart Republic', ['kart republic', 'kr kart', 'kr'], 'current', 'DPE', 'Kart Republic (KR) is a modern factory chassis on the DPE list. Confirm class homologation before you buy.'),
  kart('dap', 'DAP', ['dap', 'dap kart'], 'current', 'DPE', 'DAP is the historic Italian brand on the DPE Kart Superstore list. Same shop as Arrow, FA Kart and KR.'),
  kart('parolin', 'Parolin', ['parolin', 'parolin kart'], 'current', 'Parolin Australia', 'Parolin Australia is the official importer. Italian chassis, local support — ask them which frame is class-legal this year.'),
  kart('eos', 'EOS', ['eos', 'eos kart'], 'current', 'Alpha Motorsport / EKS', 'EOS is imported by Alpha Motorsport / EKS. Another chassis option on the KA partner page.'),
  kart('iame_ka100', 'IAME KA100', ['ka100', 'ka 100', 'iame ka100', 'reedjet'], 'current', 'Remo Racing', 'IAME KA100 is the air-cooled Reedjet used in KA3 and KA4. Remo Racing is the IAME importer in Australia.'),
  kart('iame_x30', 'IAME X30', ['x30', 'x 30', 'iame x30'], 'current', 'Remo Racing', 'IAME X30 is the water-cooled 125 TaG used in X30 Light/Heavy. Remo Racing supplies IAME in Australia.'),
  kart('rotax_max', 'Rotax 125 MAX', ['rotax', 'rotax max', 'senior max', 'rotax 125'], 'current', 'International Karting / IKD', 'Rotax 125 MAX is the Senior Max engine. International Karting / IKD is the Australian Rotax channel. Confirm series tyres (Mojo) separately.'),
  kart('rotax_junior', 'Rotax Junior MAX', ['junior max', 'jr max', 'rotax junior'], 'current', 'IKD', 'Rotax Junior MAX is the restricted junior version of the Max. Same importer family as Senior Max.'),
  kart('mini_rok', 'Vortex Mini Rok', ['mini rok', 'vortex mini rok', 'cadet rok'], 'current', 'vortex-engines.com', 'Vortex Mini Rok is the Cadet 9 (16 mm restrictor) and Cadet 12 (open) engine. Check the 2026 KA restrictor table.'),
  kart('torini', 'Torini Clubmaxx TC210', ['torini', 'clubmaxx', 'tc210', '4ss'], 'current', 'torini.com.au', 'Torini Clubmaxx TC210 is the sealed 4-stroke for 4SS. Homologation PDF is on the KA media store (Feb 2024).'),
  kart('tony_ka100', 'Tony Kart KA100', ['tony kart ka100', 'tony ka100'], 'current', 'OTK + IAME', 'A common Australian club package: Tony Kart chassis, KA100 engine. Confirm weight and restrictor for your class.'),
  kart('tony_x30', 'Tony Kart X30', ['tony kart x30', 'tony x30'], 'current', 'OTK + IAME', 'Tony Kart with an X30 is a typical national-class pairing. Same OTK importer, Remo Racing for the engine.'),
  kart('birel_x30', 'Birel ART X30', ['birel x30', 'birel art x30'], 'current', 'Patrizicorse + Remo', 'Birel ART plus X30 is a paddock regular. Two importers: Patrizicorse for the frame, Remo for IAME.'),
  kart('birel_rotax', 'Birel ART Rotax', ['birel rotax', 'birel max'], 'current', 'Patrizicorse + IKD', 'Birel ART with a Rotax Max. Confirm Mojo / series tyre rules if you race Pro Tour, not just KA class regs.'),
  kart('kosmic_ka100', 'Kosmic KA100', ['kosmic ka100'], 'current', 'OTK + IAME', 'Kosmic chassis, KA100 engine. Same OTK family as Tony Kart, different colours.'),
  kart('crg_rotax', 'CRG Rotax', ['crg rotax', 'crg max'], 'current', 'CRG + IKD', 'CRG with Rotax Max. Club and state paddocks run this pairing a lot.'),
  kart('parolin_ka100', 'Parolin KA100', ['parolin ka100'], 'current', 'Parolin Australia + Remo', 'Parolin chassis, KA100. Ask Parolin Australia which 2026 homologated frame they stock.'),
  kart('eos_x30', 'EOS X30', ['eos x30'], 'current', 'Alpha / EKS + Remo', 'EOS with X30. Alpha Motorsport / EKS for the chassis, Remo Racing for IAME.'),
  kart('arrow_ka100', 'Arrow KA100', ['arrow ka100'], 'current', 'DPE + Remo', 'Arrow chassis from DPE, KA100 from Remo. A straightforward club-day package.'),
  kart('fa_x30', 'FA Kart X30', ['fa kart x30', 'fa x30'], 'current', 'DPE + Remo', 'FA Kart plus X30. DPE Kart Superstore for the frame.'),
  kart('kr_x30', 'Kart Republic X30', ['kr x30', 'kart republic x30'], 'current', 'DPE + Remo', 'Kart Republic with X30. Confirm the chassis is the homologated KR for your class.'),
  kart('cadet_mini_rok', 'Cadet Mini Rok package', ['cadet package', 'cadet 9', 'cadet 12'], 'current', 'Mini Rok + Maxxis', 'Cadet 9 uses Mini Rok + 16 mm; Cadet 12 is open Mini Rok. Tyres: Maxxis 190D dry / MW21 wet (2026 KA class table).'),
  kart('4ss_package', '4SS Torini package', ['4ss package', 'four stroke kart'], 'current', 'sealed TC210', '4SS is the sealed Torini Clubmaxx path — cheaper to run, PULP fuel. Cadet / Junior / Senior weights are in the 2026 KA class table.'),
  kart('tag_125', 'TaG 125', ['tag 125', 'tag'], 'current', 'open 125', 'TaG 125 is the open 125 class (senior B). Tyres: LeCont LOH dry + SV1 wet per the 2026 class map.'),
  kart('tag_restricted', 'TaG Restricted', ['tag restricted', 'tag rest'], 'current', 'restricted 125', 'TaG Restricted uses listed restrictors (see kb-au-rules restrictors.json). LeCont LH03 dry. Masters 40+.'),
  kart('kz2', 'KZ2', ['kz2', 'kz 2', 'gearbox kart'], 'current', '125 gearbox', 'KZ2 is the 125 gearbox class — front brakes, highest physical load. Min weight is in the 2026 KA class table. Engine make still VERIFY per homologation.'),
];

const faqs = {
  version: 1,
  coach: [
    {
      id: 'coach_licence_001',
      question: 'How do I get a Karting Australia licence?',
      answer:
        'Join an affiliated club in KOMP (portal.karting.net.au), then apply for the Cadet 9 / Cadet 12 / Junior / Senior licence that matches your age. Safety training is required. D Grade and 8-Day need an Observed Driving Session and must show a P plate. Under 18: a parent/guardian holds a Participant’s Licence. Source: 2026 Australian Karting Manual Update 1 (kb-au-rules licences).',
      recommended_user_inputs: ['age', 'state', 'club'],
    },
    {
      id: 'coach_licence_002',
      question: 'What do the licence grades mean?',
      answer:
        'High to low: A / E-A, B / E-B, C / E-C, D, E (social), 8-Day (one try-a-meeting per year). D→C after 4 endorsed meetings. C→B after 6 meetings or a listed National top-5. B→A after a State Championship top-3. National Cadet/KA3 needs C. KA2, Junior Max, TaG 125, X30 need B. Source: 2026 KA Manual Update 1.',
    },
    {
      id: 'coach_class_001',
      question: 'Which class should I start in?',
      answer:
        'Typical club ladder: 4SS (sealed Torini) or Cadet 9 (Mini Rok + 16 mm) → Cadet 12 → KA3 Junior → KA3 Senior or TaG Restricted → TaG 125 / X30 / Rotax 125. KA2 is the faster junior (Rok DVS). Age bands and minimum weights are in the 2026 Manual — state/supp regs can change them. Source: kb-au-rules classes + kart-class-reference.md.',
    },
    {
      id: 'coach_first_day_001',
      question: 'What happens on a first club race day?',
      answer:
        'You need a current KA (or recognised) licence to drive on a KA track. D / 8-Day: ODS then P plate. Scrutineering, drivers briefing, practice, then heats. Transponder hire is a club item — ask the secretary. One change at a time if the kart feels odd. Parent/guardian stays with juniors when officials call you.',
    },
    {
      id: 'coach_weight_001',
      question: 'Do class weights include the driver?',
      answer:
        'Yes. KA class minimums are kart + driver + equipment unless a row says otherwise. Example from the 2026 book: KA3 Senior Light 150 kg, Medium 170, Heavy 190. Always confirm the meeting Supplementary Regulations. Source: kb-au-rules/data/classes.json.',
    },
    {
      id: 'coach_transponder_001',
      question: 'Do I need my own transponder?',
      answer:
        'Most clubs hire MyLaps-style transponders on the day. Buy one later if you race often. Clip it where the club shows you — usually the front bumper / number plate area. Ask the race secretary; do not invent a mounting rule.',
    },
    {
      id: 'coach_pathway_001',
      question: 'Can karting lead to Formula 1?',
      answer:
        'Yes — that is the usual first step. A common single-seater path is karting → Formula 4 → F3 → F2 → F1. Australians who started in karts include Oscar Piastri, Daniel Ricciardo and Jack Doohan. There is no guaranteed ladder. Club craft comes first.',
    },
    {
      id: 'coach_pathway_002',
      question: 'Can karting lead to Supercars?',
      answer:
        'Yes. Many Supercars drivers started in Australian or New Zealand karting (for example Will Power, Cam Waters, Broc Feeney, Will Brown, Scott McLaughlin). Super2 / Super3 sit later on that path. Confirm current series regs if you are planning a switch.',
    },
    {
      id: 'coach_pathway_003',
      question: 'What is F1 Academy?',
      answer:
        'F1 Academy is a single-seater series aimed at developing women toward Formula 1. Several drivers arrived from karting. Australian Aiva Anagnostiadis came through karting — confirm the current grid each year before you quote a seat.',
    },
    {
      id: 'coach_flags_001',
      question: 'What do the flags mean?',
      answer:
        'Use the current KA Manual flags chapter (kb-au-rules/national/flags-driving.md). Yellow = slow, no overtaking in that sector. Red = stop racing, return as directed. Blue = faster kart approaching. Black = report to officials. If this app and the briefing disagree, the briefing and Supp Regs win.',
    },
    {
      id: 'coach_wet_001',
      question: 'When can I use wet tyres?',
      answer:
        'Wets only after the Clerk of the Course declares Wet. From first qualifying you get one dry set and one wet set (+1 replacement each if approved). Air only. No mixing dry and wet on the kart. Source: 2026 KA tyre rules in chassis-setup-and-tyre-kb.md.',
    },
  ],
  bikesetup: [
    {
      id: 'setup_pressure_001',
      question: 'What cold pressure should I start with?',
      answer:
        'Use the cited starting window for your compound, then adjust. LeCont LH03 9.5–11.0 psi (KA3/KA4/TaG Restricted/DD2/Jr Max); LOH 8.5–10 psi (KA2/TaG 125); LPM 8.0–9.5 psi (X30/Rok GP); Maxxis Cadet 0.6 bar (~8.7 psi). Wets: SV1 0.9 bar service; Maxxis MW21 1.0 bar service / 0.6 recommended. Present as a start point — not a race setting. Source: control-tyre-data-extract.md.',
    },
    {
      id: 'setup_one_change_001',
      question: 'How many things should I change between sessions?',
      answer:
        'One. Cheap and reversible first: pressures → front width / hubs → caster/camber/toe → ride height → axle/hubs → seat. If a change makes the kart worse, put it back. Source: chassis-setup-and-tyre-kb.md session order.',
    },
    {
      id: 'setup_chain_001',
      question: 'How much chain slack should I run?',
      answer:
        'About 10 mm total slack (~4% of centres) is the KB baseline. Check sprocket alignment. Do not hide a handling problem by adding rear teeth. Source: chassis-setup-and-tyre-kb.md.',
    },
    {
      id: 'setup_front_001',
      question: 'The kart will not turn in. What first?',
      answer:
        'Confirm it is not the driver. Then: front hubs out one spacer per side → rear +0.1 bar → raise front ride height → a little more toe-out → more caster. One step only. Source: chassis-setup-and-tyre-kb.md troubleshooting table.',
    },
    {
      id: 'setup_hop_001',
      question: 'The kart hops in the middle of the corner. Is that me?',
      answer:
        'Often it is bind — the rear tyres fighting each other — especially for taller drivers. Try: lower rear ballast, seat back and down, lower rear ride height, softer axle, fewer seat struts. Tell your coach. Source: chassis-setup-and-tyre-kb.md hop row.',
    },
    {
      id: 'setup_gearing_001',
      question: 'How do I pick sprockets?',
      answer:
        'Single ratio: typical front 10–11T, rear about 68–95T. More rear teeth = more drive, less top speed. Wet starting point: +3 rear teeth, then drop teeth as it dries. Source: tools/setup-engine gearing + ANGRI chain notes.',
    },
    {
      id: 'setup_width_001',
      question: 'What does front width do?',
      answer:
        'Wider front = more jacking and faster turn-in. Narrower front = slower turn-in, more push. Change one spacer per side. Source: chassis-setup-and-tyre-kb.md front table.',
    },
    {
      id: 'setup_pyrometer_001',
      question: 'How do I read tyre temperatures?',
      answer:
        'Outside / middle / inside as soon as you stop. Optimum band 75–85 °C; near 95 °C the tyre is overworked. Cold middle → raise pressure; hot middle → drop. Chase left/right and front/rear variance, not a magic number. Source: chassis-setup-and-tyre-kb.md.',
    },
  ],
  global_principles: [
    'Cite the 2026 Australian Karting Manual (Update 1) or a named KB file. Do not invent pressures, weights, or restrictor sizes.',
    'Weights are kart + driver + equipment unless stated.',
    'Junior changes that touch brakes, steering, axle, or seat mounts need a parent/mechanic.',
    'Sprint karts brake with the rear only (KZ2 adds front). Do not copy car/bike trail-brake advice.',
  ],
};

const akcRounds = [
  { title: '2026 Penrite AKC Round 1', venue: 'C.ex Raceway, Coffs Harbour', state: 'NSW', startDate: '2026-03-13', endDate: '2026-03-15', url: 'https://www.karting.net.au/ka-calendar' },
  { title: '2026 Penrite AKC Round 2', venue: 'Ipswich Kart Club', state: 'QLD', startDate: '2026-05-15', endDate: '2026-05-17', url: 'https://www.karting.net.au/ka-calendar' },
  { title: '2026 Penrite AKC Round 3', venue: 'Townsville Kart Club (Sun City Raceway)', state: 'QLD', startDate: '2026-07-03', endDate: '2026-07-05', url: 'https://www.karting.net.au/ka-calendar', notes: 'Venue per AKC provisional entry list (handoff 2026-09-10).' },
  { title: '2026 Penrite AKC Round 4', venue: 'Eastern Lions Kart Club, Seymour', state: 'VIC', startDate: '2026-09-04', endDate: '2026-09-06', url: 'https://www.karting.net.au/ka-calendar' },
  { title: '2026 Penrite AKC Round 5', venue: 'Bolivar Raceway, Southern Go Kart Club', state: 'SA', startDate: '2026-10-16', endDate: '2026-10-18', url: 'https://www.karting.net.au/ka-calendar' },
];

function main() {
  writeJson('app/src/data/onboardingDrivers.json', drivers);
  writeJson('app/src/data/onboardingKarts.json', karts);
  writeJson('android-app/src/data/onboardingDrivers.json', drivers);
  writeJson('android-app/src/data/onboardingKarts.json', karts);
  writeJson('app/src/data/onboardingRiders.json', drivers);
  writeJson('app/src/data/onboardingBikes.json', karts);
  writeJson('android-app/src/data/onboardingRiders.json', drivers);
  writeJson('android-app/src/data/onboardingBikes.json', karts);

  writeJson('app/src/data/rider_ai_faqs.json', faqs);
  writeJson('android-app/src/data/rider_ai_faqs.json', faqs);
  writeJson('api/data/rider_ai_faqs.json', faqs);

  const australia = akcRounds.map((r) => ({
    ...r,
    country: 'Australia',
    series: 'akc',
    seriesLabel: 'Australian Kart Championship',
    organiser: 'Karting Australia',
  }));

  const calendarStatic = { motogp: [], australia, australia_club: [], national: australia, club: [] };
  writeJson('api/data/calendar-static.json', calendarStatic);
  writeJson('packs/regions/au/calendar/static.json', calendarStatic);

  const sources = {
    meta: {
      timezone: 'Australia/Adelaide',
      period: { start_date: '2026-01-01', end_date: '2026-12-31' },
      event_scope: {
        discipline: 'kart',
        include_keywords: ['Kart', 'AKC', 'Rotax', 'Club Day', 'State Titles', 'Cup'],
        exclude_keywords: ['Motocross', 'Speedway', 'Road Race', 'Superkart', 'Superbike', 'MotoGP'],
      },
    },
    sources: [
      { id: 'ka_national', name: 'Karting Australia calendar', type: 'governing_body_calendar', jurisdiction: 'national', url: 'https://www.karting.net.au/ka-calendar' },
      { id: 'kansw', name: 'Karting Australia (NSW)', type: 'governing_body_calendar', jurisdiction: 'NSW', url: 'https://www.kansw.com.au/calendar/' },
      { id: 'kartingnt', name: 'Karting Northern Territory', type: 'governing_body_calendar', jurisdiction: 'NT', url: 'https://www.kartingnt.com.au/calendar/' },
      { id: 'kartingqld', name: 'Karting Queensland', type: 'governing_body_calendar', jurisdiction: 'QLD', url: 'https://www.kartingqld.com.au/calendar/' },
      { id: 'kartingsa', name: 'Karting SA', type: 'governing_body_calendar', jurisdiction: 'SA', url: 'https://www.kartingsa.com.au/calendar/' },
      { id: 'kartingtas', name: 'Karting Tasmania', type: 'governing_body_calendar', jurisdiction: 'TAS', url: 'https://www.karting.net.au/the-aka-calendar/tasmania' },
      { id: 'kartingvic', name: 'Karting Victoria', type: 'governing_body_calendar', jurisdiction: 'VIC', url: 'https://vka.asn.au/calendar/' },
      { id: 'kartingwa', name: 'Karting Western Australia', type: 'governing_body_calendar', jurisdiction: 'WA', url: 'https://www.kartingwa.com.au/calendar/' },
    ],
  };
  writeJson('api/data/au-kart-sources.json', sources);
  writeJson('api/data/au-road-race-sources.json', sources);
  writeJson('packs/regions/au/calendar/sources.json', sources);

  const seedEvents = australia.map((ev, i) => ({
    name: ev.title,
    start_date: ev.startDate,
    end_date: ev.endDate,
    state: ev.state,
    venue: ev.venue,
    organiser: ev.organiser,
    source_id: 'calendar_static_akc',
    source_url: ev.url,
    entry_url: ev.url,
    discipline: 'kart',
    notes: ev.notes || '',
    confidence: 'high',
  }));
  writeJson('api/data/au-kart-events.json', {
    updatedAt: new Date().toISOString(),
    sourceCount: sources.sources.length,
    eventCount: seedEvents.length,
    errors: [],
    events: seedEvents,
  });

  const news = {
    sources: [
      { id: 'kartsportnews', name: 'KartSportNews', url: 'https://www.kartsportnews.com/', rss: 'https://www.kartsportnews.com/feed/', confidence: 'high', nodeId: 'au', notes: 'PRIMARY — probed 200 valid RSS 2026-09-10' },
      { id: 'karting_australia_news', name: 'Karting Australia', url: 'https://www.karting.net.au/', rss: 'https://www.karting.net.au/feed/', confidence: 'high', nodeId: 'au' },
    ],
  };
  writeJson('packs/regions/au/news/sources.json', news);
  writeJson('packs/regions/au/headlines/sources.json', {
    sourceIds: news.sources.map((s) => s.id),
    sources: news.sources.map((s) => ({ id: s.id, name: s.name, type: 'rss', confidence: s.confidence, nodeId: 'au' })),
  });

  writeJson('packs/regions/au/competitions/series.json', {
    series: [
      { id: 'akc', name: 'Penrite Australian Kart Championship', local: true },
      { id: 'au_club', name: 'Club / state kart meetings', local: true },
      { id: 'rotax_pro_tour', name: 'Rotax Pro Tour', local: true, notes: 'Dates VERIFY at rotax.com.au' },
    ],
  });

  const classes = JSON.parse(fs.readFileSync(path.join(ROOT, 'kb-au-rules/data/classes.json'), 'utf8'));
  writeJson(
    'packs/regions/au/competitions/classes.json',
    {
      classes: (classes.classes || []).map((c) => ({
        id: c.id,
        name: c.id.replace(/-/g, ' '),
        chapter: c.chapter,
        licence: c.licence,
        eligibility: c.eligibility,
      })),
    }
  );

  writeJson('packs/regions/au/licensing/pathways.json', {
    pathways: [
      { id: 'cadet9', name: 'Cadet 9', minAge: '7th birthday to race', portal: 'https://portal.karting.net.au' },
      { id: 'cadet12', name: 'Cadet 12', minAge: '9th birthday' },
      { id: 'junior', name: 'Junior', minAge: '11th birthday' },
      { id: 'senior', name: 'Senior', minAge: '15th birthday (14th if moving up from Junior)' },
    ],
    notes: '2026 KA Manual Update 1. Join a club before applying.',
  });

  writeJson('packs/regions/au/organisations/federations.json', {
    items: [
      { id: 'ka', name: 'Karting Australia', url: 'https://www.karting.net.au/', role: 'NSO' },
      { id: 'kansw', name: 'Karting Australia (NSW)', url: 'https://www.kansw.com.au/' },
      { id: 'kartingnt', name: 'Karting Northern Territory', url: 'https://www.kartingnt.com.au/' },
      { id: 'kartingqld', name: 'Karting Queensland', url: 'https://www.kartingqld.com.au/' },
      { id: 'kartingsa', name: 'Karting SA', url: 'https://www.kartingsa.com.au/' },
      { id: 'kartingvic', name: 'Karting Victoria', url: 'https://www.kartingvic.net.au/' },
      { id: 'kartingwa', name: 'Karting Western Australia', url: 'https://www.kartingwa.com.au/' },
      { id: 'kartingtas', name: 'Karting Tasmania', url: 'https://www.kartingtas.net.au/' },
    ],
  });

  const clubsDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'kb-au-rules/data/clubs.json'), 'utf8'));
  writeJson('packs/regions/au/organisations/clubs.json', {
    items: (clubsDoc.clubs || []).map((c) => ({
      name: c.name,
      state: c.state,
      asn: c.asn,
      web: c.web,
      track: c.track,
      email: c.email,
    })),
  });

  writeJson('packs/regions/au/organisations/coaching.json', { items: [] });
  writeJson('packs/regions/au/rules/rulebook.json', {
    name: '2026 Australian Karting Manual',
    edition: 'Update 1 (2 March 2026)',
    url: 'https://www.karting.net.au/administration/rules',
    localSnapshot: 'kb-au-rules/',
  });
  writeJson('packs/regions/au/rules/technical_variations.json', {
    notes: 'Restrictors, weights, and tyres: kb-au-rules/data. State/supp regs can change a meeting.',
  });
  writeJson('packs/regions/au/suppliers.json', {
    items: [
      { name: 'OTK Kart Group Australia', brands: ['Tony Kart', 'Kosmic', 'LN Kart'] },
      { name: 'Patrizicorse / JDP', brands: ['Birel ART', 'Lenzokart', 'LeCont'] },
      { name: 'DPE Kart Superstore', brands: ['Arrow', 'FA Kart', 'KR', 'DAP'] },
      { name: 'Parolin Australia', brands: ['Parolin'] },
      { name: 'Alpha Motorsport / EKS', brands: ['EOS'] },
      { name: 'Remo Racing', brands: ['IAME KA100', 'IAME X30'] },
      { name: 'International Karting / IKD', brands: ['Rotax'] },
      { name: 'Torini', brands: ['Clubmaxx TC210'] },
    ],
  });
  writeJson('packs/regions/au/terminology.json', {
    terms: [
      { term: 'AKC', meaning: 'Australian Kart Championship' },
      { term: 'KA', meaning: 'Karting Australia' },
      { term: 'KOMP', meaning: 'Karting Officials and Members Portal' },
      { term: 'TaG', meaning: 'Touch and Go 125 engine class' },
      { term: 'S/F', meaning: 'Start/Finish' },
    ],
  });
  writeJson('packs/regions/au/emergency.json', {
    notes: 'Use the club’s posted medical / emergency contacts on the day. Triple Zero (000) in Australia.',
  });
  writeJson('packs/regions/au/services.json', { items: [] });
  writeJson('packs/regions/au/progression/pathways.json', {
    pathways: [
      { id: 'f1', name: 'Karting → F4 → F3 → F2 → F1' },
      { id: 'supercars', name: 'Karting → Super3/Super2 → Supercars' },
      { id: 'indycar', name: 'Karting → US juniors → IndyCar' },
      { id: 'f1academy', name: 'Karting → F1 Academy' },
    ],
  });
  writeJson('packs/regions/au/ai/prompts.json', {
    coachHomeContext:
      'You are an expert Australian kart racing coach. Junior-friendly, evidence-based, Australian spelling (tyre).',
    bikeSetupHomeContext:
      'You are an expert Australian kart chassis tuner. Live axle, no motorcycle suspension. Cheap reversible changes first.',
    askPriority:
      'Priority: Australian karting (KA, AKC, state/club) first, then F1 / Supercars / IndyCar / F1 Academy / GT / NASCAR / WEC as general interest.',
    rulesModeName: '2026 Australian Karting Manual',
    rulesHomeContext:
      'You are a Karting Australia Manual rule-check assistant. Cite the 2026 Update 1 snapshot in kb-au-rules. Supp Regs override.',
    webSearchCountry: 'AU',
    spellingLocale: 'en-AU',
    tyreSpelling: 'tyre',
  });
  writeJson('packs/regions/au/ai/knowledge/index.json', {
    files: [
      'gpt-knowledge/instructions.md',
      'gpt-knowledge/chassis-setup-and-tyre-kb.md',
      'gpt-knowledge/kart-class-reference.md',
      'gpt-knowledge/control-tyre-data-extract.md',
      'gpt-knowledge/kart-tyre-wear-patterns.md',
      'gpt-knowledge/core-diagnostic-pack-kart-v1.json',
    ],
  });

  const clubs = clubsDoc.clubs || [];
  const byState = new Map();
  for (const c of clubs) {
    if (!byState.has(c.state)) byState.set(c.state, []);
    byState.get(c.state).push({ name: c.name, location: c.track || c.state, website: c.web, email: c.email });
  }
  const stateNames = { NSW: 'New South Wales', VIC: 'Victoria', QLD: 'Queensland', SA: 'South Australia', WA: 'Western Australia', TAS: 'Tasmania', NT: 'Northern Territory', ACT: 'Australian Capital Territory' };
  writeJson('packs/regions/au/onboarding/areas.json', {
    areas: [...byState.entries()].map(([code, clubList]) => ({
      code,
      name: stateNames[code] || code,
      clubs: clubList,
      classes: ['Cadet 9', 'Cadet 12', 'KA3', 'KA4', 'X30', 'TaG 125', '4SS'],
      coaches: [],
    })),
  });

  console.log(`drivers ${drivers.length}, karts ${karts.length}`);
}

main();
