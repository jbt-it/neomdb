/**
 * Definition of the handler functions for the trainees module
 */
import database = require("../database");

import { Request, Response } from "express";
import * as traineesTypes from "./traineesTypes";
import { doesPermissionsInclude } from "../utils/authUtils";

/**
 * Retrieves all internal projects of one generation
 */
export const retrieveAllIPsByGeneration = (req: Request, res: Response): void => {
  // TODO: You don't need this controller function necessarily, but it's a good practice :)
  // TODO: Add database.query call (see 'retrieveCurrentDirectors' function in membersController for a good example)
  // Hint: You get the url parameter (in this case generation-id) like this:
  //        req.params.{name of the url parameter}
  //        e.g.: req.params.id
};

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
    .then((result: traineesTypes.GetInternalProjectType[]) => {
      if (result.length === 0) {
        res.status(404).send("IP not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
      console.log(err);
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
      FROM mitglied, internesprojekt
      WHERE internesProjektID = ? AND internesProjektID = mitglied.internesprojekt`,
      [req.params.id]
    )
    .then((result: traineesTypes.GetIPMailType[]) => {
      if (result.length === 0) {
        res.status(404).send("Email not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
      console.log(err);
    });
};
