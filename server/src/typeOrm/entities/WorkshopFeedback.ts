import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkshopInstance } from "./WorkshopInstance";
import { WorkshopFeedbackHasFeedbackQuestion } from "./WorkshopFeedbackHasFeedbackQuestion";
import { WorkshopFeedbackHasMember } from "./WorkshopFeedbackHasMitglied";

@Index("schulungsinstanzID_UNIQUE", ["workshopFeedbackId"], { unique: true })
@Index("fk_schulungsfeedback_schulungsinstanz1", ["workshopInstanceId"], {})
@Entity("schulungsfeedback", { schema: "mdb" })
export class WorkshopFeedback {
  @PrimaryGeneratedColumn({ type: "int", name: "schulungsfeedbackID" })
  workshopFeedbackId: number;

  @Column("int", { name: "schulungsinstanz_schulungsinstanzID" })
  workshopInstanceId: number;

  @Column("datetime", { name: "datum", nullable: true })
  date: Date | null;

  @Column("text", { name: "schulungsniveau", nullable: true })
  workshopLevel: string | null;

  @Column("text", { name: "inhaltlich", nullable: true })
  contentFeedback: string | null;

  @Column("text", { name: "praesentation", nullable: true })
  presentationFeedback: string | null;

  @Column("text", { name: "schulungsbedarf", nullable: true })
  workshopNeed: string | null;

  @ManyToOne(() => WorkshopInstance, (workshopInstance) => workshopInstance.workshopFeedbacks, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "schulungsinstanz_schulungsinstanzID",
      referencedColumnName: "workshopInstanceId",
    },
  ])
  workshopInstance: WorkshopInstance;

  @OneToMany(
    () => WorkshopFeedbackHasFeedbackQuestion,
    (workshopFeedbackHasFeedbackQuestion) => workshopFeedbackHasFeedbackQuestion.workshopFeedback
  )
  workshopFeedbackHasFeedbackQuestions: WorkshopFeedbackHasFeedbackQuestion[];

  @OneToMany(() => WorkshopFeedbackHasMember, (workshopFeedbackHasMember) => workshopFeedbackHasMember.workshopFeedback)
  workshopFeedbackHasMembers: WorkshopFeedbackHasMember[];
}
