import { MemberStatusDto, MembersFieldDto } from "./memberTypes";

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
  memberId: number;
  firstname: string;
  lastname: string;
  mentorChoice: number | null;
  mentorChoiceName: string | null;
  mentorChoice1: number | null;
  mentorChoice1Name: string | null;
  mentorChoice2: number | null;
  mentorChoice2Name: string | null;
  mentorChoice3: number | null;
  mentorChoice3Name: string | null;
  departmentChoice: number | null;
  departmentChoiceShortName: string | null;
  departmentChoice1: number | null;
  departmentChoice1ShortName: string | null;
  departmentChoice2: number | null;
  departmentChoice2ShortName: string | null;
  departmentChoice3: number | null;
  departmentChoice3ShortName: string | null;
  internalProjectChoice: number | null;
  internalProjectChoiceShortName: string | null;
  internalProjectChoice1: number | null;
  internalProjectChoice1ShortName: string | null;
  internalProjectChoice1Motivation: string | null;
  internalProjectChoice2: number | null;
  internalProjectChoice2ShortName: string | null;
  internalProjectChoice2Motivation: string | null;
  internalProjectChoice3: number | null;
  internalProjectChoice3ShortName: string | null;
  internalProjectChoice3Motivation: string | null;
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
export type UpdateVotingDeadlinesRequestDto = {
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
export type MandatoryWorkshopFeedback = {
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
