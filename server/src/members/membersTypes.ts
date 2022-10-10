/**
 * Definition of used types within the users module
 */

/**
 * Type of query results of members retrieval
 */
export type GetMembersQueryResult = {
  vorname: string;
  nachname: string;
  handy: number;
  jbt_email: string;
  mitgliedstatus: string;
  ressort: string;
  lastchange: string;
};

/**
 * Type of query result of the basic identification of a member
 */
export type GetMemberIdentificationQueryResult = {
  mitgliedID: number;
  name: string;
  jbt_email: string;
};

export type GetMembersNameQueryResult = {
  name: string;
};

/**
 * Type of query results of member retrieval
 */
export type GetMemberQueryResult = {
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
  kontoinhaber?: string;
  iban?: string;
  bic?: string;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
};

/**
 * Type of query results of langauge retrieval for a specific member
 */
export type GetLanguageOfMemberQueryResult = {
  wert: string;
  niveau: string;
};

/**
 * Type of query results of edv skills retrieval for a specific member
 */
export type GetEDVSkillsOfMemberQueryResult = {
  wert: string;
  niveau: string;
};

/**
 * Type of query results of mentor retrieval for a specific member
 */
export type GetMentorOfMemberQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
};

/**
 * Type of query results of mentee retrieval for a specific member
 */
export type GetMenteeOfMemberQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
};

/**
 * Type of query results of all directors retrieval.
 */
export type GetDirectorsQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  geschlecht: string;
  kuerzel: string;
  bezeichnung_maennlich: string;
  bezeichnung_weiblich: string;
  von: string | null;
  bis: string | null;
};

/**
 * Type of query results of permissions retrieval
 */
export type GetPermissionsQueryResult = {
  vorname: string;
  nachname: string;
  permission: number;
};

/**
 * Type of query results of department members retrieval.
 */
export type GetDepartmentMembersQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  ressort: string;
  bezeichnung: string;
};

/**
 * Type of query results of current directors retrieval.
 */
export type GetCurrentDirectorsQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  geschlecht: string;
  bezeichnung_weiblich: string;
  bezeichnung_maennlich: string;
  kuerzel: string;
};

/**
 * Returns the name and passwordHash associated to verify the current password
 */
export type GetPasswordForValidation = {
  name: string;
  passwordHash: string;
};

/**
 * Type of query results of all department retrieval.
 */
export type GetDepartmentsQueryResult = {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
};

/**
 * Type of plesk api call result
 */
export type PleskApiResult = {
  code: number;
  stdout: string;
  stderr: string;
};

/**
 * Type of nextcloud api call result
 */
export type NCApiResult = {
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
  status: string;
  message: string;
  messagecode: string;
  canpreservestate: boolean;
};
