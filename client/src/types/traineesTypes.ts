/**
 * Contains all members types for the frontend
 */

import { MemberStatus, MembersFieldDto } from "./membersTypes";

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
 * Type of generation
 */
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

/**
 * Type of the mandatory workshops of a member
 */
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
 * Type of the trainee choice of a member
 */
export type TraineeChoiceDto = {
  memberID: number;
  firstname: string;
  lastname: string;
  choice_mentor: number;
  choice_mentor1: number;
  choice_mentor2: number;
  choice_mentor3: number;
  choice_internalProject: number;
  choice_internalProject1: number;
  choice_internalProject2: number;
  choice_internalProject3: number;
  choice_department: number;
  choice_department1: number;
  choice_department2: number;
  choice_department3: number;
};

/**
 * Type of the motivation of a trainee
 */
export type TraineeMotivationDto = {
  memberID: number;
  internalProject1Motivation: string;
  internalProject2Motivation: string;
  internalProject3Motivation: string;
};

/**
 * Type of the trainee progress with the internal project milestones and mandatory workshops feedback
 */
export type TraineeProgressDto = {
  memberID: number;
  memberStatus: MemberStatus;
  firstname: string;
  lastname: string;
  generationID: number;
  internalProjectID: number;
  projectName: string;
  abbreviation: string;
  offerAtEv: boolean;
  zpAtEv: boolean;
  zpHeld: Date | null;
  apAtEv: boolean;
  apHeld: Date | null;
  dlAtEv: boolean;
  projectManagement: boolean;
  rhetoricPresentationTechnique: boolean;
  acquisitionNegotiationTechnique: boolean;
  departmentFinanceAndLaw: boolean;
  departmentNetwork: boolean;
  departmentQualityManagement: boolean;
  msPowerpoint: boolean;
  strategyAndOrganisation: boolean;
  dataPrivacyTraining: boolean;
  safetyTraining: boolean;
  excelBasics: boolean;
};

/**
 * Type of the request to update the voting deadlines of a generation
 */
export type UpdateVotingDeadlinesRequest = {
  generationId: number;
  electionStart: Date;
  electionEnd: Date;
};

/**
 * Type of the assignment of a trainee to an internal project, mentor and department
 */
export type TraineeAssignmentRequest = {
  traineeId: number;
  ipID: number;
  mentorID: number;
  departmentID: number;
};
