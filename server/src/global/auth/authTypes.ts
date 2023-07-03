/*
 * Definition of used types within the auth module
 */

/**
 * Type for the user of the application
 * A user is a member abstracted to the details needed for authentication
 */
export type User = {
  mitgliedID: number;
  name: string;
  passwordHash?: string;
  permissions: string;
};

/**
 * Type for the request to login a user
 */
export type UserLoginRequest = {
  username: string;
  password: string;
};

/**
 * Type of query results of the permission retrieval
 */
export type DirectorPermissionsQueryResult = {
  permissions: string;
};
