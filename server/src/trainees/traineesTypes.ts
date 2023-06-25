/**
 * Definition of used types within the trainees module
 */

/**
 * Type of query results of current trainee generation retrieval.
 */
export type GetCurrentTraineesQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
};

/**
 * Type of query results of current trainee generation retrieval.
 */
export type GetCurrentIPsQueryResult = {
  internesprojektID: number;
  generation: number;
  projektname: string;
  kickoff: Date;
  AngebotBeiEV: boolean;
  ZPbeiEV: boolean;
  APgehalten: boolean;
};

/**
 * Type of query results of trainee generations retrieval.
 */
export type GetAllIPsQueryResult = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  internesprojektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
  kickoff: Date;
  AngebotBeiEV: boolean;
  ZPbeiEV: boolean;
  ZPgehalten: boolean;
  APbeiEV: boolean;
  APgehalten: boolean;
  DLbeiEV: boolean;
};

/**
 * Type of query results of trainee generations retrieval.
 */
export type retrieveAllTraineesQueryResult = {
  generation: number;
  mitgliedID: number;
  vorname: string;
  nachname: string;
  internesprojekt: string;
};
