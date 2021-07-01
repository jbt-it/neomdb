/**
 * Definition of used types within the users module
 */
 export type LoginQueryResult = {
    mitgliedID: number;
    name: string;
    passwordHash: string;
    permissions: string;
  };

  export type UserDataQueryResult = {
      mitliedID: number;
      name: string;
      permissions: string;
  };