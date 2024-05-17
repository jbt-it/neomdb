import { MembersField } from "./membersTypes";

/**
 * Type of the internal project of a member
 */
export type InternalProject = {
  internesProjektID: number;
  generation: number;
  generationsBezeichnung: string;
  projektname: string;
  kuerzel: string;
  kickoff: string | null;
  AngebotBeiEV: boolean;
  ZPBeiEV: boolean;
  ZPGehalten: string | null;
  APBeiEV: boolean;
  APGehalten: string | null;
  DLBeiEV: boolean;
  projektmitglieder: MembersField[] | null;
  qualitaetsmanager: MembersField[] | null;
};

/**
 * Type of the generation
 */
export type Generation = {
  generationID: number;
  bezeichnung: string;
  bewerbung_start: Date;
  bewerbung_ende: Date;
  wwTermin: string;
  auswahlWETermin: string;
  infoabendBesucher: number;
  tuercode: number;
  wahl_start: Date;
  wahl_ende: Date;
};

/**
 * Type of trainee choice
 */
export type TraineePreference = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  wahl_mentor: number | null;
  wahl_mentor1: number | null;
  wahl_mentor1_name: string | null;
  wahl_mentor2: number | null;
  wahl_mentor2_name: string | null;
  wahl_mentor3: number | null;
  wahl_mentor3_name: string | null;
  wahl_ressort: number | null;
  wahl_ressort1: number | null;
  wahl_ressort1_kuerzel: string | null;
  wahl_ressort2: number | null;
  wahl_ressort2_kuerzel: string | null;
  wahl_ressort3: number | null;
  wahl_ressort3_kuerzel: string | null;
  wahl_internesprojekt: number | null;
  wahl_internesprojekt1: number | null;
  wahl_internesprojekt1_kuerzel: string | null;
  wahl_internesprojekt2: number | null;
  wahl_internesprojekt2_kuerzel: string | null;
  wahl_internesprojekt3: number | null;
  wahl_internesprojekt3_kuerzel: string | null;
  wahl_internesprojekt1_motivation: string | null;
  wahl_internesprojekt2_motivation: string | null;
  wahl_internesprojekt3_motivation: string | null;
};

/**
 * Type of the jbt mail of a member
 */
export type JBTMail = {
  email: string;
};

/**
 * Type of the trainee motivation written by a trainee to explain the choice of an internal project
 */
export type TraineeMotivation = {
  mitgliedID: number;
  wahl_internesprojekt1_motivation: string;
  wahl_internesprojekt2_motivation: string;
  wahl_internesprojekt3_motivation: string;
};

/**
 * Type of a trainee (partial member)
 */
export type Trainee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
};

/**
 * Type of the assignment of a trainee to an internal project, mentor and department
 */
export type TraineeAssignment = {
  ipID: number | null;
  mentorID: number | null;
  departmentID: number | null;
};

/**
 * Type of the milestones during internal project for trainee
 */
export type InternalProjectAndTrainee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
  internesprojekt: number;
  projektname: string;
  kuerzel: string;
  AngebotBeiEV: boolean;
  ZPbeiEV: boolean;
  ZPgehalten: string;
  APbeiEV: boolean;
  APgehalten: string;
  DLbeiEV: boolean;
};

/**
 * Type of the given feedback on obligatory workshop for trainees
 */
export type Workshop = {
  mitgliedID: number;
  schulungsinstanzID: number;
  schulungsname: string;
  feedbackAbgegeben: number;
};

/**
 * Type of the request to update the voting deadlines of a generation
 */
export type UpdateVotingDeadlinesRequest = {
  votingStart: string; // TODO: Date
  votingEnd: string; // TODO: Date
};

/**
 * Type of the progress of a trainee (consists of internal project, trainee and workshop)
 */
export type TraineeProgress = InternalProjectAndTrainee & Workshop;
