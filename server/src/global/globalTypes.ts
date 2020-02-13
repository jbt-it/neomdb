/**
 * Definition of used types within the global module
 */
export type JWTPayload = {
  mitgliedID: number;
  name: string;
  permissions: number[];
};

export type SignedJWTPayload = {
  mitgliedID: number;
  name: string;
  permissions: number[];
  iat: number;
  exp: number;
};