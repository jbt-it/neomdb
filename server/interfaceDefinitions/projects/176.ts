// Type for workshop suggestion
export type WorkshopSuggestion = {
  workshopId: number;
  workshopName: string;
  workshopSelected: boolean;
};

// Type for external project experience
export type ExternalProjectExperience = {
  projectName: string;
  projectDuration: string;
  earnedBT: number;
  statusOfMember: string;
};

// Type for applicant data
export type ApplicantData = {
  internship: string;
  apprenticeship: string;
  workingStudentPosition: string;
  seminarPapers: string;
  trainingAndWorkshops: WorkshopSuggestion[];
  motivation: string;
  confidentialityAgreementSignature: boolean;
  availabilitySchedule: boolean;
  reasonForTimeConstrains: string;
  boardActivity: boolean;
  teamLeader: boolean;
  extraordinaryClubCommitment: string;
  initialContact: boolean;
  writingTheProposal: boolean;
};

// Type for member details
export type MemberDetails = {
  memberID: number;
  givenName: string;
  surname: string;
  courseOfStudy: string;
  semester: number;
  specialization: string;
};

// Type for previous application
export type PreviousApplication = {
  memberID: number;
  projectID: number;
  projectName: string;
  applicationStatus: string;
};

// Get suggestions
const suggestions = {
  ITSkills: [] as string[],
  trainingAndWorkshops: [] as WorkshopSuggestion[],
  activitiesInJBT: [] as string[],
  conductedWorkshops: [] as string[]
};

// Get application information
const applicationInformation = {
  memberDetails: {
    memberID: 0,
    givenName: '',
    surname: '',
    courseOfStudy: '',
    semester: 0,
    specialization: ''
  },
  applicantData: {
    internship: '',
    apprenticeship: '',
    workingStudentPosition: '',
    seminarPapers: '',
    trainingAndWorkshops: [] as WorkshopSuggestion[],
    motivation: '',
    confidentialityAgreementSignature: false,
    availabilitySchedule: false,
    reasonForTimeConstrains: '',
    boardActivity: false,
    teamLeader: false,
    extraordinaryClubCommitment: '',
    initialContact: false,
    writingTheProposal: false
  },
  externProjectExperience: [] as ExternalProjectExperience[]
};

// Get previous application
const previousApplication: PreviousApplication[] = [
  {
    memberID: 0,
    projectID: 0,
    projectName: '',
    applicationStatus: ''
  }
];