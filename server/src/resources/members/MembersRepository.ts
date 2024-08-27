import { ItSkillsValue, LanguageValue, MemberDirectorPositionsDto, NewMember } from "types/memberTypes";
import { EntityManager, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../../datasource";
import { Generation } from "../../entities/Generation";
import { ItSkill } from "../../entities/ItSkill";
import { Language } from "../../entities/Language";
import { Member } from "../../entities/Member";
import { MemberHasDirectorPosition } from "../../entities/MemberHasDirectorPosition";
import { MemberStatus } from "../../entities/MemberStatus";
import { Permission } from "../../entities/Permission";
import { PermissionDTO } from "../../types/authTypes";
import { Director } from "../../entities/Director";

/**
 * Creates and exports the Members Repository
 */
export const MembersRepository = AppDataSource.getRepository(Member).extend({
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
      relations: ["mentor", "mentees", "internalProject", "languages", "itSkills", "department", "memberStatus"],
    });
  },

  /**
   * Creates a member
   * @param member The details of the new member to create
   * @returns The saved member's memberId
   */
  async createMember(member: NewMember): Promise<number> {
    const newMember = await this.save(member);
    return newMember.memberId;
  },

  /**
   * Saves a member
   * @param member The member to save
   * @returns The saved member's memberId
   */
  async saveMember(member: Member, transactionalEntityManager?: EntityManager): Promise<Member> {
    return transactionalEntityManager ? transactionalEntityManager.save(member) : this.save(member);
  },
});

/**
 * Creates and exports the MemberStatus Repository
 */
export const MemberStatusRespository = AppDataSource.getRepository(MemberStatus).extend({
  /**
   * Retrieves a member status by its name
   * @param statusID The name of the member status
   * @returns The member status or null if no member status was found
   */
  getMemberStatusByName(statusName: string): Promise<MemberStatus> {
    return this.findOne({ where: { name: statusName } });
  },

  /**
   * Retrieves a member status by its id
   * @param statusID The id of the member status
   * @returns The member status or null if no member status was found
   */
  getMemberStatusByID(statusID: number): Promise<MemberStatus> {
    return this.findOne({ where: { memberStatusId: statusID } });
  },
});

/**
 * Creates and exports the Language Repository
 */
export const LanguagesRepository = AppDataSource.getRepository(Language).extend({
  /**
   * Retrieves all the distinct values of the languages
   * @returns A list of distinct language values
   */
  getLanguageValues(): Promise<LanguageValue[]> {
    return this.createQueryBuilder("language").select("language.value").distinct(true).getRawMany();
  },
});

/**
 * Creates and exports the ItSkills Repository
 */
export const ItSkillsRepository = AppDataSource.getRepository(ItSkill).extend({
  /**
   * Retrieves the all distinct values of the itSkills
   * @returns A list of distinct itSkill values
   */
  getItSkillValues(): Promise<ItSkillsValue[]> {
    return this.createQueryBuilder("itSkill").select("itSkill.value").distinct(true).getMany();
  },
});

/**
 * Creates and exports the Permission Repository
 */
export const PermissionsRepository = AppDataSource.getRepository(Permission).extend({
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

/**
 * Creates and exports the Director Repository
 */
export const DirectorRepository = AppDataSource.getRepository(Director).extend({
  /**
   * Retrieves all director positions
   * @param includeDirectorMembers Include names of director members if true
   * @returns All director positions
   */
  getDirectorPositions(): Promise<Director[]> {
    return this.find({
      order: {
        sequence: "ASC",
      },
    });
  },
});

/**
 * Creates and exports the MemberHasDirectorPosition Repository
 */
export const MemberHasDirectorPositionRepository = AppDataSource.getRepository(MemberHasDirectorPosition).extend({
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

  /**
   * Retrieves the member's director positions
   * @param memberID The id of the member
   * @returns The member's director positions
   */
  getMemberDirectorPositions(memberID: number): Promise<MemberHasDirectorPosition[]> {
    return this.find({
      where: {
        member: { memberId: memberID },
      },
      relations: ["director", "member"],
    });
  },

  /**
   * Deletes the director position of the member
   * @param memberID The member id
   * @param directorID The director position
   */
  deleteDirectorPosition(memberID: number, directorID: number): Promise<void> {
    return this.delete({
      member: { memberId: memberID },
      director: { directorId: directorID },
    });
  },

  /**
   * Saves a new director position to the member or changes a current director position
   * @param memberID The id of the member
   * @param directorID The id of the director
   * @param from The start date of the director position
   * @param until The end date of the director position
   * @param transactionalEntityManager The transactional entity manager
   */
  saveDirectorPosition(
    memberID: number,
    directorID: number,
    from: Date,
    until: Date,
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    return transactionalEntityManager
      ? this.save({ memberId: memberID, directorId: directorID, from, until }, transactionalEntityManager)
      : this.save({ memberId: memberID, directorId: directorID, from, until });
  },

  /**
   * End the term of a director position
   * @param directorID The id of the director
   * @param transactionalEntityManager The transactional entity manager
   * @returns A promise that resolves when the director position term is ended
   */
  endDirectorPositionTerm(directorID: number, transactionalEntityManager?: EntityManager): Promise<void> {
    return transactionalEntityManager
      ? this.update(
          {
            director: { directorId: directorID },
            from: LessThanOrEqual(new Date()),
            until: MoreThanOrEqual(new Date()),
          },
          {
            until: new Date(new Date().setDate(new Date().getDate() - 1)),
          },
          transactionalEntityManager
        )
      : this.update(
          {
            director: { directorId: directorID },
            from: LessThanOrEqual(new Date()),
            until: MoreThanOrEqual(new Date()),
          },
          {
            until: new Date(new Date().setDate(new Date().getDate() - 1)),
          }
        );
  },
});

/**
 * Creates and exports the Generation Repository
 */
export const GenerationRepository = AppDataSource.getRepository(Generation).extend({
  /**
   * Retrieves all generations as a list
   * @returns A list of generations
   */
  getGenerations(): Promise<Generation[]> {
    return this.find();
  },

  /**
   * Retrieves a generation by its id
   * @param generationId The id of the generation
   * @returns The generation or null if no generation was found
   */
  getGenerationById(generationId: number): Promise<Generation | null> {
    return this.findOne({ where: { generationId } });
  },
});
