// Type for project
export type Project = {
  name: string; // Name
  coreCompetence: string; // Kernkompetenz
  startDate: string; // Beginn
  endDate: string; // Ende
  bt: string; // BT
  status: string; // Status
};

// Type for customer information
export type CustomerInfo = {
  name: string; // Name
  industry: string; // Branche
  shortDescription: string; // Kurzbeschreibung
  addressAdditional: string; // Adresszusatz
  streetNumber: string; // Straße/Nr:
  postalCode: string; // PLZ
  city: string; // Ort
  website: string; // Webseite
  confidential: string; // Geheim
  lastUpdated: string; // Letzte Änderung
  updatedBy: string; // von
  projects: Project[]; // Projekte
};