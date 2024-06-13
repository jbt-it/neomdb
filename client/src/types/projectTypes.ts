import { Dayjs } from "dayjs";
import { MembersFieldDto } from "./membersTypes";

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
export type CompanyDto = {
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
  client: CompanyDto;
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

export type ProjectKeyData = {
  projectName: string | undefined;
  location: string | undefined;
  tenderingDate: Dayjs | undefined;
  start: Dayjs | undefined;
  duration: string | undefined;
  conditions: number | undefined;
  conditionsRange: number | undefined;
  btMin: number | undefined;
  btMax: number | undefined;
  amountProjectMembersMin: number | undefined;
  amountProjectMembersMax: number | undefined;
  applicationDeadline: Dayjs | undefined;
};

export type CustomerData = {
  customerName: string | undefined;
  shortDescription: string | undefined;
  newCustomer: boolean | undefined;
  acquisitor: string | undefined;
  acquisitionMethod: string | undefined;
  contactChannels: string[];
};

export type ProjectDescriptionData = {
  situation: string | undefined;
  peculiarities: string | undefined;
  coreCompetencies: CoreCompetencyDto[];
  requirementProfile: string | undefined;
  referenceProjects: string | undefined;
  notes: string | undefined;
};
