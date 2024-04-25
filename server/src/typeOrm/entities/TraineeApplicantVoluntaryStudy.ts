import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TraineeApplicant } from "./TraineeApplicant";

@Index("fk_traineebewerber_ehrenamtlichstudium", ["traineeApplicantId"], {})
@Entity("traineebewerber_ehrenamtlichstudium", { schema: "mdb" })
export class TraineeApplicantVoluntaryStudy {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "traineebewerberID" })
  traineeApplicantId: number;

  @Column("text", { name: "taetigkeit", nullable: true })
  activity: string | null;

  @ManyToOne(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.traineeApplicantVoluntaryStudies, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "traineebewerberID", referencedColumnName: "traineeApplicantId" }])
  traineeApplicant: TraineeApplicant;
}
