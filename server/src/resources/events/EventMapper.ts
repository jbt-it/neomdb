import { MemberHasEvent } from "entities/MemberHasEvent";
import { MemberHasEventWw } from "entities/MemberHasEventWw";
import { MemberField } from "types/memberTypes";
import { Event } from "../../entities/Event";
import { EventDto, EventWWMember } from "../../types/EventTypes";

/**
 * Provides methods to map an event to a dto (data transfer object) or vice versa
 */
export class EventMapper {
  static memberHasEventToMemberField(memberHasEvent: MemberHasEvent): MemberField {
    return {
      name: `${memberHasEvent.member.firstName} ${memberHasEvent.member.lastName}`,
      memberID: memberHasEvent.memberId,
      vorname: memberHasEvent.member.firstName,
      nachname: memberHasEvent.member.lastName,
      status: memberHasEvent.member?.memberStatus?.name ?? null,
    };
  }

  static memberHasEventToWwMember(memberHasEvent: MemberHasEventWw): EventWWMember {
    return {
      eventID: memberHasEvent.eventId,
      mitgliedID: memberHasEvent.memberId,
      vorname: memberHasEvent.member.firstName,
      nachname: memberHasEvent.member.lastName,
      anreise: memberHasEvent.arrival,
      abreise: memberHasEvent.departure,
      auto: memberHasEvent.car,
      plaetze: memberHasEvent.seats,
      vegetarier: memberHasEvent.vegetarian,
      kommentar: memberHasEvent.comment,
      status: memberHasEvent.member?.memberStatus?.name ?? null,
    };
  }

  static eventToEventDto(event: Event): EventDto {
    return {
      eventId: event.eventId,
      name: event.eventName,
      location: event.location,
      startDate: event.eventBegin,
      endDate: event.eventEnd,
      startTime: event.startTime,
      endTime: event.endTime,
      registrationStart: event.registrationFrom,
      registrationEnd: event.registrationTo,
      maxParticipants: event.maximumParticipants,
      description: event.description,
      type: event.ww ? "WW" : event.network ? "Netzwerk" : event.jbtGoes ? "JBT goes" : "Sonstige",
      organizers: event.memberHasEvents
        .filter((memberHasEvent) => memberHasEvent.role === "Organisator")
        .map((memberHasEvent) => this.memberHasEventToMemberField(memberHasEvent)),
      members: event.memberHasEvents
        .filter((memberHasEvent) => memberHasEvent.role === "Teilnehmer")
        .map((memberHasEvent) => this.memberHasEventToMemberField(memberHasEvent)),
      wwMembers: event.memberHasEventWws.map((memberHasEventWw) => this.memberHasEventToWwMember(memberHasEventWw)),
    };
  }
}
