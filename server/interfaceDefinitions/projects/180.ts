// Type for project frame data
export type ProjectFrameData = {
  projectName: string;
  location: string;
  announcementDate: Date;
  start: Date;
  duration: string;
  conditions: string;
  conditionsRange: string;
  consultingDaysMin: number;
  consultingDaysMax: number;
  projectMembersMin: number;
  projectMembersMax: number;
  applicationDeadline: Date;
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
  contactWished: boolean;
  contactPerson: string;
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
  coreCompetencies: string[];
  requirementsProfile: string;
  referenceProjects: string[];
  remarks: string;
};