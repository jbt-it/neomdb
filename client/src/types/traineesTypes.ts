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
