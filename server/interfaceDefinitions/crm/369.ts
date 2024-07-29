// Type for prospective customer information
export type ProspectiveCustomerInfo = {
  name: string; // Name
  industry: string; // Branche
  shortDescription: string; // Kurzbeschreibung
  addressAdditional: string; // Adresszusatz
  streetNumber: string; // Straße/Nr:
  postalCode: string; // PLZ
  city: string; // Ort
  website: string; // Webseite
  contactChannel: string; // Kontaktkanal
  confidential: boolean; // Geheim
  contactPerson: string; // Ansprechpartner
};