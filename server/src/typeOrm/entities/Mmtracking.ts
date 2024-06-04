import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";

@Index("datum_UNIQUE", ["date"], { unique: true })
@Index("mmtrackingID_UNIQUE", ["mmtrackingId"], { unique: true })
@Entity("mmtracking", { schema: "mdb" })
export class Mmtracking {
  @PrimaryGeneratedColumn({ type: "int", name: "mmtrackingID" })
  mmtrackingId: number;

  @Column("date", { name: "datum", unique: true })
  date: Date;

  @ManyToMany(() => Member, (mitglied) => mitglied.mmtrackings)
  members: Member[];
}
