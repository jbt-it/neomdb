/**
 * Definition of used types within the users module
 */
export type LoginQueryResult = {
  mitgliedID: number;
  name: string;
  passwordHash: string;
  permissions: string;
};

export type GetMembersQueryResult = {
  vorname: string;
  nachname: string;
  handy: number;
  jbt_email: string;
  mitgliedstatus: string;
  ressort: string;
  lastchange: string;
};

export type GetDirectorsQueryResult = {
  mitgleidID: number;
  vorname: string;
  nachname: string;
  geschlecht: string;
  kuerzel: string;
  bezeichnung_maennlich: string;
  bezeichnung_weiblich: string;
  von: string | null;
  bis: string | null;
};

export type GetPermissionsQueryResult = {
  vorname: string;
  nachname: string;
  permission: number;
};

export type GetDepartmentMembersQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  ressort: string;
  bezeichnung: string;
};

/**
 * Returns the name and passwordHash associated to verify the current password
 */
export type GetPasswordForValidation = {
  name: string;
  passwordHash: string;
};

/**
 * Returns the email, to verify if it exists
 */
export type GetEmailToVerifyValidity = {
  email: string;
};

/**
 * Returns the email, to verify if it exists
 */
 export type GetEmailDateTokenToVerifyValidity = {
  email: string;
  datediff: number;
  token: string;
};

/**
 * Type of query results of all department retrieval.
 */
export type GetDepartmentsQueryResult = {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
};
