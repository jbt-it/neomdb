/**
 * Definition of used types within the global module
 */
export type JWTPayload = {
  mitgliedID: string;
  name: string;
  permissions: number[];
};