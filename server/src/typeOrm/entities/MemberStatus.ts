import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";
import { MemberHasStatus } from "./MemberHasStatus";

@Index("mitgliedstatusID_UNIQUE", ["memberStatusId"], { unique: true })
@Entity("mitgliedstatus", { schema: "mdb" })
export class MemberStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "mitgliedStatusId" })
  memberStatusId: number;

  @Column("varchar", { name: "bezeichnung", length: 45 })
  description: string;

  @OneToMany(() => Member, (member) => member.memberStatus)
  members: Member[];

  @OneToMany(() => MemberHasStatus, (memberHasStatus) => memberHasStatus.memberStatus)
  memberHasStatuses: MemberHasStatus[];
}
