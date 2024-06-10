import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";

@Index("fk_Sprachen_mitglied1", ["memberId"], {})
@Entity("sprachen", { schema: "mdb" })
export class Language {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("varchar", { primary: true, name: "wert", length: 150 })
  value: string;

  @Column("int", { name: "niveau" })
  level: number;

  @ManyToOne(() => Member, (member) => member.languages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
