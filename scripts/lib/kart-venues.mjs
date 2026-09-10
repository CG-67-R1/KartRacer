/**
 * Stem → official venue names for the 129 Aus_Kart GPX files.
 * Display names are club/venue names from kb-au-rules/data/clubs.json where
 * the stem or S/F coordinates identify the club. Abbreviations are never
 * shipped as the catalog name.
 *
 * IDs are snake_case (required by gpxTrackMaps / corner index.ts imports).
 * GeraldtonK (244 m) is held out of the catalog until the club confirms the layout.
 */
export const HOLD_STEMS = {
  GeraldtonK: '244 m — confirm short/cadet layout with Midwest Kart Club before catalog',
};

const TZ = {
  NSW: 'Australia/Sydney',
  ACT: 'Australia/Sydney',
  VIC: 'Australia/Melbourne',
  QLD: 'Australia/Brisbane',
  WA: 'Australia/Perth',
  SA: 'Australia/Adelaide',
  TAS: 'Australia/Hobart',
  NT: 'Australia/Darwin',
};

/** stem → { name, layout?, club, group? } */
export const VENUES = {
  'A.WodongaK': {
    name: 'Albury-Wodonga Kart Club',
    layout: '1',
    club: 'Albury-Wodonga Kart Club',
    group: 'wodonga',
  },
  'A.WodongaK2': {
    name: 'Albury-Wodonga Kart Club',
    layout: '2',
    club: 'Albury-Wodonga Kart Club',
    group: 'wodonga',
  },
  'A.WodongaK3': {
    name: 'Albury-Wodonga Kart Club',
    layout: '3',
    club: 'Albury-Wodonga Kart Club',
    group: 'wodonga',
  },
  AlbanyK: { name: 'Albany City Kart Club', club: 'Albany City Kart Club' },
  BairnsdaleK: { name: 'Bairnsdale Kart Club', club: 'Bairnsdale Kart Club' },
  'Ballarat 2': {
    name: 'Ballarat Kart Club (Haddon Park)',
    layout: '2',
    club: 'Ballarat Kart Club',
    group: 'ballarat',
  },
  BallaratK: {
    name: 'Ballarat Kart Club (Haddon Park)',
    layout: '1',
    club: 'Ballarat Kart Club',
    group: 'ballarat',
  },
  'Barossa CCW': {
    name: 'Barossa Go-Kart Club',
    layout: 'CCW',
    club: 'Barossa Go-Kart Club',
  },
  BendigoK: { name: 'Bendigo Kart Club (Marong)', club: 'Bendigo Kart Club' },
  BHKC: { name: 'Broken Hill Kart Club', club: 'Broken Hill Kart Club' },
  'Bolivar Long': {
    name: 'Southern Go Kart Club (Bolivar Raceway)',
    layout: 'Long',
    club: 'Southern Go Kart Club',
    group: 'bolivar',
  },
  'BolivarK SH': {
    name: 'Southern Go Kart Club (Bolivar Raceway)',
    layout: 'Short',
    club: 'Southern Go Kart Club',
    group: 'bolivar',
  },
  BolivarK: {
    name: 'Southern Go Kart Club (Bolivar Raceway)',
    layout: 'National',
    club: 'Southern Go Kart Club',
    group: 'bolivar',
  },
  BPKC: { name: 'Circular Head Kart Club', club: 'Circular Head Kart Club' },
  BunburyK: {
    name: 'Bunbury City Kart Club',
    layout: '1',
    club: 'Bunbury City Kart Club',
    group: 'bunbury',
  },
  BundabergK: { name: 'Bundaberg Kart Club (Dromeside)', club: 'Bundaberg Kart Club' },
  BunKart: {
    name: 'Bunbury City Kart Club',
    layout: '2',
    club: 'Bunbury City Kart Club',
    group: 'bunbury',
  },
  BurnettK: { name: 'Burnett Kart Track', club: 'Burnett Kart Track' },
  'CairnsK ACW': {
    name: 'Cairns Kart Club',
    layout: 'ACW',
    club: 'Cairns Kart Club',
    group: 'cairns',
  },
  'CairnsK Var1': {
    name: 'Cairns Kart Club',
    layout: 'Var 1',
    club: 'Cairns Kart Club',
    group: 'cairns',
  },
  'CairnsK Var2': {
    name: 'Cairns Kart Club',
    layout: 'Var 2',
    club: 'Cairns Kart Club',
    group: 'cairns',
  },
  CanberraK: {
    name: 'Canberra Kart Racing Club (Pialligo)',
    layout: 'Short',
    club: 'Canberra Kart Racing Club',
    group: 'canberra',
  },
  CanberraLong: {
    name: 'Canberra Kart Racing Club (Pialligo)',
    layout: 'Long',
    club: 'Canberra Kart Racing Club',
    group: 'canberra',
  },
  CDKC: {
    name: 'Combined Districts Kart Club (Marrangaroo)',
    club: 'Combined Districts Kart Club',
  },
  'CHKRC A': {
    name: 'Coffs Harbour Kart Racing Club (C.ex Raceway)',
    layout: 'A',
    club: 'Coffs Harbour Kart Racing Club',
    group: 'chkrc',
  },
  'CHKRC A3': {
    name: 'Coffs Harbour Kart Racing Club (C.ex Raceway)',
    layout: 'A3',
    club: 'Coffs Harbour Kart Racing Club',
    group: 'chkrc',
  },
  'CHKRC B1': {
    name: 'Coffs Harbour Kart Racing Club (C.ex Raceway)',
    layout: 'B1',
    club: 'Coffs Harbour Kart Racing Club',
    group: 'chkrc',
  },
  'CHKRC C': {
    name: 'Coffs Harbour Kart Racing Club (C.ex Raceway)',
    layout: 'C',
    club: 'Coffs Harbour Kart Racing Club',
    group: 'chkrc',
  },
  'CHKRC D': {
    name: 'Coffs Harbour Kart Racing Club (C.ex Raceway)',
    layout: 'D',
    club: 'Coffs Harbour Kart Racing Club',
    group: 'chkrc',
  },
  'CHKRC E1': {
    name: 'Coffs Harbour Kart Racing Club (C.ex Raceway)',
    layout: 'E1',
    club: 'Coffs Harbour Kart Racing Club',
    group: 'chkrc',
  },
  'ClubSA A CCW': {
    name: 'Go Kart Club of SA (Monarto / Rocky Gully)',
    layout: 'A CCW',
    club: 'Go Kart Club of SA',
    group: 'clubsa',
  },
  'ClubSA A CW': {
    name: 'Go Kart Club of SA (Monarto / Rocky Gully)',
    layout: 'A CW',
    club: 'Go Kart Club of SA',
    group: 'clubsa',
  },
  'ClubSA B CW': {
    name: 'Go Kart Club of SA (Monarto / Rocky Gully)',
    layout: 'B CW',
    club: 'Go Kart Club of SA',
    group: 'clubsa',
  },
  'ClubSA C CCW': {
    name: 'Go Kart Club of SA (Monarto / Rocky Gully)',
    layout: 'C CCW',
    club: 'Go Kart Club of SA',
    group: 'clubsa',
  },
  CobdenK: { name: 'South West Kart Club (Cobden)', club: 'South West Kart Club' },
  CooloolaK: {
    name: 'Cooloola Coast Kart Club (Gympie Gold Raceway)',
    club: 'Cooloola Coast Kart Club',
  },
  DalbyK: { name: 'Dalby Kart Track', club: 'Dalby Kart Track' },
  'DarwinK Var1': {
    name: 'Darwin Karting Association (Hidden Valley)',
    layout: 'Var 1',
    club: 'Darwin Karting Association',
    group: 'darwin',
  },
  'DarwinK Var2': {
    name: 'Darwin Karting Association (Hidden Valley)',
    layout: 'Var 2',
    club: 'Darwin Karting Association',
    group: 'darwin',
  },
  'DarwinK Var3': {
    name: 'Darwin Karting Association (Hidden Valley)',
    layout: 'Var 3',
    club: 'Darwin Karting Association',
    group: 'darwin',
  },
  DubboK: { name: 'Dubbo Kart Club', club: 'Dubbo Kart Club' },
  'East Crk NSW': {
    name: 'Sydney International Karting Raceway (Eastern Creek)',
    layout: 'National',
    club: 'Sydney Illawarra Kart Club',
    group: 'eastern_creek',
  },
  'ELKC Short': {
    name: 'Eastern Lions Kart Club (Hume International)',
    layout: 'Short',
    club: 'Eastern Lions Kart Club',
    group: 'elkc',
  },
  ELKC: {
    name: 'Eastern Lions Kart Club (Hume International)',
    layout: 'National',
    club: 'Eastern Lions Kart Club',
    group: 'elkc',
  },
  'Emerald ACW': {
    name: 'Emerald Kart Club',
    layout: 'ACW',
    club: 'Emerald Kart Club',
    group: 'emerald',
  },
  'Emerald CW': {
    name: 'Emerald Kart Club',
    layout: 'CW',
    club: 'Emerald Kart Club',
    group: 'emerald',
  },
  EquipVar: {
    name: 'Albury-Wodonga Kart Club',
    layout: 'Kart Equip variant',
    club: 'Albury-Wodonga Kart Club',
    group: 'wodonga',
  },
  EsperanceK: { name: 'Esperance Kart Klub', club: 'Esperance Kart Klub' },
  Exmouth: { name: 'Exmouth Kart Club', club: 'Exmouth Kart Club' },
  'ExtremeK S': {
    name: 'Extreme Karting (Gold Coast)',
    layout: 'Short',
    club: 'Extreme Karting',
    group: 'extreme',
  },
  ExtremeK: {
    name: 'Extreme Karting (Gold Coast)',
    layout: 'Long',
    club: 'Extreme Karting',
    group: 'extreme',
  },
  GeelongK: { name: 'Geelong Kart Track', club: 'Geelong Kart Track' },
  'GeraldtonK 2': {
    name: 'Midwest Kart Club (Geraldton)',
    layout: '2',
    club: 'Midwest Kart Club',
    group: 'geraldton',
  },
  GeraldtonK: {
    name: 'Midwest Kart Club (Geraldton)',
    layout: 'Short (unverified)',
    club: 'Midwest Kart Club',
    group: 'geraldton',
  },
  GippslandK: {
    name: 'Gippsland Go-Kart Club (Tramway Park)',
    club: 'Gippsland Go-Kart Club',
  },
  'GKCV CW': {
    name: 'Go-Kart Club of Victoria (Port Melbourne)',
    layout: 'CW',
    club: 'Go-Kart Club of Victoria',
    group: 'gkcv',
  },
  GKCV: {
    name: 'Go-Kart Club of Victoria (Port Melbourne)',
    layout: 'National',
    club: 'Go-Kart Club of Victoria',
    group: 'gkcv',
  },
  GladstoneK: {
    name: 'Gladstone Kart Club (Formula K Raceway)',
    club: 'Gladstone Kart Club',
  },
  'GoK World AC': {
    name: 'Go Kart World (Newcastle)',
    layout: 'ACW',
    club: 'Go Kart World',
    group: 'gok_world',
  },
  'GoK World CW': {
    name: 'Go Kart World (Newcastle)',
    layout: 'CW',
    club: 'Go Kart World',
    group: 'gok_world',
  },
  GoldfieldsK: {
    name: 'Eastern Goldfields Kart Club (Kalgoorlie)',
    club: 'Eastern Goldfields Kart Club',
  },
  Grenfellk: { name: 'Grenfell Kart Club', club: 'Grenfell Kart Club' },
  GriffithK: { name: 'Griffith Kart Club', club: 'Griffith Kart Club' },
  GVKC: {
    name: 'Goulburn Valley Kart Club (Numurkah)',
    club: 'Goulburn Valley Kart Club',
  },
  HamiltonK: { name: 'Hamilton Kart Club (Buckley Park)', club: 'Hamilton Kart Club' },
  HedlandKart: {
    name: 'Hedland Kart Club',
    layout: '1',
    club: 'Hedland Kart Club',
    group: 'hedland',
  },
  ImpalaK: { name: 'Impala Kart Club (Tom Price)', club: 'Impala Kart Club' },
  'Indy800 Sh': {
    name: 'Greater Sydney Kart Club (Indy 800)',
    layout: 'Short',
    club: 'Greater Sydney Kart Club',
    group: 'indy800',
  },
  Indy800C: {
    name: 'Greater Sydney Kart Club (Indy 800)',
    layout: 'Club',
    club: 'Greater Sydney Kart Club',
    group: 'indy800',
  },
  IpswichK: {
    name: 'Ipswich Kart Club',
    layout: '1',
    club: 'Ipswich Kart Club',
    group: 'ipswich',
  },
  IpswichK2: {
    name: 'Ipswich Kart Club',
    layout: '2',
    club: 'Ipswich Kart Club',
    group: 'ipswich',
  },
  JabiruK: { name: 'Jabiru Kart Track', club: 'Jabiru Kart Track' },
  'Karratha Sh': {
    name: 'Karratha Kart Club',
    layout: 'Short',
    club: 'Karratha Kart Club',
    group: 'karratha',
  },
  Karratha: {
    name: 'Karratha Kart Club',
    layout: 'National',
    club: 'Karratha Kart Club',
    group: 'karratha',
  },
  KartEquip: {
    name: 'Albury-Wodonga Kart Club',
    layout: 'Kart Equip',
    club: 'Albury-Wodonga Kart Club',
    group: 'wodonga',
  },
  LakeKingK: { name: 'Lake King Kart Club', club: 'Lake King Kart Club' },
  LauncestonK: {
    name: 'Launceston Kart Club (Archerville)',
    layout: '1',
    club: 'Launceston Kart Club',
    group: 'launceston',
  },
  LismoreK: { name: 'Lismore Kart Club', club: 'Lismore Kart Club' },
  lkc: {
    name: 'Launceston Kart Club (Archerville)',
    layout: '2',
    club: 'Launceston Kart Club',
    group: 'launceston',
  },
  MackayK: { name: 'Mackay Kart Track', club: 'Mackay Kart Track' },
  MegaFastB: {
    name: 'Mega Fast Karts (Wanneroo)',
    layout: 'B',
    club: 'Mega Fast Karts',
    group: 'megafast_wanneroo',
  },
  MegaFastC: {
    name: 'Mega Fast Karts (Wanneroo)',
    layout: 'C',
    club: 'Mega Fast Karts',
    group: 'megafast_wanneroo',
  },
  MegaFastKart: {
    name: 'Mega Fast Karts (Wanneroo)',
    layout: 'National',
    club: 'Mega Fast Karts',
    group: 'megafast_wanneroo',
  },
  MFastKartCoc: {
    name: 'Mega Fast Karts (Cockburn)',
    layout: 'Cockburn',
    club: 'Mega Fast Karts',
    group: 'megafast_cockburn',
  },
  MFastKartD: {
    name: 'Mega Fast Karts (Cockburn)',
    layout: 'D',
    club: 'Mega Fast Karts',
    group: 'megafast_cockburn',
  },
  MilduraK: { name: 'Mildura Kart Club', club: 'Mildura Kart Club' },
  MoranbahK: { name: 'Moranbah Kart Track', club: 'Moranbah Kart Track' },
  'Mt Isa': { name: 'Mount Isa Kart Track', club: 'Mount Isa Kart Track' },
  'MtGambierK S': {
    name: 'Mt Gambier Karting Club (Glenburnie)',
    layout: 'Short',
    club: 'Mt Gambier Karting Club',
    group: 'mtgambier',
  },
  MtGambierK: {
    name: 'Mt Gambier Karting Club (Glenburnie)',
    layout: 'National',
    club: 'Mt Gambier Karting Club',
    group: 'mtgambier',
  },
  'MVKC 2024': {
    name: 'Manning Valley Kart Club (Wingham)',
    club: 'Manning Valley Kart Club',
  },
  NWKC: {
    name: 'North Western Kart Club (Highclere)',
    club: 'North Western Kart Club',
  },
  'Oakleigh-Lon': {
    name: 'Oakleigh Go-Kart Club (Clayton)',
    layout: 'Long',
    club: 'Oakleigh Go-Kart Club',
    group: 'oakleigh',
  },
  'Oakleigh-New': {
    name: 'Oakleigh Go-Kart Club (Clayton)',
    layout: 'New',
    club: 'Oakleigh Go-Kart Club',
    group: 'oakleigh',
  },
  OakleighK: {
    name: 'Oakleigh Go-Kart Club (Clayton)',
    layout: 'Club',
    club: 'Oakleigh Go-Kart Club',
    group: 'oakleigh',
  },
  'OrangeK A': {
    name: 'Orange Kart Club',
    layout: 'A',
    club: 'Orange Kart Club',
    group: 'orange',
  },
  'OrangeK B': {
    name: 'Orange Kart Club',
    layout: 'B',
    club: 'Orange Kart Club',
    group: 'orange',
  },
  'OrangeK C': {
    name: 'Orange Kart Club',
    layout: 'C',
    club: 'Orange Kart Club',
    group: 'orange',
  },
  'PDKC Long': {
    name: 'Portland District Karting Club',
    layout: 'Long',
    club: 'Portland District Karting Club',
    group: 'pdkc',
  },
  'PDKC Short': {
    name: 'Portland District Karting Club',
    layout: 'Short',
    club: 'Portland District Karting Club',
    group: 'pdkc',
  },
  'PI Kart': { name: 'Phillip Island Kart Track', club: 'Phillip Island Kart Track' },
  PictionK: { name: 'Picton Kart Track', club: 'Picton Kart Track' },
  'PMKRC Var1': {
    name: 'Port Macquarie Kart Racing Club',
    layout: 'Var 1',
    club: 'Port Macquarie Kart Racing Club',
    group: 'pmkrc',
  },
  'PMKRC Var2': {
    name: 'Port Macquarie Kart Racing Club',
    layout: 'Var 2',
    club: 'Port Macquarie Kart Racing Club',
    group: 'pmkrc',
  },
  'Port Hedland': {
    name: 'Hedland Kart Club',
    layout: '2',
    club: 'Hedland Kart Club',
    group: 'hedland',
  },
  PortGawlerK: { name: 'Port Gawler Kart Track', club: 'Port Gawler Kart Track' },
  RochesterK: {
    name: 'Rochester Kart Club (Nanneella)',
    club: 'Rochester Kart Club',
  },
  RockhamptonK: { name: 'Cap Coast Kart Club', club: 'Cap Coast Kart Club' },
  'Sapphire NSW': {
    name: 'Sapphire Coast Kart Club (Frogs Hollow)',
    club: 'Sapphire Coast Kart Club',
  },
  SilhouetteK: { name: 'Silhouette Kart Track', club: 'Silhouette Kart Track' },
  'SPKP Var1': {
    name: 'Sydney International Karting Raceway (Eastern Creek)',
    layout: 'Var 1',
    club: 'Sydney Illawarra Kart Club',
    group: 'eastern_creek',
  },
  'SPKP Var3': {
    name: 'Sydney International Karting Raceway (Eastern Creek)',
    layout: 'Var 3',
    club: 'Sydney Illawarra Kart Club',
    group: 'eastern_creek',
  },
  'SPKP Var4': {
    name: 'Sydney International Karting Raceway (Eastern Creek)',
    layout: 'Var 4',
    club: 'Sydney Illawarra Kart Club',
    group: 'eastern_creek',
  },
  STKC: {
    name: 'Southern Tasmanian Kart Club (Orielton)',
    club: 'Southern Tasmanian Kart Club',
  },
  StonyCreek: { name: 'Stony Creek Kart Track', club: 'Stony Creek Kart Track' },
  'Swan VIC': { name: 'Swan Hill Kart Club', club: 'Swan Hill Kart Club' },
  Tamworth: { name: 'Tamworth Kart Racing Club', club: 'Tamworth Kart Racing Club' },
  'Toowoomba CW': {
    name: 'Toowoomba & Lockyer Valley Kart Club (Greer Park)',
    layout: 'CW',
    club: 'Toowoomba & Lockyer Valley Kart Club',
  },
  TowersKart: {
    name: 'Charters Towers Kart Track',
    layout: '1',
    club: 'Charters Towers Kart Track',
    group: 'towers',
  },
  TowersKart2: {
    name: 'Charters Towers Kart Track',
    layout: '2',
    club: 'Charters Towers Kart Track',
    group: 'towers',
  },
  TownsvilleK: {
    name: 'Townsville Kart Club (Sun City Raceway)',
    club: 'Townsville Kart Club',
  },
  WaggaK: {
    name: 'Wagga & District Kart Racing Club',
    club: 'Wagga & District Kart Racing Club',
  },
  WarrnamboolK: {
    name: 'Warrnambool Kart Club (Lake Gillear)',
    club: 'Warrnambool Kart Club',
  },
  WarwickK: {
    name: 'Warwick Kart Club (Sandy Creek Raceway)',
    club: 'Warwick Kart Club',
  },
  WhyallaK: {
    name: 'Whyalla Go Kart Club (Mt Young Raceway)',
    club: 'Whyalla Go Kart Club',
  },
  WimmeraK: {
    name: 'Wimmera Kart Racing Club (Dooen)',
    layout: '1',
    club: 'Wimmera Kart Racing Club',
    group: 'wimmera',
  },
  WimmeraK2: {
    name: 'Wimmera Kart Racing Club (Dooen)',
    layout: '2',
    club: 'Wimmera Kart Racing Club',
    group: 'wimmera',
  },
  WollongongK: { name: 'Wollongong Kart Track', club: 'Wollongong Kart Track' },
  'Wundowie WA': {
    name: 'Hurricane Go Kart Club (Wundowie)',
    club: 'Hurricane Go Kart Club',
  },
};

export function stemToId(stem) {
  return stem
    .toLowerCase()
    .replace(/\./g, '_')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

export function timezoneForState(state) {
  return TZ[state] || 'Australia/Sydney';
}

export function displayName(venue) {
  if (!venue.layout) return venue.name;
  return `${venue.name} (${venue.layout})`;
}

export function catalogLayoutLabel(venue) {
  return venue.layout || undefined;
}

export function multiLayoutGroups(tracks) {
  const byGroup = new Map();
  for (const t of tracks) {
    if (!t.group) continue;
    if (!byGroup.has(t.group)) byGroup.set(t.group, []);
    byGroup.get(t.group).push(t.id);
  }
  return [...byGroup.values()].filter((ids) => ids.length >= 2);
}
