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
 * Enum for the arrival of a member of a working weekend
 */
export enum Arrival {
  FrF = "FrF",
  FrM = "FrM",
  FrA = "FrA",
  SaF = "SaF",
  SaM = "SaM",
  SaA = "SaA",
  SaS = "SaS",
}

/**
 * Enum for the departure of a member of a working weekend
 */
export enum Departure {
  FrM = "FrM",
  FrA = "FrA",
  SaF = "SaF",
  SaM = "SaM",
  SaA = "SaA",
  So = "So",
}
/**
 * Type of a member of an event that is a working weekend
 */
export type EventWWMember = {
  eventId: number;
  mitgliedId: number;
  firstName: string;
  lastName: string;
  arrival: Arrival;
  departure: Departure;
  car: boolean;
  seats: number;
  isVegetarian: boolean;
  comment: string;
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
export type UpdateEventRequest = EventDto;
