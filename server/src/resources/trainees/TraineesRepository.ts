import { query } from "../../database";
import { QueryError } from "../../types/errors";
import { Generation, InternalProject, JBTMail, TraineeChoice, TraineeMotivation } from "../../types/traineesTypes";
import mysql = require("mysql2");

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
      throw new QueryError(`Error while retrieving trainee's IP with id ${id}`);
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
      throw new QueryError(`Error while retrieving generation with id ${id}`);
    }
  };

  /**
   * Get all choices of trainees of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */
  getTraineeChoicesByGenerationID = async (generationID: number, connection?: mysql.PoolConnection): Promise<any> => {
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
      throw new QueryError(`Error while retrieving generations`);
    }
  };
}

export default TraineesRepository;
