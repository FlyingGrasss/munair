export const INSTAGRAM_SIZE = { width: 1080, height: 1350 } as const;

export const INSTAGRAM_COLORS = {
  night: "#05080d",
  navy: "#0b1626",
  navyAlt: "#121d2f",
  ink: "#101923",
  blue: "#156bc9",
  blueDark: "#0e459a",
  blueLight: "#8ab7da",
  mist: "#9cbdd9",
  ice: "#eaf2f7",
  paper: "#f4f7f9",
  muted: "#5a6a7a",
  white: "#ffffff",
  gold: "#c9a36a",
} as const;

export type DesignCard = {
  label: string;
  title: string;
  detail: string;
  body?: string;
  points: string[];
  background: string;
  foreground: string;
  rule: string;
};

export type CommitteeDesign = {
  slug: string;
  order: string;
  abbr: string;
  name: string;
  kicker: string;
  tagline: string;
  motto: string;
  intro: string;
  titleLines: string[];
  titleConnector?: string;
  slideTwoTitle: string[];
  slideThreeTitle: string[];
  slideTwoLabel: string;
  slideTwoFooter: string;
  slideThreeQuote: string;
  agenda: string[];
  agendaDetails: string[];
  meta: { label: string; value: string }[];
  cards: DesignCard[];
  accent: string;
  accentSoft: string;
  watermark: "dragon" | "wordmark";
  year: string;
  yearLabel: string;
};

export const COMMITTEE_DESIGNS: Record<string, CommitteeDesign> = {
  "house-of-the-dragons": {
    slug: "house-of-the-dragons",
    order: "01",
    abbr: "F-JCC",
    name: "House of the Dragons",
    kicker: "Fictional Joint Crisis Committee",
    tagline: "A Targaryen civil war, reimagined.",
    motto: "Fire & Blood",
    intro:
      "King Viserys is dead. Two claimants, two councils, and no agreed successor. Delegates govern one of the rival courts, negotiate across a divided realm, and decide how far they will go for the Iron Throne.",
    titleLines: ["HOUSE", "DRAGONS"],
    titleConnector: "OF THE",
    slideTwoTitle: ["TWO COURTS.", "ONE THRONE."],
    slideThreeTitle: ["THE DANCE", "OF THE", "DRAGONS"],
    slideTwoLabel: "THE TWO COURTS",
    slideTwoFooter: "TWO CABINETS · ONE SHARED CRISIS · LIVE UPDATES",
    slideThreeQuote: "Every claim has a cost.",
    agendaDetails: [
      "Who has the stronger claim — the king's named heir or his eldest son?",
      "Every house must choose a side. Every choice has a price.",
      "Air superiority, civilian risk, and the future of the realm.",
    ],
    meta: [
      { label: "FORMAT", value: "JOINT CRISIS" },
      { label: "COUNCILS", value: "TWO" },
      { label: "UPDATES", value: "LIVE" },
    ],
    cards: [
      {
        label: "The Blacks",
        title: "Rhaenyra Targaryen",
        detail: "The Queen's Council",
        body: "The late king's named heir. The realm swore an oath to her — and the Greens crowned another.",
        points: ["Dragonstone", "The Velaryon fleet", "The North"],
        background: "#101923",
        foreground: "#eaf2f7",
        rule: "#a8433c",
      },
      {
        label: "The Greens",
        title: "Aegon II Targaryen",
        detail: "The King's Council",
        body: "The king's eldest son. The Greens hold the capital, the crown, and the weight of precedent.",
        points: ["King's Landing", "The Reach", "The Stormlands"],
        background: "#2d4a3a",
        foreground: "#eaf2f7",
        rule: "#7da98b",
      },
    ],
    agenda: [
      "The succession of the Iron Throne",
      "The loyalty of the great houses",
      "The cost of dragons at war",
    ],
    accent: "#b9c9d6",
    accentSoft: "rgba(185, 201, 214, 0.08)",
    watermark: "dragon",
    year: "129 AC",
    yearLabel: "THE DANCE BEGINS",
  },
  disec: {
    slug: "disec",
    order: "02",
    abbr: "DISEC",
    name: "Disarmament & International Security",
    kicker: "General Assembly · First Committee",
    tagline: "Security is never unilateral.",
    motto: "Peace & Security",
    intro:
      "Delegates confront the weapons and technologies that shape international stability — from autonomous systems to nuclear risk and the militarisation of space. Every proposal must balance deterrence with restraint.",
    titleLines: ["DISEC"],
    slideTwoTitle: ["ONE ROOM.", "GLOBAL STAKES."],
    slideThreeTitle: ["THE", "AGENDA"],
    slideTwoLabel: "THREE FRONTS",
    slideTwoFooter: "THREE FRONTS · ONE COMMITTEE · ONE RESOLUTION",
    slideThreeQuote: "Security is never unilateral.",
    agendaDetails: [
      "Human control, accountability, and the line between tool and combatant.",
      "Deterrence, transparency, and the machinery of escalation.",
      "Orbital stability and the prevention of an arms race beyond Earth.",
    ],
    meta: [
      { label: "FORMAT", value: "GENERAL ASSEMBLY" },
      { label: "COMMITTEE", value: "FIRST" },
      { label: "OUTPUT", value: "RESOLUTION" },
    ],
    cards: [
      {
        label: "Autonomous Weapons",
        title: "Lethal autonomy",
        detail: "Human control, accountability, and the laws of war.",
        points: ["Human control", "Accountability", "Compliance"],
        background: "#101923",
        foreground: "#eaf2f7",
        rule: "#156bc9",
      },
      {
        label: "Nuclear Risk",
        title: "A fragile balance",
        detail: "Doctrine, transparency, and escalation management.",
        points: ["Doctrine", "Transparency", "Hotlines"],
        background: "#156bc9",
        foreground: "#ffffff",
        rule: "#8ab7da",
      },
      {
        label: "Space Security",
        title: "The next frontier",
        detail: "Orbital stability and the prevention of an arms race.",
        points: ["Orbits", "Debris", "Dual-use"],
        background: "#0e459a",
        foreground: "#eaf2f7",
        rule: "#8ab7da",
      },
    ],
    agenda: [
      "Lethal autonomous weapons systems",
      "Nuclear risk reduction and strategic stability",
      "The militarisation of outer space",
    ],
    accent: INSTAGRAM_COLORS.blueLight,
    accentSoft: "rgba(21, 107, 201, 0.12)",
    watermark: "wordmark",
    year: "2027",
    yearLabel: "THE SESSION OPENS",
  },
  "un-ocean": {
    slug: "un-ocean",
    order: "03",
    abbr: "UN OCEAN",
    name: "Ocean Affairs",
    kicker: "General Assembly · Ocean Committee",
    tagline: "The blue economy has a price.",
    motto: "Life Below Water",
    intro:
      "The ocean is a shared resource, a trade route, and a fragile ecosystem. Delegates negotiate protection and production, and decide who pays when the interests of coastal communities, industry, and the climate collide.",
    titleLines: ["UN OCEAN"],
    slideTwoTitle: ["A SHARED", "OCEAN."],
    slideThreeTitle: ["THE", "AGENDA"],
    slideTwoLabel: "THREE FRONTS",
    slideTwoFooter: "THREE FRONTS · ONE COMMITTEE · ONE RESOLUTION",
    slideThreeQuote: "The blue economy has a price.",
    agendaDetails: [
      "Conservation targets, enforcement, and the waters beyond national jurisdiction.",
      "Quotas, subsidies, and the fishing fleets that outrun the rules.",
      "Adaptation finance for the communities on the front line of a rising sea.",
    ],
    meta: [
      { label: "FORMAT", value: "GENERAL ASSEMBLY" },
      { label: "FOCUS", value: "OCEAN POLICY" },
      { label: "OUTPUT", value: "RESOLUTION" },
    ],
    cards: [
      {
        label: "Marine Protection",
        title: "30 by 30",
        detail: "Area-based conservation beyond national waters.",
        points: ["30% by 2030", "High-seas treaty", "Enforcement"],
        background: "#0e459a",
        foreground: "#ffffff",
        rule: "#8ab7da",
      },
      {
        label: "Sustainable Fisheries",
        title: "The shared catch",
        detail: "Quotas, subsidies, and illegal fishing.",
        points: ["Quotas", "Subsidies", "IUU fishing"],
        background: "#156bc9",
        foreground: "#ffffff",
        rule: "#eaf2f7",
      },
      {
        label: "Coastal Resilience",
        title: "Rising water",
        detail: "Adaptation, finance, and displaced communities.",
        points: ["Adaptation", "Finance", "Displacement"],
        background: "#101923",
        foreground: "#eaf2f7",
        rule: "#156bc9",
      },
    ],
    agenda: [
      "Marine protected areas and the high seas",
      "Sustainable fisheries and harmful subsidies",
      "Climate adaptation for coastal communities",
    ],
    accent: INSTAGRAM_COLORS.blueLight,
    accentSoft: "rgba(21, 107, 201, 0.12)",
    watermark: "wordmark",
    year: "2027",
    yearLabel: "THE SESSION OPENS",
  },
  "age-of-discovery": {
    slug: "age-of-discovery",
    order: "04",
    abbr: "CRISIS",
    name: "Age of Discovery",
    kicker: "Historical Crisis Committee",
    tagline: "The map is not the world.",
    motto: "Wind & Cartography",
    intro:
      "It is an age of sails, silver, and uncertain maps. Delegates pursue trade, territory, and knowledge while the consequences of contact move faster than any courier. Every claim on the map is a claim on someone's home.",
    titleLines: ["AGE OF", "DISCOVERY"],
    slideTwoTitle: ["THE MAP IS", "NOT THE WORLD."],
    slideThreeTitle: ["THE", "AGENDA"],
    slideTwoLabel: "THREE HORIZONS",
    slideTwoFooter: "THREE HORIZONS · ONE COMMITTEE · ONE RESOLUTION",
    slideThreeQuote: "Every claim on the map has a cost.",
    agendaDetails: [
      "Routes, monopolies, and the naval power that protects them.",
      "Patronage, cartography, and who gets to write the world.",
      "Contact, extraction, and the lives behind the legend.",
    ],
    meta: [
      { label: "FORMAT", value: "HISTORICAL CRISIS" },
      { label: "HORIZONS", value: "THREE" },
      { label: "UPDATES", value: "LIVE" },
    ],
    cards: [
      {
        label: "The Atlantic",
        title: "A new route",
        detail: "Navigation, patronage, and the race for reach.",
        points: ["Routes", "Patronage", "Cartography"],
        background: "#101923",
        foreground: "#eaf2f7",
        rule: "#8ab7da",
      },
      {
        label: "The Indian Ocean",
        title: "The old network",
        detail: "Ports, monopoly, and the price of passage.",
        points: ["Ports", "Monopoly", "Passage"],
        background: "#2d4a3a",
        foreground: "#eaf2f7",
        rule: "#7da98b",
      },
      {
        label: "The New World",
        title: "Contact",
        detail: "Exchange, extraction, and the cost of empire.",
        points: ["Contact", "Exchange", "Extraction"],
        background: "#0e459a",
        foreground: "#eaf2f7",
        rule: "#8ab7da",
      },
    ],
    agenda: [
      "Competing trade routes and maritime claims",
      "The politics of patronage and knowledge",
      "The human cost of discovery",
    ],
    accent: INSTAGRAM_COLORS.blueLight,
    accentSoft: "rgba(21, 107, 201, 0.12)",
    watermark: "wordmark",
    year: "1492",
    yearLabel: "THE SESSION OPENS",
  },
};

export const DESIGN_LIST = Object.values(COMMITTEE_DESIGNS);

export function getCommitteeDesign(slug: string) {
  return COMMITTEE_DESIGNS[slug];
}
