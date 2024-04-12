import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Director } from "./Director";
import { Member } from "./Member";

@Index("fk_Mitglied_has_EVposten_EVposten1", ["directorId"], {})
@Entity("mitglied_has_evposten", { schema: "mdb" })
export class MemberHasDirectorPosition {
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("int", { primary: true, name: "evposten_evpostenID" })
  directorId: number;

  @Column("date", { name: "von" })
  from: string;

  @Column("date", { name: "bis", nullable: true })
  until: string | null;

  @ManyToOne(() => Director, (director) => director.memberHasDirectorPositions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "evposten_evpostenID", referencedColumnName: "directorId" }])
  director: Director;

  @ManyToOne(() => Member, (member) => member.memberHasDirectorPositions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;
}
