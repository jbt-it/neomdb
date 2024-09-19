// Definition of the ApplicationHiwiStudentJob type
export type ApplicationPracticalExperienceDto = {
  id: number;
  activity: string | null;
  company: string | null;
  location: string | null;
  start: Date | undefined | null;
  end: Date | undefined | null;
};

// Definition of the Skill type
export type SkillDto = {
  id: number;
  name: string;
  level: number;
};

// Definition of the ApplicationImage type
export type ApplicationImageDto = {
  mimeType: string;
  base64: string;
};

// Definition of the Application type
export type ApplicationDto = {
  firstName: string;
  lastName: string;
  gender: "männlich" | "weiblich" | "divers" | null;
  picture: string;
  birthDate: Date | null;
  mobilePhone: string;
  email: string;
  confirmEmail: string;
  homeAddressStreet: string;
  homeAddressNumber: string;
  homeAddressPostalCode: string;
  homeAddressCity: string;
  studyAddressStreet: string;
  studyAddressNumber: string;
  studyAddressPostalCode: string;
  studyAddressCity: string;
  enrolledDegree: string;
  enrolledUniversity: string;
  enrolledSubject: string | null;
  enrolledOtherSubject: string | null;
  studyStart: Date | null;
  studySemester: string | null;
  studyFirstMajor: string | null;
  studySecondMajor: string | null;
  studyThirdMajor: string | null;
  bachelorSubject: string | null;
  bachelorUniversity: string | null;
  apprenticeship: boolean;
  apprenticeshipJob: string | null;
  apprenticeshipCompany: string | null;
  apprenticeshipLocation: string | null;
  apprenticeshipStart: Date | null;
  apprenticeshipEnd: Date | null;
  hasOccupation: boolean;
  occupation: string | null;
  occupationCompany: string | null;
  occupationLocation: string | null;
  occupationStart: Date | null;
  occupationEnd: Date | null;
  internship: ApplicationPracticalExperienceDto[];
  hiwiStudentJob: ApplicationPracticalExperienceDto[];
  voluntarySchool: string[];
  voluntaryStudy: string[];
  languages: SkillDto[];
  itSkills: SkillDto[];
  hobbies: string | null;
  timeInvestment: string | null;
  motivation: string | null;
  selfAssessment1: number | null;
  selfAssessment2: number | null;
  selfAssessment3: number | null;
  selfAssessment4: number | null;
  selfAssessment5: number | null;
  selfAssessment6: number | null;
  selfAssessment7: number | null;
  selfAssessment8: number | null;
  flyer: boolean;
  posters: boolean;
  lectures: boolean;
  friends: boolean;
  informationStand: boolean;
  internet: boolean;
  others: boolean;
  othersText: string;
  workingWeekend: boolean;
  socialMedia: boolean;
  campusRally: boolean;
  partner: boolean;
  newsletter: boolean;
  availabilitySelectionWeekend: "kannImmer" | "nichtFR" | "nichtSA" | "nichtSO" | null;
};

// Definition of application request dto
export type ApplicationRequestDto = {
  application: ApplicationDto;
  applicationImage: ApplicationImageDto;
};

// Definition of the new Generation request type
export type NewGenerationRequestDto = {
  description: string;
  applicationStart: Date | null;
  applicationEnd: Date | null;
  selectionWeDateStart: Date | null;
  selectionWeDateEnd: Date | null;
  wwDateStart: Date | null;
  wwDateEnd: Date | null;
};

// Definition of the update Generation request type
export type GenerationDto = {
  generationId: number;
  description: string;
  applicationStart: Date | null;
  applicationEnd: Date | null;
  selectionWeDateStart: Date | null;
  selectionWeDateEnd: Date | null;
  wwDateStart: Date | null;
  wwDateEnd: Date | null;
  infoEveningVisitors: number | null;
  doorCode: string | null;
  electionStart: Date | null;
  electionEnd: Date | null;
};

// Definition of the evaluation dto type
export type EvaluationDto = {
  traineeApplicantId: number;
  firstName: string;
  lastName: string;
  availabilitySelectionWeekend: "kannImmer" | "nichtFR" | "nichtSA" | "nichtSO" | null;
  workingWeekend: boolean;
  evaluation: number;
};

// Definition of the feedback statistics dto type
export type FeedbackStatisticsDto = {
  flyer: number;
  posters: number;
  lectures: number;
  friends: number;
  informationStand: number;
  internet: number;
  socialMedia: number;
  campusRally: number;
  partner: number;
  newsletter: number;
  others: number;
  othersText: string[];
};
