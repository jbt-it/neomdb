import { UpdatedEvent } from "types/EventTypes";
import EventsRepository from "./EventsRepository";
import { executeInTransaction } from "database";

class EventService {
  eventRepository = new EventsRepository();

  updateEvent = async (eventID: number, updatedEvent: UpdatedEvent, eventMemberIDs: number[]): Promise<void> => {
    // TODO: Get the current event data

    // TODO: Get the current members of the event

    // TODO: Add validation

    const tasks = [];
    tasks.push({
      func: this.eventRepository.updateEventByID,
      args: [eventID, updatedEvent],
    });
    // TODO: Filter which members to add and which to delete from the event

    await executeInTransaction(tasks);
  };
}

export default EventService;
