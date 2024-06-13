import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";

@Index("mitgliedstatusID_UNIQUE", ["coreCompetencyId"], { unique: true })
@Entity("kernkompetenz", { schema: "mdb" })
export class CoreCompetency {
  @PrimaryGeneratedColumn({ type: "int", name: "kernkompetenzID" })
  coreCompetencyId: number;

  @Column("varchar", { name: "bezeichnung", length: 45 })
  designation: string;

  @ManyToMany(() => Project, (project) => project.coreCompetencies)
  @JoinTable({
    name: "projekt_has_kernkompetenz",
    joinColumns: [
      {
        name: "kernkompetenz_kernkompetenzID",
        referencedColumnName: "coreCompetencyId",
      },
    ],
    inverseJoinColumns: [{ name: "projekt_projektID", referencedColumnName: "projectId" }],
    schema: "mdb",
  })
  projects: Project[];
}
