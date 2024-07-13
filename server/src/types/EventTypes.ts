import { MemberField } from "./memberTypes";

/**
 * Type of an organizer of an event
 */
export type EventOrganizer = MemberField;

/**
 * Type of a member of an event
 */
export type EventMember = MemberField;

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

/**
 * Type of the updated event
 */
export type EventDto = {
  eventId: number;
  name: string;
  location: string | null;
  startDate: Date;
  endDate: Date;
  startTime: string | null;
  endTime: string | null;
  registrationStart: Date | null;
  registrationEnd: Date | null;
  maxParticipants: number | null;
  description: string;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
  organizers: EventOrganizer[];
  members: EventMember[]; // is empty for non-WW events
  wwMembers: EventWWMember[]; // is empty for WW events
};

/**
 * Type of the request to update an event
 */
export type UpdateEventRequest = {
  event: EventDto;
  organizers: EventOrganizer[];
};
