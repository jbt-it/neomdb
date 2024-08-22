import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkshopInstance } from "./WorkshopInstance";
import { Member } from "./Member";

@Entity("schulungsinstanz_has_referenten", { schema: "mdb" })
export class WorkshopInstanceHasReferent {
  @Column("int", { primary: true, name: "schulungsinstanz_schulungsinstanzID" })
  workshopInstanceId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @JoinColumn([{ name: "schulungsinstanz_schulungsinstanzID", referencedColumnName: "schulungsinstanzID" }])
  WorkshopInstance: WorkshopInstance;

  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
