import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";
import { Project } from "./Project";

@Index("fk_projects_has_members_members1", ["memberId"], {})
@Entity("mitglied_has_projekt", { schema: "mdb" })
export class MemberHasProject {
  @Column("int", { primary: true, name: "projekt_projektID" })
  projectId: number;

  @Column("int", { primary: true, name: "mitglied_mitgliedID" })
  memberId: number;

  @Column("decimal", {
    name: "BTAufteilung",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  btAllocation: string | null;

  @Column("decimal", {
    name: "SpesenAufteilung",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  expensesAllocation: string | null;

  // TODO: Implement enum
  @Column("enum", {
    name: "typ",
    nullable: true,
    enum: ["Bewerbung", "Mitglied", "PL", "QM"],
  })
  type: "Bewerbung" | "Mitglied" | "PL" | "QM" | null;

  @Column("date", { name: "datum", nullable: true })
  date: Date | null;

  @Column("datetime", { name: "bewerbungsdatum", nullable: true })
  applicationDate: Date | null;

  @Column("date", { name: "vertragFreieMitarbeit", nullable: true })
  freelancerContract: Date | null;

  @Column("date", { name: "geldUeberwiesen", nullable: true })
  moneyTransferred: Date | null;

  @Column("int", { name: "semester", nullable: true })
  semester: number | null;

  @Column("text", { name: "praktika", nullable: true })
  internship: string | null;

  @Column("text", { name: "ausbildung", nullable: true })
  apprenticeship: string | null;

  @Column("text", { name: "werkstudententaetigkeit", nullable: true })
  studentJob: string | null;

  @Column("text", { name: "seminararbeiten", nullable: true })
  seminarPapers: string | null;

  @Column("text", { name: "workshops", nullable: true })
  workshops: string | null;

  // TODO: Implement enum
  @Column("set", {
    name: "internesEngagement",
    nullable: true,
    enum: ["Vorstandstätigkeit", "Teamleiter"],
  })
  internalCommitment: ("Vorstandstätigkeit" | "Teamleiter")[] | null;

  // TODO: Implement enum
  @Column("set", {
    name: "vorleistungen",
    nullable: true,
    enum: ["Herstellung des Erstkontakts", "Schreiben des Angebots"],
  })
  preliminaryWork: ("Herstellung des Erstkontakts" | "Schreiben des Angebots")[] | null;

  @Column("text", { name: "ausserordentlichesEngagement", nullable: true })
  extraordinaryCommitment: string | null;

  // TODO: Implement enum
  @Column("enum", {
    name: "verfuegbarkeit",
    nullable: true,
    enum: ["Ohne Einschränkung", "Mit Einschränkung"],
  })
  availability: "Ohne Einschränkung" | "Mit Einschränkung" | null;

  @Column("text", { name: "einschraenkung", nullable: true })
  restriction: string | null;

  @Column("text", { name: "motivation", nullable: true })
  motivation: string | null;

  @ManyToOne(() => Member, (member) => member.memberHasProjects, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }])
  member: Member;

  @ManyToOne(() => Project, (project) => project.memberHasProjects, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "projekt_projektID", referencedColumnName: "projectId" }])
  project: Project;
}
