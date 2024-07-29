// Type for project frame data
export type ProjectFrameData = {
  projectName: string;
  status: string;
  location: string;
  announcementDate: Date;
  kickoff: string | Date;
  duration: string;
  conditions: string;
  conditionsRange: string;
  consultingDaysMin: number;
  consultingDaysMax: number;
  projectMembersMin: number;
  projectMembersMax: number;
  applicationStart: Date;
  applicationDeadline: Date;
  kickOffDate: Date;
  selectionPanel: string[];
  tenderDocument: SpecialObject;
};

// Type for client data
export type ClientData = {
  client: string;
  isSecret: boolean;
  sector: string;
  shortDescription: string;
  street: string;
  postalCode: string;
  city: string;
  website: string;
  existingCustomer: boolean;
  acquisitionResponsible: string;
  acquisitionMethod: string;
  acquisitionChannel: string[];
};

// Type for project description
export type ProjectDescription = {
  startingSituation: string;
  objective: string;
  specialFeatures: string;
  coreCompetencies: string;
  requirementsProfile: string;
  referenceProjects: string;
  remarks: string;
};

// Type for execution and billing data
export type ExecutionBillingData = {
  projectMembers: string[];
  QMs: string[];
  signingDate: Date;
  conditions: string;
  soldBT: number;
  soldExpenses: number;
};

// Type for applicants
export type Applicants = {
  member: MembersField;
  applicationDate: Date;
  application: Application;
  previousApplications: Application[];
};

// Type for team composition
export type TeamComposition = {
  projectLead: MembersField;
  projectMembers: MembersField[];
  staffingCommittee: MembersField[];
};