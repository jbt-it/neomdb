/**
 * Contains all members types for the frontend
 */

/**
 * Type of a trainee
 */
export type Trainee = {
  memberID: number;
  vorname: string;
  nachname: string;
  traineeGeneration: number;
};

export type InternalProject = {
  internalprojectID: number;
  name: string;
  Kickoff: string;
  Angebot: boolean;
  ZP: string;
  AP: string;
  Dokumentationsleitfaden: boolean;
};
