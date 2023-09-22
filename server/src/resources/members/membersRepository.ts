import mysql = require("mysql2");
import { executeMultipleQueries, query } from "../../database";
import { Permission, PermissionAssignment } from "../../types/authTypes";
import { QueryError, UnprocessableEntityError } from "../../types/errors";
import {
  Department,
  DepartmentMember,
  DepartmentPartialID,
  Director,
  EdvSkill,
  Language,
  Member,
  MemberPartial,
  Mentee,
  Mentor,
  NewMember,
  Value,
} from "../../types/membersTypes";
import getStatusChangeDate from "../../utils/repositoryUtils";

class MembersRepository {
  // ---------------------------- MEMBERS ---------------------------- \\

  /**
   * Retrieves all members as a list
   * @throws QueryError if the query fails
   * @returns A list of members
   */
  getMembers = async (connection?: mysql.PoolConnection): Promise<MemberPartial[]> => {
    try {
      const membersQueryResult = await query(
        `SELECT mitgliedID, nachname, vorname, handy, mitglied.jbt_email, mitgliedstatus.bezeichnung AS mitgliedstatus, ressort.kuerzel AS ressort, lastchange
      FROM mitglied
      INNER JOIN ressort ON mitglied.ressort = ressort.ressortID
      INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
      ORDER BY nachname DESC`,
        [],
        connection
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
  getMemberByID = async (
    memberID: number,
    withFinancialData: boolean,
    connection?: mysql.PoolConnection
  ): Promise<Member> => {
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
      const memberQueryResult = await query(sql, [memberID], connection);
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
   * Retrieves the mentor of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns The mentor of the member or null if no mentor was found
   */
  getMentorByMemberID = async (memberID: number, connection?: mysql.PoolConnection): Promise<Mentor> => {
    try {
      const mentorQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname
      FROM mitglied
          WHERE mitgliedID =
          (SELECT mentor
          FROM mitglied
          WHERE mitgliedID = ?)`,
        [memberID],
        connection
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
  getMenteesByMemberID = async (memberID: number, connection?: mysql.PoolConnection): Promise<Mentee[]> => {
    try {
      const menteesQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname
      FROM mitglied
      WHERE mentor = ?`,
        [memberID],
        connection
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
  getMembersGroupedByDepartment = async (connection?: mysql.PoolConnection): Promise<DepartmentMember[]> => {
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
        [],
        connection
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
   * Creates a new member
   * @param newMember The new member object
   * @param newUserName The new username of the member
   * @param passwordHash The password hash of the member
   * @param statusID The id of the status of the member
   * @param icalToken The ical token (not supported anymore)
   * @param jbtMail The jbt mail of the member
   * @param departmentID The id of the department of the member
   * @throws QueryError if the query fails
   * @returns The id of the new member or null if the member could not be created
   */
  createMember = async (
    newMember: NewMember,
    newUserName: string,
    passwordHash: string,
    statusID: number,
    icalToken: string,
    jbtMail: string,
    departmentID: number,
    connection?: mysql.PoolConnection
  ): Promise<number> => {
    try {
      const queryResult = await query(
        `INSERT INTO mitglied (vorname, nachname, geburtsdatum, handy, name, geschlecht, passwordHash, icalToken, mitgliedstatus, generation, trainee_seit, email2, jbt_email, ressort)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newMember.vorname,
          newMember.nachname,
          newMember.geburtsdatum,
          newMember.handy,
          newUserName,
          newMember.geschlecht,
          passwordHash,
          icalToken,
          statusID,
          newMember.generation,
          newMember.traineeSeit,
          newMember.email,
          jbtMail,
          departmentID,
        ],
        connection
      );
      if (queryResult.affectedRows > 0) {
        return queryResult.insertId;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error creating new member with username ${newUserName} and jbtMail ${jbtMail}`);
    }
  };

  /**
   * Updates the critical data of a member
   * @param memberID The id of the member to update
   * @param member The updated member
   * @param mentor The mentor of the updated member
   * @throws QueryError if the query fails
   */
  updateMemberCriticalDataByID = async (
    memberID: number,
    member: Member,
    mentor: Mentor | null,
    connection?: mysql.PoolConnection
  ) => {
    try {
      const mentorID = mentor === null ? null : mentor.mitgliedID;
      await query(
        `UPDATE mitglied
        SET mitgliedstatus = (SELECT mitgliedstatusID FROM mitgliedstatus WHERE bezeichnung = ?), generation = ?, internesprojekt = ?, mentor = ?,
        trainee_seit = ?, mitglied_seit = ?, alumnus_seit = ?, senior_seit = ?,
        aktiv_seit = ?, passiv_seit = ?, ausgetreten_seit = ?,
        ressort = (SELECT ressortID FROM ressort WHERE bezeichnung = ?), engagement = ?,
        canPL = ?, canQM = ?
        WHERE mitgliedID = ?`,
        [
          member.mitgliedstatus,
          member.generation,
          member.internesprojekt,
          mentorID,
          member.trainee_seit,
          member.mitglied_seit,
          member.alumnus_seit,
          member.senior_seit,
          member.aktiv_seit,
          member.passiv_seit,
          member.ausgetreten_seit,
          member.ressort,
          member.engagement,
          member.canPL,
          member.canQM,
          memberID,
        ],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error updating critical data of member with id ${memberID}`);
    }
  };

  /**
   * Updates the personal data of a member
   * @param memberID The id of the member to update
   * @param member The updated member
   * @param mentor The mentor of the updated member
   * @param lastChangeTime The new time of the last change
   * @throws QueryError if the query fails
   */
  updateMemberPersonalDataByID = async (
    memberID: number,
    member: Member,
    lastChangeTime: string,
    connection?: mysql.PoolConnection
  ) => {
    try {
      await query(
        `UPDATE mitglied
          SET handy = ?, arbeitgeber = ?, strasse1 = ?, plz1 = ?, ort1 = ?, tel1 = ?, email1 = ?, strasse2 = ?,
          plz2 = ?, ort2 = ?, tel2 = ?, email2 = ?, hochschule = ?, studiengang = ?, studienbeginn = ?,
          studienende = ?, vertiefungen = ?, ausbildung = ?, kontoinhaber = ?, iban = ?, bic = ?, lastchange = ?, fuehrerschein = ?,
          ersthelferausbildung = ?
          WHERE mitgliedID = ?`,
        [
          member.handy,
          member.arbeitgeber,
          member.strasse1,
          member.plz1,
          member.ort1,
          member.tel1,
          member.email1,
          member.strasse2,
          member.plz2,
          member.ort2,
          member.tel2,
          member.email2,
          member.hochschule,
          member.studiengang,
          member.studienbeginn,
          member.studienende,
          member.vertiefungen,
          member.ausbildung,
          member.kontoinhaber,
          member.iban,
          member.bic,
          lastChangeTime,
          member.fuehrerschein,
          member.ersthelferausbildung,
          memberID,
        ],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error updating personal data of member with id ${memberID}`);
    }
  };

  /**
   * Updates the status of a member
   * @param memberID The id of the member to update
   * @param lastChangeTime The last change time
   * @param newStatus The new status of the member
   * @throws UnprocessableEntityError if the status is not valid
   * @throws QueryError if the query fails
   */
  updateMemberStatusByID = async (memberID: number, lastChangeTime: string, newStatus: string) => {
    // Retrieves the attribute of the status change date to update (e.g. "trainee_seit")
    const statusChangeDate = getStatusChangeDate(newStatus);
    if (statusChangeDate === null) {
      throw new UnprocessableEntityError(`Status ${newStatus} is not valid`);
    }

    try {
      await query(
        `UPDATE mitglied
          SET mitgliedstatus = (SELECT mitgliedstatusID FROM mitgliedstatus WHERE bezeichnung = ?),
          lastchange = ?, ${statusChangeDate} = ?
          WHERE mitgliedID = ?`,
        [newStatus, lastChangeTime, lastChangeTime, memberID]
      );
    } catch (error) {
      throw new QueryError(`Error updating status ${newStatus} of member with id ${memberID}`);
    }
  };

  // ---------------------------- DIRECTORS & DEPARTMENTS ---------------------------- \\

  /**
   * Retrieves all directors
   * @param onlyCurrent Only retrieve current directors if true
   * @returns All (current) directors
   */
  getDirectors = async (onlyCurrent: boolean, connection?: mysql.PoolConnection): Promise<Director[]> => {
    try {
      let sql = `SELECT mitgliedID, vorname, nachname, evpostenID, evposten.ressortID,
    geschlecht, bezeichnung_weiblich, bezeichnung_maennlich, kuerzel
        FROM mitglied, mitglied_has_evposten, evposten
        WHERE mitgliedID = mitglied_mitgliedID AND evpostenID = evposten_evpostenID`;
      if (onlyCurrent) {
        sql += " AND von < DATE(NOW()) AND DATE(NOW()) < bis ";
      }
      const directorsQueryResult = await query(sql, [], connection);
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
  getDepartments = async (connection?: mysql.PoolConnection): Promise<Department[]> => {
    try {
      const departmentsQueryResult = await query(
        `SELECT ressortID, bezeichnung, kuerzel, jbt_email, linkZielvorstellung, linkOrganigramm
      FROM ressort
      WHERE bezeichnung != "Ohne Ressort"`,
        [],
        connection
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
  getDepartmentByID = async (departmentID: number, connection?: mysql.PoolConnection): Promise<Department> => {
    try {
      const departmentQueryResult = await query(
        `SELECT ressortID, bezeichnung, kuerzel, jbt_email, linkZielvorstellung, linkOrganigramm
          FROM ressort
          WHERE ressortID = ?`,
        [departmentID],
        connection
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
  updateDepartmentByID = async (
    departmentID: number,
    linkOrganisation: string,
    linkGoal: string,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `UPDATE ressort SET linkOrganigramm = ?, linkZielvorstellung = ?  WHERE ressortID = ?`,
        [linkOrganisation, linkGoal, departmentID],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error updating department with id ${departmentID}`);
    }
  };

  /**
   * Retrieves all departments of a list of roles
   * @param roles The ids of the roles
   * @throws QueryError if the query fails
   * @returns The department ids of the roles or null if no departments were found
   */
  getDepartmentsByRoles = async (
    roles: number[],
    connection?: mysql.PoolConnection
  ): Promise<DepartmentPartialID[]> => {
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
      const departments = await query(sql, [], connection);
      if (Array.isArray(departments)) {
        return departments as DepartmentPartialID[];
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving department ids`);
    }
  };

  // ---------------------------- QUALIFICATIONS ---------------------------- \\

  /**
   * Retrieves all language values
   * @throws QueryError if the query fails
   * @returns A list of all language values
   */
  getLanguageValues = async (connection?: mysql.PoolConnection): Promise<Value[]> => {
    try {
      const languagesQueryResult = await query(
        `SELECT DISTINCT wert
      FROM sprachen`,
        [],
        connection
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
   * Retrieves the languages of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns A list of languages
   */
  getLanguagesByMemberID = async (memberID: number, connection?: mysql.PoolConnection): Promise<Language[]> => {
    try {
      const languagesQueryResult = await query(
        `SELECT wert, niveau
      FROM sprachen
      WHERE mitglied_mitgliedID = ?`,
        [memberID],
        connection
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
   * Updates the languages of a member by removing all existing languages and inserting the new ones
   * @param memberID The id of the member
   * @param updatedLanguages The updated languages
   * @throws QueryError if the query fails
   */
  updateMemberLanguagesByID = async (
    memberID: number,
    updatedLanguages: Language[],
    connection?: mysql.PoolConnection
  ) => {
    try {
      // 1. Delete the exisitng entries of languages of the specific member
      await query(`DELETE FROM sprachen WHERE mitglied_mitgliedID = ?`, [memberID], connection);
      // 2. Construct list of update queries for each language
      const langQueries = updatedLanguages.map(
        (language) => `INSERT INTO sprachen (mitglied_mitgliedID, wert, niveau)
                    VALUES (${memberID}, '${language.wert}', ${language.niveau})
                    ON DUPLICATE KEY UPDATE niveau = ${language.niveau};`
      );
      // 3. Execute all update queries
      await executeMultipleQueries(langQueries, connection);
    } catch (error) {
      throw new QueryError(`Error updating languages of member with id ${memberID}`);
    }
  };

  /**
   * Retrieves the edv skills of a member
   * @param memberID The id of the member
   * @throws QueryError if the query fails
   * @returns A list of edv skills
   */
  getEdvSkillsByMemberID = async (memberID: number, connection?: mysql.PoolConnection): Promise<EdvSkill[]> => {
    try {
      const edvSkillsQueryResult = await query(
        `SELECT wert, niveau
        FROM edvkenntnisse
        WHERE mitglied_mitgliedID = ?`,
        [memberID],
        connection
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
   * Retrieves all edv skill values
   * @throws QueryError if the query fails
   * @returns A list of all edv skill values
   */
  getEdvSkillValues = async (connection?: mysql.PoolConnection): Promise<Value[]> => {
    try {
      const edvSkillsQueryResult = await query(
        `SELECT DISTINCT wert
        FROM edvkenntnisse`,
        [],
        connection
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

  /**
   * Updates the languages of a member by removing all existing languages and inserting the new ones
   * @param memberID The id of the member
   * @param updatedLanguages The updated languages
   * @throws QueryError if the query fails
   */
  updateMemberEdvSkillsByID = async (
    memberID: number,
    updatedEdvSkills: EdvSkill[],
    connection?: mysql.PoolConnection
  ) => {
    try {
      // 1. Delete the exisitng entries of edv skills of the specific member
      await query(`DELETE FROM edvkenntnisse WHERE mitglied_mitgliedID = ?`, [memberID], connection);
      // 2. Construct list of update queries for each edv skill
      const edvSkillsQueries = updatedEdvSkills.map(
        (edv) => `INSERT INTO edvkenntnisse (mitglied_mitgliedID, wert, niveau)
                            VALUES (${memberID}, '${edv.wert}', ${edv.niveau})
                            ON DUPLICATE KEY UPDATE niveau = ${edv.niveau};`
      );
      // 3. Execute all update queries
      await executeMultipleQueries(edvSkillsQueries, connection);
    } catch (error) {
      console.log(error);
      throw new QueryError(`Error updating edv skills of member with id ${memberID}`);
    }
  };

  // ---------------------------- PERMISSIONS ---------------------------- \\

  /**
   * Retrieves a permission with the given `permissionID`
   * @throws QueryError if the query fails
   * @returns The permission or null if no permission was found
   */
  getPermissionByID = async (permissionID: number, connection?: mysql.PoolConnection): Promise<Permission> => {
    try {
      const permissionQueryResult = await query(
        `SELECT berechtigungID, canDelegate, evposten_evpostenID AS directorID
      FROM berechtigung
      WHERE berechtigungID = ?`,
        [permissionID],
        connection
      );
      if (Array.isArray(permissionQueryResult) && permissionQueryResult.length !== 0) {
        const permission = permissionQueryResult[0] as Permission;
        return permission;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving permission with id ${permissionID}`);
    }
  };

  /**
   * Retrieves all permissions
   * @throws QueryError if the query fails
   * @returns A list of all permissions
   */
  getPermissions = async (connection?: mysql.PoolConnection): Promise<Permission[]> => {
    try {
      const permissionsQueryResult = await query(`SELECT * FROM berechtigung`, [], connection);
      if (Array.isArray(permissionsQueryResult)) {
        const permissions = permissionsQueryResult as Permission[];
        return permissions;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving permissions`);
    }
  };

  /**
   * Retrieves all permission assignments of members and directors
   * @throws QueryError if the query fails
   * @returns A list of all permission assignments
   */
  getPermissionAssignments = async (connection?: mysql.PoolConnection): Promise<PermissionAssignment[]> => {
    try {
      // Evposten gets memberID of -1 to fill NULL
      const permissionAssignmentsQueryResult = await query(
        `SELECT kuerzel AS name, berechtigung_berechtigungID AS permission, canDelegate, -1 AS memberID
      FROM evposten
      INNER JOIN evposten_has_berechtigung ON evposten.evpostenID = evposten_has_berechtigung.evposten_evpostenID
      UNION
      SELECT CONCAT(vorname,' ' , nachname) AS name, berechtigung_berechtigungID AS permission, 0 AS canDelegate, mitglied.mitgliedID AS memberID
      FROM mitglied
      LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID`,
        [],
        connection
      );
      if (Array.isArray(permissionAssignmentsQueryResult)) {
        const permissionAssignments = permissionAssignmentsQueryResult as PermissionAssignment[];
        return permissionAssignments;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving permission assignments`);
    }
  };

  /**
   * Retrieves the director permissions of a member
   * @throws QueryError if the query fails
   * @returns The director permissions of a member or null if no permissions were found
   */
  getDirectorPermissionsByMemberID = async (
    memberID: number,
    connection?: mysql.PoolConnection
  ): Promise<Permission[]> => {
    try {
      const directorPermissionsQueryResult = await query(
        `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
        FROM mitglied_has_evposten
        LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
        WHERE mitglied_has_evposten.mitglied_mitgliedID = ? AND mitglied_has_evposten.von <= NOW() AND mitglied_has_evposten.bis >= NOW();`,
        [memberID],
        connection
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
   * Adds a permission with the given `permissionID` to a member with the given `memberID`
   * @throws QueryError if the query fails
   */
  addPermissionToMember = async (
    memberID: number,
    permissionID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `INSERT INTO mitglied_has_berechtigung (mitglied_mitgliedID, berechtigung_berechtigungID)
      VALUES (?, ?)`,
        [memberID, permissionID],
        connection
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new QueryError(`Permission with id ${permissionID} already assigned to member with id ${memberID}`);
      }
      throw new QueryError(`Error adding permission with id ${permissionID} to member with id ${memberID}`);
    }
  };

  /**
   * Deletes a permission with the given `permissionID` from a member with the given `memberID`
   * @throws QueryError if the query fails
   * @returns The number of affected rows
   */
  deletePermissionFromMember = async (
    memberID: number,
    permissionID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `DELETE
          FROM mitglied_has_berechtigung
          WHERE mitglied_mitgliedID = ? AND berechtigung_berechtigungID = ?`,
        [memberID, permissionID],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error deleting permission with id ${permissionID} from member with id ${memberID}`);
    }
  };
}

export default MembersRepository;
