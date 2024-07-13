import { EventDto } from "types/EventTypes";
import { NotFoundError } from "../../types/Errors";
import { EventMapper } from "./EventMapper";
import { EventsRepository } from "./EventsRepository";

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
   * Updates the event with the given `eventId` with the given `updatedEvent`
   * @param eventId The ID of the event to update
   * @param updatedEvent The updated event
   * @throws NotFoundError if the event with the given `eventID` does not exist in the database
   */
  public updateEvent = async (eventId: number, updatedEvent: EventDto): Promise<void> => {
    const event = await EventsRepository.getEventByID(eventId);

    if (event === null) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    // Combine the organizers and members of the event
    const eventMembers = updatedEvent.members.concat(updatedEvent.organizers);

    // Update event data
    event.eventName = updatedEvent.name;
    event.location = updatedEvent.location;
    event.eventBegin = updatedEvent.startDate;
    event.eventEnd = updatedEvent.endDate;
    event.startTime = updatedEvent.startTime;
    event.endTime = updatedEvent.endTime;
    event.registrationFrom = updatedEvent.registrationStart;
    event.registrationTo = updatedEvent.registrationEnd;
    event.maximumParticipants = updatedEvent.maxParticipants;
    event.description = updatedEvent.description;
    event.ww = updatedEvent.type === "WW";
    event.network = updatedEvent.type === "Netzwerk";
    event.jbtGoes = updatedEvent.type === "JBT goes";
    event.others = updatedEvent.type === "Sonstige";
    // TODO: Handle updating organizers and members
    event.memberHasEvents = eventMembers.map((member) => ({
      member: { memberId: member.memberID },
      role: member.status === "Organisator" ? "Organisator" : "Teilnehmer",
    }));
    event.memberHasEventWws = updatedEvent.wwMembers.map((wwMember) => ({
      member: { memberId: wwMember.mitgliedID },
      arrival: wwMember.anreise,
      departure: wwMember.abreise,
      car: wwMember.auto,
      seats: wwMember.plaetze,
      vegetarian: wwMember.vegetarier,
      comment: wwMember.kommentar,
    }));
  };
}

export default EventsService;
