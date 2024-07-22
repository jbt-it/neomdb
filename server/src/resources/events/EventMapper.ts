import { MemberHasEvent } from "../../entities/MemberHasEvent";
import { MemberHasEventWw } from "../../entities/MemberHasEventWw";
import { MemberField } from "../../types/memberTypes";
import { Event } from "../../entities/Event";
import { EventDto, EventMember, EventOrganizer, EventWWMember } from "../../types/EventTypes";

/**
 * Provides methods to map an event to a dto (data transfer object) or vice versa
 */
export class EventMapper {
  // --- From Entity to DTO mapper functions
  static memberHasEventToMemberField(memberHasEvent: MemberHasEvent): EventMember | EventOrganizer {
    return {
      name: `${memberHasEvent.member.firstName} ${memberHasEvent.member.lastName}`,
      memberID: memberHasEvent.memberId,
      vorname: memberHasEvent.member.firstName,
      nachname: memberHasEvent.member.lastName,
      status: memberHasEvent.member?.memberStatus?.name ?? null,
      role: memberHasEvent.role,
    };
  }

  static memberHasEventToWwMember(memberHasEvent: MemberHasEventWw): EventWWMember {
    return {
      eventId: memberHasEvent.eventId,
      mitgliedId: memberHasEvent.memberId,
      firstName: memberHasEvent.member.firstName,
      lastName: memberHasEvent.member.lastName,
      arrival: memberHasEvent.arrival,
      departure: memberHasEvent.departure,
      car: memberHasEvent.car,
      seats: memberHasEvent.seats,
      isVegetarian: memberHasEvent.isVegetarian,
      comment: memberHasEvent.comment,
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

  // --- From DTO to Entity mapper functions
  static eventDtoToEvent(eventDto: EventDto, eventMembers: EventMember[]): Event {
    return {
      ...eventDto,
      eventName: eventDto.name,
      eventBegin: eventDto.startDate,
      eventEnd: eventDto.endDate,
      registrationFrom: eventDto.registrationStart,
      registrationTo: eventDto.registrationEnd,
      maximumParticipants: eventDto.maxParticipants,
      description: eventDto.description,
      ww: eventDto.type === "WW",
      network: eventDto.type === "Netzwerk",
      jbtGoes: eventDto.type === "JBT goes",
      others: eventDto.type === "Sonstige",
      memberHasEvents: eventMembers.map(
        (member) =>
          new MemberHasEvent({
            memberId: member.memberID,
            eventId: eventDto.eventId,
            role: member.role,
            registrationTime: new Date(),
          })
      ),
      memberHasEventWws: eventDto.wwMembers.map(
        (wwMember) =>
          new MemberHasEventWw({
            memberId: wwMember.mitgliedId,
            eventId: eventDto.eventId,
            arrival: wwMember.arrival,
            departure: wwMember.departure,
            car: wwMember.car,
            seats: wwMember.seats,
            isVegetarian: wwMember.isVegetarian,
            comment: wwMember.comment,
          })
      ),
    };

    const event = new Event();
    event.eventId = eventDto.eventId;
    event.eventName = eventDto.name;
    event.location = eventDto.location;
    event.eventBegin = eventDto.startDate;
    event.eventEnd = eventDto.endDate;
    event.startTime = eventDto.startTime;
    event.endTime = eventDto.endTime;
    event.registrationFrom = eventDto.registrationStart;
    event.registrationTo = eventDto.registrationEnd;
    event.maximumParticipants = eventDto.maxParticipants;
    event.description = eventDto.description;
    event.ww = eventDto.type === "WW";
    event.network = eventDto.type === "Netzwerk";
    event.jbtGoes = eventDto.type === "JBT goes";
    event.others = eventDto.type === "Sonstige";
    event.memberHasEvents = eventMembers.map(
      (member) =>
        new MemberHasEvent({
          memberId: member.memberID,
          eventId: eventDto.eventId,
          role: member.role,
          registrationTime: new Date(),
        })
    );
    event.memberHasEventWws = eventDto.wwMembers.map(
      (wwMember) =>
        new MemberHasEventWw({
          memberId: wwMember.mitgliedId,
          eventId: eventDto.eventId,
          arrival: wwMember.arrival,
          departure: wwMember.departure,
          car: wwMember.car,
          seats: wwMember.seats,
          isVegetarian: wwMember.isVegetarian,
          comment: wwMember.comment,
        })
    );
    return event;
  }
}
