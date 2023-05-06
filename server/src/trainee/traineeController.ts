/**
 * Definition of the handler functions for the trainee module
 */
import bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import database = require("../database");
import { getRandomString } from "../utils/stringUtils";
import { createMailAccount, addMailAccountToMailingList } from "../utils/plesk";
import { createMWUser } from "../utils/mediawiki";
import { createNCUser } from "../utils/nextcloud";
import * as traineeTypes from "./traineeTypes";
import { PoolConnection } from "mysql";
import * as authTypes from "./../global/auth/authTypes";
import { canPermissionBeDelegated, doesPermissionsInclude } from "../utils/authUtils";

/**
 * Retrieves choices of mentor, internal project and department of all trainees of given generation
 * @param {Request} req request object
  * @param {number} req.body.generationID
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
      [req.body.generationID]
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
      FROM generation WHERE 1`,
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
 * @param {number} req.body.generationID
 * @param res status code and message
 */
export const setVotingDeadline = (req: Request, res: Response): void => {
  database
    .query(`UPDATE generation SET wahl_start= "?", wahl_ende= "?"  WHERE generationID=?`, [
      req.body.votingStart,
      req.body.votingEnd,
      req.body.generationID,
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
 * @param {number} req.body.mitgliedID
 * @param res status code and message
 */
export const setTraineeAssignment = (req: Request, res: Response): void => {
  database
    .query(`UPDATE mitglied SET internesprojekt=?, mentor=?, ressort=?  WHERE mitgliedID=?`, [
      req.body.internesprojektID,
      req.body.mentorID,
      req.body.ressortID,
      req.body.mitgliedID,
    ])
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
 * @param {number} req.body.mitgliedID
 * @param {number} req.body.generationID
 * @param res status code and message
 */
export const addMentor = (req: Request, res: Response): void => {
  database
    .query(`INSERT INTO generation_has_mentor (mitglied_mitgliedID, generation_generationID) VALUES (?, ?)`, [
      req.body.mitgliedID,
      req.body.generationID,
    ])
    .then((result) => {
      res.status(201).send("Added new mentor");
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Gets memberID first and last name of Mentors of generation
 * @param {Request} req request object
 * @param {number} req.body.generationID
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
      [req.body.generationID]
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
 * @param {number} req.body.generationID
 * @param res ID, generation, name and short name
 */
export const getInternalProjectsOfGeneration = (req: Request, res: Response): void => {
  database
    .query(`SELECT internesprojektID, generation, projektname, kuerzel FROM internesprojekt WHERE generation=?`, [
      req.body.generationID,
    ])
    .then((result: traineeTypes.GetInternalProjectOfGenerationResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};
