import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";
import { Project } from "./Project";

@Index("ansprechpartner_unternehmen_idx", ["companyId"], {})
@Entity("ansprechpartner", { schema: "mdb" })
export class ContactPerson {
  @PrimaryGeneratedColumn({ type: "int", name: "ansprechpartnerID" })
  contactPersonId: number;

  @Column("int", { name: "unternehmen_unternehmenID" })
  companyId: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  // TODO: Legacy code, remove it!
  /* 
  @Column("tinyint", { name: "geschlecht", nullable: true, width: 1 })
  gender: boolean | null;

  @Column("date", { name: "geburtsdatum", nullable: true })
  birthdate: string | null;

  @Column("varchar", { name: "position", nullable: true, length: 100 })
  position: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("varchar", { name: "festnetz", nullable: true, length: 20 })
  landline: string | null;

  @Column("varchar", { name: "handy", nullable: true, length: 20 })
  mobile: string | null;

  @Column("varchar", { name: "xing", nullable: true, length: 200 })
  xing: string | null;

  @Column("varchar", { name: "adresszusatz", nullable: true, length: 500 })
  addressAdditional: string | null;

  @Column("varchar", { name: "strasse", nullable: true, length: 100 })
  street: string | null;

  @Column("varchar", { name: "plz", nullable: true, length: 10 })
  postalCode: string | null;

  @Column("varchar", { name: "ort", nullable: true, length: 100 })
  city: string | null;

  @Column("mediumtext", { name: "persoenlicheEigenschaften", nullable: true })
  personalCharacteristics: string | null;

  @Column("mediumtext", { name: "verbleib", nullable: true })
  whereabouts: string | null;

  @Column("int", { name: "wichtigkeitKontaktaufnahme", nullable: true })
  importanceOfContact: number | null;

  @Column("int", { name: "kontaktperson", nullable: true })
  contactPersonJBTId: number | null;

  @Column("date", { name: "erinnerung", nullable: true })
  reminder: Date | null;

  @Column("date", { name: "erwarteBestaetigung", nullable: true })
  expectedConfirmation: Date | null;

  @Column("int", { name: "zufriedenheit", nullable: true })
  satisfaction: number | null;

  @ManyToOne(() => Member, (member) => member.contactPersons, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "kontaktperson", referencedColumnName: "memberId" }])
  contactPersonJBT: Member; */

  @ManyToOne(() => Company, (company) => company.contactPersons, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    {
      name: "unternehmen_unternehmenID",
      referencedColumnName: "companyId",
    },
  ])
  company: Company;

  @ManyToMany(() => Project, (project) => project.contactPersons)
  @JoinTable({
    name: "projekt_has_ansprechpartner",
    joinColumns: [
      {
        name: "ansprechpartner_ansprechpartnerID",
        referencedColumnName: "contactPersonId",
      },
    ],
    inverseJoinColumns: [{ name: "projekt_projektID", referencedColumnName: "projectId" }],
    schema: "mdb",
  })
  projects: Project[];
}
