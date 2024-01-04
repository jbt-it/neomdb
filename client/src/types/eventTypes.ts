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
