import dayjs from "dayjs";
import { MembersFieldDto } from "../../types/membersTypes";
import {
  ContactPersonDto,
  CoreCompetencyDto,
  ProjectMembersDto,
  ProjectDetailsDto,
  ProjectApplicantDto,
  ProjectBillingDetailsDto,
  MembersBillingDto,
  MemberBTAllocationDto,
} from "../../types/projectTypes";
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
      memberId: 8111,
      firstname: "Brandon-Lee",
      lastname: "Frye",
      memberStatus: {
        memberStatusId: 1,
        name: "Trainee",
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
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 3,
        name: "Senior",
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
    alert("Saving project");
    console.log("Saving project", newProject);
  };

  const projectApplications: ProjectApplicantDto[] = [
    {
      memberId: 8222,
      firstname: "Talha",
      lastname: "Driscoll",
      memberStatus: {
        memberStatusId: 3,
        name: "Senior",
      },
      university: "Universität Hohenheim",
      courseOfStudy: "Wirtschaftswissenschaften",
      specializations: "Controlling,, Externe Unternehmensrechnung und Bewertung, Business Optimization",
      applicationDate: new Date(),
      internship: "Kain & Company",
      apprenticeship: "Ja",
      studentJob: "Nein",
      seminarPapers: "Ja",
      workshops: [],
      internalCommitment: null,
      externalProjects: [],
      preliminaryWork: null,
      extraordinaryCommitment: "Nein",
      availability: "Ohne Einschränkung",
      restriction: "Keine",
      motivation: "Ich möchte gerne an dem Projekt teilnehmen, weil ich mich für das Thema interessiere.",
    },
    {
      memberId: 8167,
      firstname: "Wolfgang U",
      lastname: "Luft",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
      university: "Universität Hohenheim",
      courseOfStudy: "Wirtschaftswissenschaften",
      specializations: "Master of Science - Marketing",
      applicationDate: new Date(),
      internship: "McRinsey & Company",
      apprenticeship: "Nein",
      studentJob: "Ja",
      seminarPapers: "Nein",
      workshops: [],
      internalCommitment: ["Teamleiter"],
      externalProjects: [
        {
          projectId: 1,
          projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
          projectStart: new Date(),
          projectEnd: null,
          status: "Durchführung",
          type: "Mitglied",
          btAllocation: 0,
        },
      ],
      preliminaryWork: ["Schreiben des Angebots"],
      extraordinaryCommitment: "Ja",
      availability: "Mit Einschränkung",
      restriction: "Keine",
      motivation: "Ich möchte gerne an dem Projekt teilnehmen, weil ich mich für das Thema interessiere.",
    },
    {
      memberId: 8324,
      firstname: "Miruna",
      lastname: "Decker",
      memberStatus: {
        memberStatusId: 2,
        name: "aktives Mitglied",
      },
      university: "Universität Hohenheim",
      courseOfStudy: "Wirtschaftswissenschaften",
      specializations: "Marktorientiertes Management; Information Systems; Interne Managementfunktionen",
      applicationDate: new Date(),
      internship: "BZG",
      apprenticeship: "Nein",
      studentJob: "Ja",
      seminarPapers: "Nein",
      workshops: [],
      internalCommitment: ["Vorstandstätigkeit", "Teamleiter"],
      externalProjects: [
        {
          projectId: 1,
          projectName: "Aufnahme und Analyse von Workflows im Auftragsmanagement",
          projectStart: new Date(),
          projectEnd: null,
          status: "PL",
          type: "Mitglied",
          btAllocation: 0,
        },
        {
          projectId: 2,
          projectName: "Aufnahme und Analyse von Prozessen im Vertrieb",
          projectStart: new Date(),
          projectEnd: new Date(),
          status: "Abgeschlossen",
          type: "PL",
          btAllocation: 10,
        },
      ],
      preliminaryWork: null,
      extraordinaryCommitment: "Ja",
      availability: "Mit Einschränkung",
      restriction: "Keine",
      motivation:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.   Duis utem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.  At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.  Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.   Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo",
    },
  ];

  const projectBillingDetails = [
    {
      projectId: 2,
      projectName: "Entwurf und Realisierung einer Schulungsreihe für neue Softwaretools",
      status: "Abrechnung",
      APatEV: true,
      APHold: true,
      evaluationAtEV: true,
      DLatEV: true,
      offerInAlfresco: true,
      deviationFromStandard: true,
      consultingContractProvided: true,
      teamContractProvided: true,
      qmApproval: true,
      CRMEntryExists: true,
      paymentDelay: false,
      moneyReceived: true,
      signatureDate: new Date("2024-02-10"),
      euroPerBT: 400,
      soldBT: 46.13,
      soldExpenses: 0,
      membersBilling: [
        {
          memberId: 8167,
          firstname: "Wolfgang",
          lastname: "Luft",
          type: "PL",
          freelancerContract: new Date("2024-02-10"),
          moneyTransferred: new Date("2024-06-30"),
          btAllocation: 36.13,
          expensesAllocation: 0,
        },
        {
          memberId: 8222,
          firstname: "Talha",
          lastname: "Driscoll",
          type: "Mitglied",
          freelancerContract: new Date("2024-02-10"),
          moneyTransferred: new Date("2024-06-30"),
          btAllocation: 10,
          expensesAllocation: 0,
        },
        {
          memberId: 8331,
          firstname: "Jorja",
          lastname: "Bautista",
          type: "QM",
          freelancerContract: new Date("2024-02-10"),
          moneyTransferred: new Date("2024-06-30"),
          btAllocation: 0,
          expensesAllocation: 0,
        },
      ] as MembersBillingDto[],
    },
    {
      projectId: 5,
      projectName: "Durchführung und Auswertung einer Mitarbeiterzufriedenheitsstudie",
      status: "Durchführung",
      APatEV: false,
      APHold: false,
      evaluationAtEV: false,
      DLatEV: false,
      offerInAlfresco: true,
      deviationFromStandard: true,
      consultingContractProvided: true,
      teamContractProvided: true,
      qmApproval: true,
      CRMEntryExists: true,
      paymentDelay: false,
      signatureDate: new Date("2024-02-10"),
      euroPerBT: 400,
      soldBT: 10.5,
      soldExpenses: 150,
      membersBilling: [
        {
          memberId: 8167,
          firstname: "Wolfgang",
          lastname: "Luft",
          type: "PL",
          freelancerContract: new Date(),
          moneyTransferred: null,
          btAllocation: 8,
          expensesAllocation: 0,
        },
        {
          memberId: 8222,
          firstname: "Talha",
          lastname: "Driscoll",
          type: "Mitglied",
          freelancerContract: new Date(),
          moneyTransferred: null,
          btAllocation: 2.5,
          expensesAllocation: null,
        },
      ] as MembersBillingDto[],
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
      deviationFromStandard: false,
      consultingContractProvided: false,
      teamContractProvided: false,
      qmApproval: false,
      CRMEntryExists: true,
      paymentDelay: true,
      signatureDate: new Date("2024-02-10"),
      euroPerBT: null,
      soldBT: null,
      soldExpenses: null,
      membersBilling: [
        {
          memberId: 8167,
          firstname: "Wolfgang",
          lastname: "Luft",
          type: "PL",
          freelancerContract: null,
          moneyTransferred: null,
          btAllocation: null,
          expensesAllocation: null,
        },
        {
          memberId: 8222,
          firstname: "Talha",
          type: "QM",
          lastname: "Driscoll",
          freelancerContract: null,
          moneyTransferred: null,
          btAllocation: null,
          expensesAllocation: null,
        },
      ] as MembersBillingDto[],
    },
  ] as ProjectBillingDetailsDto[];

  const projectBillingDetailsDto = projectBillingDetails.find((project) => project.projectId === projectID);

  const saveProjectTeamComposition = (
    staffingCommittee: MembersFieldDto[],
    projectManager: ProjectMembersDto,
    projectMembers: ProjectMembersDto[],
    notes: string,
    kickOffDate: Date
  ) => {
    alert("Saving project team composition");
    console.log(
      "Saving project team composition",
      notes,
      projectMembers,
      projectManager,
      staffingCommittee,
      kickOffDate
    );
  };

  // handle save BT allocation
  const saveBTAllocation = (allocations: MemberBTAllocationDto[]) => {
    alert("BT-Aufteilung gespeichert siehe Konsole");
    console.log(allocations);
  };

  const checkProjectBillingCheckmark = (checkmark: string) => {
    alert("Checkmark " + checkmark + " gespeichert");
  };

  const checkFreelancerContract = (memberId: number) => {
    alert("Freelancer contract for member " + memberId + " checked");
  };

  const checkMoneyTransferred = (memberId: number) => {
    alert("Money transferred for member " + memberId + " checked");
  };

  const saveProjectData = (
    projectMembers: ProjectMembersDto[],
    qms: MembersFieldDto[],
    signatureDate: Date | null,
    conditions: number | null,
    soldBT: number | null,
    soldExpenses: number | null
  ) => {
    alert("Saving project data");
    console.log("Saving project data", projectMembers, qms, signatureDate, conditions, soldBT, soldExpenses);
  };

  const checkHasPlQualification = (memberId: number) => {
    if (memberId === 8167 || memberId === 8222 || memberId === 8320) {
      return true;
    }
    return false;
  };

  const checkHasQMQualification = (memberId: number) => {
    if (memberId === 8167 || memberId === 8222) {
      return true;
    }
    return false;
  };

  return {
    projectDetails,
    saveProject,
    projectApplicants,
    projectApplications,
    saveProjectTeamComposition,
    projectBillingDetailsDto,
    saveBTAllocation,
    checkProjectBillingCheckmark,
    checkFreelancerContract,
    checkMoneyTransferred,
    checkHasPlQualification,
    checkHasQMQualification,
    saveProjectData,
  };
};

export default useProjectDetails;
