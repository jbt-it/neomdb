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

/**
 * Type for the request to change the password of a user
 */
export type UserChangePasswordRequest = {
  userID: number;
  userName: string;
  oldPassword: string;
  newPassword: string;
};

/**
 * Type of the permission
 */
export type Permission = {
  permissionID: number;
  canDelegate: boolean;
  directorID?: number;
};

/**
 * Type of the payload if the jason web token
 */
export type JWTPayload = {
  mitgliedID: number;
  name: string;
  permissions: Permission[];
  roles: number[];
};

/**
 * Type of the payload of the signed jason web token
 */
export type SignedJWTPayload = {
  mitgliedID: number;
  name: string;
  permissions: Permission[];
  iat: number;
  exp: number;
};
