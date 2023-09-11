/**
 * Definition of the handler functions for the members module
 */
import { Request, Response } from "express";
import { QueryResult } from "../../types/databaseTypes";
import { doesPermissionsInclude } from "../../utils/authUtils";
import { checkForSQLKeywords } from "../../utils/stringUtils";
import database = require("../../database");
import TraineesService from "./TraineesService";
import { InternalProject } from "types/traineesTypes";
import { UnauthorizedError } from "../../types/errors";

const traineesService = new TraineesService();

/**
 * Retrieves a single internal project
 */
export const retrieveIP = async (req: Request, res: Response): Promise<Response> => {
  const ipID = parseInt(req.params.id);
  const ip = await traineesService.getIPByID(ipID);

  return res.status(200).json(ip);
};

/**
 * Retrieves choices of mentor, internal project and department of all trainees of given generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of generation
 * @param res member ID, first and last name and choices
 */
export const retrieveTraineeChoices = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const choices = await traineesService.getTraineeChoicesByGenerationID(generationID);

  return res.status(200).json(choices);
};

/**
 * Updates an internal project
 */
export const updateIP = async (req: Request, res: Response): Promise<Response> => {
  const ipID = parseInt(req.params.id);
  const updatedIp = req.body as InternalProject;

  // Check if user has permission to update an internal project
  if (doesPermissionsInclude(res.locals.permissions, [15])) {
    throw new UnauthorizedError("You are not allowed to update an internal project");
  }

  await traineesService.updateIPByID(ipID, updatedIp);

  return res.status(200).send("Updated IP");
};

/**
 * Retrieves the mails for the specified internal projects
 */
export const retrieveTeamMails = async (req: Request, res: Response): Promise<Response> => {
  const ipID = parseInt(req.params.id);
  const mails = await traineesService.getTraineeMailsByIpID(ipID);

  return res.status(200).json(mails);
};

/*
 * Gets letter of motivation form trainees of given generation
 * @param {Request} req request object
 * @param {number} req.body.generationID
 * @param res member ID and 3 motivation texts
 */
export const retrieveTraineeMotivation = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const motivation = await traineesService.getTraineeMotivationsByGenerationID(generationID);

  return res.status(200).json(motivation);
};

/**
 * Retrieves information about all generations
 * @param {Request} req empty request object
 * @param res generationID, short name and deadlines
 */
export const retrieveGenerations = async (req: Request, res: Response): Promise<Response> => {
  const generations = await traineesService.getGenerations();

  return res.status(200).json(generations);
};

/**
 * Sets "wahl_start" and "wahl_ende" for generation
 * @param {Request} req request object
 * @param {Date} req.body.votingStart
 * @param {Date} req.body.votingEnd
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const setVotingDeadline = async (req: Request, res: Response) => {
  // Check if ID of generation is in database
  const idChecks = await checkForIDs([req.params.id], ["generationID"], ["generation"]);
  // If ID is not in database return status error code and error message
  if (idChecks.state > 0) {
    res.status(idChecks.state).send(idChecks.errorMessage);
    return;
  }
  database
    .query(`UPDATE generation SET wahl_start= ?, wahl_ende= ?  WHERE generationID= ? `, [
      req.body.votingStart,
      req.body.votingEnd,
      req.params.id,
    ])
    .then((result) => {
      res.status(201).send("Updated Trainee Voting Deadline");
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Sets choices of internesprojekt, mentor and ressort of member
 * @param {Request} req request object
 * @param {number} req.body.internesprojektID
 * @param {number} req.body.mentorID
 * @param {number} req.body.ressortID
 * @param {number} req.params.id ID of member
 * @param res status code and message
 */
export const setTraineeAssignment = async (req: Request, res: Response) => {
  // Check if given IDs are in database
  const idChecks = checkForIDs(
    [req.params.id, req.body.internesprojektID, req.body.mentorID, req.body.ressortID],
    ["mitgliedID", "internesprojektID", "mitglied_mitgliedID", "ressortID"],
    ["mitglied", "internesprojekt", "generation_has_mentor", "ressort"]
  );
  // If one ID is not in database return status error code and error message
  if ((await idChecks).state > 0) {
    res.status((await idChecks).state).send((await idChecks).errorMessage);
    return;
  }
  database
    .query(
      `UPDATE mitglied SET wahl_internesprojekt =?, internesprojekt=? ,wahl_mentor=?, mentor=?, wahl_ressort=?, ressort=? WHERE mitgliedID=?`,
      [
        req.body.internesprojektID,
        req.body.internesprojektID,
        req.body.mentorID,
        req.body.mentorID,
        req.body.ressortID,
        req.body.ressortID,
        req.params.id,
      ]
    )
    .then((result) => {
      res.status(201).send("Updated Trainee Assignment");
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Addes one new member as mentor to generation
 * @param {Request} req request object
 * @param {number} req.params.member_id ID of member
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const addMentor = async (req: Request, res: Response) => {
  // Check if given IDs are in database
  const idChecks = checkForIDs(
    [req.params.id, req.params.member_id],
    ["generationID", "mitgliedID"],
    ["generation", "mitglied"]
  );
  // If one ID is not in database return status error code and error message
  if ((await idChecks).state > 0) {
    res.status((await idChecks).state).send((await idChecks).errorMessage);
    return;
  }
  database
    .query(`INSERT INTO generation_has_mentor (mitglied_mitgliedID, generation_generationID) VALUES (?, ?)`, [
      req.params.member_id,
      req.params.id,
    ])
    .then((result) => {
      res.status(201).send("Added new mentor");
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
  return;
};

/**
 * Gets memberID, first and last name of Mentors of generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const getMentorsOfGeneration = async (req: Request, res: Response): Promise<Response> => {
  const generationID = parseInt(req.params.id);
  const mentors = await traineesService.getMentorsByGenerationID(generationID);

  return res.status(200).json(mentors);
};

/**
 * Gets information of internal projects of generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of Generation
 * @param res ID, generation, name and short name
 */
export const getInternalProjectsOfGeneration = (req: Request, res: Response): void => {
  database
    .query(`SELECT internesprojektID, generation, projektname, kuerzel FROM internesprojekt WHERE generation=?`, [
      req.params.id,
    ])
    .then(
      (
        result: QueryResult
        // traineesTypes.GetInternalProjectOfGenerationResult
      ) => {
        res.status(200).json(result);
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Checks if the given ids are present in the database
 * @param {Array<string>} ids ids that need to be checked
 * @param {Array<string>} idNames id's corresponding column names in database
 * @param {Array<string>} tables id's corresponding tabel names in database
 * @returns {Promise<{ state: number; errorMessage: string }>} status code and error message when an error was found. If no error occured return { state: 0, errorMessage: "success" }
 */
const checkForIDs = async (
  ids: Array<string>,
  idNames: Array<string>,
  tables: Array<string>
): Promise<{ state: number; errorMessage: string }> => {
  // Iterate over all inputs
  for (let index = 0; index < ids.length; index++) {
    // Check if given names vor table und colum contain any SQL keywords
    if (checkForSQLKeywords(tables[index]) || checkForSQLKeywords(idNames[index])) {
      throw Error("No SQL statements allowed in String!");
    }
    // Check if id is null or empty
    if (ids[index]) {
      // Query database to check if id exits
      const resultQuery = await database.query(
        `SELECT ${idNames[index]} FROM ${tables[index]} WHERE ${idNames[index]} = ?;`,
        [ids[index]]
      );
      if (!Array.isArray(resultQuery) || resultQuery.length === 0) {
        return { state: 404, errorMessage: `ID of ${idNames[index]} does not exist` };
      }
    } else {
      return { state: 422, errorMessage: `ID of ${idNames[index]} is null or empty` };
    }
  }
  return { state: 0, errorMessage: "success" };
};

/**
 * Retrieves all current trainees
 */
export const retrieveCurrentTrainees = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname
        FROM mitglied
        WHERE mitgliedstatus = 1 AND mitglied.generation = (SELECT max(generation) from internesprojekt)
        ORDER BY nachname`,
      []
    )
    .then((result: traineesTypes.GetCurrentTraineesQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("Trainees not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/*
  Retrieves all current IPs
  */
export const retrieveCurrentIPs = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT internesprojektID, projektname, kickoff, AngebotBeiEV, ZPbeiEV, APgehalten
      FROM internesprojekt
      WHERE generation = (SELECT max(generation) from internesprojekt)
      ORDER BY internesprojektID`,
      []
    )
    .then((result: traineesTypes.GetCurrentTraineesQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("IPs not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/*
  Retrieve all IPs
*/
export const retrieveAllIPs = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT *
      FROM internesprojekt 
      ORDER BY generation`,
      []
    )
    .then((result: traineesTypes.GetAllIPsQueryResult[]) => {
      res.status(200).json(result); //IPs are unsorted
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/*
  Retrieve a list of all Trainees with their respective IPs
  Group all Trainees into their corresponding generations
*/
export const retrieveAllTraineesWithIPs = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitglied.generation, mitglied.mitgliedID, mitglied.vorname, mitglied.nachname, internesprojekt.internesprojektID, internesprojekt.projektname, internesprojekt.kuerzel, internesprojekt.kickoff, internesprojekt.AngebotBeiEV, internesprojekt.ZPbeiEV, internesprojekt.ZPgehalten, internesprojekt.APbeiEV, internesprojekt.APgehalten, internesprojekt.DLbeiEV
      FROM mitglied
      LEFT JOIN internesprojekt ON mitglied.generation = internesprojekt.generation 
      ORDER BY generation`,
      []
    )
    .then((result: traineesTypes.retrieveAllTraineesWithIPsQueryResult[]) => {
      let groupedGenerations = {};

      for (let i = 0; i < result.length; i++) {
        let obj = result[i];
        let generation = obj.generation;

        // Create Array for current generation if none exists yet
        if (!groupedGenerations[generation]) {
          groupedGenerations[generation] = [];
        }

        // Add object to respective generation
        groupedGenerations[generation].push(obj);
      }
      res.status(200).json(groupedGenerations);
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};
