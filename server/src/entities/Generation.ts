import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";
import { TraineeApplicant } from "./TraineeApplicant";
import { InternalProject } from "./InternalProject";

@Index("generationID_UNIQUE", ["generationId"], { unique: true })
@Index("bezeichnung_UNIQUE", ["description"], { unique: true })
@Entity("generation", { schema: "mdb" })
export class Generation {
  @PrimaryGeneratedColumn({ type: "int", name: "generationID" })
  generationId: number;

  @Column("varchar", { name: "bezeichnung", unique: true, length: 45 })
  description: string;

  @Column("datetime", { name: "bewerbung_start", nullable: true })
  applicationStart: Date | null;

  @Column("datetime", { name: "bewerbung_ende", nullable: true })
  applicationEnd: Date | null;

  @Column("date", { name: "auswahl_WE_Termin_start", nullable: true })
  selectionWeDateStart: Date | null;

  @Column("date", { name: "auswahl_WE_Termin_ende", nullable: true })
  selectionWeDateEnd: Date | null;

  @Column("date", { name: "ww_Termin_start", nullable: true })
  wwDateStart: Date | null;

  @Column("date", { name: "ww_Termin_ende", nullable: true })
  wwDateEnd: Date | null;

  @Column("int", { name: "infoabendBesucher", nullable: true })
  infoEveningVisitors: number | null;

  @Column("varchar", { name: "tuercode", nullable: true, length: 10 })
  doorCode: string | null;

  @Column("datetime", { name: "wahl_start", nullable: true })
  electionStart: Date | null;

  @Column("datetime", { name: "wahl_ende", nullable: true })
  electionEnd: Date | null;

  @ManyToMany(() => Member, (member) => member.generations)
  @JoinTable({
    name: "generation_has_mentor",
    joinColumns: [{ name: "generation_generationID", referencedColumnName: "generationId" }],
    inverseJoinColumns: [{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }],
    schema: "mdb",
  })
  mentors: Member[];

  @OneToMany(() => Member, (member) => member.generation)
  members: Member[];

  @OneToMany(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.generation)
  traineeApplicants: TraineeApplicant[];

  @OneToMany(() => InternalProject, (internalProject) => internalProject.generation)
  internalProjects: InternalProject[];
}
