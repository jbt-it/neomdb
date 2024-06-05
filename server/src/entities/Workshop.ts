import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkshopInstance } from "./WorkshopInstance";

@Index("schulungID_UNIQUE", ["workshopId"], { unique: true })
@Entity("schulung", { schema: "mdb" })
export class Workshop {
  @PrimaryGeneratedColumn({ type: "int", name: "schulungID" })
  workshopId: number;

  @Column("varchar", { name: "schulungsname", length: 45 })
  workshopName: string; // "schulungsname" translated to "trainingName"

  // TODO: Implement enum
  @Column("enum", {
    name: "art",
    nullable: true,
    enum: ["Pflichtworkshop", "Workshop", "Externer Workshop"],
  })
  type: "Pflichtworkshop" | "Workshop" | "Externer Workshop" | null;

  @Column("text", { name: "beschreibung", nullable: true })
  description: string | null;

  @OneToMany(() => WorkshopInstance, (workshopInstance) => workshopInstance.workshop)
  workshopInstances: WorkshopInstance[];
}
