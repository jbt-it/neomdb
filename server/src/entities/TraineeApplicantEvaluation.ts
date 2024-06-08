import { Column, Entity } from "typeorm";

@Entity("traineebewerber_bewertung", { schema: "mdb" })
export class TraineeApplicantEvaluation {
  @Column("int", { primary: true, name: "traineebewerber_traineebewerberID" })
  traineeApplicantId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("int", { name: "bewertung", default: () => "'0'" })
  evaluation: number;
}
