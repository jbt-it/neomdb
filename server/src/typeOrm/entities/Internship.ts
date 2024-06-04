import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";

@Entity("praktika", { schema: "mdb" })
export class Internship {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("varchar", { name: "unternehmen", nullable: true, length: 100 })
  company: string | null;

  @Column("varchar", { primary: true, name: "beschreibung", length: 255 })
  description: string;

  @ManyToOne(() => Member, (member) => member.internships, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
