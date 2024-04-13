import { QueryBuilder } from "typeorm";
import { AppDataSource } from "../../datasource";
import { Member } from "../../typeOrm/entities/Member";
import { MemberHasDirectorPosition } from "../../typeOrm/entities/MemberHasDirectorPosition";
import { Department } from "typeOrm/entities/Department";

export const MembersRepository_typeORM = AppDataSource.getRepository(Member).extend({
  /**
   * Retrieves all members as a list
   * @returns A list of members
   */
  getMembersWithDepartment(): Promise<Member[]> {
    return this.find({ relations: ["department"] });
  },

  /**
   * Retrieves all active members as a list with department information
   * @returns A list of members with the department
   */
  getActiveMembersWithDepartmentAndWithDirectorPositions(): Promise<Member[]> {
    /*
     * Correspons to following query:
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
    return this.createQueryBuilder("member")
      .leftJoinAndSelect("member.department", "department")
      .where("member.memberStatusId <= :status", { status: 3 })
      .andWhere((qb) => {
        // Subquery for NOT EXISTS
        const subQuery = qb
          .subQuery()
          .select("mhdp.memberId")
          .from(MemberHasDirectorPosition, "mhdp")
          .where("mhdp.from < :currentDate", { currentDate: new Date() })
          .andWhere("mhdp.until > :currentDate", { currentDate: new Date() })
          .andWhere("mhdp.memberId = member.memberId")
          .getQuery();
        return "NOT EXISTS " + subQuery;
      })
      .orderBy("department.departmentId")
      .getMany();
  },

  /**
   * Retrieves a member by its id
   * @param memberID The id of the member
   * @returns The member or null if no member was found
   */
  getMemberByID(memberID: number): Promise<Member | null> {
    return this.findOne({ where: { memberId: memberID } });
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
   * Retrieves all members that are or were directors
   * @returns A list of members that are or were directors
   */
  getAllDirectors(): Promise<Member[]> {
    return this.createQueryBuilder("member")
      .innerJoinAndSelect("member.memberHasDirectorPositions", "memberHasDirectorPositions")
      .innerJoinAndSelect("memberHasDirectorPositions.director", "director")
      .innerJoinAndSelect("member.department", "department")
      .getMany();
  },

  /**
   * Retrieves the members that are currently directors
   * @returns A list of members that are currently directors
   */
  getCurrentDirectors(): Promise<Member[]> {
    return this.createQueryBuilder("member")
      .innerJoinAndSelect("member.memberHasDirectorPositions", "memberHasDirectorPositions")
      .innerJoinAndSelect("memberHasDirectorPositions.director", "director")
      .innerJoinAndSelect("member.department", "department")
      .where("memberHasDirectorPositions.from < :currentDate", { currentDate: new Date() })
      .andWhere("memberHasDirectorPositions.until > :currentDate", { currentDate: new Date() })
      .getMany();
  },
});
