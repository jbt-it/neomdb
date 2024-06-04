import { Column, Entity } from "typeorm";

@Entity("generationenbeauftragter", { schema: "mdb" })
export class Generationenbeauftragter {
  @Column("int", { primary: true, name: "generation_generationID" })
  generationGenerationId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  mitgliedMitgliedId: number;
}
