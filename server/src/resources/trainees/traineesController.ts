/**
 * Definition of the handler functions for the trainees module
 */
import { Request, Response } from "express";
import { checkForSQLKeywords } from "../../utils/stringUtils";
import database = require("../../database");

import { doesPermissionsInclude } from "../../utils/authUtils";
import * as traineesTypes from "./traineesTypes";
import { QueryResult } from "databaseTypes";

/**
 * Retrieves a single internal project
 */
export const retrieveIP = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT internesProjektID, generation, projektname, kuerzel, kickoff, AngebotBeiEV, ZPBeiEV, ZPGehalten, APBeiEV, APGehalten, DLBeiEV
      FROM internesprojekt
      WHERE internesProjektID = ?`,
      [req.params.id]
    )
    .then(
      (
        result: QueryResult
        // traineesTypes.GetInternalProjectType[]
      ) => {
        if (result.length === 0) {
          res.status(404).send("IP not found");
        } else {
          res.status(200).json(result);
        }
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
      console.log(err);
    });
};

/**
 * Retrieves choices of mentor, internal project and department of all trainees of given generation
 * @param {Request} req request object
 * @param {number} req.params.id ID of generation
 * @param res member ID, first and last name and choices
 */
export const retrieveTraineeChoice = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname,
      wahl_mentor, wahl_mentor1, wahl_mentor2, wahl_mentor3,
      wahl_internesprojekt, wahl_internesprojekt1, wahl_internesprojekt2, wahl_internesprojekt3,
      wahl_ressort, wahl_ressort1, wahl_ressort2, wahl_ressort3
      FROM  mitglied
      INNER JOIN generation
      ON mitglied.generation = generation.generationID
      WHERE  generation.generationID = ?`,
      [req.params.id]
    )
    .then(
      (
        result: QueryResult
        // traineesTypes.GetTraineeChoiceResult
      ) => {
        res.status(200).json(result);
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Updates an internal project
 */
export const updateIP = (req: Request, res: Response): void => {
  const date: Date = new Date();

  // Format date yyyy-mm-dd hh:mm:ss
  const lastChangeTime =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);

  // Grants access to all fields for members with permission
  if (doesPermissionsInclude(res.locals.permissions, [15])) {
    database
      .query(
        `UPDATE internesprojekt
          SET  generation = ?, projektname = ?, kuerzel = ?, kickoff = ?, AngebotBeiEV = ?, ZPBeiEV = ?, ZPGehalten = ?, APBeiEV = ?, APGehalten = ?, DLBeiEV = ?
          WHERE internesProjektID = ?`,
        [
          req.body.generationID,
          req.body.projektname,
          req.body.kuerzel,
          req.body.kickoff,
          req.body.AngebotBeiEV,
          req.body.ZPBeiEV,
          req.body.ZPGehalten,
          req.body.APBeiEV,
          req.body.APGehalten,
          req.body.DLBeiEV,
          req.params.id,
        ]
      )
      .then((result) => {
        res.status(200).send("IP Update Successful");
      })
      .catch((err) => {
        res.status(500).send("Query Error: Updating IP failed");
      });
  } else {
    res.status(403).send("Authorization failed: You are not permitted to do this");
  }
};

/**
 * Retrieves the mails for the specified internal projects
 */
export const retrieveTeamMails = (req: Request, res: Response) => {
  database
    .query(
      `SELECT jbt_email
      FROM mitglied
      INNER JOIN internesprojekt
      ON mitglied.internesprojekt = internesprojekt.internesprojektID
      WHERE internesProjektID = ?`,
      [req.params.id]
    )
    .then(
      (
        result: QueryResult
        // traineesTypes.GetIPMailType[]
      ) => {
        if (result.length === 0) {
          res.status(404).send("Email not found");
        } else {
          res.status(200).json(result);
        }
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
      console.log(err);
    });
};
/*
 * Gets letter of motivation form trainees of given generation
 * @param {Request} req request object
 * @param {number} req.body.generationID
 * @param res member ID and 3 motivation texts
 */
export const retrieveTraineeMotivation = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, wahl_internesprojekt1_motivation, wahl_internesprojekt2_motivation,
      wahl_internesprojekt3_motivation
      FROM mitglied
      INNER JOIN generation
      ON mitglied.generation = generation.generationID
      WHERE generation.generationID = ?`,
      [req.body.generationID]
    )
    .then(
      (
        result: QueryResult
        // traineesTypes.GetTraineeMotivationResult
      ) => {
        res.status(200).json(result);
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves information about all generations
 * @param {Request} req empty request object
 * @param res generationID, short name and deadlines
 */
export const retrieveGenerations = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT generationID, bezeichnung, bewerbung_start, bewerbung_ende, wwTermin,
      auswahlWETermin, infoabendBesucher,
      tuercode, wahl_start, wahl_ende
      FROM generation`,
      []
    )
    .then(
      (
        result: QueryResult
        // traineesTypes.GetGenerationsResult
      ) => {
        res.status(200).json(result);
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
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
export const getMentorsOfGeneration = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname, generation_generationID
    FROM mitglied
    INNER JOIN generation_has_mentor
    ON generation_has_mentor.mitglied_mitgliedID = mitglied.mitgliedID
    WHERE generation_has_mentor.generation_generationID = ?`,
      [req.params.id]
    )
    .then(
      (
        result: QueryResult
        //  traineesTypes.GetMentorsOfGenerationResult
      ) => {
        res.status(200).json(result);
      }
    )
    .catch((err) => {
      res.status(500).send("Query Error");
    });
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
