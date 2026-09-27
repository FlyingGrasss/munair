import type { ApplicationType, PublicCommittee, PublicTeamMember, QuestionDefinition, SiteSettings } from "@/types/conference";

const grades = ["Preparation Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Graduate"];
const englishLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];
const dietary = ["No preference", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Other"];
const committees = ["DISEC", "UN Women", "UNESCO", "UN Ocean", "Crisis Committee: Age of Discovery", "Historical Committee: San Remo Conference"];

const q = (id: string, label: string, type: QuestionDefinition["type"] = "shortText", required = false, extra: Partial<QuestionDefinition> = {}): QuestionDefinition =>
  ({ id, label, type, required, ...extra });

const personal = (): QuestionDefinition[] => [
  q("fullName", "Full name", "shortText", true, { placeholder: "Your full name" }),
  q("email", "Email address", "email", true, { placeholder: "you@example.com" }),
  q("phoneNumber", "Phone number", "phone", true, { placeholder: "+90 5xx xxx xx xx" }),
  q("birthDate", "Birth date", "date", true),
  q("school", "School", "shortText", true),
  q("grade", "Grade / level", "dropdown", true, { options: grades }),
];

const preferences = (): QuestionDefinition[] => [
  q("choice1", "First committee preference", "dropdown", true, { options: committees }),
  q("choice2", "Second committee preference", "dropdown", false, { options: committees }),
  q("choice3", "Third committee preference", "dropdown", false, { options: committees }),
];

const commonEnd = (): QuestionDefinition[] => [
  q("experience", "Previous MUN experience", "longText"),
  q("motivationLetter", "Motivation letter", "longText", true, { minWords: 150 }),
  q("dietaryPreferences", "Dietary preference", "dropdown", false, { options: dietary }),
  q("additionalInfo", "Anything else we should know?", "longText"),
  q("privacyConsent", "I have read and accept the privacy notice", "dropdown", true, { options: ["I accept"] }),
];

const questions: Record<ApplicationType, QuestionDefinition[]> = {
  delegate: [...personal(), q("englishLevel", "English level", "dropdown", true, { options: englishLevels }), ...preferences(), ...commonEnd()],
  chair: [
    ...personal(), ...preferences(),
    q("experience", "Previous chairing and MUN experience", "longText", true),
    q("motivationLetter", "Motivation letter", "longText", true, { minWords: 150 }),
    q("scenario", "How would you restore productive debate in a divided committee?", "longText", true),
    ...commonEnd().slice(2),
  ],
  delegation: [
    q("schoolName", "School or organization", "shortText", true),
    q("numberOfDelegates", "Number of delegates", "number", true),
    q("contactEmail", "Head delegate / advisor email", "email", true),
    q("delegateFullName", "Delegate full name", "shortText", true),
    q("delegateBirthDate", "Birth date", "date", true),
    q("choice1", "First committee preference", "dropdown", true, { options: committees }),
    q("choice2", "Second committee preference", "dropdown", false, { options: committees }),
    q("delegateEnglishLevel", "English level", "dropdown", true, { options: englishLevels }),
    q("delegateEmail", "Delegate email", "email", true),
    q("delegatePhoneNumber", "Delegate phone", "phone", true),
    q("delegateGrade", "Grade / level", "dropdown", true, { options: grades }),
    q("delegateExperience", "Previous MUN experience", "longText"),
    q("delegateDietaryPreferences", "Dietary preference", "dropdown", false, { options: dietary }),
  ],
  press: [...personal(), q("experience", "Previous press or media experience", "longText"), q("portfolio", "Portfolio link", "shortText"), q("motivationLetter", "Motivation letter", "longText", true, { minWords: 150 }), ...commonEnd().slice(2)],
  admin: [...personal(), q("experience", "Previous event experience", "longText"), q("scenario", "How would you respond to an urgent operational problem during the conference?", "longText", true), q("motivationLetter", "Motivation letter", "longText", true, { minWords: 150 }), ...commonEnd().slice(2)],
};

export const DEFAULT_SETTINGS: SiteSettings = {
  conference: {
    id: "munair27",
    brandName: "MUNAIR",
    shortName: "MUNAIR'27",
    displayName: "MUNAIR'27",
    fullName: "Model United Nations of Aviation",
    sessionName: "Third Official Session of MUNAIR",
    dates: "2027",
    startDateIso: "2027-01-01T09:00:00+03:00",
    endDateIso: "",
    year: 2027,
    hashtag: "#wingsofdiplomacy",
    siteUrl: "https://www.modelunair.com",
    contactEmail: "contact@modelunair.com",
    senderEmail: "MUNAIR <applications@example.com>",
    instagramUrl: "https://www.instagram.com/modelunair/",
    instagramHandle: "@modelunair",
    location: { venue: "Havajet Aviation High School", city: "İzmir", country: "Türkiye" },
    organizer: { name: "MUNAIR Organization Team", creditName: "Emre Bozkurt", creditUrl: "https://www.instagram.com/emre.bozqurt/" },
  },
  sections: { about: true, letters: true, committees: true, team: true, applications: true, contact: true },
  applications: [
    { id: "delegate", enabled: true, title: "Delegate", formTitle: "Delegate Application", description: "Represent a nation, research global issues, and turn debate into practical diplomacy." },
    { id: "chair", enabled: true, title: "Chairboard", formTitle: "Chairboard Application", description: "Guide procedure, protect productive debate, and help every delegate contribute." },
    { id: "delegation", enabled: true, title: "Delegation", formTitle: "Delegation Application", description: "Bring your school or organization to MUNAIR as one coordinated delegation." },
    { id: "press", enabled: true, title: "Press", formTitle: "Press Application", description: "Document the conference through reporting, photography, and visual storytelling." },
    { id: "admin", enabled: true, title: "Admin", formTitle: "Admin Application", description: "Keep the conference moving through communication, logistics, and participant support." },
  ],
  form: { minimumDelegates: 4, committeePreferenceCount: 3, questions },
  letters: [{
    id: "secretary-general", titlePrefix: "Letter from the", titleHighlight: "Secretary-General", opening: "Dear Participants",
    paragraphs: [
      "It is my pleasure to welcome you to {shortName}, the third official session of Model United Nations of Aviation. At Havajet Aviation High School, delegates will meet across borders and perspectives to turn careful research into purposeful debate.",
      "Our team is building a conference where first-time and experienced delegates can speak with confidence, negotiate with respect, and leave each room with a wider view of the world. We look forward to welcoming you to İzmir.",
    ],
    author: "Rüzgar Efe Taşın — Secretary-General",
  }],
};

const defaultUpdatedAt = "2026-09-26T00:00:00.000Z";

export const DEFAULT_COMMITTEES: PublicCommittee[] = [
  { id: -1, name: "DISEC", slug: "disec", imageUrl: null, description: "The Disarmament and International Security Committee examines threats to global peace, weapons policy, and international security cooperation.", documents: [], updatedAt: defaultUpdatedAt },
  { id: -2, name: "UN Women", slug: "un-women", imageUrl: null, description: "A forum focused on gender equality, the rights of women and girls, and practical international action against discrimination.", documents: [], updatedAt: defaultUpdatedAt },
  { id: -3, name: "UNESCO", slug: "unesco", imageUrl: null, description: "Delegates address cooperation in education, science, culture, and the protection of shared human heritage.", documents: [], updatedAt: defaultUpdatedAt },
  { id: -4, name: "UN Ocean", slug: "un-ocean", imageUrl: null, description: "A policy room for marine ecosystems, sustainable use of the oceans, and the international challenges facing coastal communities.", documents: [], updatedAt: defaultUpdatedAt },
  { id: -5, name: "Crisis: Age of Discovery", slug: "crisis-age-of-discovery", imageUrl: null, description: "A fast-moving historical crisis where delegates respond to changing events, competing ambitions, and uncertain information.", documents: [], updatedAt: defaultUpdatedAt },
  { id: -6, name: "San Remo Conference", slug: "san-remo-conference", imageUrl: null, description: "A historical simulation built around negotiation, mandates, and the decisions that reshaped the post-war international order.", documents: [], updatedAt: defaultUpdatedAt },
];

export const DEFAULT_TEAM: PublicTeamMember[] = [
  { id: -1, name: "Rüzgar Efe Taşın", slug: "secretary-general", role: "Secretary-General", imageUrl: "/munair_logo.jpg", bio: "Leads the conference vision and represents the MUNAIR secretariat.", instagram: null, updatedAt: defaultUpdatedAt },
  { id: -2, name: "MUNAIR Academic Team", slug: "academic-team", role: "Academic Team", imageUrl: "/munair_logo.jpg", bio: "Guides committee preparation, academic standards, and chairboard coordination.", instagram: null, updatedAt: defaultUpdatedAt },
  { id: -3, name: "MUNAIR Organization Team", slug: "organization-team", role: "Organization Team", imageUrl: "/munair_logo.jpg", bio: "Coordinates the organization team and the conference’s operational plan.", instagram: null, updatedAt: defaultUpdatedAt },
  { id: -4, name: "MUNAIR Press Team", slug: "press-team", role: "Press Team", imageUrl: "/munair_logo.jpg", bio: "Documents the conference through reporting, photography, and visual storytelling.", instagram: null, updatedAt: defaultUpdatedAt },
];

export const APPLICATION_TYPES = DEFAULT_SETTINGS.applications.map((item) => item.id);

export function formatConferenceText(text: string, settings: SiteSettings = DEFAULT_SETTINGS) {
  return text.replaceAll("{sessionName}", settings.conference.sessionName).replaceAll("{dates}", settings.conference.dates).replaceAll("{shortName}", settings.conference.shortName);
}
