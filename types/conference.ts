export type QuestionType =
  | "shortText"
  | "email"
  | "phone"
  | "date"
  | "dropdown"
  | "number"
  | "longText";

export type QuestionDefinition = {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  minWords?: number;
  minCharacters?: number;
};

export type ApplicationType = "delegate" | "chair" | "delegation" | "press" | "admin";

export type ApplicationDefinition = {
  id: ApplicationType;
  enabled: boolean;
  title: string;
  formTitle: string;
  description: string;
};

export type LetterDefinition = {
  id: string;
  titlePrefix: string;
  titleHighlight: string;
  opening: string;
  paragraphs: string[];
  author?: string;
};

export type SiteSettings = {
  conference: {
    id: string;
    brandName: string;
    shortName: string;
    displayName: string;
    fullName: string;
    sessionName: string;
    dates: string;
    startDateIso: string;
    endDateIso: string;
    year: number;
    hashtag: string;
    siteUrl: string;
    contactEmail: string;
    senderEmail: string;
    instagramUrl: string;
    instagramHandle: string;
    location: { venue: string; city: string; country: string };
    organizer: { name: string; creditName: string; creditUrl: string };
  };
  sections: {
    about: boolean;
    letters: boolean;
    committees: boolean;
    team: boolean;
    applications: boolean;
    contact: boolean;
  };
  applications: ApplicationDefinition[];
  form: {
    minimumDelegates: number;
    committeePreferenceCount: number;
    questions: Record<ApplicationType, QuestionDefinition[]>;
  };
  letters: LetterDefinition[];
};

export type PublicCommittee = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string;
  documents: Array<{ label: string; url: string }>;
  updatedAt: string;
};

export type PublicTeamMember = {
  id: number;
  name: string;
  slug: string;
  role: string;
  imageUrl: string | null;
  bio: string;
  instagram: string | null;
  updatedAt: string;
};
