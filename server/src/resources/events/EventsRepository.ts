import * as mysql from "mysql2";
import { QueryError } from "types/Errors";
import { query } from "../../database";
import logger from "../../logger";

class EventsRepository {
  updateEventByID = async (
    eventID: number,
    updatedEvent: any, // TODO: Add type
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      // TODO: Add attributes
      // SELECT eventname, ort, datum, ende, startzeit, endzeit, anmeldungsfrist FROM event;
      await query(`UPDATE events SET ? WHERE id = ?`, [updatedEvent, eventID], connection);

      return null;
    } catch (error) {
      logger.error(`Caught error while updating event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while updating event with id ${eventID}: ${error}`);
    }
  };
}

export default EventsRepository;
