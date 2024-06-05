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
  projectNumberOfBT: number | null;
};

export type TenderedProject = {
  projectID: number;
  projectName: string;
  projectStatus: string;
  projectText: string;
  applicationDeadline: Dayjs;
};
