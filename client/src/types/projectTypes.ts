import { Dayjs } from "dayjs";
import { MembersFieldDto } from "./membersTypes";

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
