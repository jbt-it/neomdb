/**
 * Contains all members types for the frontend
 */

import { Dayjs } from "dayjs";
import { MembersField } from "./membersTypes";

/**
 * Type of a trainee
 */
export type Trainee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
  generationBezeichnung: string;
  internesprojekt: number;
  AngebotBeiEV: boolean;
  APgehalten: boolean;
  DLbeiEV: boolean;
  Projektmanagement: boolean;
  RhetorikPräsenationstechnik: boolean;
  AkquiseVerhandlungstechnik: boolean;
  FinanzenRecht: boolean;
  Netzwerke: boolean;
  Qualitätsmanagement: boolean;
  MSPowerpoint: boolean;
  StrategieOrganisation: boolean;
  Datenschutzschulung: boolean;
  Sicherheitsschulung: boolean;
  ExcelGrundlagen: boolean;
};

export type InternalProject = {
  internesprojektID: number;
  generation: number;
  projektname: string;
  kickoff: string;
  AngebotBeiEV: boolean;
  ZPgehalten: boolean;
  APgehalten: string;
  DLbeiEV: boolean;
};

export type InternalProjectAll = {
  internesProjektID: number;
  generation: number;
  projektname: string;
  kuerzel: string;
  kickoff: Date | null;
  AngebotBeiEV: number;
  ZPBeiEV: number;
  ZPGehalten: Date | null;
  APBeiEV: number;
  APGehalten: Date | null;
  DLBeiEV: number;
};

export type Generation = {
  generationID: number;
  bezeichnung: string;
  bewerbung_start: string;
};

export type Pflichtworkshops = {
  mitgliedID: number;
  schulungID: number;
  schulungsname: string;
  feedbackAbgegeben: boolean;
};

/**
 * Type of the Ip Info
 */
export type IpInfoType = {
  id: number;
  name: string;
  kuerzel: string;
  traineegeneration: string;
  kickoff: Dayjs | null | undefined;
  angebotAbgegeben: boolean | undefined;
  apDatum: Dayjs | null | undefined;
  apAbgegeben: boolean | undefined;
  zpDatum: Dayjs | null | undefined;
  zpAbgegeben: boolean | undefined;
  dlAbgegeben: boolean | undefined;
  projektmitglieder: MembersField[];
  qualitaetsmanager: MembersField[];
};
