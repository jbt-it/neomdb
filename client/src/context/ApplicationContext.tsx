import React, { createContext, useState, useContext, ReactNode } from "react";
import { Application, ApplicationError } from "../types/applicationTypes";

/**
 * The application context provides the following values:
 */
interface ApplicationContextProps {
  applicationState: Application;
  updateApplicationState: (attributeName: string, attributeValue: any) => void;
  applicationErrorState: ApplicationError;
  updateApplicationErrorState: (attributeName: string, attributeValue: boolean) => void;
  resetApprenticeship: () => void;
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
    occupation: null,
    occupationCompany: null,
    occupationLocation: null,
    occupationStart: null,
    occupationEnd: null,
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

  return (
    <ApplicationContext.Provider
      value={{
        applicationState,
        updateApplicationState,
        applicationErrorState,
        updateApplicationErrorState,
        resetApprenticeship,
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
