import { Event, EventMember, EventOrganizer, EventWWMember } from "types/EventTypes";
import EventsRepository from "./EventsRepository";
import { executeInTransaction } from "../../database";
import { NotFoundError } from "../../types/Errors";

/**
 * Provides methods for retrieving, creating and updating events and its members/organizers
 */
class EventsService {
  eventRepository = new EventsRepository();

  /**
   * Returns the event with the given `eventID`
   * @param eventID The ID of the event to return
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public getEvent = async (eventID: number): Promise<Event> => {
    const event = await this.eventRepository.getEventByID(eventID);

    if (!event) {
      throw new NotFoundError(`Event with ID ${eventID} not found`);
    }

    return event;
  };

  /**
   * Returns the members of the event with the given `eventID`
   * @param eventID The ID of the event to return the members of
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public getEventMembers = async (eventID: number): Promise<EventMember[]> => {
    const event = await this.eventRepository.getEventByID(eventID);

    if (!event) {
      throw new NotFoundError(`Event with ID ${eventID} not found`);
    }

    return this.eventRepository.getEventMembersByEventID(eventID);
  };

  /**
   * Returns the members of the working weekend event with the given `eventID`
   * @param eventID The ID of the event to return the members of
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public getEventWWMembers = async (eventID: number): Promise<EventWWMember[]> => {
    const event = await this.eventRepository.getEventByID(eventID);

    if (!event) {
      throw new NotFoundError(`Event with ID ${eventID} not found`);
    }

    return this.eventRepository.getEventWWMembersByEventID(eventID);
  };

  /**
   * Returns the organizers of the event with the given `eventID`
   * @param eventID The ID of the event to return the organizers of
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public getEventOrganizers = async (eventID: number): Promise<EventOrganizer[]> => {
    const event = await this.eventRepository.getEventByID(eventID);

    if (!event) {
      throw new NotFoundError(`Event with ID ${eventID} not found`);
    }

    return this.eventRepository.getEventOrganizersByEventID(eventID);
  };

  /**
   * Updates the event with the given `eventID` with the given `updatedEvent`
   * @param eventID The ID of the event to update
   * @param updatedEvent The updated event
   * @param eventOrganizerIDs The IDs of the organizers of the event
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public updateEvent = async (eventID: number, updatedEvent: Event, eventOrganizerIDs: number[]): Promise<void> => {
    const currentEvent = await this.eventRepository.getEventByID(eventID);

    if (!currentEvent) {
      throw new Error(`Event with ID ${eventID} not found`);
    }

    const currentEventOrganizers = await this.eventRepository.getEventOrganizersByEventID(eventID);

    // Create a list of members to add and to delete
    const organizersToAdd = eventOrganizerIDs.filter(
      (id) => !currentEventOrganizers.some((organizer) => organizer.memberID === id)
    );
    const organizersToDelete = currentEventOrganizers.filter(
      (organizer) => !eventOrganizerIDs.some((id) => organizer.memberID === id)
    );

    const tasks = [];
    tasks.push({
      func: this.eventRepository.updateEventByID,
      args: [eventID, updatedEvent],
    });
    organizersToAdd.forEach((memberID) => {
      tasks.push({
        func: this.eventRepository.addEventOrganizerByID,
        args: [eventID, memberID],
      });
    });
    organizersToDelete.forEach((member) => {
      tasks.push({
        func: this.eventRepository.deleteEventOrganizerByID,
        args: [eventID, member.memberID],
      });
    });

    await executeInTransaction(tasks);
  };
}

export default EventsService;
