import { Mentor } from "types/membersTypes";
import { query } from "../../database";
import { ConflictError, QueryError } from "../../types/Errors";
import {
  Generation,
  InternalProject,
  JBTMail,
  Trainee,
  TraineeChoice,
  TraineeMotivation,
  TraineeAssignment,
  InternalProjectAndTrainee,
  Workshop,
} from "../../types/traineesTypes";
import * as mysql from "mysql2";
import logger from "../../logger";

class TraineesRepository {
  /**
   * Get an internal project by its id
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */
  getIPByID = async (id: number, connection?: mysql.PoolConnection): Promise<InternalProject> => {
    try {
      const ipQueryResult = await query(
        `SELECT internesProjektID, generation, projektname, kuerzel, kickoff, AngebotBeiEV, ZPBeiEV, ZPGehalten, APBeiEV, APGehalten, DLBeiEV
      FROM internesprojekt
      WHERE internesProjektID = ?`,
        [id],
        connection
      );
      if (Array.isArray(ipQueryResult) && ipQueryResult.length !== 0) {
        const ip = ipQueryResult[0] as InternalProject;
        return ip;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving IP with id ${id}: ${error}`);
      throw new QueryError(`Error while retrieving IP with id ${id}`);
    }
  };

  /**
   * Get a generation by its id
   * @param id id of the generation
   * @throws QueryError if the query fails
   */
  getGenerationByID = async (id: number, connection?: mysql.PoolConnection): Promise<any> => {
    try {
      const generationQueryResult = await query(
        `SELECT generationID, bezeichnung, bewerbung_start, bewerbung_ende, wwTermin, auswahlWETermin, infoabendBesucher, tuercode, wahl_start, wahl_ende 
      FROM generation
      WHERE generationID = ?`,
        [id],
        connection
      );
      if (Array.isArray(generationQueryResult) && generationQueryResult.length !== 0) {
        const generation = generationQueryResult[0] as Generation;
        return generation;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving generation with id ${id}: ${error}`);
      throw new QueryError(`Error while retrieving generation with id ${id}`);
    }
  };

  /**
   * Get all choices of trainees of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */
  getTraineeChoicesByGenerationID = async (
    generationID: number,
    connection?: mysql.PoolConnection
  ): Promise<TraineeChoice[]> => {
    try {
      const choicesQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname,
      wahl_mentor, wahl_mentor1, wahl_mentor2, wahl_mentor3,
      wahl_internesprojekt, wahl_internesprojekt1, wahl_internesprojekt2, wahl_internesprojekt3,
      wahl_ressort, wahl_ressort1, wahl_ressort2, wahl_ressort3
      FROM  mitglied
      INNER JOIN generation
      ON mitglied.generation = generation.generationID
      WHERE  generation.generationID = ?`,
        [generationID],
        connection
      );
      if (Array.isArray(choicesQueryResult)) {
        const choices = choicesQueryResult as TraineeChoice[];
        return choices;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving choices of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while retrieving choices of generation with id ${generationID}`);
    }
  };

  /**
   * Update an internal project by its id
   * @param id id of the internal project
   * @param updatedIp updated internal project
   * @throws QueryError if the query fails
   */
  updateIPByID = async (id: number, updatedIp: InternalProject, connection?: mysql.PoolConnection): Promise<void> => {
    try {
      await query(
        `UPDATE internesprojekt
          SET  generation = ?, projektname = ?, kuerzel = ?, kickoff = ?, AngebotBeiEV = ?, ZPBeiEV = ?, ZPGehalten = ?, APBeiEV = ?, APGehalten = ?, DLBeiEV = ?
          WHERE internesProjektID = ?`,
        [
          updatedIp.generation,
          updatedIp.projektname,
          updatedIp.kuerzel,
          updatedIp.kickoff,
          updatedIp.AngebotBeiEV,
          updatedIp.ZPBeiEV,
          updatedIp.ZPGehalten,
          updatedIp.APBeiEV,
          updatedIp.APGehalten,
          updatedIp.DLBeiEV,
          id,
        ],
        connection
      );
    } catch (error) {
      logger.error(`Error while updating IP with id ${id}: ${error}`);
      throw new QueryError(`Error while updating IP with id ${id}`);
    }
  };

  /**
   * Get the mails of all trainees of an internal project
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */
  getTraineeMailsByIpID = async (id: number, connection?: mysql.PoolConnection): Promise<JBTMail[]> => {
    try {
      const mailsQueryResult = await query(
        `SELECT jbt_email as email
        FROM mitglied
        INNER JOIN internesprojekt
        ON mitglied.internesProjekt = internesprojekt.internesProjektID
        WHERE internesprojekt.internesProjektID = ?`,
        [id],
        connection
      );
      if (Array.isArray(mailsQueryResult)) {
        const mails = mailsQueryResult as JBTMail[];
        return mails;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving mails of trainees of IP with id ${id}: ${error}`);
      throw new QueryError(`Error while retrieving mails of trainees of IP with id ${id}`);
    }
  };

  /**
   * Get the motivations of all trainees of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */
  getTraineeMotivationsByGenerationID = async (
    generationID: number,
    connection?: mysql.PoolConnection
  ): Promise<TraineeMotivation[]> => {
    try {
      const motivationsQueryResult = await query(
        `SELECT mitgliedID, wahl_internesprojekt1_motivation, wahl_internesprojekt2_motivation,
      wahl_internesprojekt3_motivation
      FROM mitglied
      INNER JOIN generation
      ON mitglied.generation = generation.generationID
      WHERE generation.generationID = ?`,
        [generationID],
        connection
      );
      if (Array.isArray(motivationsQueryResult)) {
        const motivations = motivationsQueryResult as TraineeMotivation[];
        return motivations;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving motivations of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while retrieving motivations of generation with id ${generationID}`);
    }
  };

  /**
   * Get all generations
   * @throws QueryError if the query fails
   */
  getGenerations = async (connection?: mysql.PoolConnection): Promise<Generation[]> => {
    try {
      const generationsQueryResult = await query(
        `SELECT generationID, bezeichnung, bewerbung_start, bewerbung_ende, wwTermin,
      auswahlWETermin, infoabendBesucher,
      tuercode, wahl_start, wahl_ende
      FROM generation`,
        [],
        connection
      );
      if (Array.isArray(generationsQueryResult)) {
        const generations = generationsQueryResult as Generation[];
        return generations;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving generations: ${error}`);
      throw new QueryError(`Error while retrieving generations`);
    }
  };

  /**
   * Get all mentors of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */
  getMentorsByGenerationID = async (generationID: number, connection?: mysql.PoolConnection): Promise<Mentor[]> => {
    try {
      const mentorsQueryResult = await query(
        `SELECT mitgliedID, vorname, nachname, generation_generationID as generationID
          FROM mitglied
          INNER JOIN generation_has_mentor
          ON generation_has_mentor.mitglied_mitgliedID = mitglied.mitgliedID
          WHERE generation_has_mentor.generation_generationID = ?`,
        [generationID],
        connection
      );
      if (Array.isArray(mentorsQueryResult)) {
        const mentors = mentorsQueryResult as Mentor[];
        return mentors;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving mentors of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while retrieving mentors of generation with id ${generationID}`);
    }
  };

  /**
   * Updates the voting deadline of a generation
   * @param generationID id of the generation
   * @param votingStart start of the voting period
   * @param votingEnd end of the voting period
   * @throws QueryError if the query fails
   */
  updateVotingDeadline = async (
    generationID: number,
    votingStart: string,
    votingEnd: string,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `UPDATE generation
          SET wahl_start= ?, wahl_ende= ?
          WHERE generationID = ?`,
        [votingStart, votingEnd, generationID],
        connection
      );
    } catch (error) {
      logger.error(`Error while updating voting deadline of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while updating voting deadline of generation with id ${generationID}`);
    }
  };

  /**
   * Update the assignment of a trainee
   * @param traineeID id of the trainee
   * @param ipID id of the internal project
   * @param mentorID id of the mentor
   * @param departmentID id of the department
   * @throws QueryError if the query fails
   */
  updateAssignmentByMemberID = async (
    memberID: number,
    traineeAssignment: TraineeAssignment,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      query(
        `UPDATE mitglied SET wahl_internesprojekt =?, internesprojekt=? ,wahl_mentor=?, mentor=?, wahl_ressort=?, ressort=? WHERE mitgliedID=?`,
        [
          traineeAssignment.ipID,
          traineeAssignment.ipID,
          traineeAssignment.mentorID,
          traineeAssignment.mentorID,
          traineeAssignment.departmentID,
          traineeAssignment.departmentID,
          memberID,
        ],
        connection
      );
    } catch (error) {
      logger.error(`Error while updating trainee assignment: ${error}`);
      throw new QueryError(`Error while updating trainee assignment`);
    }
  };

  /**
   * Adds a mentor to a generation
   * @param generationID id of the generation
   * @param mentorID id of the mentor
   * @throws QueryError if the query fails or the mentor is already assigned to the generation
   */
  addMentorToGeneration = async (
    generationID: number,
    mentorID: number,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `INSERT INTO generation_has_mentor (generation_generationID, mitglied_mitgliedID) VALUES (?, ?)`,
        [generationID, mentorID],
        connection
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        logger.error(`Mentor with id ${mentorID} is already assigned to generation with id ${generationID}: ${error}`);
        throw new ConflictError(`Mentor with id ${mentorID} is already assigned to generation with id ${generationID}`);
      }
      logger.error(`Error while adding mentor with id ${mentorID} to generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while adding mentor with id ${mentorID} to generation with id ${generationID}`);
    }
  };

  /**
   * Get all internal projects of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */
  getInternalProjectsByGenerationID = async (
    generationID: number,
    connection?: mysql.PoolConnection
  ): Promise<InternalProject[]> => {
    try {
      const ipsQueryResult = await query(
        `SELECT internesProjektID, generation, projektname, kuerzel, kickoff, AngebotBeiEV, ZPBeiEV, ZPGehalten, APBeiEV, APGehalten, DLBeiEV
      FROM internesprojekt
      WHERE generation = ?`,
        [generationID],
        connection
      );
      if (Array.isArray(ipsQueryResult)) {
        const ips = ipsQueryResult as InternalProject[];
        return ips;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving IPs of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while retrieving IPs of generation with id ${generationID}`);
    }
  };

  /**
   * Get all trainees
   * @throws QueryError if the query fails
   */
  getTrainees = async (connection?: mysql.PoolConnection): Promise<Trainee[]> => {
    try {
      const queryResult = await query(
        `SELECT mitgliedID, vorname, nachname, generation
        FROM mitglied
        WHERE mitgliedstatus = 1 AND mitglied.generation = (SELECT max(generation) from internesprojekt) ORDER BY nachname`,
        [],
        connection
      );
      if (Array.isArray(queryResult)) {
        const trainees = queryResult as Trainee[];
        return trainees;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving trainees: ${error}`);
      throw new QueryError(`Error while retrieving trainees`);
    }
  };

  /**
   * Get all internal projects
   * @param onlyCurrent if true, only the current internal projects are returned
   * @throws QueryError if the query fails
   */
  getInternalProjects = async (onlyCurrent: boolean, connection?: mysql.PoolConnection): Promise<InternalProject[]> => {
    try {
      let sql = `SELECT internesProjektID, generation, projektname, kuerzel, kickoff, AngebotBeiEV, ZPBeiEV, ZPGehalten, APBeiEV, APGehalten, DLBeiEV
        FROM internesprojekt `;
      if (onlyCurrent) {
        sql += " WHERE generation = (SELECT max(generation) from internesprojekt) ";
      }
      sql += `ORDER BY generation`;
      const queryResult = await query(sql, [], connection);
      if (Array.isArray(queryResult)) {
        const ips = queryResult as InternalProject[];
        return ips;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving internal projects: ${error}`);
      throw new QueryError(`Error while retrieving internal projects`);
    }
  };

  /**
   * For all trainees of a given generation get internal project milestones
   * @param generationID ID of the generation
   * @throws QueryError if the query fails
   */
  getTraineeMilestonesfromInternalProjectsByGenerationID = async (
    generationID: number,
    connection?: mysql.PoolConnection
  ): Promise<InternalProjectAndTrainee[]> => {
    try {
      const ipsQueryResult = await query(
        `SELECT 
        mitglied.mitgliedID, 
        mitglied.vorname, 
        mitglied.nachname, 
        mitglied.generation,
        mitglied.internesprojekt, 
        internesprojekt.projektname, 
        internesprojekt.kuerzel, 
        CAST(COALESCE(internesprojekt.AngebotBeiEV, 0) AS SIGNED) AS AngebotBeiEV, 
        CAST(COALESCE(internesprojekt.ZPbeiEV, 0) AS SIGNED) AS ZPbeiEV, 
        CAST(COALESCE(internesprojekt.ZPgehalten, 0) AS SIGNED) AS ZPgehalten, 
        CAST(COALESCE(internesprojekt.APbeiEV, 0) AS SIGNED) AS APbeiEV, 
        CAST(COALESCE(internesprojekt.APgehalten, 0) AS SIGNED) AS APgehalten, 
        CAST(COALESCE(internesprojekt.DLbeiEV, 0) AS SIGNED) AS DLbeiEV
    FROM mitglied 
    JOIN internesprojekt ON mitglied.internesprojekt = internesprojekt.internesprojektID
    WHERE mitglied.generation = ?  
    ORDER BY mitglied.nachname ASC`,
        [generationID],
        connection
      );
      if (Array.isArray(ipsQueryResult)) {
        const ips = ipsQueryResult as InternalProjectAndTrainee[];
        return ips;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving IPs of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while retrieving IPs of generation with id ${generationID}`);
    }
  };

  /**
   * For all trainees of a given generation get boolen if feedback was given for obligatory workshop
   * @param generationID ID of the generation
   * @throws QueryError if the query fails
   */
  getTraineeWorkshopFeedbackByGenerationID = async (
    generationID: number,
    connection?: mysql.PoolConnection
  ): Promise<Workshop[]> => {
    try {
      const feedbackQueryResult = await query(
        `SELECT DISTINCT mitglied.mitgliedID, schulung.schulungsname, 
        MAX(COALESCE(mitglied_has_schulungsinstanz.feedbackAbgegeben, 0)) AS feedbackAbgegeben 
        FROM mitglied
          CROSS JOIN schulung
          LEFT JOIN schulungsinstanz ON schulung.schulungID = schulungsinstanz.schulung_schulungID
          LEFT JOIN mitglied_has_schulungsinstanz ON mitglied.mitgliedID = mitglied_has_schulungsinstanz.mitglied_mitgliedID
            AND mitglied_has_schulungsinstanz.typ = 'Teilnehmer'
            AND mitglied_has_schulungsinstanz.schulungsinstanz_schulungsinstanzID = schulungsinstanz.schulungsinstanzID
        WHERE mitglied.generation = ?
          AND schulung.art = 'Pflichtworkshop'
        GROUP BY mitglied.mitgliedID, schulung.schulungsname
        ORDER BY schulung.schulungsname ASC`,
        [generationID],
        connection
      );
      if (Array.isArray(feedbackQueryResult)) {
        const feedback = feedbackQueryResult as Workshop[];
        return feedback;
      }

      return null;
    } catch (error) {
      logger.error(`Error while retrieving feedback of generation with id ${generationID}: ${error}`);
      throw new QueryError(`Error while retrieving Schulungen of generation with id ${generationID}`);
    }
  };
}

export default TraineesRepository;
