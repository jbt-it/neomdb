/**
 * Definition of used types within the trainees module
 */

// TODO: Add trainees types here (They should be the same as in the frontend
// because they are used for the return type of the database query and are sent like
// this to the client)

/**
 * Type of query results of internal project retrieval
 */
export type GetInternalProjectType = {
  internesProjektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
  kickoff: string;
  AngebotBeiEV: boolean;
  ZPBeiEV: boolean;
  ZPGehalten: boolean;
  APBeiEV: boolean;
  APGehlaten: boolean;
  DLBeiEV: boolean;
};

export type GetIPMailType = {
  jbt_email: string;
};
