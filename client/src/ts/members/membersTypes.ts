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
    handy: string;
    jbt_email: string;
    ressort: string;
    mitgliedstatus: string;
    lastchange: string;
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
    generation: string | null;
    internesprojekt: string | null;
    mentor: Mentor | null;
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
    plz1: number;
    ort1: string;
    tel1: number;
    email1: string;
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
    kontoinhaber: string;
    iban: string;
    bic: string;
    engagement: string | null;
    canPL: string | null;
    canQM: string | null;
    lastchange: string;
    fuehrerschein: boolean;
    ersthelferausbildung: boolean;
    sprachen: LanguageOfMember[];
    mentees: Mentee[];
    edvkenntnisse: EDVSkillOfMember[];
};