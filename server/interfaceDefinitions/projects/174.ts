// Type for edit project details
export type EditProjectDetails = {
  projectID: number;
  projectName: string;
  projectDescription: string;
  projectStatus: string;
};

// Type for project details
export type ProjectDetails = {
  projectID: number;
  projectName: string;
  status: string;
  location: string;
  announcementDate: string; // could be Date object
  kickoff: string; // could be Date object
  duration: string;
  conditions: number;
  conditionsRange: string;
  consultingDaysMin: number;
  consultingDaysMax: number;
  membersMin: number;
  membersMax: number;
  applicationStart: string; // could be Date object
  applicationDeadline: string; // could be Date object
  kickOffDate: Date; // could be Date object
  selectionPanel: string[]; // array of strings
};

// Type for client data
export type ClientData = {
  client: string;
  sector: string;
  shortDescription: string;
  street: string;
  postalCode: string;
  city: string;
  website: string;
  existingCustomer: boolean;
  acquisitionResponsible: string;
  acquisitionMethod: string;
  acquisitionChannel: string[]; // array of strings
  confidential: string;
};

// Class for project description
export class ProjectDescription {
  startingSituation: string;
  objective: string;
  peculiarities: string;
  coreCompetencies: string[]; // array of strings
  requirementsProfile: string;
  referenceProjects: string[]; // array of strings
  remarks: string;
}

// Class for execution and billing data
export class ExecutionBillingData {
  projectMembers: (MembersField & { application: string })[]; // array of MembersField + application
  QMs: (MembersField & { application: string })[]; // array of MembersField + application
  signingDate: string; // could be Date object
  conditions: number;
  soldBT: number;
  soldExpenses: number;
  projectEnd: string; // could be Date object
  invoicing: string; // could be Date object
}