import { MemberField } from "./membersTypes";

/**
 * Type of the request to update an event
 */
export type UpdateEventRequest = {
  title: string;
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
export type UpdatedEvent = {
  title: string;
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
