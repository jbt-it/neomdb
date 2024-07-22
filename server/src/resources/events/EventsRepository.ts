import { AppDataSource } from "../../datasource";
import { Event } from "../../entities/Event";

export const EventsRepository = AppDataSource.getRepository(Event).extend({
  /**
   * Retrieves an event by the given `eventID`
   * @param eventID The ID of the event to retrieve
   * @returns The event with the given `eventID` or `null` if no event with the given `eventID` exists
   */
  getEventByID(eventId: number): Promise<Event | null> {
    return this.findOne({
      where: { eventId: eventId },
      relations: ["memberHasEvents", "memberHasEventWws", "memberHasEvents.member", "memberHasEventWws.member"],
    });
  },

  /**
   * Saves the given `event` to the database
   * @param event The event to save
   * @returns The saved event
   */
  upadteEvent(event: Event): Promise<Event> {
    return this.save(event);
  },
});
