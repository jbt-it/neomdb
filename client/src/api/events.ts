import { AxiosResponse } from "axios";
import api from "../utils/api";
import { CommonEventType } from "../types/eventTypes";

//----------------------------------------
// GET ROUTES

/**
 * Get the details of a specific event
 * @param eventId - The ID of the event
 * @returns The event of type CommonEventType
 */
export const getEventDetails = async (eventId: number): Promise<AxiosResponse<CommonEventType>> => {
  return await api.get<CommonEventType>(`/events/${eventId}`);
};

/**
 * Get all participants of a specific event
 * @param eventId - The ID of the event
 * @returns An array of all participants of type EventParticipant
 */
export const getEventParticipants = async (eventId: number) => {
  return await api.get(`/events/${eventId}/members`);
};

/**
 * Get all organizers of a specific event
 * @param eventId - The ID of the event
 * @returns An array of all organizers of type EventOrganizer
 */
export const getEventOrganizers = async (eventId: number) => {
  return await api.get(`/events/${eventId}/organizers`);
};

/**
 * Get all participants of a specific working weekend
 * @param eventId - The ID of the event
 * @returns An array of all participants of type WorkingWeekendParticipant
 */
export const getWWParticipants = async (eventId: number) => {
  return await api.get(`/events/${eventId}/ww-members`);
};

//----------------------------------------
// UPDATE ROUTES
export const updateEventDetails = async (eventData: CommonEventType) => {
  const organizers = eventData.organizers?.map((organizer) => {
    return {
      memberID: organizer.mitgliedID,
      vorname: organizer.vorname,
      nachname: organizer.nachname,
      status: organizer.mitgliedstatus,
    };
  });
  const updateEventDetails = {
    event: {
      eventID: eventData.eventID,
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate.format("YYYY-MM-DD HH:MM:ss"),
      endDate: eventData.endDate.format("YYYY-MM-DD HH:MM:ss"),
      startTime: eventData.startTime ? eventData.startTime.format("HH:mm") : "",
      endTime: eventData.endTime ? eventData.endTime.format("HH:mm") : "",
      location: eventData.location,
      registrationStart: eventData.registrationStart?.format("YYYY-MM-DD HH:mm:ss"),
      registrationEnd: eventData.registrationEnd
        ? eventData.registrationEnd.format("YYYY-MM-DD HH:mm:ss")
        : eventData.startDate.format("YYYY-MM-DD HH:mm:ss"),
      maxParticipants: eventData.maxParticipants,
      type: eventData.type,
    },
    organizers: organizers,
  };
  console.log(updateEventDetails.event.endTime);
  return await api.put(`/events/${eventData.eventID}`, updateEventDetails);
};
