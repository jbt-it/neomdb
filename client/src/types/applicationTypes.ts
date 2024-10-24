// Definition of the ApplicationHiwiStudentJob type
export type ApplicationPracticalExperience = {
  id: number;
  activity: string | null;
  company: string | null;
  location: string | null;
  start: Date | undefined | null;
  end: Date | undefined | null;
};

// Definition of the ApplicationHiwiStudentJobError type
export type ApplicationPracticalExperienceError = {
  id: number;
  activity: boolean;
  company: boolean;
  location: boolean;
  start: boolean;
  end: boolean;
};

// Definition of the Skill type
export type Skill = {
  id: number;
  name: string;
  level: number;
};

// Definition of the SkillError type
export type SkillError = {
  id: number;
  name: boolean;
  level: boolean;
};

// Definition of the Application type
export type Application = {
  firstName: string;
  lastName: string;
  gender: string;
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
  internship: ApplicationPracticalExperience[];
  hiwiStudentJob: ApplicationPracticalExperience[];
  voluntarySchool: string[];
  voluntaryStudy: string[];
  languages: Skill[];
  itSkills: Skill[];
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

// Definition of the ApplicationError type
export type ApplicationError = {
  firstName: boolean;
  lastName: boolean;
  gender: boolean;
  picture: boolean;
  birthDate: boolean;
  mobilePhone: boolean;
  email: boolean;
  confirmEmail: boolean;
  homeAddressStreet: boolean;
  homeAddressNumber: boolean;
  homeAddressPostalCode: boolean;
  homeAddressCity: boolean;
  studyAddressStreet: boolean;
  studyAddressNumber: boolean;
  studyAddressPostalCode: boolean;
  studyAddressCity: boolean;
  enrolledDegree: boolean;
  enrolledUniversity: boolean;
  enrolledSubject: boolean;
  enrolledOtherSubject: boolean;
  studyStart: boolean;
  studySemester: boolean;
  studyFirstMajor: boolean;
  studySecondMajor: boolean;
  studyThirdMajor: boolean;
  bachelorSubject: boolean;
  bachelorUniversity: boolean;
  apprenticeship: boolean;
  apprenticeshipJob: boolean;
  apprenticeshipCompany: boolean;
  apprenticeshipLocation: boolean;
  apprenticeshipStart: boolean;
  apprenticeshipEnd: boolean;
  occupation: boolean;
  occupationCompany: boolean;
  occupationLocation: boolean;
  occupationStart: boolean;
  occupationEnd: boolean;
  internship: ApplicationPracticalExperienceError[];
  hiwiStudentJob: ApplicationPracticalExperienceError[];
  voluntarySchool: boolean;
  voluntaryStudy: boolean;
  languages: SkillError[];
  itSkills: SkillError[];
  hobbies: boolean;
  timeInvestment: boolean;
  motivation: boolean;
  selfAssessment1: boolean;
  selfAssessment2: boolean;
  selfAssessment3: boolean;
  selfAssessment4: boolean;
  selfAssessment5: boolean;
  selfAssessment6: boolean;
  selfAssessment7: boolean;
  selfAssessment8: boolean;
  flyer: boolean;
  lectures: boolean;
  internet: boolean;
  others: boolean;
  othersText: boolean;
  workingWeekend: boolean;
  availabilitySelectionWeekend: boolean;
  socialMedia: boolean;
  campusRally: boolean;
  partner: boolean;
  newsletter: boolean;
};
