import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Expertise } from "./Expertise";
import { Member } from "./Member";

@Index("fk_mitglied_has_expertenwissen_expertenwissen1", ["expertiseId"], {})
@Entity("mitglied_has_expertenwissen", { schema: "mdb" })
export class MemberHasExpertise {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("int", { primary: true, name: "expertenwissen_expertenwissenID" })
  expertiseId: number;

  @Column("varchar", { primary: true, name: "wert", length: 150 })
  value: string;

  @ManyToOne(() => Expertise, (expertise) => expertise.memberHasExpertise, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "expertenwissen_expertenwissenID",
      referencedColumnName: "expertiseId",
    },
  ])
  expertise: Expertise;

  @ManyToOne(() => Member, (member) => member.memberHasExpertises, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
