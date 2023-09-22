/*
 * Definition of used types within the global module
 */

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
