import { EventsRepository } from "../../src/resources/events/EventsRepository";
import { executeScript } from "./databaseUtils";

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
}

export default EventsTestUtils;
