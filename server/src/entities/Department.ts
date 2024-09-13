import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Director } from "./Director";
import { Member } from "./Member";

@Index("Bezeichnung_UNIQUE", ["name"], { unique: true })
@Index("ressortID_UNIQUE", ["departmentId"], { unique: true })
@Index("kuerzel_UNIQUE", ["shortName"], { unique: true })
@Entity("ressort", { schema: "mdb" })
export class Department {
  @PrimaryGeneratedColumn({ type: "int", name: "ressortID" })
  departmentId: number;

  @Column("varchar", { name: "bezeichnung", unique: true, length: 45 })
  name: string;

  @Column("varchar", { name: "kuerzel", unique: true, length: 10 })
  shortName: string;

  @Column("varchar", { name: "jbt_email", length: 45 })
  jbtEmail: string;

  @Column("text", { name: "linkZielvorstellung", nullable: true })
  linkObjectivePresentation: string | null;

  @Column("text", { name: "linkOrganigramm", nullable: true })
  linkOrganigram: string | null;

  @Column("text", { name: "kurzvorstellung" })
  shortPresentation: string;

  @Column("longtext", { name: "inhalt" })
  content: string;

  @OneToOne(() => Director, (director) => director.department)
  director: Director;

  @OneToMany(() => Member, (member) => member.department)
  members: Member[];
}
