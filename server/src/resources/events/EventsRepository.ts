import * as mysql from "mysql2";
import { QueryError } from "types/Errors";
import { executeMultipleQueries, query } from "../../database";
import logger from "../../logger";
import { MemberField } from "types/membersTypes";
import { UpdatedEvent } from "types/EventTypes";

class EventsRepository {
  // TODO: Comment
  public updateEventByID = async (
    eventID: number,
    updatedEvent: UpdatedEvent,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      // TODO: Use correct attributes for jbt goes, sonsitges, workshop, pflichtworkshop, registration_end, max_participants
      await query(
        `UPDATE events SET eventname = ?, ort = ?, datum = ?, ende = ?, startzeit = ?, endzeit = ?, anmeldungsfrist = ?, registration_end = ?, max_participants = ?, beschreibung = ?, ww = ?, netzwerk = ? WHERE event_id = ?`,
        [
          updatedEvent.title,
          updatedEvent.location,
          updatedEvent.startDate,
          updatedEvent.endDate,
          updatedEvent.startTime,
          updatedEvent.endTime,
          updatedEvent.registrationStart,
          updatedEvent.registrationEnd,
          updatedEvent.maxParticipants,
          updatedEvent.description,
          updatedEvent.type === "WW" ? 1 : 0,
          updatedEvent.type === "Netzwerk" ? 1 : 0,
          eventID,
        ],
        connection
      );

      return null;
    } catch (error) {
      logger.error(`Caught error while updating event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while updating event with id ${eventID}: ${error}`);
    }
  };

  // TODO: Comment
  public addEventMemberByID = async (
    eventID: number,
    memberID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `INSERT INTO mitglied_has_event (event_eventID, mitglied_mitgliedID) VALUES ?`,
        [eventID, memberID],
        connection
      );
    } catch (error) {
      logger.error(`Caught error while adding member with id ${memberID} to event with id ${eventID}: ${error}`);
      throw new QueryError(
        `Caught error while adding member with id ${memberID} to event with id ${eventID}: ${error}`
      );
    }
  };

  // TODO: Comment
  public deleteEventMemberByID = async (
    eventID: number,
    memberID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `DELETE FROM mitglied_has_event WHERE event_eventID = ? AND mitglied_mitgliedID = ?`,
        [eventID, memberID],
        connection
      );
    } catch (error) {
      logger.error(`Caught error while deleting member with id ${memberID} from event with id ${eventID}: ${error}`);
      throw new QueryError(
        `Caught error while deleting member with id ${memberID} from event with id ${eventID}: ${error}`
      );
    }
  };
}

export default EventsRepository;
