import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./Department";
import { DirectorHasPermission } from "./DirectorHasPermission";
import { MemberHasDirectorPosition } from "./MemberHasDirectorPosition";
import { Project } from "./Project";

@Index("mitgliedstatusID_UNIQUE", ["directorId"], { unique: true })
@Index("ressortID_UNIQUE", ["departmentId"], { unique: true })
@Index("fk_evposten_ressort", ["departmentId"], {})
@Entity("evposten", { schema: "mdb" })
export class Director {
  @PrimaryGeneratedColumn({ type: "int", name: "evpostenID" })
  directorId: number;

  @Column("varchar", { name: "bezeichnung_maennlich", length: 45 })
  designationMale: string;

  @Column("varchar", { name: "bezeichnung_weiblich", length: 45 })
  designationFemale: string;

  @Column("int", { name: "ressortID", nullable: true, unique: true })
  departmentId: number | null;

  @Column("varchar", { name: "kuerzel", length: 10 })
  shortName: string;

  @Column("varchar", { name: "jbt_email", length: 45 })
  jbtEmail: string;

  @Column("mediumtext", { name: "kurzvorstellung" })
  shortIntroduction: string;

  @Column("longtext", { name: "inhalt" })
  content: string;

  @Column("int", { name: "reihenfolge" })
  sequence: number;

  @OneToOne(() => Department, (department) => department.director, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ressortID", referencedColumnName: "departmentId" }])
  department: Department;

  @OneToMany(() => DirectorHasPermission, (directorHasPermission) => directorHasPermission.director)
  directorHasPermissions: DirectorHasPermission[];

  @OneToMany(() => MemberHasDirectorPosition, (memberHasDirectorPosition) => memberHasDirectorPosition.director)
  memberHasDirectorPositions: MemberHasDirectorPosition[];

  @OneToMany(() => Project, (project) => project.acquisitor)
  projects: Project[];
}
