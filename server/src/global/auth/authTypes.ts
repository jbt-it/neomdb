/**
 * Definition of used types within the auth module
 */

/**
 * Type of query results of the user data retrieval
 */
export type UserDataQueryResult = {
  mitgliedID: number;
  name: string;
  passwordHash?: string;
  permissions: string;
};

/**
 * Type of query results of the permission retrieval
 */
export type DirectorPermissionsQueryResult = {
  permissions: string;
};

/**
 * Type of query result to get member email and check email existence
 */
export type GetEmailToVerifyValidityQueryResult = {
  email: string;
};

/**
 * Type of query results to get email, date, and token to check if the combination is valid for passwort reset
 */
export type GetEmailDateTokenToVerifyValidityQueryResult = {
  email: string;
  datediff: number;
  token: string;
};
