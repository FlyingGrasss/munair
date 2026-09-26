import type { ApplicationType, QuestionDefinition, SiteSettings } from "@/types/conference";

const grades = ["Preparation Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Graduate"];
const englishLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];
const dietary = ["No preference", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Other"];
const committees = ["To be announced"];

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
    dates: "To be announced",
    startDateIso: "",
    endDateIso: "",
    year: 2027,
    hashtag: "#wingsofdiplomacy",
    siteUrl: "https://www.modelunair.com",
    contactEmail: "Contact details to be announced",
    senderEmail: "MUNAIR <applications@example.com>",
    instagramUrl: "https://www.instagram.com/modelunair/",
    instagramHandle: "@modelunair",
    location: { venue: "Havajet Aviation High School", city: "Izmir", country: "Turkey" },
    organizer: { name: "MUNAIR Organization Team", creditName: "Emre Bozkurt", creditUrl: "https://www.instagram.com/emre.bozqurt/" },
  },
  sections: { about: true, letters: true, committees: true, team: true, applications: true, contact: true },
  applications: [
    { id: "delegate", enabled: false, title: "Delegate", formTitle: "Delegate Application", description: "Represent a nation, research global issues, and turn debate into practical diplomacy." },
    { id: "chair", enabled: false, title: "Chairboard", formTitle: "Chairboard Application", description: "Guide procedure, protect productive debate, and help every delegate contribute." },
    { id: "delegation", enabled: false, title: "Delegation", formTitle: "Delegation Application", description: "Bring your school or organization to MUNAIR as one coordinated delegation." },
    { id: "press", enabled: false, title: "Press", formTitle: "Press Application", description: "Document the conference through reporting, photography, and visual storytelling." },
    { id: "admin", enabled: false, title: "Admin", formTitle: "Admin Application", description: "Keep the conference moving through communication, logistics, and participant support." },
  ],
  form: { minimumDelegates: 4, committeePreferenceCount: 3, questions },
  letters: [{
    id: "welcome", titlePrefix: "A message from", titleHighlight: "MUNAIR", opening: "Dear future participants",
    paragraphs: [
      "MUNAIR brings diplomacy into an environment shaped by aviation: precise, international, and always moving forward. Our third official session will bring students together at Havajet Aviation High School for research, debate, negotiation, and cooperation.",
      "The next session is taking shape. Until its details are announced, we invite you to discover the conference, meet the organization, and follow @modelunair for the first updates.",
    ],
    author: "MUNAIR Organization Team",
  }],
};

export const APPLICATION_TYPES = DEFAULT_SETTINGS.applications.map((item) => item.id);

export function formatConferenceText(text: string, settings: SiteSettings = DEFAULT_SETTINGS) {
  return text.replaceAll("{sessionName}", settings.conference.sessionName).replaceAll("{dates}", settings.conference.dates).replaceAll("{shortName}", settings.conference.shortName);
}
