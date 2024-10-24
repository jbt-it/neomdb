import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TraineeApplicant } from "./TraineeApplicant";

@Index("fk_traineebewerber", ["traineeApplicantId"], {})
@Entity("traineebewerber_praktikum", { schema: "mdb" })
export class TraineeApplicantInternship {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "traineebewerberID" })
  traineeApplicantId: number;

  @Column("text", { name: "taetigkeit", nullable: true })
  activity: string | null;

  @Column("varchar", { name: "unternehmen", nullable: true, length: 200 })
  company: string | null;

  @Column("varchar", { name: "ort", nullable: true, length: 100 })
  location: string | null;

  @Column("varchar", { name: "beginn", nullable: true, length: 45 })
  start: Date | null;

  @Column("varchar", { name: "ende", nullable: true, length: 45 })
  end: Date | null;

  @ManyToOne(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.traineeApplicantInternships, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "traineebewerberID", referencedColumnName: "traineeApplicantId" }])
  traineeApplicant: TraineeApplicant;
}
