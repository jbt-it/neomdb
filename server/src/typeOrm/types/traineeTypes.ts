import { MemberStatusDto, MembersFieldDto } from "./memberTypes";

/**
 * Type of the internal project of a member
 */
export type InternalProjectDto = {
  internalProjectID: number;
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
 * Type of the request to update the voting deadlines of a generation
 */
export type UpdateVotingDeadlinesRequest = {
  electionStart: Date;
  electionEnd: Date;
};

/**
 * Type of the assignment of a trainee to an internal project, mentor and department
 */
export type TraineeAssignmentDto = {
  ipID: number;
  mentorID: number;
  departmentID: number;
};

/**
 * Type of mandatory workshop feedback
 */
export type mandatoryWorkshopFeedback = {
  workshopId: number;
  feedbackGiven: boolean;
};

/**
 * Type of the trainee progress with the internal project milestones and mandatory workshops feedback
 */
export type TraineeProgressDto = {
  memberID: number;
  firstname: string;
  lastname: string;
  memberStatus: MemberStatusDto;
  generationID: number;
  internalProjectID: number | null;
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
