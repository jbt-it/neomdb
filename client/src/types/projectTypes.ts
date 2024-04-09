import { Dayjs } from "dayjs";
import { MembersField } from "./membersTypes";

export type Project = {
  projectID: number;
  projectName: string;
  projectStatus: string;
  projectMembers: MembersField[];
};

export type ProjectOverview = Project & {
  projectSector: string;
  projectCompany: string;
  projectCoreCompetence: string;
  projectStartDate: Dayjs;
  projectEndDate: Dayjs;
  projectNumberOfBT: number;
};

export type TenderedProject = {
  projectID: number;
  projectName: string;
  projectStatus: string;
  projectText: string;
  applicationDeadline: Dayjs;
};
