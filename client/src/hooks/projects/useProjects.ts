import { MembersFieldDto } from "../../types/membersTypes";
import dayjs from "dayjs";
import {
  CoreCompetencyDto,
  IndustryDto,
  ProjectApplicantDto,
  ProjectBillingCheckmarksDto,
  ProjectDetailsDto,
  ProjectOverviewDto,
  ProjectShortDto,
  ProjectTenderDto,
  TenderedProjectDto,
} from "../../types/projectTypes";
import useCompanies from "../useCompanies";

// CURRENTLY JUST A PLACEHOLDER UNTIL REACT QUERY IS IMPLEMENTED
const useProjects = () => {
  const { allCompaniesShort, allContactPartners, allCompanies } = useCompanies();

  const allCoreCompetencies = [
    {
      coreCompetencyId: 1,
      designation: "Process & Organization",
    },
    {
      coreCompetencyId: 2,
      designation: "Human Resources",
    },
    {
      coreCompetencyId: 3,
      designation: "Marketing & Sales",
    },
    {
      coreCompetencyId: 4,
      designation: "Finance & Controlling",
    },
    {
      coreCompetencyId: 5,
      designation: "Sonstiges",
    },
    {
      coreCompetencyId: 6,
      designation: "Research & Implications",
    },
    {
      coreCompetencyId: 7,
      designation: "Sustainability",
    },
  ] as CoreCompetencyDto[];

  const allIndustries = [
    {
      industryId: 9,
      description: "Automobilindustrie, Zulieferer",
    },
    {
      industryId: 10,
      description: "Banken, Finanzen, Versicherungen",
    },
    {
      industryId: 11,
      description: "Baugewerbe, Handwerk, Fertigung",
    },
    {
      industryId: 12,
      description: "Bergbau, Metallgewerbe",
    },
    {
      industryId: 15,
      description: "Elektronik, Elektrotechnik, Technik",
    },
    {
      industryId: 28,
      description: "Luft- und Raumfahrtindustrie",
    },
    {
      industryId: 44,
      description: "Eventmanagement",
    },
  ] as IndustryDto[];

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
  ] as MembersFieldDto[];

  const projectMembers = [
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
  ] as MembersFieldDto[];

  const projects = [
    {
      projectId: 1,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      status: "Durchführung",
      projectMembers: projectMembers as MembersFieldDto[],
    },
    {
      projectId: 2,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      status: "Durchführung",
      projectMembers: projectMembers as MembersFieldDto[],
    },
    {
      projectId: 3,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      status: "Abrechnung",
      projectMembers: projectMembers as MembersFieldDto[],
    },
    {
      projectId: 4,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      status: "Angebot",
      projectMembers: projectMembers2 as MembersFieldDto[],
    },
    {
      projectId: 5,
      projectName: "Markteintrittsstrategie für ein mobiles Solardach",
      status: "Abgeschlossen",
      projectMembers: projectMembers as MembersFieldDto[],
    },
  ] as ProjectShortDto[];

  const tenderedProjects = [
    {
      projectId: 10,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      status: "application",
      situation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc,
      nec ultricies nunc nisl nec nunc.`,
      applicationEnd1: dayjs("2024-04-20"),
      applicationEnd2: null,
    },
  ] as TenderedProjectDto[];

  const allProjects = [
    {
      // Projekt abgeschlossen
      projectId: 1,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      status: "Abgeschlossen",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[0],
      coreCompetencies: [allCoreCompetencies[0], allCoreCompetencies[2]] as CoreCompetencyDto[],
      tenderDate: dayjs("2020-06-14"),
      kickoff: dayjs("2020-06-20"),
      projectEnd: dayjs("2020-09-20"),
      soldBT: 14.35,
      estimatedProjectBTmin: 10,
      estimatedProjectBTmax: 20,
    },
    {
      // Projekt in Abrechnungsphase
      projectId: 2,
      projectName: "Implementierung und Optimierung von CRM-Systemen im Vertriebsbereich",
      status: "Abrechnung",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[1],
      coreCompetencies: [
        {
          coreCompetencyId: 3,
          designation: "Marketing & Sales",
        },
        {
          coreCompetencyId: 5,
          designation: "Finance & Controlling",
        },
      ] as CoreCompetencyDto[],
      tenderDate: dayjs("2020-12-01"),
      kickoff: dayjs("2020-12-18"),
      projectEnd: dayjs("2021-03-15"),
      soldBT: 5,
      estimatedProjectBTmin: 5,
      estimatedProjectBTmax: 5,
    },
    {
      // Projekt abgeleht
      projectId: 3,
      projectName: "Überprüfung und Neugestaltung der Lieferkettenprozesse in der Lebensmittelindustrie",
      status: "Abgelehnt",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[1],
      coreCompetencies: [
        {
          coreCompetencyId: 3,
          designation: "Marketing & Sales",
        },
        {
          coreCompetencyId: 5,
          designation: "Finance & Controlling",
        },
      ] as CoreCompetencyDto[],
      tenderDate: dayjs("2021-02-12"),
      kickoff: dayjs("2021-02-21"),
      projectEnd: null,
      soldBT: null,
      estimatedProjectBTmin: 50,
      estimatedProjectBTmax: 100,
    },
    {
      //  Projekt Pitch verloren
      projectId: 4,
      projectName: "Erstellung und Analyse einer Risikomanagementstrategie für Finanzdienstleister",
      status: "Pitch verloren",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[2],
      coreCompetencies: [allCoreCompetencies[4], allCoreCompetencies[5]],
      tenderDate: dayjs("2021-03-11"),
      kickoff: dayjs("2021-03-16"),
      projectEnd: null,
      soldBT: null,
      estimatedProjectBTmin: 15,
      estimatedProjectBTmax: 30,
    },
    {
      // Projekt nicht besetzt
      projectId: 5,
      projectName: "Konzeption und Umsetzung einer digitalen Marketingkampagne für die ABC AG",
      status: "Nicht besetzt",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[3],
      coreCompetencies: allCoreCompetencies[2],
      tenderDate: dayjs("2021-06-14"),
      kickoff: null,
      projectEnd: null,
      soldBT: null,
      estimatedProjectBTmin: 1,
      estimatedProjectBTmax: 1,
    },
    {
      // Projekt in Angebotsphase
      projectId: 6,
      projectName: "Durchführung und Auswertung einer Mitarbeiterzufriedenheitsstudie",
      status: "Angebot",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[4],
      coreCompetencies: [
        {
          coreCompetencyId: 5,
          designation: "Finance & Controlling",
        },
      ] as CoreCompetencyDto[],
      tenderDate: dayjs("2022-07-14"),
      kickoff: dayjs("2022-07-25"),
      projectEnd: null,
      soldBT: null,
      estimatedProjectBTmin: 10,
      estimatedProjectBTmax: 15,
    },
    {
      // Projekt in Durchführung, gestartet, aber noch nicht beendet
      projectId: 7,
      projectName: "Planung und Koordination der Büroerweiterung für Start-up Unternehmen",
      status: "Durchführung",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[5],
      coreCompetencies: allCoreCompetencies[5],
      tenderDate: dayjs("2023-010-10"),
      kickoff: dayjs("2023-10-20"),
      projectEnd: null,
      soldBT: null,
      estimatedProjectBTmin: 12,
      estimatedProjectBTmax: 40,
    },
    {
      // Projekt in Bewerbungsphase
      projectId: 8,
      projectName: "Entwurf und Realisierung einer Schulungsreihe für neue Softwaretools",
      status: "Bewerbung",
      projectMembers: projectMembers as MembersFieldDto[],
      client: allCompaniesShort[6],
      coreCompetencies: allCoreCompetencies[6],
      tenderDate: dayjs("2024-02-10"),
      kickoff: null,
      projectEnd: null,
      soldBT: null,
      estimatedProjectBTmin: 10,
      estimatedProjectBTmax: 20,
    },
  ] as ProjectOverviewDto[];

  const projectsInBilling = [
    {
      projectId: 2,
      projectName: "Entwurf und Realisierung einer Schulungsreihe für neue Softwaretools",
      status: "Abrechnung",
      APatEV: true,
      APHold: true,
      evaluationAtEV: true,
      DLatEV: true,
      offerInAlfresco: true,
      consultingContractProvided: true,
      teamContractProvided: true,
      qmApproval: true,
      freelancerContractExistingForAllMembers: false,
      moneyTransferredForAllMembers: false,
    },
    {
      projectId: 5,
      projectName: "Durchführung und Auswertung einer Mitarbeiterzufriedenheitsstudie",
      status: "Abrechnung",
      APatEV: false,
      APHold: false,
      evaluationAtEV: false,
      DLatEV: false,
      offerInAlfresco: true,
      consultingContractProvided: true,
      teamContractProvided: true,
      qmApproval: true,
      freelancerContractExistingForAllMembers: false,
      moneyTransferredForAllMembers: false,
    },
    {
      projectId: 9,
      projectName: "Erstellung und Analyse einer Risikomanagementstrategie für Finanzdienstleister",
      status: "Durchführung",
      APatEV: false,
      APHold: false,
      evaluationAtEV: false,
      DLatEV: false,
      offerInAlfresco: true,
      consultingContractProvided: false,
      teamContractProvided: false,
      qmApproval: false,
      freelancerContractExistingForAllMembers: false,
      moneyTransferredForAllMembers: false,
    },
  ] as ProjectBillingCheckmarksDto[];

  const tenderProject = (newProject: ProjectTenderDto) => {
    console.log("Tendering project", newProject);
  };

  const saveProject = (newProject: ProjectTenderDto) => {
    console.log("Saving project", newProject);
  };

  return {
    projects,
    tenderedProjects,
    allProjects,
    allIndustries,
    allCoreCompetencies,
    projectsInBilling,
    tenderProject,
    saveProject,
  };
};

export default useProjects;
