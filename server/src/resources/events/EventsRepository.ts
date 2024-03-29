import * as mysql from "mysql2";
import { QueryError } from "../../types/Errors";
import { Event, EventMember, EventOrganizer, EventWWMember } from "../../types/EventTypes";
import { query } from "../../database";
import logger from "../../logger";

/**
 * Repository for the events module
 */
class EventsRepository {
  /**
   * Retrieves an event by the given `eventID`
   * @param eventID The ID of the event to retrieve
   * @throws QueryError If an error occurs while retrieving the event
   * @returns The event with the given `eventID` or `null` if no event with the given `eventID` exists
   */
  public getEventByID = async (eventID: number, connection?: mysql.PoolConnection): Promise<Event> => {
    // TODO: Add anmeldungVon
    try {
      const eventQueryResult = await query(
        `SELECT
          eventname AS name,
          ort AS location,
          datum AS startDate,
          ende AS endDate,
          startzeit AS startTime,
          endzeit AS endTime,
          anmeldungVon AS registrationStart, 
          anmeldungBis AS registrationEnd,  
          maximaleTeilnehmer AS maxParticipants,
          beschreibung AS description,
          CASE
            WHEN ww = 1 THEN 'WW'
            WHEN netzwerk = 1 THEN 'Netzwerk'
            WHEN jbtgoes = 1 THEN 'JBT goes'
            ELSE 'Sonstige'
          END AS type
        FROM
          event
        WHERE 
          eventID = ?`,
        [eventID],
        connection
      );
      if (Array.isArray(eventQueryResult) && eventQueryResult.length !== 0) {
        const department = eventQueryResult[0] as Event;
        return department;
      }

      return null;
    } catch (error) {
      logger.error(`Caught error while retrieving event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while retrieving event with id ${eventID}: ${error}`);
    }
  };

  /**
   * Retrieves all members of the event with the given `eventID`
   * @param eventID The ID of the event to retrieve the members of
   * @throws QueryError If an error occurs while retrieving the members of the event
   * @returns The members of the event with the given `eventID` or `null` if no event with the given `eventID` exists
   */
  public getEventMembersByEventID = async (
    eventID: number,
    connection?: mysql.PoolConnection
  ): Promise<EventMember[]> => {
    try {
      const eventMembersQueryResult = await query(
        `SELECT
          mitglied_has_event.event_eventID AS eventID,
          mitglied.mitgliedID, mitglied.vorname,
          mitglied.nachname,
          mitgliedstatus.bezeichnung AS status
        FROM
          mitglied_has_event INNER JOIN mitglied ON mitglied_has_event.mitglied_mitgliedID = mitglied.mitgliedID
          INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
        WHERE
          mitglied_has_event.event_eventID = ? AND mitglied_has_event.rolle = 'Teilnehmer'`,
        [eventID],
        connection
      );
      if (Array.isArray(eventMembersQueryResult)) {
        const eventMembers = eventMembersQueryResult as EventMember[];
        return eventMembers;
      }

      return null;
    } catch (error) {
      logger.error(`Caught error while retrieving members of event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while retrieving members of event with id ${eventID}: ${error}`);
    }
  };

  /**
   * Retrieves all members of the event with the given `eventID` that are working weekend members
   * @param eventID The ID of the event to retrieve the working weekend members of
   * @throws QueryError If an error occurs while retrieving the working weekend members of the event
   * @returns The working weekend members of the event with the given `eventID` or `null` if no event with the given `eventID` exists
   */
  public getEventWWMembersByEventID = async (
    eventID: number,
    connection?: mysql.PoolConnection
  ): Promise<EventWWMember[]> => {
    try {
      const eventMembersQueryResult = await query(
        `SELECT
          mitglied_has_eventww.*,
          mitglied.vorname,
          mitglied.nachname,
          mitgliedstatus.bezeichnung AS status
        FROM
          mitglied_has_eventww INNER JOIN mitglied ON mitglied_has_eventww.mitglied_mitgliedID = mitglied.mitgliedID
          INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
          WHERE
          event_eventID = ?;`,
        [eventID],
        connection
      );
      if (Array.isArray(eventMembersQueryResult)) {
        const eventMembers = eventMembersQueryResult as EventWWMember[];
        return eventMembers;
      }

      return null;
    } catch (error) {
      logger.error(`Caught error while retrieving members of event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while retrieving members of event with id ${eventID}: ${error}`);
    }
  };

  /**
   * Retrieves all organizers of the event with the given `eventID`
   * @param eventID The ID of the event to retrieve the organizers of
   * @throws QueryError If an error occurs while retrieving the organizers of the event
   * @returns The organizers of the event with the given `eventID` or `null` if no event with the given `eventID` exists
   */
  public getEventOrganizersByEventID = async (
    eventID: number,
    connection?: mysql.PoolConnection
  ): Promise<EventOrganizer[]> => {
    try {
      const eventMembersQueryResult = await query(
        `SELECT
          mitglied_has_event.event_eventID AS eventID,
          mitglied.mitgliedID as memberID,
          mitglied.vorname as firstName,
          mitglied.nachname as lastName,
          mitgliedstatus.bezeichnung AS status
        FROM
          mitglied_has_event INNER JOIN mitglied ON mitglied_has_event.mitglied_mitgliedID = mitglied.mitgliedID
          INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
          WHERE
          mitglied_has_event.event_eventID = ? AND mitglied_has_event.rolle = 'Organisator'`,
        [eventID],
        connection
      );
      if (Array.isArray(eventMembersQueryResult)) {
        const eventMembers = eventMembersQueryResult as EventOrganizer[];
        return eventMembers;
      }

      return null;
    } catch (error) {
      logger.error(`Caught error while retrieving members of event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while retrieving members of event with id ${eventID}: ${error}`);
    }
  };

  /**
   * Updates the event with the given `eventID` with the given `updatedEvent`
   * @param eventID The ID of the event to update
   * @param updatedEvent The updated event
   * @throws QueryError If an error occurs while updating the event
   */
  public updateEventByID = async (
    eventID: number,
    updatedEvent: Event,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `UPDATE event
          SET
            eventname = ?,
            ort = ?,
            datum = ?,
            ende = ?,
            startzeit = ?,
            endzeit = ?,
            anmeldungVon = ?,
            anmeldungBis = ?,
            maximaleTeilnehmer = ?,
            beschreibung = ?,
            ww = ?,
            netzwerk = ?,
            jbtgoes = ?,
            sonstige = ?
          WHERE eventID = ?`,
        [
          updatedEvent.name,
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
          updatedEvent.type === "JBT goes" ? 1 : 0,
          updatedEvent.type === "Sonstige" ? 1 : 0,
          eventID,
        ],
        connection
      );
    } catch (error) {
      logger.error(`Caught error while updating event with id ${eventID}: ${error}`);
      throw new QueryError(`Caught error while updating event with id ${eventID}: ${error}`);
    }
  };

  /**
   * Adds the member with the given `memberID` as an organizer to the event with the given `eventID`
   * @param eventID The ID of the event to add the member to
   * @param memberID The ID of the member to add to the event
   * @throws QueryError If an error occurs while adding the member to the event
   */
  public addEventOrganizerByID = async (
    eventID: number,
    memberID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `INSERT INTO mitglied_has_event (event_eventID, mitglied_mitgliedID, rolle, anmeldezeitpunkt) VALUES (?, ?, ?, NOW())`,
        [eventID, memberID, "Organisator"],
        connection
      );
    } catch (error) {
      logger.error(`Caught error while adding organizer with id ${memberID} to event with id ${eventID}: ${error}`);
      throw new QueryError(
        `Caught error while adding organizer with id ${memberID} to event with id ${eventID}: ${error}`
      );
    }
  };

  /**
   * Deletes the organiser with the given `memberID` from the event with the given `eventID`
   * @param eventID The ID of the event to delete the member from
   * @param memberID The ID of the member to delete from the event
   * @throws QueryError If an error occurs while deleting the member from the event
   */
  public deleteEventOrganizerByID = async (
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
      logger.error(`Caught error while deleting organizer with id ${memberID} from event with id ${eventID}: ${error}`);
      throw new QueryError(
        `Caught error while deleting organizer with id ${memberID} from event with id ${eventID}: ${error}`
      );
    }
  };

  /**
   * Adds the member with the given `memberID` to the event with the given `eventID`
   * @param eventID The ID of the event to add the member to
   * @param memberID The ID of the member to add to the event
   * @throws QueryError If an error occurs while adding the member to the event
   */
  public addEventMemberByID = async (
    eventID: number,
    memberID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `INSERT INTO mitglied_has_event (event_eventID, mitglied_mitgliedID, rolle, anmeldezeitpunkt) VALUES (?, ?, ?, NOW())`,
        [eventID, memberID, "Teilnehmer"],
        connection
      );
    } catch (error) {
      logger.error(`Caught error while adding member with id ${memberID} to event with id ${eventID}: ${error}`);
      throw new QueryError(
        `Caught error while adding member with id ${memberID} to event with id ${eventID}: ${error}`
      );
    }
  };

  /**
   * Deletes the member with the given `memberID` from the event with the given `eventID`
   * @param eventID The ID of the event to delete the member from
   * @param memberID The ID of the member to delete from the event
   * @throws QueryError If an error occurs while deleting the member from the event
   */
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
