/*
 * Definition of used types within the global module
 */

/**
 * Type of the permission
 */
export type Permission = {
  permissionID: number;
  canDelegate: boolean;
};

/**
 * Type of the payload if the jason web token
 */
export type JWTPayload = {
  mitgliedID: number;
  name: string;
  permissions: Permission[];
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
