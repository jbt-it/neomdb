import { MembersFieldDto } from "./memberTypes";

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
