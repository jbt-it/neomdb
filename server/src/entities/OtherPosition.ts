import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberHasOtherPosition } from "./MemberHasOtherPosition";

@Entity("andererposten", { schema: "mdb" })
export class OtherPosition {
  @PrimaryGeneratedColumn({ type: "int", name: "andererpostenID" })
  otherPositionId: number;

  @Column("varchar", { name: "bezeichnung_maennlich", length: 100 })
  descriptionMale: string;

  @Column("varchar", { name: "bezeichnung_weiblich", length: 100 })
  descriptionFemale: string;

  @Column("mediumtext", { name: "kurzvorstellung" })
  briefIntroduction: string;

  @Column("longtext", { name: "inhalt" })
  content: string;

  @OneToMany(() => MemberHasOtherPosition, (memberHasOtherPosition) => memberHasOtherPosition.otherPosition)
  memberHasOtherPositions: MemberHasOtherPosition[];
}
