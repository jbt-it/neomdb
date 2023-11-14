/**
 * Contains all members types for the frontend
 */

/**
 * Type of a trainee
 */
export type Trainee = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  generation: number;
  generationBezeichnung: string;
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

export type Generation = {
  generationID: number;
  Bezeichnung: string;
  bewerbung_start: string;
};

export type Pflichtworkshops = {
  mitgliedID: number;
  schulungID: number;
  schulungsname: string;
  feedbackAbgegeben: boolean;
};
