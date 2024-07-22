import { Arrival, Departure, EventDto, EventMemberRole } from "../../src/types/EventTypes";
import { EventsRepository } from "../../src/resources/events/EventsRepository";
import { executeScript } from "./databaseUtils";
import { Event } from "../../src/entities/Event";

class EventsTestUtils {
  clearEventsScript = "./test/scripts/events/db_events_clear.sql";
  fillEventsScript = "./test/scripts/events/db_events_fill.sql";

  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
  }

  /**
   * Fills the events database with data that is changed during tests
   * (e.g. events)
   */
  setupEventsData = async () => {
    try {
      console.log("------------------FILL DATABASE------------------");
      await executeScript(this.fillEventsScript);
      console.log("> Database filled!");
    } catch (error) {
      console.error(`> ERROR: Failed to setup events data: ${error}`);
    }
  };

  /**
   * Clears the events database
   */
  clearEventsData = async () => {
    try {
      console.log("------------------CLEAR DATABASE------------------");
      await executeScript(this.clearEventsScript);
      console.log("> Database cleared!");
    } catch (error) {
      console.error(`> ERROR: Failed to clear events data: ${error}`);
    }
  };

  /**
   * Creates an event with the given `id` and `isWwEvent` flag.
   * This object is not persisted in the database yet!
   * @param id The ID of the event
   * @param isWwEvent Flag indicating if the event is a WW event. Default is `false`.
   * @returns The event object
   */
  createUpdateEventRequestObject = (id: number, isWwEvent = false): EventDto => {
    const organizers = [
      {
        memberID: 8111,
        nachname: "Frye",
        vorname: "Brandon-Lee",
        status: "Senior",
        name: "b.frye",
        role: EventMemberRole.Organizer,
      },
    ];
    const members = [
      {
        memberID: 8113,
        nachname: "Luft",
        vorname: "Wolfgang",
        status: "Senior",
        name: "w.luft",
        role: EventMemberRole.Participant,
      },
    ];
    const wwMembers = [
      {
        eventId: id,
        mitgliedId: 8167,
        firstName: "Wolfgang",
        lastName: "Luft",
        arrival: Arrival.FrF,
        departure: Departure.SaA,
        car: true,
        seats: 4,
        isVegetarian: true,
        comment: "Test Comment",
        status: "Trainee",
      },
    ];

    return {
      eventId: id,
      name: "Test Event",
      location: "Test Location",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-01-02"),
      startTime: "12:00",
      endTime: "12:00",
      registrationStart: new Date("2021-01-01"),
      registrationEnd: new Date("2021-01-02"),
      maxParticipants: 100,
      description: "Test Description",
      type: isWwEvent ? "WW" : "Sonstige",
      // Organizers are only set for non-WW events
      organizers: isWwEvent ? [] : organizers,
      // Members are only set for non-WW events
      members: isWwEvent ? [] : members,
      // WW members are only set for WW events
      wwMembers: isWwEvent ? wwMembers : [],
    };
  };

  /**
   * Retrieves the event with the given `id` from the database
   * @param id The ID of the event
   * @returns The event object
   */
  getEventFromDB = async (id: number): Promise<Event> => {
    return EventsRepository.getEventByID(id);
  };
}

export default EventsTestUtils;
