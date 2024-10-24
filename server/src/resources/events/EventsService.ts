import { EventDto } from "types/EventTypes";
import { NotFoundError } from "../../types/Errors";
import { EventMapper } from "./EventMapper";
import { EventsRepository } from "./EventsRepository";
import { MemberHasEvent } from "../../entities/MemberHasEvent";
import { MemberHasEventWw } from "../../entities/MemberHasEventWw";
import { Member } from "../../entities/Member";

/**
 * Provides methods for retrieving, creating and updating events and its members/organizers
 */
class EventsService {
  /**
   * Returns the event with the given `eventId`
   * @param eventId The ID of the event to return
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public getEvent = async (eventId: number): Promise<EventDto> => {
    const event = await EventsRepository.getEventByID(eventId);
    if (event === null) {
      throw new NotFoundError(`Event with ID ${eventId} not found`);
    }

    return EventMapper.eventToEventDto(event);
  };

  /**
   * Returns the members of the event with the given `eventId`
   * @param eventId The ID of the event to return the members of
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public getEventOrganizers = async (eventId: number): Promise<Member[]> => {
    const event = await EventsRepository.getEventByID(eventId);
    if (event === null) {
      throw new NotFoundError(`Event with ID ${eventId} not found`);
    }

    const organizers = event.memberHasEvents
      .filter((memberHasEvent) => memberHasEvent.role === "Organisator")
      .map((organizerHasEvent) => organizerHasEvent.member);

    return organizers;
  };

  /**
   * Updates the event with the given `eventId` with the given `updatedEvent`
   * @param eventId The ID of the event to update
   * @param updatedEventDto The updated event
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public updateEvent = async (eventId: number, updatedEventDto: EventDto): Promise<void> => {
    const event = await EventsRepository.getEventByID(eventId);

    if (event === null) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    // Combine the organizers and members of the event
    const eventMembers = updatedEventDto.members.concat(updatedEventDto.organizers);
    const mappedEvent = EventMapper.eventDtoToEvent(updatedEventDto, eventMembers);
    Object.assign(event, mappedEvent);
    // TODO: Check Object.assign and Repostory.merge
    await EventsRepository.upadteEvent(event);
  };
}

export default EventsService;
