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

/**
 * Type of the trainee data received from the backend
 */
export type TraineeShort = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
};

/**
 * Type of the assignment of a trainee to an internal project, mentor and department
 */
export type TraineeAssignment = {
  ipID: number | null;
  mentorID: number | null;
  departmentID: number | null;
};

/**
 * Type of the internal project of a member
 */
export type InternalProject = {
  internesProjektID: number;
  generation: number;
  generationsBezeichnung: string;
  projektname: string;
  kuerzel: string;
  kickoff: string | null;
  AngebotBeiEV: boolean;
  ZPBeiEV: boolean;
  ZPGehalten: string | null;
  APBeiEV: boolean;
  APGehalten: string | null;
  DLBeiEV: boolean;
  projektmitglieder: MembersField[] | null;
  qualitaetsmanager: MembersField[] | null;
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
  bewerbung_start: Date;
  bewerbung_ende: Date;
  wwTermin: string;
  auswahlWETermin: string;
  infoabendBesucher: number;
  tuercode: number;
  wahl_start: Date;
  wahl_ende: Date;
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

/**
 * Type of trainee choice
 */
export type TraineePreference = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  wahl_mentor: number | null;
  wahl_mentor1: number | null;
  wahl_mentor1_name: string | null;
  wahl_mentor2: number | null;
  wahl_mentor2_name: string | null;
  wahl_mentor3: number | null;
  wahl_mentor3_name: string | null;
  wahl_ressort: number | null;
  wahl_ressort1: number | null;
  wahl_ressort1_kuerzel: string | null;
  wahl_ressort2: number | null;
  wahl_ressort2_kuerzel: string | null;
  wahl_ressort3: number | null;
  wahl_ressort3_kuerzel: string | null;
  wahl_internesprojekt: number | null;
  wahl_internesprojekt1: number | null;
  wahl_internesprojekt1_kuerzel: string | null;
  wahl_internesprojekt2: number | null;
  wahl_internesprojekt2_kuerzel: string | null;
  wahl_internesprojekt3: number | null;
  wahl_internesprojekt3_kuerzel: string | null;
  wahl_internesprojekt1_motivation: string | null;
  wahl_internesprojekt2_motivation: string | null;
  wahl_internesprojekt3_motivation: string | null;
};
