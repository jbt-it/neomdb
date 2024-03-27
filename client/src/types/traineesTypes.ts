/**
 * Contains all members types for the frontend
 */

import { Dayjs } from "dayjs";
import { MembersField } from "./membersTypes";

/**
 * Type of the trainee data received from the backend
 */
export type Trainee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
  mitgliedstatus: string;
};

export type TraineeProgress = Trainee & {
  generationBezeichnung: string;
  internesprojekt: number;
  AngebotBeiEV: boolean;
  APgehalten: boolean;
  DLbeiEV: boolean;
  Projektmanagement: boolean;
  Präsentationstechnik: boolean;
  AkquiseVerhandlungstechnik: boolean;
  FinanzenRecht: boolean;
  Netzwerke: boolean;
  Qualitätsmanagement: boolean;
  Compliance: boolean;
  MSPowerpoint: boolean;
  StrategieOrganisation: boolean;
  Datenschutzschulung: boolean;
  Sicherheitsschulung: boolean;
  ExcelGrundlagen: boolean;
  BDSU: boolean;
};

export type InternalProject = {
  internesProjektID: number;
  generation: number;
  projektname: string;
  kickoff: string;
  AngebotBeiEV: boolean;
  ZPBeiEV: boolean;
  APgehalten: string;
  DLBeiEV: boolean;
};

export type InternalProjectAll = InternalProject & {
  kuerzel: string;
  kickoff: Date | null;
  ZPGehalten: Date | null;
  APGehalten: Date | null;
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
export type InternalProjectDetails = {
  internesProjektID: number;
  projektname: string;
  kuerzel: string;
  generation: number;
  generationsBezeichnung: string;
  kickoff: Dayjs | null | undefined;
  AngebotBeiEV: boolean | undefined;
  ZPBeiEV: boolean | undefined;
  ZPGehalten: Dayjs | null | undefined;
  APBeiEV: boolean | undefined;
  APGehalten: Dayjs | null | undefined;
  DLBeiEV: boolean | undefined;
  projektmitglieder: MembersField[];
  qualitaetsmanager: MembersField[];
};
