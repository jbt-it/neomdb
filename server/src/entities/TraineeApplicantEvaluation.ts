import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";
import { TraineeApplicant } from "./TraineeApplicant";

@Entity("traineebewerber_bewertung", { schema: "mdb" })
export class TraineeApplicantEvaluation {
  @Column("int", { primary: true, name: "traineebewerber_traineebewerberID" })
  traineeApplicantId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("int", { name: "bewertung", default: () => "'0'" })
  evaluation: number;

  @ManyToOne(() => Member, (member) => member.memberHasEvents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;

  @ManyToOne(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.traineeApplicantEvaluations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "traineebewerber_traineebewerberID", referencedColumnName: "traineeApplicantId" }])
  traineeApplicant: TraineeApplicant;
}
