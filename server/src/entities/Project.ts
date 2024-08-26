import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Director } from "./Director";
import { ContactPerson } from "./ContactPerson";
import { MemberHasProject } from "./MemberHasProject";
import { Company } from "./Company";
import { Industry } from "./Industry";
import { CoreCompetency } from "./CoreCompetency";

@Index("projekt_id_UNIQUE", ["projectId"], { unique: true })
@Index("fk_branche", ["industry"], {})
@Index("fk_auftraggeber_idx", ["client"], {})
@Index("fk_akquiseverantw_idx", ["acquisitor"], {})
@Entity("projekt", { schema: "mdb" })
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "projektID" })
  projectId: number;

  // TODO: Implement enum
  @Column("enum", {
    name: "status",
    nullable: true,
    enum: [
      "Bewerbung",
      "Angebot",
      "Durchführung",
      "Abrechnung",
      "Abgeschlossen",
      "NichtBesetzt",
      "PitchVerloren",
      "AngebotAbgelehnt",
      "Abgebrochen",
    ],
  })
  status:
    | "Bewerbung"
    | "Angebot"
    | "Durchführung"
    | "Abrechnung"
    | "Abgeschlossen"
    | "NichtBesetzt"
    | "PitchVerloren"
    | "AngebotAbgelehnt"
    | "Abgebrochen"
    | null;

  @Column("varchar", { name: "projektname", length: 150 })
  projectName: string;

  @Column("char", { name: "bewerbungenKey", length: 32 })
  applicationsKey: string;

  @Column("int", { name: "auftraggeber", nullable: true })
  clientId: number | null;

  @Column("tinyint", {
    name: "auftraggeberGeheim",
    width: 1,
    default: () => "'0'",
  })
  clientConfidential: boolean;

  @Column("int", { name: "branche_old", nullable: true })
  sectorOld: number | null;

  @Column("varchar", { name: "unternehmen_old", nullable: true, length: 100 })
  companyOld: string | null;

  @Column("text", { name: "bemerkung", nullable: true })
  note: string | null;

  @Column("date", { name: "kickoff", nullable: true })
  kickoff: Date | null;

  @Column("date", { name: "projektende", nullable: true })
  projectEnd: Date | null;

  @Column("datetime", { name: "bewerbungbeginn1", nullable: true })
  applicationStart1: Date | null;

  @Column("datetime", { name: "bewerbungende1", nullable: true })
  applicationEnd1: Date | null;

  @Column("datetime", { name: "bewerbungbeginn2", nullable: true })
  applicationStart2: Date | null;

  @Column("datetime", { name: "bewerbungende2", nullable: true })
  applicationEnd2: Date | null;

  @Column("date", { name: "unterschriftsdatum", nullable: true })
  signatureDate: Date | null;

  @Column("date", { name: "rechnungsstellung", nullable: true })
  invoicing: Date | null;

  @Column("int", { name: "rechnungsnr", nullable: true })
  invoiceNumber: number | null;

  @Column("date", { name: "abrechnung_seit", nullable: true })
  accountingSince: Date | null;

  @Column("decimal", {
    name: "verkaufteBT",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  soldBT: string | null;

  @Column("decimal", {
    name: "geleisteteBT",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  performedBT: string | null;

  @Column("decimal", {
    name: "verkaufteSpesen",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  soldExpenses: string | null;

  @Column("decimal", {
    name: "euroProBT",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  euroPerBT: string | null;

  @Column("tinyint", { name: "APbeiEV", nullable: true, width: 1 })
  APatEV: boolean | null;

  @Column("tinyint", { name: "evaluationBeiEV", nullable: true, width: 1 })
  evaluationAtEV: boolean | null;

  @Column("tinyint", { name: "DLbeiEV", nullable: true, width: 1 })
  DLatEV: boolean | null;

  @Column("tinyint", { name: "geldEingegangen", nullable: true, width: 1 })
  moneyReceived: boolean | null;

  @Column("tinyint", { name: "zahlungsverzug", nullable: true, width: 1 })
  paymentDelay: boolean | null;

  @Column("tinyint", {
    name: "beratungsvertragVorhanden",
    nullable: true,
    width: 1,
  })
  consultingContractProvided: boolean | null;

  @Column("tinyint", { name: "teamvertragVorhanden", nullable: true, width: 1 })
  teamContractProvided: boolean | null;

  @Column("tinyint", { name: "AngebotinAlfresco", nullable: true, width: 1 })
  offerInAlfresco: boolean | null;

  @Column("tinyint", {
    name: "AbweichungvomStandard",
    nullable: true,
    width: 1,
  })
  deviationFromStandard: boolean | null;

  @Column("tinyint", { name: "QMFreigabe", nullable: true, width: 1 })
  qmApproval: boolean | null;

  @Column("varchar", { name: "einsatzort", nullable: true, length: 200 })
  jobSite: string | null;

  @Column("datetime", { name: "ausschreibungdatum", nullable: true })
  tenderDate: Date | null;

  @Column("varchar", {
    name: "ausschreibungstartschuss",
    nullable: true,
    length: 45,
  })
  estimatedProjectStart: string | null;

  @Column("varchar", { name: "ausschreibungdauer", nullable: true, length: 30 })
  estimatedProjectDuration: string | null;

  @Column("smallint", { name: "ausschreibungBTmin", nullable: true })
  estimatedProjectBTmin: number | null;

  @Column("smallint", { name: "ausschreibungBTmax", nullable: true })
  estimatedProjectBTmax: number | null;

  @Column("decimal", {
    name: "ausschreibungEuroProBT",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  estimatedProjectEuroPerBT: string | null;

  @Column("tinytext", { name: "ausschreibungEuroProBTrange", nullable: true })
  estimatedProjectEuroPerBTrange: string | null;

  @Column("tinyint", { name: "ausschreibungmitglmin", nullable: true })
  estimatedProjectMemberMin: number | null;

  @Column("tinyint", { name: "ausschreibungmitglmax", nullable: true })
  estimatedProjectMemberMax: number | null;

  @Column("text", { name: "besetzungsgremium", nullable: true })
  staffingCommittee: string | null;

  // TODO: Implement enum
  @Column("enum", {
    name: "kundenart",
    nullable: true,
    enum: ["Altkunde", "Neukunde"],
  })
  customerType: "Altkunde" | "Neukunde" | null;

  @Column("varchar", { name: "kundensitz_old", nullable: true, length: 45 })
  customerLocationOld: string | null;

  @Column("varchar", { name: "kundeAdresse1_old", nullable: true, length: 200 })
  customerAddress1Old: string | null;

  @Column("varchar", { name: "kundeAdresse2_old", nullable: true, length: 200 })
  customerAddress2Old: string | null;

  @Column("varchar", { name: "kundeAdresse3_old", nullable: true, length: 200 })
  customerAddress3Old: string | null;

  @Column("int", { name: "akquiseverantw", nullable: true })
  acquisitorId: number | null;

  // TODO: Implement enum
  @Column("enum", {
    name: "akquisemethode",
    nullable: true,
    enum: ["Kunde", "Alumni", "Kurator", "Partner", "PA", "JBTler"],
  })
  acquisitionMethod: "Kunde" | "Alumni" | "Kurator" | "Partner" | "PA" | "JBTler" | null;

  @Column("text", { name: "auftraggeberinfos_old", nullable: true })
  clientInformationOld: string | null;

  @Column("text", { name: "situation", nullable: true })
  situation: string | null;

  @Column("text", { name: "besonderheiten", nullable: true })
  peculiarities: string | null;

  @Column("int", { name: "kernkompetenz", nullable: true })
  coreCompetency: number | null;

  @Column("text", { name: "anforderungsprofil", nullable: true })
  requirementProfile: string | null;

  @Column("varchar", { name: "referenzprojekte", nullable: true, length: 240 })
  referenceProjects: string | null;

  @Column("decimal", {
    name: "nettoverkaufspreisVariabel",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  netSalesPriceVariable: string | null;

  @Column("varchar", { name: "owncloud", nullable: true, length: 50 })
  ownCloud: string | null;

  // Relationships remain unchanged
  @OneToMany(() => MemberHasProject, (memberHasProject) => memberHasProject.project)
  memberHasProjects: MemberHasProject[];

  @ManyToOne(() => Director, (director) => director.projects, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "akquiseverantw", referencedColumnName: "directorId" }])
  acquisitor: Director;

  @ManyToOne(() => Company, (company) => company.projects, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "auftraggeber", referencedColumnName: "companyId" }])
  client: Company;

  @ManyToOne(() => Industry, (industry) => industry.projects, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "branche_old", referencedColumnName: "industryId" }])
  industry: Industry;

  @ManyToMany(() => ContactPerson, (contactperson) => contactperson.projects)
  contactPersons: ContactPerson[];

  @ManyToMany(() => CoreCompetency, (coreCompetency) => coreCompetency.projects)
  coreCompetencies: CoreCompetency[];
}
