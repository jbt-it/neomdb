import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";
import { WorkshopInstance } from "./WorkshopInstance";

@Index("fk_Schulunginstanz_has_Mitglied_Mitglied1", ["memberId"], {})
@Entity("mitglied_has_schulungsinstanz", { schema: "mdb" })
export class MemberHasWorkshopInstance {
  @Column("int", { primary: true, name: "schulungsinstanz_schulungsinstanzID" })
  workshopInstanceId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  // TODO: Implement enum
  @Column("enum", {
    name: "typ",
    enum: ["Anmeldung", "Teilnehmer", "Referent"],
  })
  type: "Anmeldung" | "Teilnehmer" | "Referent";

  @Column("date", { name: "datum", nullable: true })
  date: Date | null;

  @Column("tinyint", { name: "anwesend", nullable: true, width: 1 })
  present: boolean | null;

  @Column("tinyint", {
    name: "feedbackAbgegeben",
    width: 1,
    default: () => "'0'",
  })
  feedbackGiven: boolean;

  @ManyToOne(() => Member, (member) => member.memberHasWorkshopInstances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;

  @ManyToOne(() => WorkshopInstance, (workshopInstance) => workshopInstance.memberHasWorkshopInstances, {
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
}
