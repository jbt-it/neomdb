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
  description: string;
  date: Dayjs | null;
  endDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string;
  registrationStart: Dayjs | null;
  registrationDeadline: Dayjs | null;
  participantsCount?: number | null;
  maximumParticipants?: number | null;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige";
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

export type Bewertung = {
  schulungsfeedback_has_schulungsfeedbackID: number;
  schulungsfeedback_datum: string;
  note: number;
};

/**
 * Type of a workshop feedback question
 */
export type Frage = {
  feedbackfrage_feedbackfrageID: number;
  frageText: string;
  durchschnitt: number;
  bewertungen: Bewertung[];
};

export type ReferentenBewertung = {
  mitglied_mitgliedID: number;
  vorname: string;
  nachname: string;
  durchschnitt: number;
  bewertungen: Bewertung[];
};

export type TextFeedback = {
  name: string;
  frageText: string;
  kommentare: string[];
};

/**
 * Type of a workshop Feedback
 */
export type WorkshopInstanceFeedback = {
  schulung_schulungID: number;
  status: string;
  teilnehmerAnzahl: number;
  gesamt: number;
  fragen: Frage[];
  referenten: ReferentenBewertung[];
  textFeedback: TextFeedback[];
  mitgliederOhneFeedback: {
    mitgliedID: number;
    vorname: string;
    nachname: string;
  }[];
};
