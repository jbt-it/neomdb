import { Column, Entity } from "typeorm";

@Entity("generationenbeauftragter", { schema: "mdb" })
export class GenerationRepresentative {
  @Column("int", { primary: true, name: "generation_generationID" })
  generationId: number;

  // TODO: Make foreign, if entity is used
  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;
}
