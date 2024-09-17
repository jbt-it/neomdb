import {
  Application,
  ApplicationError,
  ApplicationPracticalExperience,
  ApplicationPracticalExperienceError,
  Skill,
  SkillError,
} from "../types/applicationTypes";

const isDateInvalid = (dateValue: Date | null | undefined) => {
  return !dateValue || isNaN(dateValue.getTime());
};

/**
 * Function to check if all required attributes are filled and set the error state accordingly
 * @param attributes - The attributes to check for required fields in the application state
 * @returns true if any required field is missing, false otherwise
 */
const checkRequiredAttributes = (
  attributes: (keyof Application)[],
  applicationState: Application,
  updateApplicationErrorState: (updates: Partial<ApplicationError>) => void
) => {
  let hasError = false;
  const newErrorState: Partial<ApplicationError> = {};

  // Helper function to check if a value is missing
  const isMissing = (value: any) => value === "" || value === null || value === undefined;

  attributes.forEach((attribute) => {
    const value = applicationState[attribute];

    if (attribute === "internship" || attribute === "hiwiStudentJob") {
      const experienceArray = value as ApplicationPracticalExperience[];
      const errors = experienceArray.map((item) => {
        const itemError: ApplicationPracticalExperienceError = {
          id: item.id,
          activity: !item.activity,
          company: !item.company,
          location: !item.location,
          start: isDateInvalid(item.start),
          end: isDateInvalid(item.end),
        };

        if (itemError.activity || itemError.company || itemError.location || itemError.start || itemError.end) {
          hasError = true;
        }

        return itemError;
      });

      newErrorState[attribute] = errors;
    } else if (attribute === "languages" || attribute === "itSkills") {
      // value is Skill[]
      const skillArray = value as Skill[];
      const errors = skillArray.map((item) => {
        const itemError: SkillError = {
          id: item.id,
          name: isMissing(item.name),
          level: isMissing(item.level) || item.level === 0,
        };

        if (itemError.name || itemError.level) {
          hasError = true;
        }

        return itemError;
      });

      newErrorState[attribute] = errors;
    } else if (attribute === "occupation") {
      // Validate occupation fields if 'hasOccupation' is true
      if (applicationState.hasOccupation) {
        const occupationErrors = {
          occupation: !applicationState.occupation,
          occupationCompany: !applicationState.occupationCompany,
          occupationLocation: !applicationState.occupationLocation,
          occupationStart: isDateInvalid(applicationState.occupationStart),
          occupationEnd: isDateInvalid(applicationState.occupationEnd),
        };

        if (
          occupationErrors.occupation ||
          occupationErrors.occupationCompany ||
          occupationErrors.occupationLocation ||
          occupationErrors.occupationStart ||
          occupationErrors.occupationEnd
        ) {
          hasError = true;
        }

        // Set the error state for occupation fields
        Object.assign(newErrorState, occupationErrors);
      }
    } else if (attribute === "apprenticeship") {
      // Validate apprenticeship fields if 'apprenticeship' is true
      if (applicationState.apprenticeship) {
        const apprenticeshipErrors = {
          apprenticeshipJob: !applicationState.apprenticeshipJob,
          apprenticeshipCompany: !applicationState.apprenticeshipCompany,
          apprenticeshipLocation: !applicationState.apprenticeshipLocation,
          apprenticeshipStart: isDateInvalid(applicationState.apprenticeshipStart),
          apprenticeshipEnd: isDateInvalid(applicationState.apprenticeshipEnd),
        };

        if (
          apprenticeshipErrors.apprenticeshipJob ||
          apprenticeshipErrors.apprenticeshipCompany ||
          apprenticeshipErrors.apprenticeshipLocation ||
          apprenticeshipErrors.apprenticeshipStart ||
          apprenticeshipErrors.apprenticeshipEnd
        ) {
          hasError = true;
        }

        // Set the error state for apprenticeship fields
        Object.assign(newErrorState, apprenticeshipErrors);
      }
    } else if (Array.isArray(value)) {
      // Do not set an error if arrays are empty eg for voluntary activities
      // Optionally validate items if needed
    } else {
      const isError = isMissing(value);
      type ScalarAttributes = Exclude<
        keyof ApplicationError,
        "internship" | "hiwiStudentJob" | "voluntarySchool" | "voluntaryStudy" | "languages" | "itSkills"
      >;
      newErrorState[attribute as ScalarAttributes] = isError;

      if (isError) {
        hasError = true;
      }
    }
  });

  updateApplicationErrorState(newErrorState);
  return hasError;
};

/**
 * Function to check if all required fields are filled for the current step
 * @returns true if any required field is missing, false otherwise
 */
export const checkRequiredFields = (
  attributesToCheckByStep: { [key: number]: (keyof Application)[] },
  activeStep: number,
  applicationState: Application,
  updateApplicationErrorState: (updates: Partial<ApplicationError>) => void
) => {
  let attributes = attributesToCheckByStep[activeStep] || [];

  // For step 1, handle conditional required fields
  if (activeStep === 1) {
    if (applicationState.enrolledDegree === "Master") {
      attributes = [...attributes, "bachelorSubject", "bachelorUniversity"];
    }
    if (applicationState.apprenticeship) {
      attributes = [
        ...attributes,
        "apprenticeshipJob",
        "apprenticeshipCompany",
        "apprenticeshipLocation",
        "apprenticeshipStart",
        "apprenticeshipEnd",
      ];
    }
  } else if (activeStep === 2) {
    // If the user has an occupation, validate occupation details
    if (applicationState.hasOccupation) {
      attributes = [
        ...attributes,
        "occupation",
        "occupationCompany",
        "occupationLocation",
        "occupationStart",
        "occupationEnd",
      ];
    }
  }

  if (attributes.length > 0) {
    return checkRequiredAttributes(attributes, applicationState, updateApplicationErrorState);
  }
  return false;
};
