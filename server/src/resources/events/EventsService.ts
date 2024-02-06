import EventsRepository from "./EventsRepository";

class EventService {
  eventRepository = new EventsRepository();

  updateEvent = async (eventID: number, updatedEvent: any): Promise<void> => {
    // TODO: Add validation

    return this.eventRepository.updateEventByID(eventID, updatedEvent);
  };
}
