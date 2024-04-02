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
  const updateEventDetails = {
    event: {
      ID: eventData.ID,
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate.toJSON(),
      endDate: eventData.endDate.toJSON(),
      startTime: eventData.startTime ? eventData.startTime.hour() + ":" + eventData.startTime.minute() : "",
      endTime: eventData.endTime
        ? eventData.endTime.hour().toString() + ":" + eventData.endTime.minute().toString()
        : "",
      location: eventData.location,
      registrationStart: eventData.registrationStart?.toJSON(),
      registrationEnd: eventData.registrationEnd?.toJSON(),
      organizers: eventData.organizers,
      maxParticipants: eventData.maxParticipants,
      type: eventData.type,
    },
  };
  console.log("updateEventDetails: ", updateEventDetails);
  return await api.put(`/events/${eventData.ID}`, updateEventDetails);
};
