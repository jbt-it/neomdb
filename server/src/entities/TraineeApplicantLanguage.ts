import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TraineeApplicant } from "./TraineeApplicant";

@Index("fk_traineebewerber_sprache", ["traineeApplicantId"], {})
@Entity("traineebewerber_sprache", { schema: "mdb" })
export class TraineeApplicantLanguage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "traineebewerberID" })
  traineeApplicantId: number;

  @Column("varchar", { name: "sprache", nullable: true, length: 45 })
  language: string | null;

  @Column("varchar", { name: "sprachlevel", nullable: true, length: 45 })
  languageLevel: string | null;

  @ManyToOne(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.traineeApplicantLanguages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "traineebewerberID", referencedColumnName: "traineeApplicantId" }])
  traineeApplicant: TraineeApplicant;
}
