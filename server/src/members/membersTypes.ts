/**
 * Definition of used types within the users module
 */
export type LoginQueryResult = {
  mitgliedID: number;
  name: string;
  permissions: string;
};

export type GetMembersQueryResult = {
  vorname: string;
  nachname: string;
  handy: number;
};

export type GetPermissionsQueryResult = {
  vorname: string;
  nachname: string;
  permission: number;
};