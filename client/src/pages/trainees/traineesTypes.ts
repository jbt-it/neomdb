/**
 * Contains all trainees types for the frontend
 */

import { MembersField } from "../../types/membersTypes";

/**
 * Type of the Ip Info
 */
export type IpInfoType = {
  id: number;
  name: string;
  kuerzel: string;
  traineegeneration: string;
  kickoff: Date | undefined;
  angebotAbgegeben: boolean | undefined;
  apDatum: Date | undefined;
  apAbgegeben: boolean | undefined;
  zpDatum: Date | undefined;
  zpAbgegeben: boolean | undefined;
  dlAbgegeben: boolean | undefined;
  projektmitglieder: MembersField[];
  qualitaetsmanager: MembersField[];
};

export type InternalProjectType = {
  id: number;
  name: string;
  kuerzel: string;
  traineegeneration: string;
  kickoff: Date | undefined;
  angebotAbgegeben: boolean;
  apDatum: Date | undefined;
  apAbgegeben: boolean;
  zpDatum: Date | undefined;
  zpAbgegeben: boolean;
  dlAbgegeben: boolean;
  projektmitglieder: string;
  qualitaetsmanager: string;
};
