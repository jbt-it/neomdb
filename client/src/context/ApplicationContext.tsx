import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  ApplicationDto,
  ApplicationError,
  ApplicationImageDto,
  ApplicationPracticalExperienceDto,
  ApplicationPracticalExperienceError,
} from "../types/applicationTypes";

/**
 * The application context provides the following values:
 */
interface ApplicationContextProps {
  applicationState: ApplicationDto;
  updateApplicationState: (attributeName: string, attributeValue: any) => void;
  applicationErrorState: ApplicationError;
  updateApplicationErrorState: (updates: Partial<ApplicationError>) => void;
  resetApprenticeship: () => void;
  resetOccupation: () => void;
  addPracticalExperienceJob: (type: string) => void;
  removePracticalExperienceJob: (type: string, jobId: number) => void;
  updatePracticalExperience: (type: string, job: ApplicationPracticalExperienceDto) => void;
  updatePracticalExperienceError: (type: string, jobId: number, errorName: string, errorValue: boolean) => void;
  addSkill: (skillType: string) => void;
  removeSkill: (skillType: string, skillId: number) => void;
  updateSkill: (skillType: string, skillId: number, attributeName: string, attributeValue: any) => void;
  applicationImage: ApplicationImageDto | undefined;
  updateApplicationImage: (mimeType: string, base64: string) => void;
}

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

/**
 * The provider for the application context
 * @param children The children of the provider
 * @returns The provider for the application context
 */
export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applicationState, setApplicationState] = useState<ApplicationDto>({
    firstName: "",
    lastName: "",
    gender: null,
    picture: "",
    birthDate: null,
    mobilePhone: "",
    email: "",
    confirmEmail: "",
    homeAddressStreet: "",
    homeAddressNumber: "",
    homeAddressPostalCode: "",
    homeAddressCity: "",
    studyAddressStreet: "",
    studyAddressNumber: "",
    studyAddressPostalCode: "",
    studyAddressCity: "",
    enrolledDegree: "",
    enrolledUniversity: "",
    enrolledSubject: null,
    enrolledOtherSubject: null,
    studyStart: null,
    studySemester: null,
    studyFirstMajor: null,
    studySecondMajor: null,
    studyThirdMajor: null,
    bachelorSubject: null,
    bachelorUniversity: null,
    apprenticeship: false,
    apprenticeshipJob: null,
    apprenticeshipCompany: null,
    apprenticeshipLocation: null,
    apprenticeshipStart: null,
    apprenticeshipEnd: null,
    hasOccupation: false,
    occupation: null,
    occupationCompany: null,
    occupationLocation: null,
    occupationStart: null,
    occupationEnd: null,
    internship: [],
    hiwiStudentJob: [],
    voluntarySchool: [],
    voluntaryStudy: [],
    languages: [],
    itSkills: [],
    hobbies: null,
    timeInvestment: null,
    motivation: null,
    selfAssessment1: null,
    selfAssessment2: null,
    selfAssessment3: null,
    selfAssessment4: null,
    selfAssessment5: null,
    selfAssessment6: null,
    selfAssessment7: null,
    selfAssessment8: null,
    flyer: false,
    posters: false,
    lectures: false,
    friends: false,
    informationStand: false,
    internet: false,
    others: false,
    othersText: "",
    workingWeekend: false,
    socialMedia: false,
    campusRally: false,
    partner: false,
    newsletter: false,
    availabilitySelectionWeekend: null,
  });

  const [applicationErrorState, setApplicationErrorState] = useState<ApplicationError>({
    firstName: false,
    lastName: false,
    gender: false,
    picture: false,
    birthDate: false,
    mobilePhone: false,
    email: false,
    confirmEmail: false,
    homeAddressStreet: false,
    homeAddressNumber: false,
    homeAddressPostalCode: false,
    homeAddressCity: false,
    studyAddressStreet: false,
    studyAddressNumber: false,
    studyAddressPostalCode: false,
    studyAddressCity: false,
    enrolledDegree: false,
    enrolledUniversity: false,
    enrolledSubject: false,
    enrolledOtherSubject: false,
    studyStart: false,
    studySemester: false,
    studyFirstMajor: false,
    studySecondMajor: false,
    studyThirdMajor: false,
    bachelorSubject: false,
    bachelorUniversity: false,
    apprenticeship: false,
    apprenticeshipJob: false,
    apprenticeshipCompany: false,
    apprenticeshipLocation: false,
    apprenticeshipStart: false,
    apprenticeshipEnd: false,
    occupation: false,
    occupationCompany: false,
    occupationLocation: false,
    occupationStart: false,
    occupationEnd: false,
    internship: [],
    hiwiStudentJob: [],
    voluntarySchool: false,
    voluntaryStudy: false,
    languages: [],
    itSkills: [],
    hobbies: false,
    timeInvestment: false,
    motivation: false,
    selfAssessment1: false,
    selfAssessment2: false,
    selfAssessment3: false,
    selfAssessment4: false,
    selfAssessment5: false,
    selfAssessment6: false,
    selfAssessment7: false,
    selfAssessment8: false,
    flyer: false,
    lectures: false,
    internet: false,
    others: false,
    othersText: false,
    workingWeekend: false,
    availabilitySelectionWeekend: false,
    socialMedia: false,
    campusRally: false,
    partner: false,
    newsletter: false,
  });

  const [applicationImage, setApplicationImage] = useState<ApplicationImageDto>();

  const updateApplicationImage = (mimeType: string, base64: string) => {
    const image = { mimeType: mimeType, base64: base64 };
    setApplicationImage(image);
  };

  /**
   * Updates the application state with the given attribute name and value
   * @param attributeName - The name of the attribute to update
   * @param attributeValue - The value to update the attribute with
   */
  const updateApplicationState = (attributeName: string, attributeValue: any) => {
    setApplicationState({ ...applicationState, [attributeName]: attributeValue });
  };

  /**
   * Updates the application error state with the given attribute name and value
   * @param attributeName - The name of the attribute to update
   * @param attributeValue - The value to update the attribute with
   */
  const updateApplicationErrorState = (updates: Partial<ApplicationError>) => {
    setApplicationErrorState({ ...applicationErrorState, ...updates });
  };

  /**
   * Resets the apprenticeship attributes in the application state and error state
   */
  const resetApprenticeship = () => {
    setApplicationState({
      ...applicationState,
      apprenticeship: false,
      apprenticeshipJob: null,
      apprenticeshipCompany: null,
      apprenticeshipLocation: null,
      apprenticeshipStart: null,
      apprenticeshipEnd: null,
    });
    setApplicationErrorState({
      ...applicationErrorState,
      apprenticeshipJob: false,
      apprenticeshipCompany: false,
      apprenticeshipLocation: false,
      apprenticeshipStart: false,
      apprenticeshipEnd: false,
    });
  };

  /**
   * Resets the apprenticeship attributes in the application state and error state
   */
  const resetOccupation = () => {
    setApplicationState({
      ...applicationState,
      hasOccupation: false,
      occupation: null,
      occupationCompany: null,
      occupationLocation: null,
      occupationStart: null,
      occupationEnd: null,
    });
    setApplicationErrorState({
      ...applicationErrorState,
      occupation: false,
      occupationCompany: false,
      occupationLocation: false,
      occupationStart: false,
      occupationEnd: false,
    });
  };

  // Function to initialize a new ApplicationPracticalExperienceJob object
  const initializePracticalExperience = (): ApplicationPracticalExperienceDto => ({
    id: 0,
    activity: "",
    company: "",
    location: "",
    start: undefined,
    end: undefined,
  });

  // Function to initialize a new ApplicationPracticalExperienceError object
  const initializePracticalExperienceError = (): ApplicationPracticalExperienceError => ({
    id: 0,
    activity: false,
    company: false,
    location: false,
    start: false,
    end: false,
  });

  // Function to add an object to PracticalExperience
  const addPracticalExperienceJob = (type: string) => {
    const newJob = initializePracticalExperience();
    const newJobError = initializePracticalExperienceError();
    const jobType = type === "internship" ? applicationState.internship : applicationState.hiwiStudentJob;
    newJob.id = jobType.length > 0 ? jobType[jobType.length - 1].id + 1 : 1;
    newJobError.id = newJob.id;
    if (type === "internship") {
      setApplicationState((prevState) => ({
        ...prevState,
        internship: [...prevState.internship, newJob],
      }));
      setApplicationErrorState((prevState) => ({
        ...prevState,
        internship: [...prevState.internship, newJobError],
      }));
    } else if (type === "hiwiStudentJob") {
      setApplicationState((prevState) => ({
        ...prevState,
        hiwiStudentJob: [...prevState.hiwiStudentJob, newJob],
      }));
      setApplicationErrorState((prevState) => ({
        ...prevState,
        hiwiStudentJob: [...prevState.hiwiStudentJob, newJobError],
      }));
    }
  };

  // Function to remove an object from hiwiStudentJob
  const removePracticalExperienceJob = (type: string, jobId: number) => {
    if (type === "internship") {
      setApplicationState((prevState) => ({
        ...prevState,
        internship: prevState.internship.filter((job) => job.id !== jobId),
      }));
      setApplicationErrorState((prevState) => ({
        ...prevState,
        internship: prevState.internship.filter((job) => job.id !== jobId),
      }));
    } else if (type === "hiwiStudentJob") {
      setApplicationState((prevState) => ({
        ...prevState,
        hiwiStudentJob: prevState.hiwiStudentJob.filter((job) => job.id !== jobId),
      }));
      setApplicationErrorState((prevState) => ({
        ...prevState,
        hiwiStudentJob: prevState.hiwiStudentJob.filter((job) => job.id !== jobId),
      }));
    }
  };

  /**
   * Updates the PracticalExperience state with the given job
   * @param updatedJob - The updated job
   */
  const updatePracticalExperience = (type: string, updatedJob: ApplicationPracticalExperienceDto) => {
    if (type === "internship") {
      setApplicationState((prevState) => ({
        ...prevState,
        internship: prevState.internship.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
      }));
    } else if (type === "hiwiStudentJob") {
      setApplicationState((prevState) => ({
        ...prevState,
        hiwiStudentJob: prevState.hiwiStudentJob.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
      }));
    }
  };

  /**
   * Updates the PracticalExperience error state with the given job error
   * @param jobId - The id of the job
   * @param errorName - The name of the error
   * @param errorValue - The value of the error
   */
  const updatePracticalExperienceError = (type: string, jobId: number, errorName: string, errorValue: boolean) => {
    if (type === "internship") {
      setApplicationErrorState((prevState) => ({
        ...prevState,
        internship: prevState.internship.map((jobError) =>
          jobError.id === jobId ? { ...jobError, [errorName]: errorValue } : jobError
        ),
      }));
    } else if (type === "hiwiStudentJob") {
      setApplicationErrorState((prevState) => ({
        ...prevState,
        hiwiStudentJob: prevState.hiwiStudentJob.map((jobError) =>
          jobError.id === jobId ? { ...jobError, [errorName]: errorValue } : jobError
        ),
      }));
    }
  };

  /**
   * Adds a new skill to the application state based on the skill type
   * @param skillType - The type of the skill
   */
  const addSkill = (skillType: string) => {
    const skills = skillType === "it" ? applicationState.itSkills : applicationState.languages;
    const newSkillId = skills.length > 0 ? skills[skills.length - 1].id + 1 : 1;
    if (skillType === "language") {
      setApplicationState({
        ...applicationState,
        languages: [...skills, { id: newSkillId, name: "", level: 0 }],
      });
    } else if (skillType === "it") {
      setApplicationState({
        ...applicationState,
        itSkills: [...skills, { id: newSkillId, name: "", level: 0 }],
      });
    }
  };

  /**
   * Removes a skill from the application state based on the skill type and skill id
   * @param skillType - The type of the skill
   * @param skillId - The id of the skill
   */
  const removeSkill = (skillType: string, skillId: number) => {
    if (skillType === "language") {
      setApplicationState({
        ...applicationState,
        languages: applicationState.languages.filter((skill) => skill.id !== skillId),
      });
    } else if (skillType === "it") {
      setApplicationState({
        ...applicationState,
        itSkills: applicationState.itSkills.filter((skill) => skill.id !== skillId),
      });
    }
  };

  /**
   * Updates a skill in the application state based on the skill type, skill id, attribute name, and attribute value
   * @param skillType - The type of the skill
   * @param skillId - The id of the skill
   * @param attributeName - The name of the attribute
   * @param attributeValue - The value of the attribute
   */
  const updateSkill = (skillType: string, skillId: number, attributeName: string, attributeValue: any) => {
    if (skillType === "language") {
      setApplicationState({
        ...applicationState,
        languages: applicationState.languages.map((skill) =>
          skill.id === skillId ? { ...skill, [attributeName]: attributeValue } : skill
        ),
      });
    } else if (skillType === "it") {
      setApplicationState({
        ...applicationState,
        itSkills: applicationState.itSkills.map((skill) =>
          skill.id === skillId ? { ...skill, [attributeName]: attributeValue } : skill
        ),
      });
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applicationState,
        updateApplicationState,
        applicationErrorState,
        updateApplicationErrorState,
        resetApprenticeship,
        resetOccupation,
        addPracticalExperienceJob,
        removePracticalExperienceJob,
        updatePracticalExperience,
        updatePracticalExperienceError,
        addSkill,
        removeSkill,
        updateSkill,
        applicationImage,
        updateApplicationImage,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

/**
 * The hook to use the application context
 * @returns The application context
 */
export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplicationContext must be used within an ApplicationProvider");
  }
  return context;
};
