import { Body, Controller, Get, Post, Patch, Path, Request, Route, Security, Tags } from "tsoa";
import { Event, EventMember, EventWWMember, UpdateEventRequest } from "../../types/EventTypes";
import EventsService from "./EventsService";
import { JWTPayload } from "../../types/authTypes";
import { UnauthorizedError } from "../../types/Errors";
import { doesPermissionsInclude } from "../../utils/authUtils";

/**
 * Controller for the members module
 * Provides routes for retrieving, creating and updating members, departments and permissions
 */
@Tags("Events")
@Route("events")
export class EventsController extends Controller {
  private eventsService = new EventsService();

  @Get("")
  @Security("jwt")
  public async getEvents(): Promise<Event[]> {
    return this.eventsService.getAllEvents();
  }

  /**
   * Retrieves the event with the given `eventID`
   * @summary Retrieves the event
   * @param eventID The ID of the event to retrieve
   */
  @Get("{eventID}")
  @Security("jwt")
  public async getEvent(@Path() eventID: number): Promise<Event> {
    return this.eventsService.getEvent(eventID);
  }

  // EventsController.ts
  @Get("members/{memberId}/events")
  @Security("jwt")
  public async getMemberEvents(@Path() memberId: number): Promise<Event[]> {
    return this.eventsService.getMemberEvents(memberId);
  }

  /**
   * Retrieves the members of the event with the given `eventID`
   * @summary Retrieves the members of the event
   * @param eventID The ID of the event to retrieve the members of
   */
  @Get("{eventID}/members")
  @Security("jwt")
  public async getEventMembers(@Path() eventID: number): Promise<EventMember[]> {
    return this.eventsService.getEventMembers(eventID);
  }

  /**
   * Retrieves the members of the working weekend event with the given `eventID`
   * @summary Retrieves the members of the working weekend event
   * @param eventID The ID of the event to retrieve the members of
   */
  @Get("{eventID}/ww-members")
  @Security("jwt")
  public async getEventWWMembers(@Path() eventID: number): Promise<EventWWMember[]> {
    return this.eventsService.getEventWWMembers(eventID);
  }

  /**
   * Retrieves the organizers of the event with the given `eventID`
   * @summary Retrieves the organizers of the event
   * @param eventID The ID of the event to retrieve the organizers of
   */
  @Get("{eventID}/organizers")
  @Security("jwt")
  public async getEventOrganizers(@Path() eventID: number): Promise<EventMember[]> {
    return this.eventsService.getEventOrganizers(eventID);
  }

  /**
   * Updates the event with the given `eventID` with the given `updatedEvent`
   * @summary Updates the event
   * @param eventID The ID of the event to update
   * @param updatedEvent The updated event
   * @example requestBody {
   *  "name": "Test Event",
   *  "location": "Test Location",
   *  "startDate": "2022-01-01",
   *  "endDate": "2022-01-02",
   *  "startTime": "12:00",
   *  "endTime": "12:00",
   *  "registrationStart": "2021-01-01",
   *  "registrationEnd": "2021-01-02",
   *  "maxParticipants": 100,
   *  "organizers": [
   *   {
   *    "memberID": 8167,
   *    "vorname": "Wolfgang",
   *    "nachname": "Luft",
   *    "status": "aktiv",
   *    "name": "w.luft"
   *   }
   *  ],
   *  "description": "Test Description",
   *  "type": "WW"
   * }
   */
  @Patch("{eventID}")
  @Security("jwt")
  public async updateEvent(
    @Path() eventID: number,
    @Body() requestBody: UpdateEventRequest,
    @Request() request
  ): Promise<void> {
    // TODO: Needs testing after database changes are implemented!!

    const { organizers, ...updatedEvent } = requestBody;
    const organizerIDs = organizers.map((organizer) => organizer.memberID);
    const currentOrganizers = await this.eventsService.getEventOrganizers(eventID);

    const user = request.user as JWTPayload;

    // Check if the user has the permission to update the event or is part of the organizers
    if (
      !doesPermissionsInclude(user.permissions, [8]) &&
      !currentOrganizers.some((organizer) => organizer.memberID === user.memberId)
    ) {
      throw new UnauthorizedError("You are not allowed to update this event");
    }
  }
  @Post("{eventId}/add/member/{memberId}")
  @Security("jwt")
  public async addMemberToEvent(@Path() eventId: number, @Path() memberId: number): Promise<void> {
    await this.eventsService.registerMemberForEvent(eventId, memberId);
  }
}
