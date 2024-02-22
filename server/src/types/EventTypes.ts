import { MemberField } from "./membersTypes";

/**
 * Type of the request to update an event
 */
export type UpdateEventRequest = {
  name: string;
  location: string | null;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  maxParticipants: number | null;
  organizers: MemberField[];
  description: string;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
};

/**
 * Type of the updated event
 */
export type Event = {
  eventID: number;
  name: string;
  location: string | null;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  maxParticipants: number | null;
  description: string;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
};

/**
 * Type of a member of an event
 */
export type EventMember = MemberField;

/**
 * Type of an organizer of an event
 */
export type EventOrganizer = MemberField;

/**
 * Type of a member of an event that is a working weekend
 */
export type EventWWMember = {
  eventID: number;
  mitgliedID: number;
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
