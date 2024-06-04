import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";
import { MemberStatus } from "./MemberStatus";

@Index("fk_status_idx", ["memberStatus"], {})
@Entity("mitglied_has_status", { schema: "mdb" })
export class MemberHasStatus {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("date", {
    primary: true,
    name: "datum",
    comment: "Genau genommen das Startdatum",
  })
  date: Date;

  @Column("int", { name: "mitgliedstatus_status" })
  memberStatusId: number;

  @Column("text", { name: "bemerkung", nullable: true })
  note: string | null;

  @ManyToOne(() => MemberStatus, (memberStatus) => memberStatus.memberHasStatuses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitgliedstatus_status", referencedColumnName: "memberStatusId" }])
  memberStatus: MemberStatus;

  @ManyToOne(() => Member, (member) => member.memberHasStatuses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
