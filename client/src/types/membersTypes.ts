/**
 * Contains all members types for the frontend
 */
import { InternalProject } from "./traineesTypes";

/**
 * Type of the language of a member
 */
export type LanguageOfMember = {
  memberId: number;
  value: string;
  level: string;
};

/**
 * Type of the it skill of a member
 */
export type ItSkillOfMember = {
  memberId: number;
  value: string;
  level: string;
};

/**
 * Type of a language
 */
export type Language = {
  /*
   * Additional attribute which is needed for the Automplece Component
   * It is only used for filtering
   */
  inputValue?: string;
  value: string;
};

/**
 * Type of an edv skill
 */
export type ItSkill = {
  /*
   * Additional attribute which is needed for the Automplece Component
   * It is only used for filtering
   */
  inputValue?: string;
  value: string;
};

export type MemberStatus = {
  memberStatusId: number;
  name: "Trainee" | "aktives Mitglied" | "Senior" | "Alumnus" | "passives Mitglied" | "Ausgetretene";
};

/**
 * Type of the partial department dto used for the member list
 */
export type DepartmentPartialDto = {
  departmentId: number;
  name: string;
  shortName: string;
};

/**
 * Type of the department details
 */
export type DepartmentDetails = {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
  jbt_email: string;
  linkZielvorstellung: string;
  linkOrganigramm: string;
};

/**
 * Type of the director (partial member with department and role information)
 */
export type DirectorDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  directorId: number;
  department: DepartmentPartialDto;
  gender: boolean;
  designationFemale: string;
  designationMale: string;
};

/**
 * Type of the mentor (partial member)
 */
export type MentorDto = {
  memberId: number;
  firstname: string;
  lastname: string;
};

/**
 * Type of the mentee (partial member)
 */
export type MenteeDto = {
  memberId: number;
  firstname: string;
  lastname: string;
};

/**
 * Type of the partial member dto used for the member list
 */
export type MemberPartialDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  generationId: number;
  mobile: string;
  jbtEmail: string;
  memberStatus: MemberStatus;
  department: DepartmentPartialDto;
  lastChange: Date;
};

/**
 * Type of a member of a department (partial member with department information)
 */
export type DepartmentMemberDto = {
  memberId: number;
  firstname: string;
  lastname: string;
  department: DepartmentPartialDto;
};

/**
 * Type of the member image
 */
export type MemberImage = {
  base64: string;
  mimeType: string;
};

/**
 * Type of the member details dto used for the member details page
 */
export type MemberDetailsDto = {
  memberId: number;
  lastname: string;
  firstname: string;
  gender: boolean;
  birthday: Date | null;
  mobile: string;
  jbtEmail: string;
  memberStatus: MemberStatus;
  generation: number | null;
  internalProject: InternalProject | null;
  traineeSince: Date | null;
  memberSince: Date | null;
  alumnusSince: Date | null;
  seniorSince: Date | null;
  activeSince: Date | null;
  passiveSince: Date | null;
  exitedSince: Date | null;
  department: DepartmentPartialDto | null;
  employer: string | null;
  street1: string;
  postalCode1: string | null;
  city1: string;
  phone1: string | null;
  email1: string | null;
  street2: string | null;
  postalCode2: string | null;
  city2: string | null;
  phone2: string | null;
  email2: string | null;
  university: string;
  courseOfStudy: string;
  studyStart: Date | null;
  studyEnd: Date | null;
  specializations: string | null;
  apprenticeship: string | null;
  commitment: string | null;
  canPL: Date | null;
  canQM: Date | null;
  lastChange: Date;
  drivingLicense: number;
  firstAidTraining: boolean;
  // Optional attributes only viewable with specific permissions (of if the user is the member)
  accountHolder?: string;
  iban?: string;
  bic?: string;
  // Additional attributes
  languages?: LanguageOfMember[];
  itSkills?: ItSkillOfMember[];
  mentees?: MenteeDto[];
  mentor?: MentorDto | null;
};

/**
 * Enum for the differents types of actions for the languages reducer function
 */
export enum languagesReducerActionType {
  /**
   * Action type for adding the value of a language in string format
   */
  addNewLanguageWithValueAsString = "ADD-NEW-LANGUAGE-WITH-VALUE-AS-STRING",

  /**
   * Action type for adding the value of a language in an object format
   */
  addNewLanguageWithValueAsObject = "ADD-NEW-LANGUAGE-WITH-VALUE-AS-OBJECT",

  /**
   * Action type for adding the niveau of a language
   */
  addNewLanguageWithNiveau = "ADD-NEW-LANGUAGE-WITH-NIVEAU",

  /**
   * Action type for adding an empty language (with empty value and niveau fields)
   */
  addEmptyLanguage = "ADD-EMPTY-LANGUAGE",

  /**
   * Action type for deleting a language
   */
  deleteLanguage = "DELETE-LANGUAGE",
}

/**
 * Type of the different actions for the languages
 */
export type languagesReducerAction =
  | {
      type: languagesReducerActionType.addNewLanguageWithValueAsObject;
      payload: {
        index: number;
        lang: Language;
      };
    }
  | {
      type: languagesReducerActionType.addNewLanguageWithValueAsString;
      payload: {
        index: number;
        value: string;
      };
    }
  | {
      type: languagesReducerActionType.addNewLanguageWithNiveau;
      payload: {
        index: number;
        niveau: string;
      };
    }
  | {
      type: languagesReducerActionType.deleteLanguage;
      payload: {
        lang: Language;
      };
    }
  | {
      type: languagesReducerActionType.addEmptyLanguage;
    };

/**
 * Enum for the differents types of actions for the it skills reducer function
 */
export enum itSkillsReducerActionType {
  /**
   * Action type for adding the value of an it skill in string format
   */
  addNewItSkillWithValueAsString = "ADD-NEW-IT-SKILL-WITH-VALUE-AS-STRING",

  /**
   * Action type for adding the value of an it skill in an object format
   */
  addNewItSkillWithValueAsObject = "ADD-NEW-IT-SKILL-WITH-VALUE-AS-OBJECT",

  /**
   * Action type for adding the niveau of an it skill
   */
  addNewItSkillWithNiveau = "ADD-NEW-IT-SKILL-WITH-LEVEL",

  /**
   * Action type for adding an empty it skill (with empty value and niveau fields)
   */
  addEmptyItSkill = "ADD-EMPTY-IT-SKILL",

  /**
   * Action type for deleting an it skill
   */
  deleteItSkill = "DELETE-IT-SKILL",
}

/**
 * Type of the different actions for the edv skills
 */
export type itSkillsReducerAction =
  | {
      type: itSkillsReducerActionType.addNewItSkillWithValueAsObject;
      payload: {
        index: number;
        itSkill: ItSkill;
      };
    }
  | {
      type: itSkillsReducerActionType.addNewItSkillWithValueAsString;
      payload: {
        index: number;
        value: string;
      };
    }
  | {
      type: itSkillsReducerActionType.addNewItSkillWithNiveau;
      payload: {
        index: number;
        level: string;
      };
    }
  | {
      type: itSkillsReducerActionType.deleteItSkill;
      payload: {
        itSkill: ItSkill;
      };
    }
  | {
      type: itSkillsReducerActionType.addEmptyItSkill;
    };

/**
 * Type of the Member for projects
 */
export type MembersField = {
  memberId: number;
  name: string;
  firstname: string;
  lastname: string;
  memberStatus: MemberStatus;
};
