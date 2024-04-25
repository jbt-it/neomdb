/**
 * Contains all members types for the frontend
 */

import { Dayjs } from "dayjs";
import { MembersField } from "./membersTypes";
import { MemberPartialDto } from "./membersTypes";

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

/**
 * Type of the trainee data received from the backend
 */
export type TraineeShort = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
};

export type InternalProject = {
  internalProjectId: number;
  generation: number;
  projectName: string;
  abbreviation: string;
  kickoff: Date | null;
  offerAtEv: boolean;
  zpAtEv: boolean;
  zpHeld: Date | null;
  apAtEv: boolean;
  apHeld: Date | null;
  dlAtEv: boolean;
  members: MemberPartialDto[];
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
