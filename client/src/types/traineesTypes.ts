/**
 * Contains all members types for the frontend
 */

import { MembersFieldDto } from "./membersTypes";

/**
 * Type of a trainee
 */
export type Trainee = {
  memberId: number;
  firstname: string;
  lastname: string;
  generationId: number;
  generationBezeichnung: string;
  internalProjectId: number;
  AngebotBeiEV: boolean;
  APgehalten: boolean;
  DLbeiEV: boolean;
  Projektmanagement: boolean;
  RhetorikPräsenationstechnik: boolean;
  AkquiseVerhandlungstechnik: boolean;
  FinanzenRecht: boolean;
  Netzwerke: boolean;
  Qualitätsmanagement: boolean;
  MSPowerpoint: boolean;
  StrategieOrganisation: boolean;
  Datenschutzschulung: boolean;
  Sicherheitsschulung: boolean;
  ExcelGrundlagen: boolean;
};

/**
 * Type of the trainee data received from the backend
 */
export type TraineeShort = {
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
 * Type of the internal project of a member
 */
export type InternalProject = {
  internalProjectId: number;
  generation: number;
  generationName: string;
  projectName: string;
  abbreviation: string;
  kickoff: string | null;
  offerAtEv: boolean;
  zpAtEv: boolean;
  zpHeld: string | null;
  apAtEv: boolean;
  apHeld: string | null;
  dlAtEv: boolean;
  members: MembersFieldDto[] | null;
  qualityManagers: MembersFieldDto[] | null;
};

export type InternalProjectAll = {
  internesProjektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
  kickoff: Date | null;
  AngebotBeiEV: number;
  ZPBeiEV: number;
  ZPGehalten: Date | null;
  APBeiEV: number;
  APGehalten: Date | null;
  DLBeiEV: number;
};

export type Generation = {
  generationId: number;
  description: string;
  applicationStart: Date | null;
  applicationEnd: Date | null;
  wwDate: string | null;
  selectionWeDate: string | null;
  infoEveningVisitors: number | null;
  doorCode: string | null;
  electionEnd: Date | null;
};

export type Pflichtworkshops = {
  mitgliedID: number;
  schulungID: number;
  schulungsname: string;
  feedbackAbgegeben: boolean;
};

/**
 * Type of the internal project of a member
 */
export type InternalProjectDto = {
  internalProjectId: number;
  generation: number;
  generationName: string;
  projectName: string;
  abbreviation: string;
  kickoff: Date | null;
  offerAtEv: boolean;
  zpAtEv: boolean;
  zpHeld: Date | null;
  apAtEv: boolean;
  apHeld: Date | null;
  dlAtEv: boolean;
  members: MembersFieldDto[] | null;
  qualityManagers: MembersFieldDto[] | null;
};

/**
 * Type of trainee choice
 */
export type TraineePreference = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  mentorChoice: number | null;
  mentorChoice1: number | null;
  mentorChoice1Name: string | null;
  mentorChoice2: number | null;
  mentorChoice2Name: string | null;
  mentorChoice3: number | null;
  mentorChoice3Name: string | null;
  departmentChoice: number | null;
  departmentChoice1: number | null;
  departmentChoice1ShortName: string | null;
  departmentChoice2: number | null;
  departmentChoice2ShortName: string | null;
  departmentChoice3: number | null;
  departmentChoice3ShortName: string | null;
  internalProjectChoice: number | null;
  internalProjectChoice1: number | null;
  internalProjectChoice1ShortName: string | null;
  internalProjectChoice2: number | null;
  internalProjectChoice2ShortName: string | null;
  internalProjectChoice3: number | null;
  internalProjectChoice3ShortName: string | null;
  internalProjectChoice1Motivation: string | null;
  internalProjectChoice2Motivation: string | null;
  internalProjectChoice3Motivation: string | null;
};
