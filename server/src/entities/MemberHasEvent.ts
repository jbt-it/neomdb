import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";
import { Member } from "./Member";

@Index("fk_mitglied_has_event_event1", ["eventId"], {})
@Index("fk_mitglied_has_event_mitglied1", ["memberId"], {})
@Entity("mitglied_has_event", { schema: "mdb" })
export class MemberHasEvent {
  @Column("int", { primary: true, name: "event_eventID" })
  eventId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  // TODO: Implement enum
  @Column("enum", { name: "rolle", enum: ["Teilnehmer", "Organisator"] })
  role: "Teilnehmer" | "Organisator";

  @Column("timestamp", {
    name: "anmeldezeitpunkt",
    default: () => "CURRENT_TIMESTAMP",
  })
  registrationTime: Date;

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

  constructor(init?: Partial<MemberHasEvent>) {
    Object.assign(this, init);
  }
}
