import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Member } from "./Member";
import { Generation } from "./Generation";

@Index("fk_IP_Generation", ["generationId"], {})
@Entity("internesprojekt", { schema: "mdb" })
export class InternalProject {
  @PrimaryGeneratedColumn({ type: "int", name: "internesprojektID" })
  internalProjectId: number;

  @Column("int", { name: "generation" })
  generationId: number;

  @Column("varchar", { name: "projektname", length: 150 })
  projectName: string;

  @Column("varchar", { name: "kuerzel", length: 10 })
  abbreviation: string;

  @Column("date", { name: "kickoff", nullable: true })
  kickoff: Date | null;

  @Column("tinyint", {
    name: "AngebotBeiEV",
    width: 1,
    default: () => "'0'",
    transformer: {
      to(value: boolean): number {
        return value ? 1 : 0;
      },
      from(value: number): boolean {
        return value === 1;
      },
    },
  })
  offerAtEv: boolean;

  @Column("tinyint", { name: "ZPbeiEV", width: 1, default: () => "'0'" })
  zpAtEv: boolean;

  @Column("date", { name: "ZPgehalten", nullable: true })
  zpHeld: Date | null;

  @Column("tinyint", { name: "APbeiEV", width: 1, default: () => "'0'" })
  apAtEv: boolean;

  @Column("date", { name: "APgehalten", nullable: true })
  apHeld: Date | null;

  @Column("tinyint", { name: "DLbeiEV", width: 1, default: () => "'0'" })
  dlAtEv: boolean;

  @ManyToMany(() => Member, (member) => member.qualityManagers)
  @JoinTable({
    name: "internesprojekt_has_qm",
    joinColumns: [
      {
        name: "internesprojekt_internesprojektID",
        referencedColumnName: "internalProjectId",
      },
    ],
    inverseJoinColumns: [{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }],
    schema: "mdb",
  })
  qualityManagers: Member[];

  @OneToMany(() => Member, (member) => member.internalProject, { cascade: true })
  members: Member[];

  @ManyToOne(() => Generation, (generation) => generation.internalProjects)
  @JoinColumn({ name: "generation", referencedColumnName: "generationId" })
  generation: Generation;
}
