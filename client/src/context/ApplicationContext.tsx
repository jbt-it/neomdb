import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  Application,
  ApplicationError,
  ApplicationPracticalExperience,
  ApplicationPracticalExperienceError,
} from "../types/applicationTypes";

/**
 * The application context provides the following values:
 */
interface ApplicationContextProps {
  applicationState: Application;
  updateApplicationState: (attributeName: string, attributeValue: any) => void;
  applicationErrorState: ApplicationError;
  updateApplicationErrorState: (attributeName: string, attributeValue: boolean) => void;
  resetApprenticeship: () => void;
  resetOccupation: () => void;
  addPracticalExperienceJob: (type: string) => void;
  removePracticalExperienceJob: (type: string, jobId: number) => void;
  updatePracticalExperience: (type: string, job: ApplicationPracticalExperience) => void;
  updatePracticalExperienceError: (type: string, jobId: number, errorName: string, errorValue: boolean) => void;
}

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

/**
 * The provider for the application context
 * @param children The children of the provider
 * @returns The provider for the application context
 */
export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applicationState, setApplicationState] = useState<Application>({
    firstName: "",
    lastName: "",
    gender: "",
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
    itSkills: null,
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
    flyer: null,
    lectures: null,
    internet: null,
    others: null,
    othersText: null,
    workingWeekend: null,
    availabilityWorkingWeekend: null,
    socialMedia: null,
    campusRally: null,
    partner: null,
    newsletter: null,
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
    itSkills: false,
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
    availabilityWorkingWeekend: false,
    socialMedia: false,
    campusRally: false,
    partner: false,
    newsletter: false,
  });

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
  const updateApplicationErrorState = (attributeName: string, attributeValue: boolean) => {
    setApplicationErrorState({ ...applicationErrorState, [attributeName]: attributeValue });
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
  const initializePracticalExperience = (): ApplicationPracticalExperience => ({
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
  const updatePracticalExperience = (type: string, updatedJob: ApplicationPracticalExperience) => {
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
