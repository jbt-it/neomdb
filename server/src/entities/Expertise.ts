import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberHasExpertise } from "./MemberHasExpertise";

@Entity("expertenwissen", { schema: "mdb" })
export class Expertise {
  @PrimaryGeneratedColumn({ type: "int", name: "expertenwissenID" })
  expertiseId: number;

  @Column("varchar", { name: "bezeichnung", nullable: true, length: 50 })
  designation: string | null;

  @OneToMany(() => MemberHasExpertise, (memberHasExpertise) => memberHasExpertise.expertise)
  memberHasExpertise: MemberHasExpertise[];
}
