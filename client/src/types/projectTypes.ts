import { Dayjs } from "dayjs";
import { MembersFieldDto } from "./membersTypes";

export type CoreCompetency = {
  coreCompetencyId: number;
  designation: string;
};

export type Project = {
  projectID: number;
  projectName: string;
  projectStatus: string;
  projectMembers: MembersFieldDto[];
};

export type ProjectOverview = Project & {
  projectSector: string | null;
  projectCompany: string | null;
  projectCoreCompetence: string | null;
  projectStartDate: Dayjs;
  projectEndDate: Dayjs | null;
  projectNumberOfBT: number;
};

export type TenderedProject = {
  projectID: number;
  projectName: string;
  projectStatus: string;
  projectText: string;
  applicationDeadline: Dayjs;
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
  contactChannels: string[] | undefined;
};

export type ProjectDescriptionData = {
  situation: string | undefined;
  peculiarities: string | undefined;
  coreCompetencies: CoreCompetency[];
  requirementProfile: string | undefined;
  referenceProjects: string | undefined;
  notes: string | undefined;
};
