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
  geschlecht: number;
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
  tel1: string | null;
  email1: string;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: string | null;
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
 * Type of the language of a member
 */
export type Language = {
  wert: string;
  niveau: number;
};

/**
 * Type of the edv skill of a member
 */
export type EdvSkill = {
  wert: string;
  niveau: number;
};

/**
 * Type of the mentor (partial member)
 */
export type Mentor = {
  mitgliedID: number;
  vorname?: string;
  nachname?: string;
  generationID?: number;
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
 * Type of member with additional data (languages, mentor, mentee, edvskills)
 */
export type MemberDetails = {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: number;
  geburtsdatum: string | null;
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
  tel1: string | null;
  email1: string | null;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: string | null;
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
  mentor?: Mentor | null;
};

/**
 * Type of the request to create a member
 */
export type CreateMemberRequest = {
  vorname: string;
  nachname: string;
  name: string;
  geburtsdatum: string;
  password: string;
  handy: string;
  geschlecht: number;
  generation: number;
  traineeSeit: string;
  email: string;
};

/**
 * Type of the new member object used for the creation of a member
 */
export type NewMember = {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  handy: string;
  geschlecht: number;
  generation: number;
  traineeSeit: string;
  email: string;
};

/**
 * Type of the overview of the status of the different account creation operations
 */
export type StatusOverview = {
  querySuccesful: boolean;
  queryErrorMsg: string;
  mailSuccesful: boolean;
  mailErrorMsg: string;
  mailListSuccesful: boolean;
  mailListErrorMsg: string;
  nextcloudSuccesful: boolean;
  nextcloudErrorMsg: string;
  wikiSuccesful: boolean;
  wikiErrorMsg: string;
};

/**
 * Type of the response after creating a member
 */
export type CreateMemberResponse = {
  memberID: number;
  statusOverview: StatusOverview;
};

/**
 * Value type used for languages and edv skills
 */
export type Value = {
  wert: string;
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
 * Type of the request to update a department
 */
export type UpdateDepartmentRequest = {
  jbt_email: string;
  kuerzel: string;
  bezeichnung: string;
  ressortID: number;
  linkZielvorstellung: string;
  linkOrganigramm: string;
};

/**
 * Type of the department
 */
export type Department = {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
  jbt_email: string;
  linkZielvorstellung: string;
  linkOrganigramm: string;
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

/**
 * Type of plesk api call result
 */
export type PleskApiResult = {
  // TODO: Move to own file if used
  code: number;
  stdout: string;
  stderr: string;
};

/**
 * Type of nextcloud api call result
 */
export type NCApiResult = {
  // TODO: Move to own file if used
  status: string;
  statuscode: number;
  message: string;
  totalitems: number;
  itemsperpage: number;
};

/**
 * Type of mediawiki api call result
 */
export type MWApiResult = {
  // TODO: Move to own file if used
  status: string;
  message: string;
  messagecode: string;
  canpreservestate: boolean;
};

export type AssignPermissionToMemberRequest = {
  memberID: number;
  permissionID: number;
};
