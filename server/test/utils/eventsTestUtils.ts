import EventsRepository from "../../src/resources/events/EventsRepository";
import { executeScript } from "./databaseUtils";

class EventsTestUtils {
  clearEventsScript = "./test/scripts/events/db_events_clear.sql";
  fillEventsScript = "./test/scripts/events/db_events_fill.sql";

  traineesRepository: EventsRepository = null;
  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
    this.traineesRepository = new EventsRepository();
  }

  /**
   * Fills the trainee database with data that is changed during tests
   * (e.g. trainees)
   */
  setupEventsData = async () => {
    try {
      console.log("------------------FILL DATABASE------------------");
      await executeScript(this.fillEventsScript);
      console.log("> Database filled!");
    } catch (error) {
      console.error(`> ERROR: Failed to setup trainee data: ${error}`);
    }
  };

  /**
   * Clears the trainee database
   */
  clearEventsData = async () => {
    try {
      console.log("------------------CLEAR DATABASE------------------");
      await executeScript(this.clearEventsScript);
      console.log("> Database cleared!");
    } catch (error) {
      console.error(`> ERROR: Failed to clear trainee data: ${error}`);
    }
  };
}

export default EventsTestUtils;
