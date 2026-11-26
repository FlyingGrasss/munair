export const INSTAGRAM_SIZE = { width: 1080, height: 1350 } as const;

export const SLIDES_PER_COMMITTEE = 2;
export const STAY_TUNED_SLIDES = 3;
export const STAY_TUNED_VARIANTS = 4;

export const INSTAGRAM_COLORS = {
  night: "#05080d",
  navy: "#0b1626",
  blue: "#156bc9",
  blueDark: "#0e459a",
  blueLight: "#8ab7da",
  mist: "#9cbdd9",
  ice: "#eaf2f7",
  muted: "#5a6a7a",
  white: "#ffffff",
} as const;

export type CommitteeDesign = {
  slug: string;
  order: string;
  abbr: string;
  name: string;
  kicker: string;
  image: string;
  coverTitleSize: number;
  coverSubtitle: string;
  titleLines: string[];
  titleConnector?: string;
  slideTwoKicker: string;
  slideTwoTitle: string[];
  motto: string;
  agenda: string[];
  agendaDetails: string[];
  accent: string;
};

export const COMMITTEE_DESIGNS: Record<string, CommitteeDesign> = {
  "house-of-the-dragons": {
    slug: "house-of-the-dragons",
    order: "01",
    abbr: "F-JCC",
    name: "House of the Dragons",
    kicker: "Fictional Joint Crisis Committee",
    image: "/design/instagram/house-of-the-dragons.jpg",
    coverTitleSize: 118,
    coverSubtitle: "A TARGARYEN CIVIL WAR, REIMAGINED.",
    titleLines: ["HOUSE", "DRAGONS"],
    titleConnector: "OF THE",
    slideTwoKicker: "THE DANCE OF THE DRAGONS",
    slideTwoTitle: ["TWO COURTS.", "ONE THRONE."],
    motto: "Fire & Blood",
    agenda: [
      "The succession of the Iron Throne",
      "The loyalty of the great houses",
      "The cost of dragons at war",
    ],
    agendaDetails: [
      "Who has the stronger claim — the king's named heir, or his eldest son?",
      "Every house must choose a side. Every choice has a price.",
      "Air superiority, civilian risk, and the future of the realm.",
    ],
    accent: "#b9c9d6",
  },
  disec: {
    slug: "disec",
    order: "02",
    abbr: "DISEC",
    name: "Disarmament & International Security",
    kicker: "General Assembly · First Committee",
    image: "/design/instagram/disec.jpg",
    coverTitleSize: 184,
    coverSubtitle: "DISARMAMENT & INTERNATIONAL SECURITY",
    titleLines: ["DISEC"],
    slideTwoKicker: "ONE ROOM · GLOBAL STAKES",
    slideTwoTitle: ["THREE FRONTS."],
    motto: "Peace & Security",
    agenda: [
      "Lethal autonomous weapons systems",
      "Nuclear risk reduction and strategic stability",
      "The militarisation of outer space",
    ],
    agendaDetails: [
      "Human control, accountability, and the line between tool and combatant.",
      "Deterrence, transparency, and the machinery of escalation.",
      "Orbital stability and the prevention of an arms race beyond Earth.",
    ],
    accent: INSTAGRAM_COLORS.blueLight,
  },
  "un-ocean": {
    slug: "un-ocean",
    order: "03",
    abbr: "UN OCEAN",
    name: "Ocean Affairs",
    kicker: "General Assembly · Ocean Committee",
    image: "/design/instagram/un-ocean.jpg",
    coverTitleSize: 166,
    coverSubtitle: "OCEAN AFFAIRS",
    titleLines: ["UN OCEAN"],
    slideTwoKicker: "THE BLUE ECONOMY HAS A PRICE",
    slideTwoTitle: ["A SHARED", "OCEAN."],
    motto: "Life Below Water",
    agenda: [
      "Marine protected areas and the high seas",
      "Sustainable fisheries and harmful subsidies",
      "Climate adaptation for coastal communities",
    ],
    agendaDetails: [
      "Conservation targets, enforcement, and the waters beyond national jurisdiction.",
      "Quotas, subsidies, and the fishing fleets that outrun the rules.",
      "Adaptation finance for the communities on the front line of a rising sea.",
    ],
    accent: INSTAGRAM_COLORS.blueLight,
  },
  "age-of-discovery": {
    slug: "age-of-discovery",
    order: "04",
    abbr: "CRISIS",
    name: "Age of Discovery",
    kicker: "Historical Crisis Committee",
    image: "/design/instagram/age-of-discovery.jpg",
    coverTitleSize: 132,
    coverSubtitle: "A HISTORICAL CRISIS · 1492",
    titleLines: ["AGE OF", "DISCOVERY"],
    slideTwoKicker: "EUROPE LOOKS OUTWARD",
    slideTwoTitle: ["THE MAP IS", "NOT THE WORLD."],
    motto: "Wind & Cartography",
    agenda: [
      "Competing trade routes and maritime claims",
      "The politics of patronage and knowledge",
      "The human cost of discovery",
    ],
    agendaDetails: [
      "Routes, monopolies, and the naval power that protects them.",
      "Patronage, cartography, and who gets to write the world.",
      "Contact, extraction, and the lives behind the legend.",
    ],
    accent: INSTAGRAM_COLORS.blueLight,
  },
};

export const DESIGN_LIST = Object.values(COMMITTEE_DESIGNS);

export function getCommitteeDesign(slug: string) {
  return COMMITTEE_DESIGNS[slug];
}

export const STAY_TUNED = {
  slug: "stay-tuned",
  dates: "5 – 6 – 7 MARCH 2027",
  city: "İZMİR",
  edition: "MUNAIR'27",
  kicker: "MODEL UNITED NATIONS OF AVIATION",
} as const;
