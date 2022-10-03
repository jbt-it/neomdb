/**
 * Definition of used types within the auth module
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

/**
 * Type of query results of the director permissions retrieval
 */
export type DirectorPermissionsQueryResult = {
  permissionID: number;
  canDelegate: boolean;
};
