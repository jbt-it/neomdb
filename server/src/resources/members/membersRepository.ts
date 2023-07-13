import { query } from "../../database";
import { Permission, User } from "../../types/authTypes";
import { QueryError } from "../../types/errors";
import {
  Department,
  DepartmentMember,
  DepartmentPartialID,
  Director,
  EdvSkill,
  Language,
  Value,
  Member,
  MemberPartial,
  Mentee,
  Mentor,
} from "../../types/membersTypes";

class MembersRepository {
  /**
   * Retrieves a user by its username
   * @throws QueryError if the query fails
   * @returns The user with permissions or null if no user was found
   */
  getUserByName = async (name: string): Promise<User> => {
    try {
      /*
       * This database call searches for all members which are trainees, active members or seniors
       * and their assigned departments if they are not currently a director
       */
      const userQueryResult = await query(
        `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
      FROM mitglied
        LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
        WHERE mitglied.name = ?
        GROUP BY mitgliedID, name`,
        [name]
      );
      if (Array.isArray(userQueryResult) && userQueryResult.length !== 0) {
        const user = userQueryResult[0] as User;
        return user;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving user data with username ${name}`);
    }
  };

  /**
   * Retrieves the director permissions of a member
   * @throws QueryError if the query fails
   * @returns The director permissions of a member or null if no permissions were found
   */
  getDirectorPermissionsByMemberID = async (memberID: number): Promise<Permission[]> => {
    try {
      const directorPermissionsQueryResult = await query(
        `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
      FROM mitglied_has_evposten
      LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
      WHERE mitglied_has_evposten.mitglied_mitgliedID = ? AND mitglied_has_evposten.von <= NOW() AND mitglied_has_evposten.bis >= NOW();`,
        [memberID]
      );
      if (Array.isArray(directorPermissionsQueryResult)) {
        const directorPermissions = directorPermissionsQueryResult as Permission[];
        return directorPermissions;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving director permissions for member with id ${memberID}`);
    }
  };

  /**
   * Updates the passwordHash of a user
   * @throws QueryError if the query fails
   */
  updateUserPasswordByUserNameAndUserID = async (
    userName: string,
    userID: number,
    newPasswordHash: string
  ): Promise<void> => {
    try {
      await query(
        `UPDATE mitglied
      SET passwordHash = ?
      WHERE mitglied.name = ?
      AND mitglied.mitgliedID = ?`,
        [newPasswordHash, userName, userID]
      );
    } catch (error) {
      throw new QueryError(`Error updating password of member with name ${userName}`);
    }
  };

  /**
   * Retrieves all departments of a list of roles
   * @param roles The ids of the roles
   * @throws QueryError if the query fails
   * @returns The department ids of the roles or null if no departments were found
   */
  getDepartmentsByRoles = async (roles: number[]): Promise<DepartmentPartialID[]> => {
    try {
      if (roles.length === 0) {
        return null;
      }

      let sql = "";
      // Iterate over roles and construct sql string to retrieve departments ids
      for (let i = 0; i < roles.length; i++) {
        if (i === 0) {
          sql += `SELECT ressortID FROM evposten WHERE (evpostenID = ${roles[i]} `;
        } else {
          sql += `OR evpostenID = ${roles[i]}`;
        }
      }
      sql += `) AND ressortID IS NOT NULL;`;
      const departments = await query(sql, []);
      if (Array.isArray(departments)) {
        return departments as DepartmentPartialID[];
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving department ids`);
    }
  };

  /**
   * Retrieves all members as a list
   * @throws QueryError if the query fails
   * @returns A list of members
   */
  getMembers = async () => {
    try {
      const membersQueryResult = await query(
        `SELECT mitgliedID, nachname, vorname, handy, mitglied.jbt_email, mitgliedstatus.bezeichnung AS mitgliedstatus, ressort.kuerzel AS ressort, lastchange
      FROM mitglied
      INNER JOIN ressort ON mitglied.ressort = ressort.ressortID
      INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
      ORDER BY nachname DESC`,
        []
      );
      if (Array.isArray(membersQueryResult)) {
        const members = membersQueryResult as MemberPartial[];
        return members;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving members`);
    }
  };

  /**
   * Retrieves a member by its id
   * @param memberID The id of the member
   * @param withFinancialData If the member should be retrieved with his financial data
   * @throws QueryError if the query fails
   * @returns The member or null if no member was found
   */
  getMemberByID = async (memberID: number, withFinancialData: boolean) => {
    try {
      let sql = `SELECT mitgliedID, vorname, nachname, mitglied.jbt_email, geschlecht, geburtsdatum, handy,
        mitgliedstatus.bezeichnung AS mitgliedstatus, generation, internesprojekt,
        trainee_seit, mitglied_seit, alumnus_seit, senior_seit, aktiv_seit, passiv_seit,
        ausgetreten_seit, ressort.bezeichnung AS ressort, arbeitgeber, strasse1, plz1, ort1,
        tel1, email1, strasse2, plz2, ort2, tel2, email2, hochschule, studiengang,
        studienbeginn, studienende, vertiefungen, ausbildung, engagement, canPL, canQM,
        lastchange, fuehrerschein, ersthelferausbildung`;
      if (withFinancialData) {
        // if the member should be retrieved with his financial data add these to the select statement
        sql += `, kontoinhaber, iban, bic`;
      }
      sql += ` FROM mitglied
        INNER JOIN ressort ON mitglied.ressort = ressort.ressortID
        INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
        WHERE mitgliedID = ?`;
      const memberQueryResult = await query(sql, [memberID]);
      if (Array.isArray(memberQueryResult) && memberQueryResult.length !== 0) {
        const member = memberQueryResult[0] as Member;
        return member;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving member with id ${memberID}`);
    }
  };

  /**
   * Retrieves the languages of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns A list of languages
   */
  getLanguagesByMemberID = async (memberID: number) => {
    try {
      const languagesQueryResult = await query(
        `SELECT wert, niveau
      FROM sprachen
      WHERE mitglied_mitgliedID = ?`,
        [memberID]
      );
      if (Array.isArray(languagesQueryResult)) {
        const languages = languagesQueryResult as Language[];
        return languages;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving languages of member with id ${memberID}`);
    }
  };

  /**
   * Retrieves the edv skills of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns A list of edv skills
   */
  getEdvSkillsByMemberID = async (memberID: number) => {
    try {
      const edvSkillsQueryResult = await query(
        `SELECT wert, niveau
        FROM edvkenntnisse
        WHERE mitglied_mitgliedID = ?`,
        [memberID]
      );
      if (Array.isArray(edvSkillsQueryResult)) {
        const edvSkills = edvSkillsQueryResult as EdvSkill[];
        return edvSkills;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving edv skills of member with id ${memberID}`);
    }
  };

  /**
   * Retrieves the mentor of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns The mentor of the member or null if no mentor was found
   */
  getMentorByMemberID = async (memberID: number) => {
    try {
      const mentorQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname
      FROM mitglied
          WHERE mitgliedID =
          (SELECT mentor
          FROM mitglied
          WHERE mitgliedID = ?)`,
        [memberID]
      );
      if (Array.isArray(mentorQueryResult) && mentorQueryResult.length !== 0) {
        const mentor = mentorQueryResult[0] as Mentor;
        return mentor;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving mentor of member with id ${memberID}`);
    }
  };

  /**
   * Retrieves the mentees of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns A list of mentees
   */
  getMenteesByMemberID = async (memberID: number) => {
    try {
      const menteesQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname
      FROM mitglied
      WHERE mentor = ?`,
        [memberID]
      );
      if (Array.isArray(menteesQueryResult)) {
        const mentee = menteesQueryResult as Mentee[];
        return mentee;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving mentees`);
    }
  };

  /**
   * Retrieves all members grouped by departments
   * It does not retrieve directors of the departments, only the members
   * @throws QueryError if the query fails
   * @returns A list of members grouped by departments without directors
   */
  getMembersGroupedByDepartment = async () => {
    try {
      const membersofDepartmentsQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname, ressort, bezeichnung
      FROM mitglied, ressort
      WHERE ressort = ressortID AND mitgliedstatus <= 3
      AND NOT EXISTS (
        SELECT mitglied_mitgliedID
        FROM mitglied_has_evposten
        WHERE von < DATE(NOW()) AND DATE(NOW()) < bis AND mitglied_mitgliedID = mitgliedID
        )
      ORDER BY ressortID`,
        []
      );
      if (Array.isArray(membersofDepartmentsQueryResult)) {
        const departmentMembers = membersofDepartmentsQueryResult as DepartmentMember[];
        return departmentMembers;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving all members grouped by departments`);
    }
  };

  /**
   * Retrieves all directors
   * @param onlyCurrent Only retrieve current directors if true
   * @returns All (current) directors
   */
  getDirectors = async (onlyCurrent: boolean) => {
    try {
      let sql = `SELECT mitgliedID, vorname, nachname, evpostenID, evposten.ressortID,
    geschlecht, bezeichnung_weiblich, bezeichnung_maennlich, kuerzel
        FROM mitglied, mitglied_has_evposten, evposten
        WHERE mitgliedID = mitglied_mitgliedID AND evpostenID = evposten_evpostenID`;
      if (onlyCurrent) {
        sql += " AND von < DATE(NOW()) AND DATE(NOW()) < bis ";
      }
      const directorsQueryResult = await query(sql, []);
      if (Array.isArray(directorsQueryResult)) {
        const directors = directorsQueryResult as Director[];
        return directors;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving directors`);
    }
  };

  /**
   * Retrieves all departments
   * @throws QueryError if the query fails
   */
  getDepartments = async () => {
    try {
      const departmentsQueryResult = await query(
        `SELECT ressortID, bezeichnung, kuerzel, jbt_email, linkZielvorstellung, linkOrganigramm
      FROM ressort
      WHERE bezeichnung != "Ohne Ressort"`,
        []
      );
      if (Array.isArray(departmentsQueryResult)) {
        const departments = departmentsQueryResult as Department[];
        return departments;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving departments`);
    }
  };

  /**
   * Retrieves a department by its id
   * @param departmentID The id of the department
   * @throws QueryError if the query fails
   */
  getDepartmentByID = async (departmentID: number) => {
    try {
      const departmentQueryResult = await query(
        `SELECT ressortID, bezeichnung, kuerzel, jbt_email, linkZielvorstellung, linkOrganigramm
          FROM ressort
          WHERE ressortID = ?`,
        [departmentID]
      );
      if (Array.isArray(departmentQueryResult) && departmentQueryResult.length !== 0) {
        const department = departmentQueryResult[0] as Department;
        return department;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving department with id ${departmentID}`);
    }
  };

  /**
   * Retrieves a department by its id
   * @param departmentID The id of the department
   * @param linkOrganisation The link to the organisation chart of the department
   * @param linkGoal The link to the goal of the department
   * @throws QueryError if the query fails
   */
  updateDepartmentByID = async (departmentID: number, linkOrganisation: string, linkGoal: string) => {
    try {
      await query(`UPDATE ressort SET linkOrganigramm = ?, linkZielvorstellung = ?  WHERE ressortID = ?`, [
        linkOrganisation,
        linkGoal,
        departmentID,
      ]);
    } catch (error) {
      throw new QueryError(`Error updating department with id ${departmentID}`);
    }
  };

  /**
   * Retrieves all language values
   * @throws QueryError if the query fails
   * @returns A list of all language values
   */
  getLanguageValues = async () => {
    try {
      const languagesQueryResult = await query(
        `SELECT DISTINCT wert
      FROM sprachen`,
        []
      );
      if (Array.isArray(languagesQueryResult)) {
        const languages = languagesQueryResult as Value[];
        return languages;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving languages`);
    }
  };

  /**
   * Retrieves all edv skill values
   * @throws QueryError if the query fails
   * @returns A list of all edv skill values
   */
  getEdvSkillValues = async () => {
    try {
      const edvSkillsQueryResult = await query(
        `SELECT DISTINCT wert
        FROM edvkenntnisse`,
        []
      );
      if (Array.isArray(edvSkillsQueryResult)) {
        const edvSkills = edvSkillsQueryResult as Value[];
        return edvSkills;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving edv skills`);
    }
  };
}

export default MembersRepository;
