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
 * Type of query results of the permission retrieval
 */
export type DirectorPermissionsQueryResult = {
  permissions: string;
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
