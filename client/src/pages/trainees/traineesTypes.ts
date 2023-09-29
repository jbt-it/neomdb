/**
 * Contains all trainees types for the frontend
 */

/**
 * Type of the Ip Info
 */
export type IpInfoType = {
  id: number;
  name: string;
  kuerzel: string;
  traineegeneration: string;
  kickoff: Date;
  angebotAbgegeben: boolean;
  apDatum: Date;
  apAbgegeben: boolean;
  zpDatum: Date;
  zpAbgegeben: boolean;
  dlAbgegeben: boolean;
  projektmitglieder: string;
  qualitaetsmanager: string;
};
