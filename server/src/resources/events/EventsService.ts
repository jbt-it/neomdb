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

  public registerMemberForEvent = async (eventId: number, memberId: number): Promise<void> => {
    // Call the method in the repository to add the member to the event
    await this.eventRepository.addMemberToEvent(eventId, memberId);
  };

  // EventsService.ts
  public getMemberEvents = async (memberId: number): Promise<Event[]> => {
    return this.eventRepository.getMemberEventsByMemberId(memberId);
  };

  /**
   * Returns a list of all events
   * @throws NotFoundError if no events exist in the database
   */
  public getAllEvents = async (): Promise<Event[]> => {
    const events = await this.eventRepository.getAllEvents();

    if (events.length === 0) {
      throw new NotFoundError("No events found");
    }

    // Hier wird davon ausgegangen, dass die Methode `getAllEvents` des Repositories die Events im richtigen Format zurückgibt
    return events;
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
   * @param eventMemberIDs The IDs of the members of the event
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public updateEvent = async (eventID: number, updatedEvent: Event, eventMemberIDs: number[]): Promise<void> => {
    const currentEvent = await this.eventRepository.getEventByID(eventID);

    if (!currentEvent) {
      throw new Error(`Event with ID ${eventID} not found`);
    }

    const currentEventMembers = await this.eventRepository.getEventMembersByEventID(eventID);

    // Create a list of members to add and to delete
    const membersToAdd = eventMemberIDs.filter((id) => !currentEventMembers.some((member) => member.memberID === id));
    const membersToDelete = currentEventMembers.filter(
      (member) => !eventMemberIDs.some((id) => member.memberID === id)
    );

    const tasks = [];
    tasks.push({
      func: this.eventRepository.updateEventByID,
      args: [eventID, updatedEvent],
    });
    membersToAdd.forEach((memberID) => {
      tasks.push({
        func: this.eventRepository.addEventMemberByID,
        args: [eventID, memberID],
      });
    });
    membersToDelete.forEach((member) => {
      tasks.push({
        func: this.eventRepository.deleteEventMemberByID,
        args: [eventID, member.memberID],
      });
    });

    await executeInTransaction(tasks);
  };
}

export default EventsService;
