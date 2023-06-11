/**
 * Definition of used types within the tainee module
 */

/**
 * Type of query results of trainee choices
 */
export type GetTraineeChoiceResult = {
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
 * Type of query results of trainee motivation for internal projects
 */
export type GetTraineeMotivationResult = {
  mitgliedID: number;
  wahl_internesprojekt1_motivation: string;
  wahl_internesprojekt2_motivation: string;
  wahl_internesprojekt3_motivation: string;
};

/**
 * Type of query results of retrieving general information about generations
 */
export type GetGenerationsResult = {
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
 * Type of query results of retrieving mentors for given generation
 */
export type GetMentorsOfGenerationResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation_generationID: number;
};

/**
 * Type of query results of retrieving general information about internal projects for given generation
 */
export type GetInternalProjectOfGenerationResult = {
  internesprojektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
};
