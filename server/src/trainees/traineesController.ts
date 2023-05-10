/**
 * Definition of the handler functions for the trainee module
 */
import { Request, Response } from "express";
import database = require("../database");
import * as traineeTypes from "./traineesTypes";

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
    .then((result: traineeTypes.GetTraineeChoiceResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
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
    .then((result: traineeTypes.GetTraineeMotivationResult) => {
      res.status(200).json(result);
    })
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
    .then((result: traineeTypes.GetGenerationsResult) => {
      res.status(200).json(result);
    })
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
  // Search for req.params.id to check if it already exists
  const resultFirstQuery = await database.query(`SELECT generationID FROM generation WHERE generationID = ?`, [req.params.id]); 
  // Check if req.params.id is null or empty
  if (Array.isArray(resultFirstQuery) && resultFirstQuery.length != 0) {
    database
    .query(`UPDATE generation SET wahl_start= ?, wahl_ende= ?  WHERE generationID=?`, [
      req.body.votingStart,
      req.body.votingEnd,
      req.params.id,
    ])
    .then((result) => {
      res.status(201).send("Updated Trainee Voting Deadline");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Query Error");
    });
   }  else {
    res.status(500).send("Generation does not exist");
    return; 
   }
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
  // Search for req.params.id to check if it already exists
  const resultFirstQuery = await database.query(`SELECT mitgliedID FROM mitglied WHERE mitgliedID = ?`, [req.params.id]); 
  // Check if req.params.id is null or empty
  if (Array.isArray(resultFirstQuery) && resultFirstQuery.length != 0) {
    database
    .query(
      `UPDATE mitglied SET wahl_internesprojekt = ?, internesprojekt=? ,wahl_mentor=?, mentor=?, wahl_ressort=?, ressort=? WHERE mitgliedID=?`,
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
  } else {
    res.status(500).send("Member does not exist");
    return;
  }
};

/**
 * Addes one new member as mentor to generation
 * @param {Request} req request object
 * @param {number} req.params.member_id ID of member
 * @param {number} req.params.id ID of generation
 * @param res status code and message
 */
export const addMentor = async (req: Request, res: Response) => {
  // Search for req.params.id to check if it already exists
  const resultFirstQuery = await database.query(`SELECT generationID FROM generation WHERE generationID = ?`, [req.params.id]); 
  // Check if req.params.id is null or empty
  if (Array.isArray(resultFirstQuery) && resultFirstQuery.length != 0) {
    database
    .query(`INSERT INTO generation_has_mentor (mitglied_mitgliedID, generation_generationID) VALUES (?, ?)`, [
      req.params.member_id,
      req.params.id,
    ])
    .then((result) => {
      res.status(201).send("Added new mentor");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Query Error");
    });
  } else {
    res.status(500).send("Generation does not exist");
    return;
  }
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
    .then((result: traineeTypes.GetMentorsOfGenerationResult) => {
      res.status(200).json(result);
    })
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
    .then((result: traineeTypes.GetInternalProjectOfGenerationResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};
