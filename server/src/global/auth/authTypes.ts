/**
 * Definition of used types within the users module
 */

/**
 * Type of query results of the login
 */
 export type LoginQueryResult = {
    mitgliedID: number;
    name: string;
    passwordHash: string;
    permissions: string;
  };

  /**
   * Type of query results of the user data retrieval
   */
  export type UserDataQueryResult = {
      mitliedID: number;
      name: string;
      permissions: string;
  };