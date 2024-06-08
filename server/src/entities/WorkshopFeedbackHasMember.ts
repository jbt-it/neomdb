import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";
import { WorkshopFeedback } from "./WorkshopFeedback";

@Index("fk_schulungsfeedback_has_mitglied_mitglied1", ["memberId"], {})
@Index("fk_schulungsfeedback_has_mitglied_schulungsfeedback1", ["workshopFeedback"], {})
@Entity("schulungsfeedback_has_mitglied", { schema: "mdb" })
export class WorkshopFeedbackHasMember {
  @Column("int", {
    primary: true,
    name: "schulungsfeedback_schulungsfeedbackID",
  })
  workshopFeedbackId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("int", { name: "note", nullable: true })
  grade: number | null;

  @ManyToOne(() => Member, (member) => member.workshopFeedbackHasMembers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;

  @ManyToOne(() => WorkshopFeedback, (workshopFeedback) => workshopFeedback.workshopFeedbackHasMembers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "schulungsfeedback_schulungsfeedbackID",
      referencedColumnName: "workshopFeedbackId",
    },
  ])
  workshopFeedback: WorkshopFeedback;
}
