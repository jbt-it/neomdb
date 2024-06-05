import { MembersFieldDto } from "../types/membersTypes";
import dayjs from "dayjs";

// CURRENTLY JUST A PLACEHOLDER UNTIL REACT QUERY IS IMPLEMENTED
const useProjects = () => {
  const projectMembers2 = [
    {
      memberId: 8167,
      firstname: "Wolfgang",
      lastname: "Luft",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
  ];

  const projectMembers = [
    {
      memberId: 8167,
      firstname: "Wolfgang",
      lastname: "Luft",
      mitgliedstatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      mitgliedstatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
    },
  ];

  const projects = [
    {
      projectID: 1,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      projectStatus: "active",
      projectMembers: projectMembers as MembersFieldDto[],
    },
    {
      projectID: 2,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "active",
      projectMembers: projectMembers as MembersFieldDto[],
    },
    {
      projectID: 3,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "invoiced",
      projectMembers: projectMembers as MembersFieldDto[],
    },
    {
      projectID: 4,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "offer",
      projectMembers: projectMembers2 as MembersFieldDto[],
    },
    {
      projectID: 5,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "completed",
      projectMembers: projectMembers as MembersFieldDto[],
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
      projectMembers: projectMembers as MembersFieldDto[],
      projectSector: "IT",
      projectCompany: "Firma1",
      projectCoreCompetence: "Finance & Controlling",
      projectStartDate: dayjs("2022-01-01"),
      projectEndDate: dayjs("2022-03-20"),
      projectNumberOfBT: 5,
    },
    {
      projectID: 2,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      projectStatus: "active",
      projectMembers: projectMembers as MembersFieldDto[],
      projectSector: "IT",
      projectCompany: "Firma2",
      projectCoreCompetence: "Finance & Controlling",
      projectStartDate: dayjs("2023-03-20"),
      projectEndDate: dayjs("2024-04-20"),
      projectNumberOfBT: 20,
    },
    {
      projectID: 3,
      projectName: "Markteintrittsstrategie für ein Autohaus",
      projectStatus: "active",
      projectMembers: projectMembers as MembersFieldDto[],
      projectSector: "IT",
      projectCompany: "Firma2",
      projectCoreCompetence: "Marketing & Sales",
      projectStartDate: dayjs("2024-02-20"),
      projectEndDate: null,
      projectNumberOfBT: 10,
    },
  ];

  return { projects, tenderedProjects, allProjects };
};

export default useProjects;
