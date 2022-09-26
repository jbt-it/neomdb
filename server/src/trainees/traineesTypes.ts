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
  AngebotBeiEV: Date, 
  ZPbeiEV: Date;
  APgehalten: Date;  
};


  
/**
 * Type of query results of trainee generations retrieval.
 */
 export type GetTraineeGenerationsQueryResult = {
    generationID: number;
    bezeichnung: string;
    mitgliedID: number;
    vorname: string;
    nachname: string;
    generation: number;
    ressort: string;

    //...
  };