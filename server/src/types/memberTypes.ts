import { InternalProject } from "../entities/InternalProject";
import { MemberStatus } from "../entities/MemberStatus";

/**
 * The member status names
 */
export type MemberStatusName =
  | "Trainee"
  | "aktives Mitglied"
  | "Senior"
  | "Alumnus"
  | "passives Mitglied"
  | "Ausgetretene";

/**
 * Type of the mentee (partial member)
 */
export type MenteeDto = {
  memberId: number;
  firstname: string;
  lastname: string;
};

/**
 * Type of the member image
 */
export type MemberImage = {
  base64: string;
  mimeType: string;
};

/**
 * Type of the mentor (partial member)
 */
export type MentorDto = {
  memberId: number;
  firstname: string;
  lastname: string;
};

/**
 * Type of the member status dto
 */
export type MemberStatusDto = {
  memberStatusId: number;
  name: string;
};

/**
 * Type of the member field
 */
export type MembersFieldDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  memberStatus?: MemberStatusDto;
};

/**
 * Type of the request to update a department
 */
export type UpdateDepartmentDto = {
  linkObjectivePresentation: string | null;
  linkOrganigram: string | null;
};

/**
 * Value type for languages
 */
export type LanguageValue = {
  language: string;
};

/**
 * Value type for it skills
 */
export type ItSkillsValue = {
  itSkill: string;
};

/**
 * Type of the department
 */
export type DepartmentDetailsDto = {
  departmentId: number;
  name: string;
  shortName: string;
  jbtEmail: string;
  linkObjectivePresentation: string;
  linkOrganigram: string;
};

/**
 * Type of the partial department dto used for the member list
 */
export type DepartmentPartialDto = {
  departmentId: number;
  name: string;
  shortName: string;
};

/**
 * Type of the partial member dto used for the member list
 */
export type MemberPartialDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  generationId: number;
  internalProjectId: number;
  mobile: string;
  jbtEmail: string;
  memberStatus: MemberStatus;
  department: DepartmentPartialDto;
  lastChange: Date;
};

/**
 * Type of the member permission asignment dto used for the permission page
 */
export type MemberPermissionAssignmentDto = {
  memberId: number;
  firstname: string;
  lastname: string;
};

/**
 * Type of a member of a department (partial member with department information)
 */
export type DepartmentMemberDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  department: DepartmentPartialDto;
};

/**
 * Type of the director position dto
 */
export type DirectorPositionDto = {
  directorId: number;
  canDelegate: boolean;
  shortName: string;
};

/**
 * Type of the director (partial member with department and role information)
 */
export type DirectorDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  directorId: number;
  department: DepartmentPartialDto;
  from: Date;
  until: Date;
  gender: boolean;
  designationFemale: string;
  designationMale: string;
};

/**
 * Type of the language dto
 */
export type LanguageDto = {
  memberId: number;
  value: string;
  level: number;
};

/**
 * Type of the it skill dto
 */
export type ItSkillDto = {
  memberId: number;
  value: string;
  level: number;
};

/**
 * Type of the member details dto used for the member details page
 */
export type MemberDetailsDto = {
  memberId: number;
  lastname: string;
  firstname: string;
  gender: boolean;
  birthday: Date | null;
  mobile: string;
  jbtEmail: string;
  memberStatus: MemberStatusDto;
  generation: number | null;
  internalProject: InternalProject | null;
  traineeSince: Date | null;
  memberSince: Date | null;
  alumnusSince: Date | null;
  seniorSince: Date | null;
  activeSince: Date | null;
  passiveSince: Date | null;
  exitedSince: Date | null;
  department: DepartmentPartialDto | null;
  employer: string | null;
  street1: string;
  postalCode1: string | null;
  city1: string;
  phone1: string | null;
  email1: string | null;
  street2: string | null;
  postalCode2: string | null;
  city2: string | null;
  phone2: string | null;
  email2: string | null;
  university: string;
  courseOfStudy: string;
  studyStart: Date | null;
  studyEnd: Date | null;
  specializations: string | null;
  apprenticeship: string | null;
  commitment: string | null;
  canPL: Date | null;
  canQM: Date | null;
  lastChange?: Date | null;
  drivingLicense: number;
  firstAidTraining: boolean;
  // Optional attributes only viewable with specific permissions (of if the user is the member)
  accountHolder?: string;
  iban?: string;
  bic?: string;
  // Additional attributes
  languages?: LanguageDto[];
  itSkills?: ItSkillDto[];
  mentees?: MenteeDto[];
  mentor?: MentorDto | null;
};

/**
 * Type of the request to create a member
 */
export type CreateMemberRequestDto = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  birthday: Date | null;
  mobile: string | null;
  gender: number | null;
  generationId: number | null;
};

/**
 * Type for creating a new member
 */
export type NewMember = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  email2: string;
  birthday: Date | null;
  mobile: string | null;
  gender: number | null;
  generationId: number | null;
  jbtEmail: string;
  memberStatusId: number;
  departmentId: number;
  icalToken: string;
  passwordHash: string;
  traineeSince: Date | null;
};

/**
 * Type of the overview of the status of the different account creation operations
 */
export type StatusOverview = {
  querySuccesful: boolean;
  queryErrorMsg: string;
  mailSuccesful: boolean;
  mailErrorMsg: string;
  mailListSuccesful: boolean;
  mailListErrorMsg: string;
  nextcloudSuccesful: boolean;
  nextcloudErrorMsg: string;
  wikiSuccesful: boolean;
  wikiErrorMsg: string;
};

/**
 * Type of the response after creating a member
 */
export type CreateMemberResponseDto = {
  memberId: number;
  statusOverview: StatusOverview;
};

/**
 * Type of the request to assign a permission to a member
 */
export type AssignPermissionToMemberRequestDto = {
  memberId: number;
  permissionID: number;
};
