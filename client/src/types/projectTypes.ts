import { Dayjs } from "dayjs";
import { MembersFieldDto } from "./membersTypes";

export type Project = {
  projectID: number;
  projectName: string;
  projectStatus: string;
  projectMembers: MembersFieldDto[];
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
