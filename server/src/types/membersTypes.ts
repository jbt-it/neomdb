/**
 * Type of the partial member
 */
export type MemberPartial = {
  vorname: string;
  nachname: string;
  handy: number;
  jbt_email: string;
  mitgliedstatus: string;
  ressort: string;
  lastchange: string;
};

/**
 * Type of the member
 */
export type Member = {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: string | null;
  internesprojekt: string | null;
  mentor: string | null;
  trainee_seit: string | null;
  mitglied_seit: string | null;
  alumnus_seit: string | null;
  senior_seit: string | null;
  aktiv_seit: string | null;
  passiv_seit: string | null;
  ausgetreten_seit: string | null;
  ressort: string;
  arbeitgeber: string | null;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: number | null;
  email2: string | null;
  hochschule: string;
  studiengang: string;
  studienbeginn: string | null;
  studienende: string | null;
  vertiefungen: string | null;
  ausbildung: string | null;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
  // Optional attributes only viewable with specific permissions (of if the user is the member)
  kontoinhaber?: string;
  iban?: string;
  bic?: string;
};

/**
 * Dto type of the member
 * This type is used to send the member with additional data (languages, mentor, mentee, edvskills) to the client
 */
export type MemberDto = {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: string | null;
  internesprojekt: string | null;
  trainee_seit: string | null;
  mitglied_seit: string | null;
  alumnus_seit: string | null;
  senior_seit: string | null;
  aktiv_seit: string | null;
  passiv_seit: string | null;
  ausgetreten_seit: string | null;
  ressort: string;
  arbeitgeber: string | null;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: number | null;
  email2: string | null;
  hochschule: string;
  studiengang: string;
  studienbeginn: string | null;
  studienende: string | null;
  vertiefungen: string | null;
  ausbildung: string | null;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
  // Optional attributes only viewable with specific permissions (of if the user is the member)
  kontoinhaber?: string;
  iban?: string;
  bic?: string;
  // Additional attributes
  sprachen?: Language[];
  edvkenntnisse?: EdvSkill[];
  mentees?: Mentee[];
  mentor?: Mentor;
};

/**
 * Type of the language of a member
 */
export type Language = {
  wert: string;
  niveau: string;
};

/**
 * Type of the edv skill of a member
 */
export type EdvSkill = {
  wert: string;
  niveau: string;
};

/**
 * Type of the mentor (partial member)
 */
export type Mentor = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
};

/**
 * Type of the mentee (partial member)
 */
export type Mentee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
};

/**
 * Type of a member of a department (partial member with department information)
 */
export type DepartmentMember = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  ressort: string;
  bezeichnung: string;
};

/**
 * Type of the partial department with just the id
 */
export type DepartmentPartialID = {
  ressortID: number;
};

/**
 * Type of the director (partial member with department and role information)
 */
export type Director = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  evpostenID: number;
  ressortID: number;
  geschlecht: string;
  bezeichnung_weiblich: string;
  bezeichnung_maennlich: string;
  kuerzel: string;
};
