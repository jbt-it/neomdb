import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";

@Entity("edvkenntnisse", { schema: "mdb" })
export class ItSkills {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("varchar", { primary: true, name: "wert", length: 150 })
  value: string;

  @Column("int", { name: "niveau" })
  level: number;

  @ManyToOne(() => Member, (member) => member.itSkills, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
