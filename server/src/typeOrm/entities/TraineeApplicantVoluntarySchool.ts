import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TraineeApplicant } from "./TraineeApplicant";

@Index("fk_traineebewerber_ehrenamtlichschule", ["traineeApplicantId"], {})
@Entity("traineebewerber_ehrenamtlichschule", { schema: "mdb" })
export class TraineeApplicantVoluntarySchool {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "traineebewerberID" })
  traineeApplicantId: number;

  @Column("text", { name: "taetigkeit", nullable: true })
  activity: string | null;

  @ManyToOne(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.traineeApplicantVoluntarySchools, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "traineebewerberID", referencedColumnName: "traineeApplicantId" }])
  traineeApplicant: TraineeApplicant;
}
