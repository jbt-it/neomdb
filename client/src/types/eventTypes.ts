/**
 * Contains all event types for the frontend
 */
import { Dayjs } from "dayjs";
import { MembersField } from "./membersTypes";
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
  eventID: number;
  name: string;
  description?: string;
  startDate: Dayjs;
  endDate: Dayjs;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string | null;
  registrationStart: Dayjs | null;
  registrationEnd: Dayjs | null;
  organizers?: MembersField[];
  participantsCount?: number | null;
  maxParticipants?: number | null;
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

export type WorkingWeekendParticipant = {
  event_eventID: number;
  mitglied_mitgliedID: number;
  vorname: string;
  nachname: string;
  anreise: string;
  abreise: string;
  auto: boolean;
  plaetze: number;
  vegetarier: boolean;
  kommentar: string;
  status: string;
};
