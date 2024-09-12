import { Dayjs } from "dayjs";
import { MembersFieldDto, MemberStatus } from "./membersTypes";

// Type of the core competency DTO
export type CoreCompetencyDto = {
  coreCompetencyId: number;
  designation: string;
};

// Type of the industry DTO
export type IndustryDto = {
  industryId: number;
  description: string;
};

// type of the company DTO
export type CompanyShortDto = {
  companyId: number;
  name: string;
  industry: IndustryDto;
};

// Type of the project DTO for the users projects
export type ProjectShortDto = {
  projectId: number;
  projectName: string;
  status: string;
  projectMembers: MembersFieldDto[];
};

// Type of the project DTO for the project overview table
export type ProjectOverviewDto = ProjectShortDto & {
  client: CompanyShortDto;
  coreCompetencies: CoreCompetencyDto | CoreCompetencyDto[];
  kickoff: Dayjs | null; // will be shown if the project is in progress
  tenderDate: Dayjs; // will be shown if the project is tendered
  projectEnd: Dayjs | null; // will be shown if the project is done
  soldBT: number | null; //  will be shown if the project is done
  estimatedProjectBTmin: number; // will be shown if the project is in progress
  estimatedProjectBTmax: number; // will be shown if the project is in progress
};

// Type of the tendered project DTO
export type TenderedProjectDto = {
  projectId: number;
  projectName: string;
  status: string;
  situation: string;
  applicationEnd1: Dayjs | null;
  applicationEnd2: Dayjs | null;
};

// Type of the new company that is send to the backend
export type NewCompanyDto = {
  name: string;
  industry: IndustryDto;
  shortDescription: string;
  street: string;
  postalCode: string;
  city: string;
  addressAdditional: string;
  url: string;
  importantInformation: string;
  contactDesired: boolean;
  classified: boolean;
};

// Type of a companyDto that is received from the backend
export type CompanyDto = {
  companyId: number;
  name: string;
  industry: IndustryDto;
  shortDescription: string;
  street: string;
  postalCode: string;
  city: string;
  addressAdditional: string;
  url: string;
  importantInformation: string;
  contactDesired: boolean;
  classified: boolean;
};

// Type of the acquisition channel that is received from the backend
export type AcquisitionChannelDto = {
  acquisitionChannelId: number;
  description: string;
};

// Type of the contact person that is received from the backend
export type ContactPersonDto = {
  contactPersonId: number;
  companyId: number;
  name: string;
};

// Type of the project key data for the project tendering
export type ProjectKeyData = {
  projectName: string;
  jobSite: string;
  tenderDate: Dayjs | undefined;
  estimatedProjectStart: Dayjs | undefined;
  estimatedProjectDuration: string;
  estimatedProjectEuroPerBT: number | undefined;
  estimatedProjectEuroPerBTrange: number | null | undefined;
  estimatedProjectBTmin: number | undefined;
  estimatedProjectBTmax: number | undefined;
  estimatedProjectMemberMin: number | undefined;
  estimatedProjectMemberMax: number | undefined;
  applicationStart1?: Dayjs | null;
  applicationEnd1: Dayjs | undefined;
  applicationStart2?: Dayjs | null;
  applicationEnd2?: Dayjs | null;
  kickoff?: Dayjs | null;
};

// Type of the customer data for the project tendering
export type CustomerData = {
  companyId: number;
  name: string;
  shortDescription: string;
  newCustomer: boolean | undefined;
  industry: IndustryDto | undefined;
  street: string;
  postalCode: string;
  city: string;
  addressAdditional: string;
  url: string;
  importantInformation: string;
  contactDesired: boolean;
  classified: boolean;
  acquisitor: string | undefined;
  acquisitionMethod: string | undefined;
  contactPerson: ContactPersonDto | undefined;
  newContactPerson: boolean;
  newContactPersonName: string;
};

// Type of the project description data for the project tendering
export type ProjectDescriptionData = {
  situation: string;
  peculiarities: string;
  coreCompetencies: CoreCompetencyDto[];
  requirementProfile: string;
  referenceProjects: string;
  notes: string;
};

// Type of the project applicant Dto
export type ProjectMembersDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  memberStatus: MemberStatus;
  date: Date;
  applicationDate: Date;
  btAllocation: number | null;
  expensesAllocation: number | null;
  type: "Bewerbung" | "Mitglied" | "PL" | "QM" | null;
  freelancerContract: Date | null;
  moneyTransferred: Date | null;
};

// Type of the project tendering data
export type ProjectDetailsDto = {
  projectId: number;
  projectName: string;
  jobSite: string;
  status: string;
  tenderDate: Date | undefined;
  estimatedProjectStart: Date;
  estimatedProjectDuration: string;
  estimatedProjectEuroPerBT: number;
  estimatedProjectEuroPerBTrange: number | undefined | null;
  estimatedProjectBTmin: number;
  estimatedProjectBTmax: number;
  estimatedProjectMemberMin: number;
  estimatedProjectMemberMax: number;
  applicationStart1: Date | null;
  applicationEnd1: Date | undefined | null;
  applicationStart2: Date | null;
  applicationEnd2: Date | null;
  situation: string;
  peculiarities: string;
  coreCompetencies: CoreCompetencyDto[];
  requirementProfile: string;
  referenceProjects: string;
  notes: string;
  acquisitor: string;
  acquisitionMethod: string;
  newContactPerson: boolean;
  newContactPersonName?: string;
  contactPerson: ContactPersonDto | undefined;
  customerType: string;
  kickoff: Date | null;
  staffingCommittee: MembersFieldDto[];
  client: CompanyDto;
  members: ProjectMembersDto[];
  qms: MembersFieldDto[];
  signatureDate: Date | null;
  euroPerBT: number | null;
  soldBT: number | null;
  soldExpenses: number | null;
  projectEnd: Date | null;
  invoicing: Date | null;
};

// Type of the project tendering data
export type ProjectTenderDto = {
  projectName: string;
  jobSite: string;
  status: string;
  tenderDate: Date | undefined;
  estimatedProjectStart: Date;
  estimatedProjectDuration: string;
  estimatedProjectEuroPerBT: number;
  estimatedProjectEuroPerBTrange: number | undefined | null;
  estimatedProjectBTmin: number;
  estimatedProjectBTmax: number;
  estimatedProjectMemberMin: number;
  estimatedProjectMemberMax: number;
  applicationStart1: Date | null;
  applicationEnd1: Date | undefined | null;
  applicationStart2: Date | null;
  applicationEnd2: Date | null;
  situation: string;
  peculiarities: string;
  coreCompetencies: CoreCompetencyDto[];
  requirementProfile: string;
  referenceProjects: string;
  notes: string;
  acquisitor: string;
  acquisitionMethod: string;
  newContactPerson: boolean;
  contactPerson: ContactPersonDto | string;
  customerType: string;
  kickoff: Date | null;
  staffingCommittee: MembersFieldDto[];
  client: CompanyDto;
  members: MembersFieldDto[];
  qms: MembersFieldDto[];
};
