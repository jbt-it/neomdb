/**
 * Contains all event types for the frontend
 */
import { Dayjs } from "dayjs";
/**
 * Type of an event participant
 */
export type EventParticipant = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  mitgliedstatus: string;
  anmeldedatum: Dayjs;
};

/**
 * Type of an event
 */
export type CommonEventType = {
  ID: number;
  name: string;
  description?: string;
  date: Dayjs;
  endDate: Dayjs;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string | null;
  registrationStart: Dayjs | null;
  registrationDeadline: Dayjs | null;
  organizers?: string[];
  participantsCount?: number | null;
  maximumParticipants?: number | null;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
};

/**
 * Type of a workshop
 */
export type Workshop = {
  schulungId: number;
  schulungsName: string;
  art: "Pflichtworkshop" | "Workshop" | "Externer Workshop";
  beschreibung: string;
};

/**
 * Type of a workshop instance
 */
export type WorkshopInstance = {
  schulungsinstanzID: number;
  schulungId: number;
  status: "Anmeldung" | "Anmeldung abgeschlossen" | "Feedback" | "Abgeschlossen";
  datum: string;
  startzeit: string;
  endzeit: string;
  ort: string;
  anzahlTeilnehmer: number;
  maximaleTeilnehmer: number;
  referenten: string;
  zielgruppe: string;
  note: number | null;
};

/**
 * Type of a workshop Feedback
 */
export type NumericFeedback = {
  feedbackfrageID: number;
  bewertung: number;
};
