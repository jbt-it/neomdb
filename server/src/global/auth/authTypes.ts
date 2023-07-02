/**
 * Definition of used types within the auth module
 */

/**
 * Type of query results of the user data retrieval
 */
export type UserAuthenticationDto = {
  mitgliedID: number;
  name: string;
  passwordHash?: string;
  permissions: string;
};

export type UserLoginDto = {
  username: string;
  password: string;
};

/**
 * Type of query results of the permission retrieval
 */
export type DirectorPermissionsQueryResult = {
  permissions: string;
};
