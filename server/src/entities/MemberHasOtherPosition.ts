import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { OtherPosition } from "./OtherPosition";
import { Member } from "./Member";

@Index("fk_mitglied_has_andererposten_andererposten", ["otherPositionId"], {})
@Entity("mitglied_has_andererposten", { schema: "mdb" })
export class MemberHasOtherPosition {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("int", { primary: true, name: "andererposten_andererpostenID" })
  otherPositionId: number;

  @Column("date", { primary: true, name: "von" })
  from: string;

  @Column("date", { name: "bis", nullable: true })
  until: string | null;

  @ManyToOne(() => OtherPosition, (otherPosition) => otherPosition.memberHasOtherPositions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "andererposten_andererpostenID",
      referencedColumnName: "otherPositionId",
    },
  ])
  otherPosition: OtherPosition;

  @ManyToOne(() => Member, (member) => member.memberHasOtherPositions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
