import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TraineeApplicant } from "./TraineeApplicant";

@Index("fk_traineebewerber_itskill", ["traineeApplicantId"], {})
@Entity("traineebewerber_itskill", { schema: "mdb" })
export class TraineeApplicantItSkill {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "traineebewerberID" })
  traineeApplicantId: number;

  @Column("varchar", { name: "itskill", nullable: true, length: 45 })
  skillName: string | null;

  @Column("varchar", { name: "level", nullable: true, length: 45 })
  skillLevel: number | null;

  @ManyToOne(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.traineeApplicantLanguages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "traineebewerberID", referencedColumnName: "traineeApplicantId" }])
  traineeApplicant: TraineeApplicant;
}
