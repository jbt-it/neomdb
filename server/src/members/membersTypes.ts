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