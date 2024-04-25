import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberHasWorkshopInstance } from "./MemberHasWorkshopInstance";
import { WorkshopFeedback } from "./WorkshopFeedback";
import { Workshop } from "./Workshop";

@Index("schulungsinstanzID_UNIQUE", ["workshopInstanceId"], { unique: true })
@Index("fk_Schulunginstanz_Schulungen1", ["workshopInstanceId"], {})
@Entity("schulungsinstanz", { schema: "mdb" })
export class WorkshopInstance {
  @PrimaryGeneratedColumn({ type: "int", name: "schulungsinstanzID" })
  workshopInstanceId: number;

  @Column("int", { name: "schulung_schulungID" })
  workshopId: number;

  // TODO: Implement enum
  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["Anmeldung", "Anmeldung abgeschlossen", "Feedback", "Abgeschlossen"],
  })
  status: "Anmeldung" | "Anmeldung abgeschlossen" | "Feedback" | "Abgeschlossen" | null;

  @Column("date", { name: "datum", nullable: true })
  date: Date | null;

  // TODO: Date?
  @Column("varchar", { name: "startzeit", nullable: true, length: 10 })
  startTime: string | null;

  // TODO: Date?
  @Column("varchar", { name: "endzeit", nullable: true, length: 10 })
  endTime: string | null;

  @Column("varchar", { name: "ort", nullable: true, length: 45 })
  location: string | null;

  @Column("int", { name: "maximaleTeilnehmer", nullable: true })
  maximumParticipants: number | null;

  @Column("text", { name: "referenten", nullable: true })
  speakers: string | null;

  @Column("text", { name: "zielgruppe", nullable: true })
  targetGroup: string | null;

  @Column("datetime", { name: "anmeldungVon", nullable: true })
  registrationFrom: Date | null;

  @Column("datetime", { name: "anmeldungBis", nullable: true })
  registrationUntil: Date | null;

  @OneToMany(() => MemberHasWorkshopInstance, (memberHasWorkshopInstance) => memberHasWorkshopInstance.workshopInstance)
  memberHasWorkshopInstances: MemberHasWorkshopInstance[];

  @OneToMany(() => WorkshopFeedback, (workshopFeedback) => workshopFeedback.workshopInstance)
  workshopFeedbacks: WorkshopFeedback[];

  @ManyToOne(() => Workshop, (workshop) => workshop.workshopInstances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "schulung_schulungID", referencedColumnName: "workshopId" }])
  workshop: Workshop;
}