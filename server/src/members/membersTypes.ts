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