// Type for the project details
export type ProjectDetails = {
  projectid: number;
  projectName: string;
  status string;
  jobSite: string;
  announcementDate: Date;
  kickoff: Date;
  tenderDate: Date;
  estimatedProjectStart: Date;
  estimatedProjectDuration: string;
  estimatedProjectEuroPerBT: string;
  estimatedProjectEuroPerBTrange: string;
  estimatedProjectBTmin: number;
  estimatedProjectBTmax: number;
  estimatedProjectMemberMin: number;
  estimatedProjectMemberMax: number;
  applicationStart1: Date;
  applicationEnd1: Date;
  applicationStart2: Date | null;
  applicationEnd2: Date | null;
  kickoff: Date;
  peculiarities: string;
  coreCompetencies: CoreCompetency[];
  requirementProfile: string;
  referenceProjects: string;
  signatureDate: Date | null,
  staffingCommittee: MemberField[];
  members: MemberField[],
  qualityManagers: MemberField[],
  situation: string;
  soldBT: string;
  soldExpenses: string;
  euroPerBT: string,
  projectEnd: Date,
  invoicing: Date,
  acquisitor: DirectorDto,
  acquisitionMethod: string,
  customerType: "Altkunde" | "Neukunde",
};

// for projects with status "Bewerbung"
type ProjectApplicationShort = {
    firstname: string,
    lastname: string,
    memberStatus: MemberStatusDto,
    applicationDate: Date, // Datum
    type: string,
}

// Type for the customer details
export type CustomerDetails = {
  customerid: number;
  industry: IndustryDto;
  shortDescription: string;
  street: string;
  postalCode: string;
  city: string;
  addressAdditional: string;
  url: string,
  importantInformation: string,
  classified: boolean,
  contactDesired: boolean,
};

// Type for project details without permissions
export type ProjectDetailsWithoutPermissions = Omit<ProjectDetails, 'staffingCommittee' | 'projectMembers'>;

// Type for project details with permissions
export type ProjectDetailsWithPermissions = ProjectDetails;