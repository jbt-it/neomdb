/**
 * Type of the internal project of a member
 */
export type InternalProject = {
  internesProjektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
  kickoff: string;
  AngebotBeiEV: boolean;
  ZPBeiEV: boolean;
  ZPGehalten: boolean;
  APBeiEV: boolean;
  APGehalten: boolean;
  DLBeiEV: boolean;
};

/**
 * Type of the generation
 */
export type Generation = {
  generationID: number;
  bezeichnung: string;
  bewerbung_start: Date;
  bewerbung_ende: Date;
  wwTermin: string;
  auswahlWETermin: string;
  infoabendBesucher: number;
  tuercode: number;
  wahl_start: Date;
  wahl_ende: Date;
};

/**
 * Type of the trainee choice of a member
 */
export type TraineeChoice = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  wahl_mentor: number;
  wahl_mentor1: number;
  wahl_mentor2: number;
  wahl_mentor3: number;
  wahl_internesprojekt: number;
  wahl_internesprojekt1: number;
  wahl_internesprojekt2: number;
  wahl_internesprojekt3: number;
  wahl_ressort: number;
  wahl_ressort1: number;
  wahl_ressort2: number;
  wahl_ressort3: number;
};

/**
 * Type of the jbt mail of a member
 */
export type JBTMail = {
  email: string;
};

/**
 * Type of the trainee motivation written by a trainee to explain the choice of an internal project
 */
export type TraineeMotivation = {
  mitgliedID: number;
  wahl_internesprojekt1_motivation: string;
  wahl_internesprojekt2_motivation: string;
  wahl_internesprojekt3_motivation: string;
};

/**
 * Type of a trainee (partial member)
 */
export type Trainee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
};
