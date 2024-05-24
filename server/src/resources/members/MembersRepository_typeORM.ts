import {
  ItSkillDto,
  ItSkillsValue,
  LanguageDto,
  LanguageValue,
  MentorDto,
  NewMember,
  UpdatedMember,
} from "typeOrm/types/memberTypes";
import { AppDataSource } from "../../datasource";
import { Language } from "../../typeOrm/entities/Language";
import { Member } from "../../typeOrm/entities/Member";
import { MemberHasDirectorPosition } from "../../typeOrm/entities/MemberHasDirectorPosition";
import { MemberStatus } from "../../typeOrm/entities/MemberStatus";
import { Permission } from "../../typeOrm/entities/Permission";
import { PermissionDTO } from "../../typeOrm/types/authTypes";
import { LessThan, MoreThan } from "typeorm";
import { ItSkill } from "../../typeOrm/entities/ItSkill";

export const MembersRepository_typeORM = AppDataSource.getRepository(Member).extend({
  /**
   * Retrieves all members as a list
   * @returns A list of members
   */
  getMembersWithDepartment(): Promise<Member[]> {
    return this.find({ relations: ["department", "memberStatus"] });
  },

  /**
   * Retrieves the member with its permissions
   * @param memberID The id of the member
   * @returns The member with its permissions or null if no member was found
   */
  getMemberByIDWithPermissions(memberID: number): Promise<Member | null> {
    return this.findOne({ where: { memberId: memberID }, relations: ["permissions"] });
  },

  /**
   * Retrieves all active members as a list with department information
   * @returns A list of members with the department
   */
  getActiveMembersWithDepartmentAndWithDirectorPositions(): Promise<Member[]> {
    /*
     * Corresponds to following query:
     *    SELECT mitgliedID, vorname, nachname, ressort, bezeichnung
     *      FROM mitglied, ressort
     *      WHERE ressort = ressortID AND mitgliedstatus <= 3
     *      AND NOT EXISTS (
     *        SELECT mitglied_mitgliedID
     *        FROM mitglied_has_evposten
     *        WHERE von < DATE(NOW()) AND DATE(NOW()) < bis AND mitglied_mitgliedID = mitgliedID
     *        )
     *      ORDER BY ressortID;
     */

    return (
      this.createQueryBuilder("member")
        .leftJoinAndSelect("member.department", "department")
        .leftJoin("member.memberHasDirectorPositions", "memberHasDirectorPositions")
        // Applying NOT EXISTS with a subquery
        .where(
          `NOT EXISTS (
      SELECT 1 FROM mitglied_has_evposten 
      WHERE von < CURRENT_DATE() 
      AND CURRENT_DATE() < bis 
      AND mitglied_mitgliedID = mitgliedID
    )`
        )
        .orderBy("department.departmentId")
        .andWhere("member.memberStatus <= :status", { status: 3 })
        .getMany()
    );
  },

  /**
   * Retrieves a member by its id
   * @param memberID The id of the member
   * @returns The member or null if no member was found
   */
  getMemberByID(memberID: number): Promise<Member | null> {
    return this.findOne({ where: { memberId: memberID }, relations: ["memberStatus"] });
  },

  /**
   * Retrieves a member by its username
   * @param name The username of the member
   * @returns The member or null if no member was found
   */
  getMemberByName(name: string): Promise<Member | null> {
    return this.findOne({ where: { name: name }, relations: ["permissions"] });
  },

  /**
   * Retrieves the director permissions of a member
   * @throws QueryError if the query fails
   * @returns The director permissions of a member or null if no permissions were found
   */
  getMemberByNameWithPermissions(name: string): Promise<Member | null> {
    return this.createQueryBuilder("member")
      .leftJoinAndSelect("member.permissions", "permissions")
      .leftJoinAndSelect("member.memberHasDirectorPositions", "memberHasDirectorPositions")
      .leftJoinAndSelect("memberHasDirectorPositions.director", "director")
      .leftJoinAndSelect("director.directorHasPermissions", "directorHasPermissions")
      .where("member.name = :name", { name })
      .getOne();
  },

  /**
   * Retrieves the member with the mentor relation
   * @param memberID The id of the member
   * @returns The member with the mentor relation or null if no member was found
   */
  getMemberByIDWithMentor(memberID: number): Promise<Member | null> {
    return this.findOne({ where: { memberId: memberID }, relations: ["mentor"] });
  },

  /**
   * Retrieves the member with the mentor, mentees, languages and itSkills relation
   * @param memberID The id of the member
   * @returns The member with the mentor, mentees, languages and itSkills relation or null if no member was found
   */
  getMemberDetailsByID(memberID: number): Promise<Member | null> {
    return this.findOne({
      where: { memberId: memberID },
      relations: ["mentor", "mentees", "languages", "itSkills", "department", "memberStatus"],
    });
  },

  /**
   * Updates the personal data of a member
   * @param memberId The id of the member to update
   * @param member The updated member
   * @throws QueryError if the query fails
   */
  updateMemberPersonalDataByID(memberId: number, memberData: UpdatedMember) {
    return this.update(memberId, {
      mobile: memberData.mobile,
      employer: memberData.employer,
      street1: memberData.street1,
      postalCode1: memberData.postalCode1,
      city1: memberData.city1,
      phone1: memberData.phone1,
      email1: memberData.email1,
      street2: memberData.street2,
      postalCode2: memberData.postalCode2,
      city2: memberData.city2,
      phone2: memberData.phone2,
      email2: memberData.email2,
      university: memberData.university,
      courseOfStudy: memberData.courseOfStudy,
      studyStart: memberData.studyStart,
      studyEnd: memberData.studyEnd,
      specializations: memberData.specializations,
      apprenticeship: memberData.apprenticeship,
      accountHolder: memberData.accountHolder,
      iban: memberData.iban,
      bic: memberData.bic,
      lastChange: new Date(),
      drivingLicense: memberData.drivingLicense,
      firstAidTraining: memberData.firstAidTraining,
    });
  },

  /**
   * Updates the critical data of a member
   * @param memberId The id of the member to update
   * @param member The updated member
   * @param mentor The mentor of the updated member
   * @throws QueryError if the query fails
   */
  updateMemberCriticalDataByID(memberId: number, memberData: UpdatedMember, mentor: MentorDto | null) {
    return this.update(memberId, {
      memberStatusId: memberData.memberStatus.memberStatusId,
      generationId: memberData.generation,
      internalProjectId: memberData.internalProject ? memberData.internalProject.internalProjectId : null,
      mentorId: mentor ? mentor.memberId : null,
      traineeSince: memberData.traineeSince,
      memberSince: memberData.memberSince,
      alumnusSince: memberData.alumnusSince,
      seniorSince: memberData.seniorSince,
      activeSince: memberData.activeSince,
      passiveSince: memberData.passiveSince,
      exitedSince: memberData.exitedSince,
      departmentId: memberData.department.departmentId,
      commitment: memberData.commitment,
      canPL: memberData.canPL,
      canQM: memberData.canQM,
    });
  },

  /**
   * Updates the passwordHash of a member
   * @param memberID The id of the member
   * @param newPasswordHash The new password hash
   * @returns A promise that resolves when the update is done
   */
  updateUserPasswordByUserNameAndUserID(name: string, memberID: number, newPasswordHash: string): Promise<void> {
    return this.update({ memberId: memberID, name: name }, { passwordHash: newPasswordHash });
  },

  /**
   * Updates the status of a member and sets the lastChanged date
   * @param memberID The id of the member
   * @param statusId The id of the new status
   * @returns A promise that resolves when the update is done
   */
  updateMemberStatus(memberID: number, statusId: number): Promise<void> {
    return this.update(memberID, { memberStatusId: statusId, lastChange: new Date() });
  },

  /**
   * Creates a member
   * @param member The details of the new member to create
   * @returns The saved member's memberId
   */
  async createMember(member: NewMember): Promise<number> {
    const savedMember = await this.save(member);
    return savedMember.memberId;
  },

  /**
   * Saves a member
   * @param member The member to save
   * @returns The saved member's memberId
   */
  async saveMember(member: Member): Promise<Member> {
    return this.save(member);
  },
});

/**
 * Creates and exports the MemberStatus Repository
 */
export const MemberStatusRespository_typeORM = AppDataSource.getRepository(MemberStatus).extend({
  /**
   * Retrieves all member statuses as a list
   * @returns A list of member statuses
   */
  getMemberStatusByName(statusName: string): Promise<MemberStatus> {
    return this.findOne({ where: { name: statusName } });
  },
});

/**
 * Creates and exports the Language Repository
 */
export const LanguagesRepository_typeORM = AppDataSource.getRepository(Language).extend({
  /**
   * Retrieves all the distinct values of the languages
   * @returns A list of distinct language values
   */
  getLanguageValues(): Promise<LanguageValue[]> {
    return this.createQueryBuilder("language").select("language.value").distinct(true).getRawMany();
  },

  /**
   * Updates the languages of a member
   * @param memberID The id of the member
   * @param updatedLanguages The updated languages
   * @returns A promise that resolves when the update is done
   */
  updateMemberLanguagesByID(memberID: number, updatedLanguages: LanguageDto[]) {
    // 1. Delete the existing entries of languages of the specific member
    this.delete({ memberId: memberID });

    // 2. Create new entries for the updated languages
    const newLanguages = updatedLanguages.map((language) => {
      const newLanguage = new Language();
      newLanguage.memberId = memberID;
      newLanguage.value = language.value;
      newLanguage.level = language.level;
      return newLanguage;
    });

    // 3. Save all new language entries
    return this.save(newLanguages);
  },
});

/**
 * Creates and exports the ItSkills Repository
 */
export const ItSkillsRepository_typeORM = AppDataSource.getRepository(ItSkill).extend({
  /**
   * Retrieves the all distinct values of the itSkills
   * @returns A list of distinct itSkill values
   */
  getItSkillValues(): Promise<ItSkillsValue[]> {
    return this.createQueryBuilder("itSkill").select("itSkill.value").distinct(true).getMany();
  },
  /**
   * Updates the languages of a member
   * @param memberId The id of the member
   * @param updatedItSkills The updated languages
   * @returns A promise that resolves when the update is done
   */
  updateMemberItSkillsByID(memberId: number, updatedItSkills: ItSkillDto[]) {
    // 1. Delete the existing entries of languages of the specific member
    this.delete({ memberId: memberId });

    // 2. Create new entries for the updated languages
    const newItSkills = updatedItSkills.map((language) => {
      const newItSkill = new ItSkill();
      newItSkill.memberId = memberId;
      newItSkill.value = language.value;
      newItSkill.level = language.level;
      return newItSkill;
    });

    // 3. Save all new language entries
    return this.save(newItSkills);
  },
});

/**
 * Creates and exports the Permission Repository
 */
export const PermissionsRepository_typeORM = AppDataSource.getRepository(Permission).extend({
  /**
   * Retrieves all permissions as a list
   * @returns A list of permissions
   */
  getPermissions(): Permission[] {
    return this.find();
  },

  /**
   * Retrieves a permission by its id
   * @param permissionID The id of the permission
   * @returns The permission or null if no permission was found
   */
  getPermissionByID(permissionID: number): Promise<Permission | null> {
    return this.findOne({ where: { permissionId: permissionID } });
  },

  /**
   * Retrieves all permission with the assigned members and directors
   * @returns A list of permissions with the assigned members and directors
   */
  async getPermissionWithAssignments(): Promise<Permission[]> {
    return this.find({ relations: ["directorHasPermissions", "directorHasPermissions.director", "members"] });
  },
});

export const MemberHasDirectorPositionRepository_typeORM = AppDataSource.getRepository(
  MemberHasDirectorPosition
).extend({
  /**
   * Retrieves all members that are or were directors
   * @returns A list of members that are or were directors
   */
  getAllDirectors(): Promise<MemberHasDirectorPosition[]> {
    return this.find({ relations: ["director", "member"] });
  },

  /**
   * Retrieves the members that are currently directors
   * @returns A list of members that are currently directors
   */
  getCurrentDirectors(): Promise<MemberHasDirectorPosition[]> {
    return this.find({
      where: {
        from: LessThan(new Date()), // 'from' date should be less than the current date
        until: MoreThan(new Date()), // 'until' date should be more than the current date
      },
      relations: ["director", "member", "director.department"],
    });
  },

  /**
   * Retrieves the director permissions of a member
   * @param memberID The id of the member
   * @returns The director permissions of a member
   */
  getDirectorPermissionsByMemberID(memberID: number): Promise<PermissionDTO[]> {
    return this.createQueryBuilder("memberHasDirectorPositions")
      .select(
        "directorHasPermissions.permissionId as permissionId, directorHasPermissions.canDelegate as canDelegate, directorHasPermissions.directorId as directorId"
      )
      .leftJoin("memberHasDirectorPositions.director", "director")
      .leftJoin("director.directorHasPermissions", "directorHasPermissions")
      .where("memberHasDirectorPositions.memberId = :memberID", { memberID })
      .andWhere("memberHasDirectorPositions.from <= NOW()")
      .andWhere("memberHasDirectorPositions.until >= NOW()")
      .getRawMany();
  },
});
