import { Column, Entity } from "typeorm";

@Entity("traineebewerber_bewertung", { schema: "mdb" })
export class TraineebewerberBewertung {
  @Column("int", { primary: true, name: "traineebewerber_traineebewerberID" })
  traineebewerberTraineebewerberId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  mitgliedMitgliedId: number;

  @Column("int", { name: "bewertung", default: () => "'0'" })
  bewertung: number;
}
