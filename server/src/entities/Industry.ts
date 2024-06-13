import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";
import { Company } from "./Company";

@Index("bezeichnung_UNIQUE", ["description"], { unique: true })
@Entity("branche", { schema: "mdb" })
export class Industry {
  @PrimaryGeneratedColumn({ type: "int", name: "brancheID" })
  industryId: number;

  @Column("varchar", { name: "bezeichnung", unique: true, length: 300 })
  description: string;

  @OneToMany(() => Project, (project) => project.industry)
  projects: Project[];

  @OneToMany(() => Company, (company) => company.industry)
  company: Company[];
}
