import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContactPerson } from "./ContactPerson";
import { Project } from "./Project";
import { Industry } from "./Industry";

@Index("name_UNIQUE", ["name"], { unique: true })
@Index("unternehmen_branche_fk_idx", ["industryId"], {})
@Entity("unternehmen", { schema: "mdb" })
export class Company {
  @PrimaryGeneratedColumn({ type: "int", name: "unternehmenID" })
  companyId: number;

  @Column("tinyint", { name: "interessent", width: 1, default: () => "'0'" })
  prospect: boolean;

  @Column("varchar", { name: "name", unique: true, length: 300 })
  name: string;

  @Column("int", { name: "branche", nullable: true })
  industryId: number | null;

  @Column("mediumtext", { name: "kurzbeschreibung", nullable: true })
  shortDescription: string | null;

  @Column("varchar", { name: "adresszusatz", nullable: true, length: 500 })
  addressAdditional: string | null;

  @Column("varchar", { name: "strasse", nullable: true, length: 100 })
  street: string | null;

  @Column("varchar", { name: "plz", nullable: true, length: 10 })
  postalCode: string | null;

  @Column("varchar", { name: "ort", nullable: true, length: 100 })
  city: string | null;

  @Column("varchar", { name: "url", nullable: true, length: 100 })
  url: string | null;

  @Column("mediumtext", { name: "wichtigeInfos", nullable: true })
  importantInformation: string | null;

  @Column("int", { name: "umsatzstaerke", nullable: true })
  revenueStrength: number | null;

  @Column("int", { name: "projektzahl", nullable: true })
  projectNumber: number | null;

  @Column("int", { name: "btzahl", nullable: true })
  btAmount: number | null;

  @Column("int", { name: "zufriedenheit", nullable: true })
  satisfaction: number | null;

  @Column("tinyint", {
    name: "kontaktErwuenscht",
    width: 1,
    default: () => "'0'",
  })
  contactDesired: boolean;

  @Column("varchar", { name: "kontaktkanal", nullable: true, length: 45 })
  contactChannel: string | null;

  @Column("tinyint", { name: "geheim", width: 1, default: () => "'0'" })
  classified: boolean;

  @OneToMany(() => ContactPerson, (contactPerson) => contactPerson.company)
  contactPersons: ContactPerson[];

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];

  @ManyToOne(() => Industry, (industry) => industry.company, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "branche", referencedColumnName: "industryId" }])
  industry: Industry;
}
