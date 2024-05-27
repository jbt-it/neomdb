import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ItSkill } from "./ItSkill";
import { Generation } from "./Generation";
import { InternalProject } from "./InternalProject";
import { Department } from "./Department";
import { Permission } from "./Permission";
import { MemberHasEvent } from "./MemberHasEvent";
import { MemberHasEventWw } from "./MemberHasEventWw";
import { MemberHasExpertise } from "./MemberHasExpertise";
import { MemberHasWorkshopInstance } from "./MemberHasWorkshopInstance";
import { MemberHasStatus } from "./MemberHasStatus";
import { Mmtracking } from "./Mmtracking";
import { PasswordReset } from "./PasswordReset";
import { Internship } from "./Internship";
import { WorkshopFeedbackHasMember } from "./WorkshopFeedbackHasMitglied";
import { TraineeApplicant } from "./TraineeApplicant";
import { MemberHasDirectorPosition } from "./MemberHasDirectorPosition";
import { MemberHasProject } from "./MemberHasProject";
import { Language } from "./Language";
import { MemberStatus } from "./MemberStatus";
import { MemberHasOtherPosition } from "./MemberHasOtherPosition";
import { booleanTransformer } from "../../utils/dataTransformer";

@Index("name", ["name"], { unique: true })
@Index("mitgliedID_UNIQUE", ["memberId"], { unique: true })
@Index("fk_Mitglied_jbt_email", ["jbtEmail"], { unique: true })
@Index("fk_Mitglied_Mitglied1", ["mentor"], {})
@Index("fk_Mitglied_Mitgliedstatus1", ["memberStatus"], {})
@Index("fk_Mitglied_Ressort1", ["departmentId"], {})
@Index("fk_Mitglied_Generation", ["generation"], {})
@Entity("mitglied", { schema: "mdb" })
export class Member {
  // ATTRIBUTES

  @PrimaryGeneratedColumn({ type: "int", name: "mitgliedID" })
  memberId: number;

  @Column("varchar", { name: "vorname", length: 30 })
  firstName: string;

  @Column("varchar", { name: "nachname", length: 30 })
  lastName: string;

  @Column("varchar", { name: "name", unique: true, length: 60 })
  name: string;

  @Column("varchar", { name: "passwordHash", nullable: true, length: 255 })
  passwordHash: string | null;

  @Column("varchar", { name: "passwort", nullable: true, length: 45 })
  password: string | null;

  @Column("varchar", { name: "icalToken", nullable: true, length: 16 })
  icalToken: string | null;

  @Column("tinyint", {
    name: "geschlecht",
    nullable: true,
    width: 1,
    transformer: booleanTransformer,
  })
  gender: boolean | null;

  @Column("date", { name: "geburtsdatum", nullable: true })
  birthday: Date | null;

  @Column("varchar", { name: "handy", nullable: true, length: 20 })
  mobile: string | null;

  @Column("varchar", { name: "fax", nullable: true, length: 20 })
  fax: string | null;

  @Column("varchar", {
    name: "jbt_email",
    nullable: true,
    unique: true,
    length: 60,
  })
  jbtEmail: string | null;

  @Column("int", { name: "mitgliedstatus" })
  memberStatusId: number;

  @Column("int", { name: "generation", nullable: true })
  generationId: number | null;

  @Column("int", { name: "internesprojekt", nullable: true })
  internalProjectId: number | null;

  @Column("varchar", {
    name: "internesprojekt_alt",
    nullable: true,
    length: 150,
  })
  internalProjectOld: string | null;

  @Column("int", { name: "mentor", nullable: true })
  mentorId: number | null;

  @Column("date", { name: "trainee_seit", nullable: true })
  traineeSince: Date | null;

  @Column("date", { name: "mitglied_seit", nullable: true })
  memberSince: Date | null;

  @Column("date", { name: "alumnus_seit", nullable: true })
  alumnusSince: Date | null;

  @Column("date", { name: "senior_seit", nullable: true })
  seniorSince: Date | null;

  @Column("date", { name: "aktiv_seit", nullable: true })
  activeSince: Date | null;

  @Column("date", { name: "passiv_seit", nullable: true })
  passiveSince: Date | null;

  @Column("date", { name: "ausgetreten_seit", nullable: true })
  exitedSince: Date | null;

  @Column("int", { name: "ressort" })
  departmentId: number;

  @Column("varchar", { name: "arbeitgeber", nullable: true, length: 30 })
  employer: string | null;

  @Column("varchar", { name: "strasse1", nullable: true, length: 30 })
  street1: string | null;

  @Column("varchar", { name: "plz1", nullable: true, length: 10 })
  postalCode1: string | null;

  @Column("varchar", { name: "ort1", nullable: true, length: 30 })
  city1: string | null;

  @Column("varchar", { name: "tel1", nullable: true, length: 20 })
  phone1: string | null;

  @Column("varchar", { name: "email1", nullable: true, length: 60 })
  email1: string | null;

  @Column("varchar", { name: "strasse2", nullable: true, length: 30 })
  street2: string | null;

  @Column("varchar", { name: "plz2", nullable: true, length: 10 })
  postalCode2: string | null;

  @Column("varchar", { name: "ort2", nullable: true, length: 30 })
  city2: string | null;

  @Column("varchar", { name: "tel2", nullable: true, length: 20 })
  phone2: string | null;

  @Column("varchar", { name: "email2", length: 60 })
  email2: string;

  @Column("varchar", { name: "hochschule", nullable: true, length: 50 })
  university: string | null;

  @Column("varchar", { name: "studiengang", nullable: true, length: 50 })
  courseOfStudy: string | null;

  @Column("date", { name: "studienbeginn", nullable: true })
  studyStart: Date | null;

  @Column("date", { name: "studienende", nullable: true })
  studyEnd: Date | null;

  @Column("varchar", { name: "vertiefungen", nullable: true, length: 1200 })
  specializations: string | null;

  @Column("varchar", { name: "ausbildung", nullable: true, length: 60 })
  apprenticeship: string | null;

  @Column("varchar", { name: "kontoinhaber", nullable: true, length: 2048 })
  accountHolder: string | null;

  @Column("varchar", { name: "iban", nullable: true, length: 2048 })
  iban: string | null;

  @Column("varchar", { name: "bic", nullable: true, length: 2048 })
  bic: string | null;

  @Column("text", { name: "engagement", nullable: true })
  commitment: string | null;

  @Column("text", { name: "bemerkungen", nullable: true })
  remarks: string | null;

  @Column("text", { name: "austritt", nullable: true })
  departure: string | null;

  @Column("date", { name: "austrittsdatum", nullable: true })
  departureDate: string | null;

  @Column("varchar", { name: "bild", nullable: true, length: 60 })
  picture: string | null;

  @Column("date", { name: "canPL", nullable: true })
  canPL: Date | null;

  @Column("date", { name: "canQM", nullable: true })
  canQM: Date | null;

  @Column("date", { name: "lastchange", nullable: true })
  lastChange: Date | null;

  @Column("text", { name: "sonstige_ws", nullable: true })
  otherWs: string | null;

  @Column("int", { name: "fuehrerschein", default: () => "'0'" })
  drivingLicense: number;

  @Column("int", { name: "fuehrerschein2", default: () => "'0'" })
  drivingLicense2: number;

  @Column("int", { name: "fuehrerschein3", default: () => "'0'" })
  drivingLicense3: number;

  @Column("tinyint", {
    name: "ersthelferausbildung",
    width: 1,
    default: () => "'0'",
    transformer: booleanTransformer,
  })
  firstAidTraining: boolean;

  @Column("int", { name: "wahl_mentor", nullable: true })
  choiceMentor: number | null;

  @Column("int", { name: "wahl_mentor1", nullable: true })
  choiceMentor1: number | null;

  @Column("int", { name: "wahl_mentor2", nullable: true })
  choiceMentor2: number | null;

  @Column("int", { name: "wahl_mentor3", nullable: true })
  choiceMentor3: number | null;

  @Column("int", { name: "wahl_internesprojekt", nullable: true })
  choiceInternalProject: number | null;

  @Column("int", { name: "wahl_internesprojekt1", nullable: true })
  choiceInternalProject1: number | null;

  @Column("mediumtext", {
    name: "wahl_internesprojekt1_motivation",
    nullable: true,
  })
  choiceInternalProject1Motivation: string | null;

  @Column("int", { name: "wahl_internesprojekt2", nullable: true })
  choiceInternalProject2: number | null;

  @Column("mediumtext", {
    name: "wahl_internesprojekt2_motivation",
    nullable: true,
  })
  choiceInternalProject2Motivation: string | null;

  @Column("int", { name: "wahl_internesprojekt3", nullable: true })
  choiceInternalProject3: number | null;

  @Column("mediumtext", {
    name: "wahl_internesprojekt3_motivation",
    nullable: true,
  })
  choiceInternalProject3Motivation: string | null;

  @Column("int", { name: "wahl_ressort", nullable: true })
  choiceDepartment: number | null;

  @Column("int", { name: "wahl_ressort1", nullable: true })
  choiceDepartment1: number | null;

  @Column("int", { name: "wahl_ressort2", nullable: true })
  choiceDepartment2: number | null;

  @Column("int", { name: "wahl_ressort3", nullable: true })
  choiceDepartment3: number | null;

  @Column("text", { name: "notizen", nullable: true })
  notes: string | null;

  // RELATIONS

  @OneToMany(() => ItSkill, (itSkills) => itSkills.member)
  itSkills: ItSkill[];

  @ManyToMany(() => Generation, (generation) => generation.members)
  generations: Generation[];

  @ManyToMany(() => InternalProject, (internalProject) => internalProject.qualityManagers)
  internalProjects: InternalProject[];

  @ManyToOne(() => Generation, (generation) => generation.members, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "generation", referencedColumnName: "generationId" }])
  generation: Generation;

  @ManyToOne(() => Member, (member) => member.mentees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mentor", referencedColumnName: "memberId" }])
  mentor: Member;

  @OneToMany(() => Member, (member) => member.mentor)
  mentees: Member[];

  @ManyToOne(() => MemberStatus, (memberStatus) => memberStatus.members, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mitgliedstatus", referencedColumnName: "memberStatusId" }])
  memberStatus: MemberStatus;

  @ManyToOne(() => Department, (department) => department.members, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ressort", referencedColumnName: "departmentId" }])
  department: Department;

  @OneToMany(() => MemberHasOtherPosition, (memberHasOtherPosition) => memberHasOtherPosition.member)
  memberHasOtherPositions: MemberHasOtherPosition[];

  @ManyToMany(() => Permission, (permission) => permission.members)
  permissions: Permission[];

  @OneToMany(() => MemberHasEvent, (memberHasEvent) => memberHasEvent.member)
  memberHasEvents: MemberHasEvent[];

  @OneToMany(() => MemberHasEventWw, (memberHasEventww) => memberHasEventww.member)
  memberHasEventwws: MemberHasEventWw[];

  @OneToMany(() => MemberHasDirectorPosition, (memberHasDircetorPositions) => memberHasDircetorPositions.member)
  memberHasDirectorPositions: MemberHasDirectorPosition[];

  @OneToMany(() => MemberHasExpertise, (memberHasExpertise) => memberHasExpertise.member)
  memberHasExpertises: MemberHasExpertise[];

  @OneToMany(() => MemberHasProject, (memberHasProject) => memberHasProject.member)
  memberHasProjects: MemberHasProject[];

  @OneToMany(() => MemberHasWorkshopInstance, (MemberHasWorkshopInstance) => MemberHasWorkshopInstance.member)
  memberHasWorkshopInstances: MemberHasWorkshopInstance[];

  @OneToMany(() => MemberHasStatus, (memberHasStatus) => memberHasStatus.member)
  memberHasStatuses: MemberHasStatus[];

  @ManyToMany(() => Mmtracking, (mmtracking) => mmtracking.members)
  @JoinTable({
    name: "mmtracking_has_mitglied",
    joinColumns: [{ name: "mitglied_mitgliedID", referencedColumnName: "memberId" }],
    inverseJoinColumns: [{ name: "mmtracking_mmtrackingID", referencedColumnName: "mmtrackingId" }],
    schema: "mdb",
  })
  mmtrackings: Mmtracking[];

  @OneToOne(() => PasswordReset, (passwordReset) => passwordReset.memberJbtEmail)
  passwordReset: PasswordReset;

  @OneToMany(() => Internship, (internship) => internship.member)
  internships: Internship[];

  @OneToMany(() => WorkshopFeedbackHasMember, (WorkshopFeedbackHasMember) => WorkshopFeedbackHasMember.member)
  workshopFeedbackHasMembers: WorkshopFeedbackHasMember[];

  @OneToMany(() => Language, (languages) => languages.member)
  languages: Language[];

  @OneToMany(() => TraineeApplicant, (traineeApplicant) => traineeApplicant.admittedMember)
  traineeApplicants: TraineeApplicant[];

  @ManyToMany(() => InternalProject, (internalProject) => internalProject.qualityManagers)
  qualityManagers: InternalProject[];

  @ManyToOne(() => InternalProject, (internalProject) => internalProject.members)
  @JoinColumn({ name: "internesprojekt", referencedColumnName: "internalProjectId" })
  internalProject: InternalProject;
}
