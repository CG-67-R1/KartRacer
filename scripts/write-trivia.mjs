/**
 * Write kart / pathway trivia seeds. Run: node scripts/write-trivia.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FUNNY = [
  'A unicycle with a jet engine.',
  'Whatever the manual says.',
  'Your mum on a scooter.',
  'The opposite of slow.',
  'A really fast shopping trolley.',
  'Where the chicken crossed the road.',
  'The thing you blame when you spin.',
  'What the marshals wave when they are bored.',
  'A chicane in the cereal aisle.',
  'Red flag: pizza arrived.',
  'The green flag at the traffic lights.',
  'A track day for hedgehogs.',
  'Something you Google after the briefing.',
  'The thing that was definitely the tyre’s fault.',
  'Where you store your ego.',
  'A very expensive way to get a tan.',
  'The opposite of a sensible life choice.',
  'Pick up the kart? I dropped the remote.',
  'Hot pit: servo past midnight.',
  'Body position: still in bed.',
];

const EASY_QA = [
  { q: 'What does AKC stand for?', a: 'Australian Kart Championship.' },
  { q: 'What does KA stand for in Australian karting?', a: 'Karting Australia.' },
  { q: 'What is KOMP?', a: 'The Karting Officials and Members Portal used to join a club and apply for a licence.' },
  { q: 'What is a cadet class?', a: 'The youngest race classes (Cadet 9 and Cadet 12) for kids starting club racing.' },
  { q: 'What engine does Cadet 9 use in 2026 KA classes?', a: 'Vortex Mini Rok with a 16 mm restrictor.' },
  { q: 'What engine does Cadet 12 use in 2026 KA classes?', a: 'Vortex Mini Rok, unrestricted.' },
  { q: 'What is KA100?', a: 'An IAME 100 cc air-cooled Reedjet used in KA3 and KA4.' },
  { q: 'What is X30?', a: 'An IAME 125 cc water-cooled TaG engine used in X30 Light and Heavy.' },
  { q: 'What is Rotax Max?', a: 'A 125 cc TaG engine family used in Junior Max and Senior Max.' },
  { q: 'What is 4SS?', a: 'The sealed four-stroke class that uses the Torini Clubmaxx TC210.' },
  { q: 'What is TaG?', a: 'Touch and Go — a 125 cc clutch engine class family.' },
  { q: 'What is KZ2?', a: 'The 125 cc gearbox kart class. It also has front brakes.' },
  { q: 'Where do most Formula 1 drivers start racing?', a: 'In karts.' },
  { q: 'What is the apex of a corner?', a: 'The point where the kart is closest to the inside of the corner.' },
  { q: 'What does a green flag mean?', a: 'The track is live; the session or race is on.' },
  { q: 'What does a yellow flag mean?', a: 'Caution. Slow down. No overtaking in that sector.' },
  { q: 'What does a red flag mean?', a: 'Stop racing and return as the officials direct.' },
  { q: 'What does a blue flag mean?', a: 'A faster kart is approaching — let them through.' },
  { q: 'What does a chequered flag mean?', a: 'The session or race has finished.' },
  { q: 'What is pole position?', a: 'The first grid slot, earned by the fastest qualifier.' },
  { q: 'What is a DNF?', a: 'Did not finish.' },
  { q: 'What is a DNS?', a: 'Did not start.' },
  { q: 'What is a slipstream?', a: 'The low-drag pocket behind another kart that can help you pass.' },
  { q: 'What is a warm-up lap?', a: 'A lap before the start to warm tyres and get the kart ready.' },
  { q: 'What is qualifying?', a: 'A timed session used to set the starting grid.' },
  { q: 'What is a transponder?', a: 'The timing box that records your lap times.' },
  { q: 'What is scrutineering?', a: 'The safety and technical check before you race.' },
  { q: 'What is a restrictor?', a: 'A sized hole that limits engine air flow so a class stays even.' },
  { q: 'Do KA class weights include the driver?', a: 'Yes. Minimums are kart plus driver plus equipment unless a row says otherwise.' },
  { q: 'Which Australian started karting in Victoria and reached Formula 1?', a: 'Oscar Piastri.' },
  { q: 'Which Formula 1 driver learned to race at Tiger Kart Club in WA?', a: 'Daniel Ricciardo.' },
  { q: 'Which series is the Penrite Australian Kart Championship?', a: 'Australia’s national kart title series, run by Karting Australia.' },
  { q: 'What tyres do Cadet 9 and Cadet 12 use in the 2026 KA table?', a: 'Maxxis 190D dry and MW21 wet.' },
  { q: 'Should you change more than one setup item between sessions?', a: 'No. Change one thing, then judge it.' },
  { q: 'Do sprint karts usually have a front brake?', a: 'No. Most sprint karts brake with the rear only. KZ2 adds a front brake.' },
  { q: 'What is chain slack about, as a starting idea?', a: 'About 10 mm total slack is the KB baseline. Check alignment too.' },
  { q: 'What does Supercars mean in Australia?', a: 'The national touring-car championship that many karters step toward.' },
  { q: 'What is IndyCar?', a: 'The top US open-wheel series, including the Indianapolis 500.' },
  { q: 'What is F1 Academy?', a: 'A single-seater series aimed at developing women toward Formula 1.' },
  { q: 'What is WEC?', a: 'The FIA World Endurance Championship, including the 24 Hours of Le Mans.' },
  { q: 'What is NASCAR?', a: 'The main US stock-car racing series.' },
  { q: 'What is a constructor championship?', a: 'The title for the manufacturer or team with the most points.' },
  { q: 'What is a drivers championship?', a: 'The title for the driver with the most points.' },
  { q: 'What is a pit stop?', a: 'A stop in the pits for tyres, fuel, or repairs.' },
  { q: 'What is a fastest lap?', a: 'The quickest lap time in that race or session.' },
  { q: 'What is a grand prix?', a: 'A major championship race on the calendar.' },
  { q: 'What is a racing line?', a: 'The fastest path through a corner: outside, apex, outside.' },
  { q: 'What is understeer in a kart?', a: 'The kart does not want to turn — it pushes wide.' },
  { q: 'What is oversteer in a kart?', a: 'The rear steps out and the kart wants to spin.' },
  { q: 'What is hop in a kart?', a: 'The inside rear bouncing because the live axle is binding.' },
  { q: 'Who publishes the Australian Karting Manual?', a: 'Karting Australia.' },
  { q: 'What licence portal do Australian karters use?', a: 'portal.karting.net.au (KOMP).' },
  { q: 'Can you mix dry and wet tyres on a KA kart?', a: 'No. Once wets are declared you run a wet set, not a mix.' },
  { q: 'When can you fit wet tyres at a KA meeting?', a: 'After the Clerk of the Course declares Wet.' },
  { q: 'What is C.ex Raceway best known as in AKC 2026?', a: 'The Coffs Harbour Kart Racing Club venue that hosted AKC Round 1.' },
  { q: 'Where is Bolivar Raceway?', a: 'South Australia, home of Southern Go Kart Club.' },
  { q: 'What state is Eastern Lions Kart Club in?', a: 'Victoria (Seymour).' },
  { q: 'What is the usual first single-seater step after karting toward F1?', a: 'Formula 4.' },
  { q: 'Name one Australian who went from karts to IndyCar.', a: 'Will Power (Toowoomba karting origin).' },
  { q: 'Name one New Zealander who went from karts to Supercars and IndyCar.', a: 'Scott McLaughlin.' },
];

const HARD_QA = [
  { q: 'Which 2026 AKC round was listed for Coffs Harbour / C.ex Raceway?', a: 'Round 1, 13–15 March 2026 (karting.net.au / KartSportNews).' },
  { q: 'Which 2026 AKC round was listed for Ipswich?', a: 'Round 2, 15–17 May 2026.' },
  { q: 'Which 2026 AKC round was listed as Townsville on the provisional entry list?', a: 'Round 3, 3–5 July 2026.' },
  { q: 'Which 2026 AKC round was listed for Eastern Lions / Seymour?', a: 'Round 4, 4–6 September 2026.' },
  { q: 'Which 2026 AKC round was listed for Bolivar / Southern Go Kart Club?', a: 'Round 5, 16–18 October 2026.' },
  { q: 'What official series name is used for the 2026 national kart title?', a: '2026 Penrite Australian Kart Championship.' },
  { q: 'What cold-pressure start window is cited for LeCont LH03 AUS?', a: '9.5–11.0 psi (KA3, KA4, TaG Restricted, DD2, Jr Max). Present as a start point.' },
  { q: 'What cold-pressure start window is cited for LeCont LOH?', a: '8.5–10 psi (KA2, TaG 125, Jr Performance).' },
  { q: 'What cold-pressure start window is cited for LeCont LPM?', a: '8.0–9.5 psi (X30, Rok GP, KZ2).' },
  { q: 'What recommended cold pressure is on the Maxxis Cadet M190D spec paper?', a: '0.6 bar, about 8.7 psi.' },
  { q: 'What service pressure is cited for LeCont SV1 wets?', a: '0.9 bar service ±0.3 (CIK form).' },
  { q: 'What Mini Rok restrictor does Cadet 9 use in the 2026 book?', a: '16 mm.' },
  { q: 'Which importer channel is listed for Tony Kart, Kosmic and LN Kart in Australia?', a: 'OTK Kart Group Australia.' },
  { q: 'Which importer is listed for Birel ART and Lenzokart?', a: 'Patrizicorse / JDP.' },
  { q: 'Which shop is listed for Arrow, FA Kart, KR and DAP?', a: 'DPE Kart Superstore.' },
  { q: 'Who imports IAME KA100 and X30 in Australia?', a: 'Remo Racing.' },
  { q: 'Who is the Australian Rotax channel named in the research handoff?', a: 'International Karting / IKD.' },
  { q: 'What typical front sprocket range does the KartRacer gearing screen use?', a: '10–11 teeth.' },
  { q: 'What typical rear sprocket range does the KartRacer gearing screen use?', a: 'About 68–95 teeth.' },
  { q: 'What wet gearing start point is in the setup-engine notes?', a: 'Plus three rear teeth, then drop teeth as it dries.' },
  { q: 'What licence grade is needed for National Cadet or KA3 in the 2026 snapshot?', a: 'C Grade (see kb-au-rules licences).' },
  { q: 'What licence grade is needed for KA2, Junior Max, TaG 125 or X30 in the 2026 snapshot?', a: 'B Grade.' },
  { q: 'How does a D Grade licence move to C Grade in the 2026 snapshot?', a: 'After four endorsed meetings.' },
  { q: 'How does C Grade move to B Grade in the 2026 snapshot?', a: 'After six meetings, or a listed National top-5.' },
  { q: 'What example KA3 Senior Light minimum weight is in the 2026 class table?', a: '150 kg (kart + driver + equipment). Always check Supp Regs.' },
  { q: 'What example KA3 Senior Medium minimum weight is in the 2026 class table?', a: '170 kg.' },
  { q: 'What example KA3 Senior Heavy minimum weight is in the 2026 class table?', a: '190 kg.' },
  { q: 'Why must you not invent per-class psi in KartRacer Coach?', a: 'Pressures are cited from KA spec papers. The coach must cite the extract, not guess.' },
  { q: 'Which tyre wear file should the coach prefer for photos?', a: 'kart-tyre-wear-patterns.md and kart-tyre-photo-recognition.md.' },
  { q: 'What pyrometer band is cited as an optimum in the chassis KB?', a: 'About 75–85 °C. Near 95 °C the tyre is overworked.' },
  { q: 'What is the cheap-first chassis fix order in the coach pack?', a: 'Pressures, then hubs/track width, caster/camber/toe, ride height, axle/hubs, torsion bars/struts, seat.' },
  { q: 'Which Australian F1 driver is described as an AKC graduate in the onboarding set?', a: 'Jack Doohan.' },
  { q: 'Which Toowoomba karter later won the Indianapolis 500?', a: 'Will Power.' },
  { q: 'Which Gold Coast karter moved into Triple Eight Supercars?', a: 'Broc Feeney.' },
  { q: 'Which Mildura karter became a Supercars Bathurst winner?', a: 'Cam Waters.' },
  { q: 'Which New Zealand karter won Supercars titles then moved to NASCAR?', a: 'Shane van Gisbergen.' },
  { q: 'Which Sunshine Coast karter reached Porsche and Le Mans?', a: 'Matt Campbell.' },
  { q: 'Which Australian is listed in onboarding as an F1 Academy pathway name, with grid VERIFY?', a: 'Aiva Anagnostiadis.' },
  { q: 'Which German club scene is linked to Schumacher and Vettel in the onboarding blurbs?', a: 'Kerpen.' },
  { q: 'What does DD2 refer to in Rotax racing?', a: 'The two-speed Rotax class (not the same as a standard Senior Max).' },
  { q: 'Why is GeraldtonK (244 m) held out of the KartRacer catalog?', a: 'The 2026-09-08 GPX audit flagged it as too short. GeraldtonK 2 (664 m) shipped instead.' },
  { q: 'What state tag was added to CanberraLong.gpx?', a: 'ACT.' },
  { q: 'What club is CHKRC in the KartRacer venue table?', a: 'Coffs Harbour Kart Racing Club (C.ex Raceway).' },
  { q: 'What venue is ClubSA / Monarto in the KartRacer venue table?', a: 'Go Kart Club of SA (Rocky Gully / Monarto).' },
  { q: 'What venue is East Crk / SPKP in the KartRacer venue table?', a: 'Sydney International Karting Raceway (Eastern Creek).' },
  { q: 'Is GoK World the same as Newcastle Kart Racing Club?', a: 'No. GoK World is a commercial Newcastle-area track. NKRC still has no GPX in this repo.' },
];

function q(question, correct, wrongs, joke, rating) {
  return {
    question,
    options: [correct, ...wrongs.slice(0, 3), joke],
    correct_index: 0,
    difficulty_rating: rating,
    difficulty: rating <= 4 ? 'easy' : 'hard',
    source: 'au-extra',
  };
}

const AU_EXTRA = [
  q('What does AKC stand for?', 'Australian Kart Championship', ['Australian Kart Club', 'Asian Kart Cup', 'Adelaide Kart Circuit'], 'A Kangaroo Convention', 1),
  q('What does KA stand for?', 'Karting Australia', ['Karting Association only', 'Kids Autocross', 'Karting Asia'], 'Kettle Appreciation', 1),
  q('What portal do Australian karters use to join a club?', 'KOMP (portal.karting.net.au)', ['MyLaps only', 'Motorsport Australia CAMS', 'iRacing'], 'The school intranet', 2),
  q('Who publishes the Australian Karting Manual?', 'Karting Australia', ['FIM', 'Supercars Australia', 'FIA only'], 'The local fish-and-chip shop', 2),
  q('What engine do Cadet 9 and Cadet 12 share?', 'Vortex Mini Rok', ['IAME X30', 'Rotax Senior Max', 'Torini TC210'], 'A hairdryer', 2),
  q('What restrictor does Cadet 9 use in the 2026 book?', '16 mm', ['19 mm', '22 mm', 'None'], 'A drinking straw', 3),
  q('What sealed four-stroke is used in 4SS?', 'Torini Clubmaxx TC210', ['KA100', 'KZ2', 'Mini Rok'], 'A lawnmower from Bunnings', 2),
  q('Who imports IAME in Australia?', 'Remo Racing', ['OTK Kart Group', 'IKD only', 'DPE'], 'The pie van', 3),
  q('Who is the Australian Rotax channel in the research set?', 'International Karting / IKD', ['Remo Racing', 'Parolin Australia', 'Torini'], 'A ferry company', 3),
  q('Which OTK brands are listed together for Australia?', 'Tony Kart, Kosmic and LN Kart', ['Birel, CRG and Arrow', 'Parolin, EOS and DAP', 'FA Kart and KR only'], 'Lego, Duplo and Knex', 3),
  q('Which shop is listed for Arrow, FA Kart, KR and DAP?', 'DPE Kart Superstore', ['Remo Racing', 'OTK Kart Group', 'Torini'], 'The servo fridge', 3),
  q('Where was 2026 AKC Round 1 listed?', 'Coffs Harbour / C.ex Raceway', ['Phillip Island', 'Bathurst', 'The Bend car circuit'], 'A Bunnings car park', 2),
  q('Where was 2026 AKC Round 2 listed?', 'Ipswich Kart Club', ['Bolivar', 'Seymour', 'Townsville'], 'The moon base', 2),
  q('Where was 2026 AKC Round 5 listed?', 'Bolivar / Southern Go Kart Club', ['Coffs Harbour', 'Ipswich', 'Seymour'], 'Narnia', 2),
  q('Which state is Eastern Lions Kart Club in?', 'Victoria', ['NSW', 'QLD', 'SA'], 'Middle-earth', 2),
  q('Which state is Coffs Harbour Kart Racing Club in?', 'New South Wales', ['Queensland', 'Victoria', 'WA'], 'Atlantis', 1),
  q('Which state is Ipswich Kart Club in?', 'Queensland', ['NSW', 'SA', 'WA'], 'The Antarctic', 1),
  q('Which state is Southern Go Kart Club (Bolivar) in?', 'South Australia', ['Victoria', 'WA', 'NT'], 'The Shire', 1),
  q('What venue name is used for Eastern Creek karting in KartRacer?', 'Sydney International Karting Raceway', ['Sydney Motorsport Park Gardner GP', 'Wakefield Park', 'One Raceway'], 'Westfield food court', 4),
  q('CHKRC in the GPX set is which club?', 'Coffs Harbour Kart Racing Club', ['Coffs Harbour Motorcycle Club', 'Canberra Kart Club', 'Club SA'], 'A radio station', 3),
  q('ClubSA / Monarto in the GPX set is which club?', 'Go Kart Club of SA', ['Southern Go Kart Club only', 'Whyalla Kart Club', 'Barossa Kart Club'], 'A footy club', 4),
  q('Is GoK World the same as Newcastle Kart Racing Club?', 'No', ['Yes', 'Only on Sundays', 'They share one licence'], 'They are the same pizza shop', 4),
  q('Which Victorian started in karts and reached Formula 1 at McLaren?', 'Oscar Piastri', ['Daniel Ricciardo', 'Mark Webber', 'Jack Doohan'], 'Crocodile Dundee', 2),
  q('Which F1 driver started at Tiger Kart Club in WA?', 'Daniel Ricciardo', ['Oscar Piastri', 'Jack Doohan', 'Mark Webber'], 'The Honey Badger’s dentist', 2),
  q('Which Australian is listed as an AKC graduate who reached F1?', 'Jack Doohan', ['Mick Doohan', 'Wayne Gardner', 'Casey Stoner'], 'A lawnmower champion', 3),
  q('Which Toowoomba karter later won the Indianapolis 500?', 'Will Power', ['Scott McLaughlin', 'Ryan Briscoe', 'Scott Dixon'], 'A power-bill mascot', 3),
  q('Which NZ karter won Supercars titles and also raced IndyCar?', 'Scott McLaughlin', ['Shane van Gisbergen', 'Scott Dixon', 'Earl Bamber'], 'A sheep shearer', 3),
  q('Which Gold Coast karter moved into Triple Eight Supercars?', 'Broc Feeney', ['Will Brown', 'Cam Waters', 'Chaz Mostert'], 'A surf lifesaver', 3),
  q('Which Mildura karter became a Supercars race winner?', 'Cam Waters', ['David Reynolds', 'Garth Tander', 'James Courtney'], 'A grape farmer', 3),
  q('Which NZ karter won Supercars titles then raced NASCAR?', 'Shane van Gisbergen', ['Scott McLaughlin', 'Scott Dixon', 'Brendon Hartley'], 'A kiwi fruit', 3),
  q('Which Sunshine Coast karter reached Porsche and Le Mans?', 'Matt Campbell', ['Earl Bamber', 'Brendon Hartley', 'Will Power'], 'A pineapple', 4),
  q('Which Tasmanian karter won Supercars then raced NASCAR?', 'Marcos Ambrose', ['Jamie Whincup', 'Craig Lowndes', 'Garth Tander'], 'A devil', 4),
  q('Which Sydney karter reached IndyCar?', 'Ryan Briscoe', ['Will Power', 'Mark Webber', 'Oscar Piastri'], 'A ferry captain', 4),
  q('Which Queanbeyan racer reached Formula 1?', 'Mark Webber', ['Oscar Piastri', 'Jack Doohan', 'Daniel Ricciardo'], 'A public-servant kart', 4),
  q('What is the usual single-seater path after karting toward F1?', 'Formula 4, then F3, then F2', ['Supercars, then NASCAR', 'Indy NXT only', 'GT3 only'], 'Mario Kart, then F-Zero', 3),
  q('What is F1 Academy?', 'A single-seater series for women toward Formula 1', ['A kart-only junior cup', 'A Supercars support class', 'A NASCAR truck series'], 'A homework club', 3),
  q('Which Australian is listed with an F1 Academy pathway (grid VERIFY)?', 'Aiva Anagnostiadis', ['Oscar Piastri', 'Broc Feeney', 'Will Power'], 'A soap-opera extra', 4),
  q('What does TaG stand for in karting?', 'Touch and Go', ['Track and Grip', 'Two and Gear', 'Timed Autocross Group'], 'Tea and Ginger', 2),
  q('What extra brakes does KZ2 have versus a typical sprint kart?', 'Front brakes', ['No brakes', 'Inboard motorcycle discs', 'ABS'], 'A handbrake from a ute', 3),
  q('What fuel style is listed for 4SS / Torini?', 'PULP (sealed four-stroke)', ['Avgas only', 'E85 only', 'Methanol only'], 'Chocolate milk', 4),
  q('What dry tyre is listed for Cadet 9/12 in the 2026 table?', 'Maxxis 190D', ['LeCont LH03', 'LeCont LPM', 'Mojo D5 only'], 'A bicycle slick', 3),
  q('What wet tyre is listed for Cadets in the 2026 table?', 'Maxxis MW21', ['LeCont SV1 only', 'Pirelli rain', 'Dunlop KR'], 'Gumboots', 3),
  q('What LeCont dry is cited for KA3 / KA4 / TaG Restricted?', 'LH03', ['LOH', 'LPM', 'SV1'], 'A pizza topping', 4),
  q('What LeCont dry is cited for KA2 / TaG 125?', 'LOH', ['LH03', 'LPM', 'MW21'], 'A radio station', 4),
  q('What LeCont dry is cited for X30 / Rok GP / KZ2?', 'LPM', ['LH03', 'LOH', '190D'], 'A lunch special', 4),
  q('What cold-pressure start is cited for Maxxis Cadet M190D?', '0.6 bar (about 8.7 psi)', ['1.4 bar', '20 psi', '0.2 bar'], 'Whatever the compressor feels', 4),
  q('What LH03 cold-pressure start window is cited?', '9.5–11.0 psi', ['6–7 psi', '15–18 psi', '0.3 bar only'], 'A lucky number', 4),
  q('Should you invent a race pressure if the spec paper is missing?', 'No — say so and cite the KA extract', ['Yes, use 12 psi', 'Copy F1 blankets', 'Use car psi'], 'Ask a magician', 3),
  q('What is the first cheap setup change in the coach pack?', 'Tyre pressures', ['New axle', 'New chassis', 'Cut the seat'], 'Paint the kart pink', 2),
  q('About how much chain slack is the KB baseline?', 'About 10 mm total', ['Zero — run it tight', '50 mm', 'One full link hanging'], 'A banana', 3),
  q('What typical front sprocket range does KartRacer use?', '10–11 teeth', ['15–17 teeth', '40–45 teeth', '6 teeth'], 'A pizza cutter', 3),
  q('What typical rear sprocket range does KartRacer use?', 'About 68–95 teeth', ['30–40 teeth', '12–15 teeth', '120–140 teeth'], 'A clock face', 3),
  q('What wet gearing start is in the setup notes?', '+3 rear teeth', ['-5 rear teeth', 'Change the front only', 'No change'], 'Add a bicycle gear', 4),
  q('Do sprint karts have motorcycle-style suspension?', 'No — live axle, no springs', ['Yes, forks and a shock', 'Only the front', 'Only in rain'], 'They bounce on jelly', 2),
  q('What does a yellow flag mean?', 'Slow, no overtaking in that sector', ['Race is finished', 'Last lap', 'Pit now for fuel'], 'Wave at your mum', 1),
  q('What does a red flag mean?', 'Stop racing and follow officials', ['Push harder', 'Last lap', 'Safety car only'], 'Pizza is here', 1),
  q('What does a blue flag mean?', 'Faster kart approaching', ['Your race is over', 'Wet declared', 'Technical infringement'], 'You dropped an ice cream', 2),
  q('What does a black flag mean?', 'Report to officials', ['You won', 'Track is dry', 'Start your engine'], 'Go buy merch', 2),
  q('What is hop in a kart?', 'Inside-rear bounce from live-axle bind', ['A jump on the kerb only', 'Engine misfire', 'A good start'], 'A bunny on the infield', 4),
  q('What is the karting-to-Supercars idea in the pack?', 'Karts, then Super3/Super2, then Supercars', ['Karts straight to Bathurst 1000', 'Karts to MotoGP', 'Karts to WRC'], 'Karts to the school bus', 3),
  q('Which series includes the 24 Hours of Le Mans?', 'FIA WEC', ['IndyCar', 'NASCAR Cup', 'AKC'], 'The school fete', 2),
  q('Which US series includes the Indianapolis 500?', 'IndyCar', ['NASCAR Cup', 'Formula 1', 'Supercars'], 'Monster Jam', 1),
  q('Which US series is stock-car oval racing’s top level?', 'NASCAR Cup Series', ['IndyCar', 'WEC', 'F1 Academy'], 'Demolition derby', 2),
  q('Where did Lewis Hamilton start racing as a kid?', 'Karts in Stevenage', ['F2 in Spain', 'NASCAR trucks', 'Isle of Man TT'], 'A London bus', 3),
  q('Where did Max Verstappen start racing?', 'Karts from age four', ['F3 only', 'Dakar', 'Moto3'], 'A playground swing', 2),
  q('Where did Ayrton Senna become a champion before F1?', 'Brazilian karting', ['Indy Lights', 'NASCAR', 'Touring cars'], 'Beach football', 3),
  q('Which club scene is linked to Schumacher and Vettel in the blurbs?', 'Kerpen', ['Monza kart only', 'Suzuka', 'Silverstone GP'], 'A pretzel factory', 4),
  q('Which NZ karter became a six-time IndyCar champion?', 'Scott Dixon', ['Scott McLaughlin', 'Earl Bamber', 'Brendon Hartley'], 'A hobbit', 4),
  q('Which Spanish karter became an IndyCar champion in the onboarding set?', 'Alex Palou', ['Carlos Sainz', 'Fernando Alonso', 'Charles Leclerc'], 'A tapas chef', 4),
  q('Which seven-time Supercars champion started in karts?', 'Jamie Whincup', ['Craig Lowndes', 'Garth Tander', 'Marcos Ambrose'], 'A cricket captain', 4),
  q('What meeting document can change class weights on the day?', 'Supplementary Regulations', ['A Facebook comment', 'A tyre sticker', 'The weather app'], 'A text from your uncle', 3),
  q('What must D Grade and 8-Day licence holders show?', 'A P plate after the Observed Driving Session', ['A gold helmet', 'A transponder they own', 'A wet tyre'], 'A learner magnet', 4),
  q('Who holds a Participant’s Licence for an under-18 driver?', 'A parent or guardian', ['The clerk of course', 'The engine builder', 'Any mechanic'], 'The family dog', 2),
  q('What is the national combined calendar page named in the handoff?', 'karting.net.au/ka-calendar', ['motogp.com', 'supercars.com', 'worldsbk.com'], 'A secret Facebook group', 3),
  q('Which headline RSS is the primary AU kart feed (probed 2026-09-10)?', 'KartSportNews', ['TKART (403)', 'FIA Karting HTML page', 'ASBK news'], 'A fishing blog', 3),
  q('Why was TKART dropped as a headline source?', 'The feed returned 403', ['It is about cars', 'It is not RSS ever', 'It is paywalled PDF only'], 'They only write in semaphore', 5),
  q('Which 2026 AKC round is listed for Townsville?', 'Round 3, 3–5 July 2026 (provisional venue note)', ['Round 1', 'Round 5', 'There is no QLD round'], 'A cruise ship', 5),
  q('Which 2026 AKC round is listed for Seymour / Eastern Lions?', 'Round 4, 4–6 September 2026', ['Round 2', 'Round 1', 'Round 5'], 'A sheep show', 5),
  q('What KA3 Senior Light example weight is in the 2026 table?', '150 kg kart + driver + equipment', ['110 kg kart only', '200 kg driver only', '80 kg'], 'A bag of potatoes', 5),
  q('What licence grade does National Cadet / KA3 need in the 2026 snapshot?', 'C Grade', ['E Grade only', 'A Grade only', 'No licence'], 'A library card', 5),
  q('What licence grade do KA2, Junior Max, TaG 125 and X30 need?', 'B Grade', ['D Grade', '8-Day only', 'E Grade'], 'A bus ticket', 5),
  q('How many endorsed meetings move D Grade to C Grade?', 'Four', ['One', 'Twelve', 'Twenty'], 'Until the canteen closes', 5),
  q('What Mini Rok peak figure is cited from vortex-engines.com?', '10 hp at 11,000 rpm', ['30 hp at 11,500', '40 hp gearbox', '2 hp'], 'A blender', 6),
  q('What Rotax Senior MAX EVO power is cited from rotax-racing.com?', '30 hp (22 kW) at 11,500 rpm', ['10 hp', '15 hp KA100 only', '50 hp'], 'A leaf blower', 6),
  q('What X30 power band is cited from AU importer sheets?', 'About 30 hp at ~11,000–11,250 rpm', ['10 hp', '40+ hp VERIFY KZ', '5 hp'], 'A kitchen mixer', 6),
  q('What Torini TC210 power is cited from the homologation sheet?', '10 hp at 5,600 rpm', ['30 hp', '15 hp at 9,750', '40 hp'], 'A ceiling fan', 6),
  q('Why is Rok DVS omitted from kartEngineRef.json?', 'The hp/rpm pairing is still VERIFY', ['It is banned forever', 'It is a motorcycle', 'It has no clutch'], 'It failed a spelling test', 6),
  q('Why is KZ2 engine make omitted from kartEngineRef.json?', 'Homologated make power is still VERIFY', ['KZ2 is not a kart', 'It is Cadet only', 'KA banned it in 1990'], 'The gearbox ate the datasheet', 6),
  q('What pyrometer optimum band is cited in the chassis KB?', 'About 75–85 °C', ['20–30 °C', '120–140 °C', '0 °C'], 'Room temperature tea', 5),
  q('What pressure step limit does the coach pack use?', '≤0.1 bar per step', ['1.0 bar jumps', '5 psi every lap', 'No limit'], 'Until it pops', 6),
  q('Which file is the cited tyre-spec extract?', 'gpt-knowledge/control-tyre-data-extract.md', ['A Reddit thread', 'A Facebook comment', 'TKART 403 feed'], 'A shopping docket', 6),
  q('Which structured snapshot holds 2026 KA classes and weights?', 'kb-au-rules/data/classes.json', ['Send-It MoMS index', 'ASBK tech bulletin', 'FIM road-race GCR'], 'A café menu', 5),
  q('What Rotax Junior MAX EVO power is cited from rotax-racing.com?', '23 hp (17 kW) at 8,500 rpm', ['30 hp at 11,500', '10 hp Mini Rok', '40 hp KZ VERIFY'], 'A desk fan', 6),
  q('What Junior MAX restrictor id family is pointed at in kb-au-rules?', 'SR4 23.5 mm (confirm restrictors.json)', ['Cadet 16 mm Mini Rok', 'KA4 19 mm', 'No restrictor ever'], 'A garden hose', 7),
  q('What KA4 restrictor size does the 2026 book use in the handoff?', '19 mm', ['16 mm Cadet', '22 mm only', 'Open'], 'A bottle cap', 6),
  q('What KA3 Junior restrictor size does the 2026 book use in the handoff?', '22 mm', ['16 mm', '19 mm only', 'None'], 'A doughnut', 6),
  q('What sign-off must KartRacer Coach use?', 'KartRacer Coach', ['RoadRacer AI Coach', 'Send-It Coach', 'MoMS Steward'], 'A lucky dip', 5),
];

function jsString(s) {
  return JSON.stringify(s);
}

function writeTriviaBank() {
  const dest = path.join(ROOT, 'api', 'triviaBankData.js');
  const body = `/**
 * Seed Q&A for trivia bank: easy and hard. Used by buildTriviaBank.js.
 */
export const FUNNY_ANSWERS = ${JSON.stringify(FUNNY, null, 2)};

export const EASY_QA = ${JSON.stringify(EASY_QA, null, 2)};

export const HARD_QA = ${JSON.stringify(HARD_QA, null, 2)};
`;
  fs.writeFileSync(dest, body);
  console.log(`wrote api/triviaBankData.js (${EASY_QA.length} easy, ${HARD_QA.length} hard)`);
}

function writeAuExtra() {
  const dest = path.join(ROOT, 'api', 'triviaAuExtra.js');
  const lines = [
    `/** Extra unique Australian / pathway trivia for AUS_Q&A merge. */`,
    ``,
    `function q(question, correct, wrongs, joke, rating) {`,
    `  const options = [correct, ...wrongs.slice(0, 3), joke].filter((s) => typeof s === 'string' && s.length > 0);`,
    `  return {`,
    `    question,`,
    `    options,`,
    `    correct_index: 0,`,
    `    difficulty_rating: rating,`,
    `    difficulty: rating <= 4 ? 'easy' : 'hard',`,
    `    source: 'au-extra',`,
    `  };`,
    `}`,
    ``,
    `export const AU_EXTRA_TRIVIA = [`,
  ];
  for (const item of AU_EXTRA) {
    const wrongs = item.options.slice(1, 4);
    const joke = item.options[item.options.length - 1];
    lines.push(
      `  q(${jsString(item.question)}, ${jsString(item.options[0])}, ${JSON.stringify(wrongs)}, ${jsString(joke)}, ${item.difficulty_rating}),`
    );
  }
  lines.push(`];`, ``);
  fs.writeFileSync(dest, `${lines.join('\n')}\n`);
  const easy = AU_EXTRA.filter((i) => i.difficulty_rating <= 4).length;
  const hard = AU_EXTRA.filter((i) => i.difficulty_rating >= 5).length;
  console.log(`wrote api/triviaAuExtra.js (${AU_EXTRA.length} items, easy ${easy}, hard ${hard})`);
}

writeTriviaBank();
writeAuExtra();
