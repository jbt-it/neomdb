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

export type ProjectKeyData = {
  projectName: string | undefined;
  location: string | undefined;
  tenderDate: Dayjs | undefined;
  estimatedProjectStart: Dayjs | undefined;
  estimatedProjectDuration: string | undefined;
  estimatedProjectEuroPerBT: number | undefined;
  estimatedProjectEuroPerBTrange: number | undefined;
  estimatedProjectBTmin: number | undefined;
  estimatedProjectBTmax: number | undefined;
  estimatedProjectMemberMin: number | undefined;
  estimatedProjectMemberMax: number | undefined;
  applicationEnd1: Dayjs | undefined;
};

export type AcquisitionChannelDto = {
  acquisitionChannelId: number;
  description: string;
};

export type ContactPersonDto = {
  contactPersonId: number;
  companyId: number;
  name: string;
};

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
};

export type ProjectDescriptionData = {
  situation: string | undefined;
  peculiarities: string | undefined;
  coreCompetencies: CoreCompetencyDto[];
  requirementProfile: string | undefined;
  referenceProjects: string | undefined;
  notes: string | undefined;
};
