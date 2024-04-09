import { MembersField } from "../types/membersTypes";
import dayjs from "dayjs";

const useProjects = () => {
  const projectMembers2 = [
    {
      mitgliedID: 8167,
      name: "Wolfgang Luft",
      vorname: "Wolfgang",
      nachname: "Luft",
      mitgliedstatus: "Aktiv",
    },
    {
      mitgliedID: 8222,
      name: "Talha Driscoll",
      vorname: "Talha",
      nachname: "Driscoll",
      mitgliedstatus: "Aktiv",
    },
    {
      mitgliedID: 8222,
      name: "Talha Driscoll",
      vorname: "Talha",
      nachname: "Driscoll",
      mitgliedstatus: "Aktiv",
    },
    {
      mitgliedID: 8222,
      name: "Talha Driscoll",
      vorname: "Talha",
      nachname: "Driscoll",
      mitgliedstatus: "Aktiv",
    },
    {
      mitgliedID: 8222,
      name: "Talha Driscoll",
      vorname: "Talha",
      nachname: "Driscoll",
      mitgliedstatus: "Aktiv",
    },
  ];

  const projectMembers = [
    {
      mitgliedID: 8167,
      name: "Wolfgang Luft",
      vorname: "Wolfgang",
      nachname: "Luft",
      mitgliedstatus: "Aktiv",
    },
    {
      mitgliedID: 8222,
      name: "Talha Driscoll",
      vorname: "Talha",
      nachname: "Driscoll",
      mitgliedstatus: "Aktiv",
    },
  ];

  const projects = [
    {
      projectID: 1,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      projectStatus: "active",
      projectMembers: projectMembers as MembersField[],
    },
    {
      projectID: 2,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "active",
      projectMembers: projectMembers as MembersField[],
    },
    {
      projectID: 3,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "invoiced",
      projectMembers: projectMembers as MembersField[],
    },
    {
      projectID: 4,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "offer",
      projectMembers: projectMembers2 as MembersField[],
    },
    {
      projectID: 5,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "completed",
      projectMembers: projectMembers as MembersField[],
    },
  ];

  const tenderedProjects = [
    {
      projectID: 10,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      projectStatus: "application",
      projectText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc,
      nec ultricies nunc nisl nec nunc.`,
      applicationDeadline: dayjs("2024-04-20"),
    },
  ];

  const allProjects = [
    {
      projectID: 1,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      projectStatus: "active",
      projectMembers: projectMembers as MembersField[],
      projectSector: "IT",
      projectCompany: "Firma1",
      projectCoreCompetence: "Analyse",
      projectStartDate: dayjs("2024-04-20"),
      projectEndDate: dayjs("2024-04-20"),
      projectNumberOfBT: 5,
    },
    {
      projectID: 2,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "active",
      projectMembers: projectMembers as MembersField[],
      projectSector: "IT",
      projectCompany: "Firma2",
      projectCoreCompetence: "Analyse",
      projectStartDate: dayjs("2024-04-20"),
      projectEndDate: dayjs("2024-04-20"),
      projectNumberOfBT: 10,
    },
    {
      projectID: 3,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "active",
      projectMembers: projectMembers as MembersField[],
      projectSector: "IT",
      projectCompany: "Firma2",
      projectCoreCompetence: "Analyse",
      projectStartDate: dayjs("2024-04-20"),
      projectEndDate: dayjs("2024-04-20"),
      projectNumberOfBT: 10,
    },
  ];

  return { projects, tenderedProjects, allProjects };
};

export default useProjects;
