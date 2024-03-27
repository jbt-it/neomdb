/**
 * Contains all members types for the frontend
 */

/**
 * Type of the language of a member
 */
export type LanguageOfMember = {
  wert: string;
  niveau: string;
};

/**
 * Type of the edv skill of a member
 */
export type EDVSkillOfMember = {
  wert: string;
  niveau: string;
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
  wert: string;
};

/**
 * Type of an edv skill
 */
export type EDVSkill = {
  /*
   * Additional attribute which is needed for the Automplece Component
   * It is only used for filtering
   */
  inputValue?: string;
  wert: string;
};

/**
 * Type of a department
 */
export type Department = {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
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
 * Type of the directors
 */
export type Director = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  evpostenID: number;
  ressortID: number;
  geschlecht: string;
  bezeichnung_weiblich: string;
  bezeichnung_maennlich: string;
  kuerzel: string;
  von: string;
  bis: string;
};

/**
 * Type of a mentor
 */
export type Mentor = {
  mitgliedID: number | null;
  vorname: string;
  nachname: string;
};

/**
 * Type of a mentee
 */
export type Mentee = {
  mitgliedID: number | null;
  vorname: string;
  nachname: string;
};

/**
 * Type of the member
 */
export type Member = {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  generation: number;
  handy: string;
  jbt_email: string;
  ressort: string;
  mitgliedstatus: string;
  lastchange: string;
};

/**
 * Type of the department member
 */
export type DepartmentMember = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  ressort: number;
  bezeichnung: string;
};

/**
 * Type of the member image
 */
export type MemberImage = {
  base64: string;
  mimeType: string;
};

/**
 * Type of the member details
 */
export type MemberDetails = {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string | null;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: number | null;
  internesprojekt: number | null;
  trainee_seit: string | null;
  mitglied_seit: string | null;
  alumnus_seit: string | null;
  senior_seit: string | null;
  aktiv_seit: string | null;
  passiv_seit: string | null;
  ausgetreten_seit: string | null;
  ressort: string | null;
  arbeitgeber: string | null;
  strasse1: string;
  plz1: number | null;
  ort1: string;
  tel1: number;
  email1: string | null;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: number | null;
  email2: string | null;
  hochschule: string;
  studiengang: string;
  studienbeginn: string | null;
  studienende: string | null;
  vertiefungen: string | null;
  ausbildung: string | null;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
  kontoinhaber?: string;
  iban?: string;
  bic?: string;
  sprachen?: LanguageOfMember[];
  mentees?: Mentee[];
  edvkenntnisse?: EDVSkillOfMember[];
  mentor?: Mentor | null;
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
 * Enum for the differents types of actions for the edv skills reducer function
 */
export enum edvSkillsReducerActionType {
  /**
   * Action type for adding the value of an edv skill in string format
   */
  addNewEdvSkillWithValueAsString = "ADD-NEW-EDV-SKILL-WITH-VALUE-AS-STRING",

  /**
   * Action type for adding the value of an edv skill in an object format
   */
  addNewEdvSkillWithValueAsObject = "ADD-NEW-EDV-SKILL-WITH-VALUE-AS-OBJECT",

  /**
   * Action type for adding the niveau of an edv skill
   */
  addNewEdvSkillWithNiveau = "ADD-NEW-EDV-SKILL-WITH-NIVEAU",

  /**
   * Action type for adding an empty edv skill (with empty value and niveau fields)
   */
  addEmptyEdvSkill = "ADD-EMPTY-EDV-SKILL",

  /**
   * Action type for deleting an edv skill
   */
  deleteEdvSkill = "DELETE-EDV-SKILL",
}

/**
 * Type of the different actions for the edv skills
 */
export type edvSkillsReducerAction =
  | {
      type: edvSkillsReducerActionType.addNewEdvSkillWithValueAsObject;
      payload: {
        index: number;
        edvSkill: EDVSkill;
      };
    }
  | {
      type: edvSkillsReducerActionType.addNewEdvSkillWithValueAsString;
      payload: {
        index: number;
        value: string;
      };
    }
  | {
      type: edvSkillsReducerActionType.addNewEdvSkillWithNiveau;
      payload: {
        index: number;
        niveau: string;
      };
    }
  | {
      type: edvSkillsReducerActionType.deleteEdvSkill;
      payload: {
        edvSkill: EDVSkill;
      };
    }
  | {
      type: edvSkillsReducerActionType.addEmptyEdvSkill;
    };

export type MemberStatus = "Trainee" | "aktives Mitglied" | "Senior" | "Alumnus" | "passives Mitglied" | "Ausgetretene";

/**
 * Type of the Member for projects
 */
export type MembersField = {
  mitgliedID: number;
  name: string;
  vorname: string;
  nachname: string;
  mitgliedstatus: MemberStatus;
};

/**
 * Type of permissions
 */
export type Permissions = {
  bezeichnung: string;
  beschreibung: string;
  berechtigungID: number;
};

/**
 * Type of permission-assignments
 */
export type PermissionAssignment = {
  name: string;
  permission: number;
  canDelegate: number;
  memberID: number;
};
