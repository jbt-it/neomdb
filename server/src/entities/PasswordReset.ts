import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Member } from "./Member";

@Entity("passwort_reset", { schema: "mdb" })
export class PasswordReset {
  @Column("varchar", { primary: true, name: "mitglied_jbt_email", length: 60 })
  memberJbtEmail: string;

  @Column("timestamp", { name: "datum", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column("binary", { name: "salt", length: 16 })
  salt: Buffer;

  @Column("char", { name: "token", length: 128 })
  token: string;

  @OneToOne(() => Member, (member) => member.passwordReset, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_jbt_email", referencedColumnName: "jbtEmail" }])
  member: Member;
}
