/**
 * Definition of the handler functions for the members module
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
 * Retrieves an overview of all registered members
 */
export const retrieveTraineeChoice = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT
      vorname, nachname, wahl_mentor, wahl_mentor1, wahl_mentor2, wahl_mentor3,
      wahl_internesprojekt, wahl_internesprojekt1, wahl_internesprojekt2, wahl_internesprojekt3,
      wahl_ressort, wahl_ressort1, wahl_ressort2, wahl_ressort3  FROM  mitglied  WHERE  mitgliedstatus = 1`,
      []
    )
    .then((result: traineeTypes.GetTraineeChoiceResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};
