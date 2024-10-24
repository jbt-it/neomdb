import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Arrival, Departure } from "../types/EventTypes";
import { Event } from "./Event";
import { Member } from "./Member";

@Index("fk_mitglied_has_eventww_mitglied1", ["memberId"], {})
@Index("fk_mitglied_has_eventww_event1", ["eventId"], {})
@Entity("mitglied_has_eventww", { schema: "mdb" })
export class MemberHasEventWw {
  @Column("int", { primary: true, name: "event_eventID" })
  eventId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  // TODO: Implement enum
  @Column("enum", {
    name: "anreise",
    nullable: true,
    enum: Arrival,
  })
  arrival: Arrival | null;

  // TODO: Implement enum
  @Column("enum", {
    name: "abreise",
    nullable: true,
    enum: Departure,
  })
  departure: Departure | null;

  @Column("tinyint", { name: "auto", nullable: true, width: 1 })
  car: boolean | null;

  @Column("int", { name: "plaetze", nullable: true })
  seats: number | null;

  @Column("tinyint", { name: "vegetarier", nullable: true, width: 1 })
  isVegetarian: boolean | null;

  @Column("text", { name: "kommentar", nullable: true })
  comment: string | null;

  @ManyToOne(() => Event, (event) => event.memberHasEvents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "event_eventID", referencedColumnName: "eventId" }])
  event: Event;

  @ManyToOne(() => Member, (member) => member.memberHasEvents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;

  constructor(init?: Partial<MemberHasEventWw>) {
    Object.assign(this, init);
  }
}
