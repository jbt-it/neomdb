/**
 * Definition of used types within the users module
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
 * Type of query results of all directors retrieval.
 */
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

/*
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
