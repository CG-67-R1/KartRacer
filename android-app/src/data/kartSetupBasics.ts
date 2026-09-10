export type HotspotKind = 'measure' | 'adjust';

export type BikeSetupHotspot = {
  id: string;
  kind: HotspotKind;
  xPct: number;
  yPct: number;
  title: string;
  summary: string;
  roadBase: string;
  trackBase: string;
  capabilityNote: string;
  aiPrompt: string;
};

export const BIKE_SETUP_INTRO = {
  whyBase:
    'A baseline is a known starting point so the kart feels predictable. Change one thing at a time, cheapest first: pressures, then front width, then caster/camber, then axle, hubs, and seat.',
  capabilityCaveat:
    'Your class may not allow every adjuster on this picture. If a number is not in the class regs or a cited tyre file, leave it and ask your coach — do not guess.',
};

export const BIKE_SETUP_HOTSPOTS: BikeSetupHotspot[] = [
  {
    id: 'pressures',
    kind: 'measure',
    xPct: 18,
    yPct: 22,
    title: 'Cold tyre pressures',
    summary:
      'Set pressures in the pits while the tyres are cold. Use the cited starting window for your compound, then adjust for the track and weather.',
    roadBase:
      'KA / importer starting windows (air only): LeCont LH03 9.5–11.0 psi (KA3/KA4/TaG Restricted/DD2/Jr Max); LOH 8.5–10 psi (KA2/TaG 125); LPM 8.0–9.5 psi (X30/Rok GP); Maxxis Cadet M190D 0.6 bar (~8.7 psi). Wets: LeCont SV1 0.9 bar service; Maxxis MW21/MW22 1.0 bar service / 0.6 recommended.',
    trackBase:
      'After a run, read outside / middle / inside with a pyrometer as soon as you stop. Optimum band 75–85 °C; near 95 °C the tyre is overworked. Cold middle → raise pressure; hot middle → drop pressure. Present every number as a starting point — not a race setting.',
    capabilityNote:
      'Sources: gpt-knowledge/control-tyre-data-extract.md and KA spec papers. If your class is not listed, ask your coach.',
    aiPrompt:
      'Help me set cold kart tyre pressures for my class and compound. Use only cited KA/importer windows. One change at a time.',
  },
  {
    id: 'front_width',
    kind: 'adjust',
    xPct: 50,
    yPct: 16,
    title: 'Front width',
    summary: 'Front track is the first chassis change after pressures. Wider front = more jacking and faster turn-in.',
    roadBase:
      'Widen front track: more front bite, faster turn-in. Narrow front: slower turn-in, more push. Work one spacer per side, then go back out.',
    trackBase:
      'Low grip / green: you may want more front bite. High grip / rubbered-in: do not keep adding width if the kart is already darty. Confirm the problem is not the driver first.',
    capabilityNote: 'From gpt-knowledge/chassis-setup-and-tyre-kb.md (ANGRI / OTK / KB chassis table).',
    aiPrompt: 'The kart pushes or turns in slowly. Talk me through a front-width change only.',
  },
  {
    id: 'caster',
    kind: 'adjust',
    xPct: 78,
    yPct: 22,
    title: 'Caster',
    summary: 'Caster jacks the chassis: more caster = more front bite and more inside-rear lift.',
    roadBase:
      'More caster: more front bite, more jacking, more entry rotation. Less caster: easier steer, frees the kart in high grip. Start central/neutral.',
    trackBase:
      'Measurement shortcut: ~4 mm height split ≈ 1° caster. A ~4 mm unexplained left/right difference can also mean a twisted chassis.',
    capabilityNote: 'Do not invent a caster number. Use the chassis scale or a sweep; confirm class legality.',
    aiPrompt: 'Explain a one-step caster change for entry understeer or a kart that is too heavy to steer.',
  },
  {
    id: 'camber',
    kind: 'adjust',
    xPct: 22,
    yPct: 48,
    title: 'Camber',
    summary: 'Typical baseline is 0–2 mm negative per side. Read the front tyre temperatures before you chase it.',
    roadBase:
      'Hot inner → less negative camber (also check caster). Hot outer → more negative camber. Softer pressure increases roll — you may need more negative camber after a pressure change.',
    trackBase: 'High-grip / rubbered-in: more negative camber is in the KB high-grip list. One change at a time.',
    capabilityNote: 'Baseline from chassis-setup-and-tyre-kb.md. Confirm the chassis scale units (mm vs degrees).',
    aiPrompt: 'Front tyres are hotter on one edge. Help me decide if that is camber, caster, or pressure.',
  },
  {
    id: 'toe',
    kind: 'adjust',
    xPct: 50,
    yPct: 48,
    title: 'Toe',
    summary: 'Toe-out 0–3 mm (smaller motors toward 0). Toe-in is rarely used.',
    roadBase: 'More toe-out: faster turn-in, more drag, less top speed. Darty on straights: reduce toe-out.',
    trackBase: 'If the kart darts, try less toe-out before you rewrite the front width.',
    capabilityNote: 'From the KB baseline dry setup table.',
    aiPrompt: 'The kart is darty on the straight or slow to turn in. Talk me through toe only.',
  },
  {
    id: 'axle_hubs',
    kind: 'adjust',
    xPct: 78,
    yPct: 48,
    title: 'Axle and hubs',
    summary: 'Stiffer axle / longer hubs = more rear grip. Softer axle keeps the inside rear up longer.',
    roadBase:
      'Stiffer axle: more rear grip (1050 textbook / high power). Softer axle: frees the chassis. Longer hubs stiffen axle response. On a 950 chassis the polarity can invert — if the book fails, try the opposite.',
    trackBase:
      'Low grip: medium–stiff axle. High grip: soft axle. Violent hop (often tall drivers): soften the rear and lower the seat before you add teeth.',
    capabilityNote: 'Live-axle kart — there is no differential and no motorcycle-style suspension.',
    aiPrompt: 'The rear is sliding or hopping. Help me choose one axle or hub change.',
  },
  {
    id: 'seat',
    kind: 'adjust',
    xPct: 35,
    yPct: 76,
    title: 'Seat position',
    summary: 'Seat is the biggest single tuning mass. Move it before you invent a new chassis setting.',
    roadBase:
      'More struts / tighter = more rear bite. Exit understeer: drop to one strut per side, lower rear ballast. Tall-driver hop: seat back and down, lower rear ballast.',
    trackBase: 'Change seat or ballast once, then go back out. Put it back if the kart is worse.',
    capabilityNote: 'From chassis-setup-and-tyre-kb.md seat + hop rows.',
    aiPrompt: 'The kart hops or will not rotate on exit. Talk me through one seat or strut change.',
  },
  {
    id: 'ride_height',
    kind: 'adjust',
    xPct: 68,
    yPct: 76,
    title: 'Ride height',
    summary: 'Baseline: front lowest; rear higher than front (wedge). Raise an end to add grip at that end.',
    roadBase:
      'Raise front ride height: more front (and some rear) transfer. Raise rear: more rear grip. Low grip: raise both. High grip: lowest rear.',
    trackBase: 'Wet list (KB): front and rear ride height maximum, with max caster and a narrower rear.',
    capabilityNote: 'Use the chassis scale. Do not copy motorcycle sag numbers onto a kart.',
    aiPrompt: 'Help me decide whether to raise the front or the rear for push or a loose kart.',
  },
];
