import * as mysql from "mysql2";
import { QueryError } from "types/Errors";
import { query } from "../../database";
import logger from "../../logger";

class EventsRepository {
  private updateEvent = async (
    eventID: number,
    updatedEvent: any, // TODO: Add type
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      // TODO: Add attributes
      await query(`UPDATE events SET ? WHERE id = ?`, [updatedEvent, eventID], connection);

      return null;
    } catch (error) {
      logger.error(`Caught error while updating event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while updating event with id ${eventID}: ${error}`);
    }
  };
}

export default EventsRepository;
