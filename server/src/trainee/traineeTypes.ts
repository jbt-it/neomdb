/**
 * Definition of used types within the users module
 */

/**
 * Type of query results of members retrieval
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

export type GetTraineeMotivationResult = {
  mitgliedID: number;
  wahl_internesprojekt1_motivation: string;
  wahl_internesprojekt2_motivation: string;
  wahl_internesprojekt3_motivation: string;
};

export type GetGenerations = {
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

export type GetMentorsOfGeneration = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation_generationID: number;
};

export type GetInternalProjectOfGeneration = {
  internesprojektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
};
