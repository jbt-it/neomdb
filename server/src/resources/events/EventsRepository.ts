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
    try {
      const eventQueryResult = await query(
        `SELECT
          eventID,
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
          mitglied.mitgliedID,
          mitglied.vorname,
          mitglied.nachname,
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
      // TODO: Add attributes!!!
      await query(
        `INSERT INTO mitglied_has_event (event_eventID, mitglied_mitgliedID, rolle, anmeldezeitpunkt) VALUES ?, ?, ?, NOW()`,
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
      // TODO: Add attributes!!!
      await query(
        `INSERT INTO mitglied_has_event (event_eventID, mitglied_mitgliedID, rolle, anmeldezeitpunkt) VALUES ?, ?, ?, NOW()`,
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

  public getMemberEventsByMemberId = async (memberId: number): Promise<Event[]> => {
    try {
      const queryResult = await query(
        `
        SELECT
          e.eventID,
          e.eventname AS name,
          e.beschreibung AS description,
          e.datum AS startDate,
          e.ende AS endDate,
          e.anmeldungVon AS registrationStart,
          e.anmeldungBis AS registrationEnd,
          e.ort AS location,
          e.startzeit AS startTime,
          e.endzeit AS endTime,
          e.ww,
          e.netzwerk,
          e.maximaleTeilnehmer AS maxParticipants,
          e.jbtgoes,
          e.sonstige
        FROM mitglied_has_event mhe
        JOIN event e ON mhe.event_eventID = e.eventID
        WHERE mhe.mitglied_mitgliedID = ?
      `,
        [memberId]
      );

      if (!Array.isArray(queryResult) || queryResult.length === 0) {
        return [];
      }

      // Transform the result into the expected Event array
      const transformedEvents = queryResult.map((row) => {
        const eventType = row.ww
          ? "WW"
          : row.netzwerk
          ? "Netzwerk"
          : row.jbtgoes
          ? "JBT goes"
          : row.sonstige
          ? "Sonstige"
          : "Workshop"; // Default to "Workshop" if none of the flags are set

        return {
          eventID: row.eventID,
          name: row.name,
          description: row.description,
          startDate: row.startDate ? row.startDate.toISOString().split("T")[0] : null,
          endDate: row.endDate ? row.endDate.toISOString().split("T")[0] : null,
          registrationStart: row.registrationStart ? row.registrationStart.toISOString() : null,
          registrationEnd: row.registrationEnd ? row.registrationEnd.toISOString() : null,
          location: row.location,
          startTime: row.startTime,
          endTime: row.endTime,
          maxParticipants: row.maxParticipants,
          type: eventType as "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop", // Cast to the union type
        };
      });

      return transformedEvents;
    } catch (error) {
      logger.error(`Caught error while retrieving member events by memberID ${memberId}: ${error}`);
      throw new QueryError(`Caught error while retrieving member events by memberID ${memberId}: ${error}`);
    }
  };

  public getAllEvents = async (): Promise<Event[]> => {
    try {
      const queryResult = await query(
        `
        SELECT
          eventID,
          eventname AS name,
          beschreibung AS description,
          datum AS startDate,
          ende AS endDate,
          anmeldungVon AS registrationStart,
          anmeldungBis AS registrationEnd,
          ort AS location,
          startzeit AS startTime,
          endzeit AS endTime,
          ww,
          netzwerk,
          maximaleTeilnehmer AS maxParticipants,
          jbtgoes,
          sonstige
        FROM events
        `,
        [] // Empty array as a placeholder for query parameters
      );

      // Check if the queryResult is an array
      if (Array.isArray(queryResult)) {
        // Transform the query results into the frontend format
        return queryResult.map(
          (row): Event => ({
            eventID: row.eventID,
            name: row.name,
            description: row.description,
            startDate: row.startDate ? row.startDate.toISOString().split("T")[0] : null,
            endDate: row.endDate ? row.endDate.toISOString().split("T")[0] : null,
            registrationStart: row.registrationStart ? row.registrationStart.toISOString() : null,
            registrationEnd: row.registrationEnd ? row.registrationEnd.toISOString() : null,
            location: row.location,
            startTime: row.startTime,
            endTime: row.endTime,
            maxParticipants: row.maxParticipants,
            type: row.ww
              ? "WW"
              : row.netzwerk
              ? "Netzwerk"
              : row.jbtgoes
              ? "JBT goes"
              : row.sonstige
              ? "Sonstige"
              : "Workshop", // Assuming "Workshop" is the default type if none of the others apply
          })
        );
      } else {
        throw new Error("Unexpected query result format");
      }
    } catch (error) {
      logger.error(`Caught error while retrieving all events: ${error}`);
      throw new QueryError(`Unable to fetch events: ${error}`);
    }
  };

  public addMemberToEvent = async (eventId: number, memberId: number): Promise<void> => {
    const exists = await this.checkMemberEventExists(eventId, memberId);
    if (exists) {
      throw new Error("Member is already registered for the event.");
    }

    await query(
      `INSERT INTO mitglied_has_event (event_eventID, mitglied_mitgliedID, rolle) VALUES (?, ?, ?)`,
      [eventId, memberId, "Teilnehmer"] // Assuming 'Teilnehmer' role, if this information is relevant
    );
  };

  // Helper method to check if the member is already registered
  private checkMemberEventExists = async (eventId: number, memberId: number): Promise<boolean> => {
    const result = await query(
      `SELECT COUNT(*) AS count FROM member_has_event WHERE event_eventID = ? AND mitglied_mitgliedID = ?`,
      [eventId, memberId]
    );
    return result[0].count > 0;
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

  // TODO: Add ww members and delete ww members?
}

export default EventsRepository;
