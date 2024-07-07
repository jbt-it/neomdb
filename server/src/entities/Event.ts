import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberHasEvent } from "./MemberHasEvent";
import { MemberHasEventWw } from "./MemberHasEventWw";

@Index("eventID_UNIQUE", ["eventId"], { unique: true })
@Entity("event", { schema: "mdb" })
export class Event {
  @PrimaryGeneratedColumn({ type: "int", name: "eventID" })
  eventId: number;

  @Column("varchar", { name: "eventname", length: 255 })
  eventName: string;

  @Column("mediumtext", { name: "beschreibung" })
  description: string;

  @Column("date", { name: "event_beginn", nullable: true })
  eventBegin: Date | null;

  @Column("date", { name: "event_ende", nullable: true })
  eventEnd: Date | null;

  @Column("datetime", { name: "anmeldungVon", nullable: true })
  registrationFrom: Date | null;

  @Column("datetime", { name: "anmeldungBis", nullable: true })
  registrationTo: Date | null;

  @Column("varchar", { name: "ort", nullable: true, length: 255 })
  location: string | null;

  // TODO: Date
  @Column("varchar", { name: "startzeit", nullable: true, length: 10 })
  startTime: string | null;

  // TODO: Date
  @Column("varchar", { name: "endzeit", nullable: true, length: 10 })
  endTime: string | null;

  @Column("tinyint", { name: "ww", width: 1, default: () => "'0'" })
  ww: boolean;

  @Column("tinyint", { name: "netzwerk", width: 1 })
  network: boolean;

  @Column("int", { name: "maximaleTeilnehmer", nullable: true })
  maximumParticipants: number | null;

  @Column("tinyint", { name: "jbtgoes", width: 1, default: () => "'0'" })
  jbtGoes: boolean;

  @Column("tinyint", { name: "sonstige", width: 1, default: () => "'0'" })
  others: boolean;

  @OneToMany(() => MemberHasEvent, (memberHasEvent) => memberHasEvent.event)
  memberHasEvents: MemberHasEvent[];

  @OneToMany(() => MemberHasEventWw, (memberHasEventww) => memberHasEventww.event)
  memberHasEventWws: MemberHasEventWw[];
}
