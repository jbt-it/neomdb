import { AppDataSource } from "../../datasource";
import { Event } from "../../entities/Event";

export const EventsRepository = AppDataSource.getRepository(Event).extend({
  /**
   * Retrieves an event by the given `eventID`
   * @param eventID The ID of the event to retrieve
   * @returns The event with the given `eventID` or `null` if no event with the given `eventID` exists
   */
  getEventByID(eventID: number): Promise<Event | null> {
    return this.findOne({
      where: { eventID },
      relations: ["memberHasEvents", "memberHasEventWws", "memberHasEvents.member", "memberHasEventWws.member"],
    });
  },
  saveEvent(event: Event): Promise<Event> {
    return this.save(event);
  },
  addEventOrganizerByID(eventID: number, memberID: number): Promise<void> {
    return this.createQueryBuilder("event").relation("org.").of(eventID).add(memberID);
  },
  deleteEventOrganizerByID(eventID: number, memberID: number): Promise<void> {
    return this.createQueryBuilder("event").relation("organizers").of(eventID).remove(memberID);
  },
  addEventMemberByID(eventID: number, memberID: number): Promise<void> {
    return this.createQueryBuilder("event").relation("members").of(eventID).add(memberID);
  },
});
