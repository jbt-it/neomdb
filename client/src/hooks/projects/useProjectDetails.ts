import dayjs from "dayjs";
import { MembersFieldDto } from "../../types/membersTypes";
import { ContactPersonDto, CoreCompetencyDto, ProjectMembersDto, ProjectDetailsDto } from "../../types/projectTypes";
import useCompanies from "../useCompanies";
import useProjects from "./useProjects";

const useProjectDetails = (projectID: number) => {
  const { allContactPartners, allCompanies } = useCompanies();
  const { allCoreCompetencies } = useProjects();

  const staffingCommittee = [
    {
      memberId: 8167,
      firstname: "Wolfgang",
      lastname: "Luft",
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
      date: dayjs("2024-02-10").toDate(),
      applicationDate: dayjs("2024-02-10").toDate(),
      btAllocation: null,
      expensesAllocation: null,
      type: "PL",
      freelancerContract: dayjs("2024-02-10").toDate(),
      moneyTransferred: dayjs("2024-02-10").toDate(),
    },
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
      date: dayjs("2024-02-10").toDate(),
      applicationDate: dayjs("2024-02-10").toDate(),
      btAllocation: null,
      expensesAllocation: null,
      type: "Mitglied",
      freelancerContract: dayjs("2024-02-10").toDate(),
      moneyTransferred: dayjs("2024-02-10").toDate(),
    },
  ] as ProjectMembersDto[];

  const qms = [
    {
      memberId: 8167,
      firstname: "Wolfgang",
      lastname: "Luft",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
      date: dayjs("2024-02-10").toDate(),
      applicationDate: dayjs("2024-02-10").toDate(),
      btAllocation: null,
      expensesAllocation: null,
      type: "PL",
      freelancerContract: dayjs("2024-02-10").toDate(),
      moneyTransferred: dayjs("2024-02-10").toDate(),
    },
  ] as ProjectMembersDto[];

  const projectApplicants = [
    {
      memberId: 8167,
      firstname: "Wolfgang",
      lastname: "Luft",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
      date: dayjs("2024-02-10").toDate(),
      applicationDate: dayjs("2024-02-10").toDate(),
      btAllocation: null,
      expensesAllocation: null,
      type: "Bewerbung",
      freelancerContract: dayjs("2024-02-10").toDate(),
      moneyTransferred: dayjs("2024-02-10").toDate(),
    },
  ] as ProjectMembersDto[];
  const allProjectDetails = [
    {
      projectId: 1,
      projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
      jobSite: "vor Ort/Remote",
      status: "Durchführung",
      tenderDate: dayjs("2024-02-10").toDate(),
      estimatedProjectStart: dayjs("2024-02-17").toDate(),
      estimatedProjectDuration: "3 Monate",
      estimatedProjectEuroPerBT: 400,
      estimatedProjectEuroPerBTrange: null,
      estimatedProjectBTmin: 10,
      estimatedProjectBTmax: 20,
      estimatedProjectMemberMin: 2,
      estimatedProjectMemberMax: 3,
      applicationStart1: dayjs("2024-02-10").toDate(),
      applicationEnd1: dayjs("2024-02-15").toDate(),
      applicationStart2: null,
      applicationEnd2: null,
      situation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      peculiarities:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      coreCompetencies: [allCoreCompetencies[5]] as CoreCompetencyDto[],
      requirementProfile: "Nichts",
      referenceProjects: "",
      notes: "",
      acquisitor: "GF Winter (GFW)",
      acquisitionMethod: "Kunde",
      newContactPerson: false,
      contactPerson: allContactPartners[0] as ContactPersonDto,
      customerType: "Altkunde",
      kickoff: dayjs("2024-02-17").toDate(),
      staffingCommittee: staffingCommittee,
      client: allCompanies[0],
      members: projectMembers,
      qms: qms as MembersFieldDto[],
      signatureDate: dayjs("2024-02-20").toDate(),
      euroPerBT: null,
      soldBT: null,
      soldExpenses: null,
      projectEnd: null,
      invoicing: null,
    },
    {
      projectId: 2,
      projectName: "Entwurf und Realisierung einer Schulungsreihe für neue Softwaretools",
      jobSite: "vor Ort/Remote",
      status: "Bewerbung",
      tenderDate: dayjs("2024-02-10").toDate(),
      estimatedProjectStart: dayjs("2024-02-17").toDate(),
      estimatedProjectDuration: "3 Monate",
      estimatedProjectEuroPerBT: 400,
      estimatedProjectEuroPerBTrange: 500,
      estimatedProjectBTmin: 10,
      estimatedProjectBTmax: 20,
      estimatedProjectMemberMin: 2,
      estimatedProjectMemberMax: 3,
      applicationStart1: dayjs("2024-02-10").toDate(),
      applicationEnd1: dayjs("2024-07-15").toDate(),
      applicationStart2: null,
      applicationEnd2: null,
      situation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      peculiarities:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
      coreCompetencies: [allCoreCompetencies[2]] as CoreCompetencyDto[],
      requirementProfile: "Nichts",
      referenceProjects: "",
      notes: "",
      acquisitor: "GF Sommer (GFS)",
      acquisitionMethod: "Alumni",
      newContactPerson: false,
      contactPerson: allContactPartners[3] as ContactPersonDto,
      customerType: "Neukunde",
      kickoff: dayjs("2024-02-17").toDate(),
      staffingCommittee: null,
      client: allCompanies[6],
      members: projectApplicants,
      qms: null,
      signatureDate: null,
      euroPerBT: null,
      soldBT: null,
      soldExpenses: 0,
      projectEnd: null,
      invoicing: null,
    },
  ] as ProjectDetailsDto[];

  const projectDetails = allProjectDetails.find((project) => project.projectId === projectID);
  const saveProject = (newProject: ProjectDetailsDto) => {
    console.log("Saving project", newProject);
  };

  return { projectDetails, saveProject };
};

export default useProjectDetails;
