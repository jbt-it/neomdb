import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";
import { Generation } from "./Generation";
import { TraineeApplicantVoluntarySchool } from "./TraineeApplicantVoluntarySchool";
import { TraineeApplicantVoluntaryStudy } from "./TraineeApplicantVoluntaryStudy";
import { TraineeApplicantHiwi } from "./TraineeApplicantHiwi";
import { TraineeApplicantInternship } from "./TraineeApplicantInternship";
import { TraineeApplicantLanguage } from "./TraineeApplicantLanguage";

@Index("fk_traineebewerber_generation", ["generation"], {})
@Index("fk_aufgenommen_mitglied", ["admitted"], {})
@Entity("traineebewerber", { schema: "mdb" })
export class TraineeApplicant {
  @PrimaryGeneratedColumn({ type: "int", name: "traineebewerberID" })
  traineeApplicantId: number;

  @Column("int", { name: "generation" })
  generation: number;

  @Column("datetime", { name: "eingangsdatum" })
  applicationDate: Date;

  @Column("tinyint", { name: "eingeladen", width: 1, default: () => "'0'" })
  invited: boolean;

  @Column("tinyint", { name: "aufnehmen", width: 1, default: () => "'0'" })
  toBeAdmitted: boolean;

  @Column("int", { name: "aufgenommen", nullable: true })
  admitted: number | null;

  @Column("varchar", { name: "vorname", nullable: true, length: 45 })
  firstName: string | null;

  @Column("varchar", { name: "nachname", nullable: true, length: 45 })
  lastName: string | null;

  @Column("tinyint", { name: "geschlecht", nullable: true, width: 1 })
  gender: boolean | null;

  @Column("varchar", { name: "bild", nullable: true, length: 45 })
  picture: string | null;

  @Column("date", { name: "geburtsdatum", nullable: true })
  birthDate: Date | null;

  @Column("varchar", { name: "handy", nullable: true, length: 45 })
  mobilePhone: string | null;

  @Column("varchar", { name: "festnetz", nullable: true, length: 45 })
  landlinePhone: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 65 })
  email: string | null;

  @Column("varchar", { name: "heimatAdr_Strasse", nullable: true, length: 100 })
  homeAddressStreet: string | null;

  @Column("varchar", { name: "heimatAdr_Nr", nullable: true, length: 45 })
  homeAddressNumber: string | null;

  @Column("varchar", { name: "heimatAdr_PLZ", nullable: true, length: 45 })
  homeAddressPostalCode: string | null;

  @Column("varchar", { name: "heimatAdr_Ort", nullable: true, length: 100 })
  homeAddressCity: string | null;

  @Column("varchar", {
    name: "studienAdr_Strasse",
    nullable: true,
    length: 100,
  })
  studyAddressStreet: string | null;

  @Column("varchar", { name: "studienAdr_Nr", nullable: true, length: 45 })
  studyAddressNumber: string | null;

  @Column("varchar", { name: "studienAdr_PLZ", nullable: true, length: 45 })
  studyAddressPostalCode: string | null;

  @Column("varchar", { name: "studienAdr_Ort", nullable: true, length: 100 })
  studyAddressCity: string | null;

  @Column("varchar", { name: "studium_Abschluss", nullable: true, length: 45 })
  enrolledDegree: string | null;

  @Column("varchar", {
    name: "studium_Hochschule",
    nullable: true,
    length: 100,
  })
  enrolledUniversity: string | null;

  @Column("varchar", { name: "studium_Fach", nullable: true, length: 45 })
  enrolledSubject: string | null;

  @Column("varchar", {
    name: "studium_SonstigesFach",
    nullable: true,
    length: 200,
  })
  enrolledOtherSubject: string | null;

  @Column("varchar", { name: "studium_Beginn", nullable: true, length: 45 })
  studyStart: Date | null;

  @Column("varchar", {
    name: "studium_Fachsemester",
    nullable: true,
    length: 45,
  })
  studySemester: string | null;

  @Column("varchar", {
    name: "studium_1Vertiefung",
    nullable: true,
    length: 200,
  })
  studyFirstMajor: string | null;

  @Column("varchar", {
    name: "studium_2Vertiefung",
    nullable: true,
    length: 200,
  })
  studySecondMajor: string | null;

  @Column("varchar", {
    name: "studium_3Vertiefung",
    nullable: true,
    length: 200,
  })
  studyThirdMajor: string | null;

  @Column("varchar", {
    name: "studium_BachelorFach",
    nullable: true,
    length: 200,
  })
  bachelorSubject: string | null;

  @Column("varchar", {
    name: "studium_BachelorHochschule",
    nullable: true,
    length: 200,
  })
  bachelorUniversity: string | null;

  @Column("varchar", {
    name: "berufsausbildung_Beruf",
    nullable: true,
    length: 200,
  })
  apprenticeshipJob: string | null;

  @Column("varchar", {
    name: "berufsausbildung_Unternehmen",
    nullable: true,
    length: 200,
  })
  apprenticeshipCompany: string | null;

  @Column("varchar", {
    name: "berufsausbildung_Ort",
    nullable: true,
    length: 100,
  })
  apprenticeshipLocation: string | null;

  @Column("varchar", {
    name: "berufsausbildung_Beginn",
    nullable: true,
    length: 45,
  })
  apprenticeshipStart: Date | null;

  @Column("varchar", {
    name: "berufsausbildung_Ende",
    nullable: true,
    length: 45,
  })
  apprenticeshipEnd: Date | null;

  @Column("varchar", { name: "beruf_Taetigkeit", nullable: true, length: 200 })
  occupation: string | null;

  @Column("varchar", { name: "beruf_Unternehmen", nullable: true, length: 200 })
  occupationCompany: string | null;

  @Column("varchar", { name: "beruf_Ort", nullable: true, length: 100 })
  occupationLocation: string | null;

  @Column("varchar", { name: "beruf_Beginn", nullable: true, length: 45 })
  occupationStart: Date | null;

  @Column("varchar", { name: "beruf_Ende", nullable: true, length: 45 })
  occupationEnd: Date | null;

  @Column("mediumtext", { name: "edv", nullable: true })
  itSkills: string | null;

  @Column("mediumtext", { name: "hobbies", nullable: true })
  hobbies: string | null;

  @Column("mediumtext", { name: "zeit", nullable: true })
  timeInvestment: string | null;

  @Column("mediumtext", { name: "motivation", nullable: true })
  motivation: string | null;

  @Column("int", { name: "radiovalue1", nullable: true })
  selfAssessment1: number | null;

  @Column("int", { name: "radiovalue2", nullable: true })
  selfAssessment2: number | null;

  @Column("int", { name: "radiovalue3", nullable: true })
  selfAssessment3: number | null;

  @Column("int", { name: "radiovalue4", nullable: true })
  selfAssessment4: number | null;

  @Column("int", { name: "radiovalue5", nullable: true })
  selfAssessment5: number | null;

  @Column("int", { name: "radiovalue6", nullable: true })
  selfAssessment6: number | null;

  @Column("int", { name: "radiovalue7", nullable: true })
  selfAssessment7: number | null;

  @Column("int", { name: "radiovalue8", nullable: true })
  selfAssessment8: number | null;

  @Column("tinyint", { name: "flyer", nullable: true, width: 1 })
  flyer: boolean | null;

  @Column("tinyint", { name: "plakate", nullable: true, width: 1 })
  posters: boolean | null;

  @Column("tinyint", { name: "vorlesungen", nullable: true, width: 1 })
  lectures: boolean | null;

  @Column("tinyint", { name: "freunde", nullable: true, width: 1 })
  friends: boolean | null;

  @Column("tinyint", { name: "internet", nullable: true, width: 1 })
  internet: boolean | null;

  @Column("tinyint", { name: "sonstiges", nullable: true, width: 1 })
  others: boolean | null;

  @Column("text", { name: "sonstigesText", nullable: true })
  othersText: string | null;

  @Column("tinyint", { name: "workingWeekend", nullable: true, width: 1 })
  workingWeekend: boolean | null;

  // TODO: Implement enum
  @Column("enum", {
    name: "verfuegbarkeitAuswahlWE",
    nullable: true,
    enum: ["kannImmer", "nichtFR", "nichtSA", "nichtSO"],
  })
  availabilitySelectionWeekend: "kannImmer" | "nichtFR" | "nichtSA" | "nichtSO" | null;

  @Column("tinyint", { name: "socialmedia", nullable: true })
  socialMedia: number | null;

  @Column("tinyint", { name: "campusrallye", nullable: true })
  campusRally: number | null;

  @Column("tinyint", { name: "partner", nullable: true })
  partner: number | null;

  @Column("int", { name: "newsletter", nullable: true })
  newsletter: number | null;

  @Column("int", { name: "infostand", nullable: true })
  informationStand: number | null;

  @ManyToOne(() => Member, (member) => member.traineeApplicants, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "aufgenommen", referencedColumnName: "memberId" }])
  admittedMember: Member;

  @ManyToOne(() => Generation, (generation) => generation.traineeApplicants, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "generation", referencedColumnName: "generationId" }])
  generationEntity: Generation;

  @OneToMany(
    () => TraineeApplicantVoluntarySchool,
    (traineeApplicantVoluntarySchool) => traineeApplicantVoluntarySchool.traineeApplicant
  )
  traineeApplicantVoluntarySchools: TraineeApplicantVoluntarySchool[];

  @OneToMany(
    () => TraineeApplicantVoluntaryStudy,
    (traineeApplicantVoluntaryStudy) => traineeApplicantVoluntaryStudy.traineeApplicant
  )
  traineeApplicantVoluntaryStudies: TraineeApplicantVoluntaryStudy[];

  @OneToMany(() => TraineeApplicantHiwi, (traineeApplicantHiwi) => traineeApplicantHiwi.traineeApplicant)
  traineeApplicantHiwis: TraineeApplicantHiwi[];

  @OneToMany(
    () => TraineeApplicantInternship,
    (traineeApplicantInternship) => traineeApplicantInternship.traineeApplicant
  )
  traineeApplicantInternships: TraineeApplicantInternship[];

  @OneToMany(() => TraineeApplicantLanguage, (traineeApplicantLanguage) => traineeApplicantLanguage.traineeApplicant)
  traineeApplicantLanguages: TraineeApplicantLanguage[];
}
