import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkshopInstance } from "./WorkshopInstance";
import { Member } from "./Member";

@Index("fk_Schulunginstanz_Schulungen1", ["workshopInstanceId"], {})
@Entity("schulungsinstanz_has_referent", { schema: "mdb" })
export class WorkshopInstanceHasReferent {
  @Column("int", { primary: true, name: "schulungsinstanz_schulungsinstanzID" })
  workshopInstanceId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @ManyToOne(() => WorkshopInstance, (workshopInstance) => workshopInstance.referents)
  @JoinColumn({ name: "schulungsinstanz_schulungsinstanzID" })
  workshopInstance: WorkshopInstance;

  @ManyToOne(() => Member, (member) => member.referencedWorkshops)
  @JoinColumn({ name: "mitglied_mitgliedID", foreignKeyConstraintName: "fk_mitglied_mitgliedID" })
  member: Member;
}
