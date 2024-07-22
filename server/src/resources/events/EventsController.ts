import { Body, Controller, Get, Path, Put, Request, Route, Security, Tags } from "tsoa";
import { JWTPayload } from "../../types/authTypes";
import { UnauthorizedError } from "../../types/Errors";
import { EventDto } from "../../types/EventTypes";
import { doesPermissionsInclude } from "../../utils/authUtils";
import EventsService from "./EventsService";

/**
 * Controller for the members module
 * Provides routes for retrieving, creating and updating members, departments and permissions
 */
@Tags("Events")
@Route("events")
export class EventsController extends Controller {
  private eventsService = new EventsService();

  /**
   * Retrieves the event with the given `eventID`
   * @summary Retrieves the event
   * @param eventID The ID of the event to retrieve
   */
  @Get("{eventID}")
  @Security("jwt")
  public async getEvent(@Path() eventID: number): Promise<EventDto> {
    return this.eventsService.getEvent(eventID);
  }

  /**
   * Updates the event with the given `eventID` with the given `updatedEvent`
   * @summary Updates the event
   * @param eventID The ID of the event to update
   * @param updatedEvent The updated event
   * @example requestBody {
   *    "eventId": 7,
   *    "name": "Test Event",
   *    "location": "Test Location",
   *    "startDate": "2022-01-01",
   *    "endDate": "2022-01-02",
   *    "startTime": "12:00",
   *    "endTime": "12:00",
   *    "registrationStart": "2021-01-01",
   *    "registrationEnd": "2021-01-02",
   *    "maxParticipants": 100,
   *    "description": "Test Description",
   *    "type": "Sonstige",
   *    "organizers": [
   *      {
   *        "memberID": 8167,
   *        "vorname": "Wolfgang",
   *        "nachname": "Luft",
   *        "status": "aktiv",
   *        "name": "w.luft",
   *       "role": "Organisator"
   *      }
   *    ],
   *   "members": [],
   *   "wwMembers": []
   * }
   */
  @Put("{eventID}")
  @Security("jwt")
  public async updateEvent(
    @Path() eventID: number,
    @Body() requestBody: EventDto,
    @Request() request: any
  ): Promise<void> {
    const updatedEvent = requestBody;
    const currentOrganizers = await this.eventsService.getEventOrganizers(eventID);

    const user = request.user as JWTPayload;

    // Check if the user has the permission to update the event or is part of the organizers
    if (
      !doesPermissionsInclude(user.permissions, [8]) &&
      !currentOrganizers.some((organizer) => organizer.memberId === user.memberId)
    ) {
      throw new UnauthorizedError("You are not allowed to update this event");
    }

    await this.eventsService.updateEvent(eventID, updatedEvent);
  }
}
