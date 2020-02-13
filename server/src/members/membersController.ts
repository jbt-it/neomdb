/**
 * Definition of the handler functions for the users module
 */
import database = require("../database");
import auth = require("../global/authController");

import {Request, Response} from "express";
import * as membersTypes from "./membersTypes";
import {JWTPayload} from "../global/globalTypes";

/**
 * Obtains username and corresponding permissions
 */
export const replyCredentials = (req: Request, res: Response): void => {
 if(req.body.username === "" || req.body.password === ""){
   res.status(400).send("Credentials incomplete");
 } else {
   database.query(
    `SELECT mitgliedID, name, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
    FROM mitglied
    INNER JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
    WHERE mitglied.name = ? AND mitglied.passwordHash = ?
    GROUP BY mitgliedID, name`,
    [req.body.username, req.body.password])
    .then((result: membersTypes.LoginQueryResult[]) => {
      if (result.length === 0) {
        res.status(401).send("Username or password wrong");
      }
      const payload: JWTPayload = {
        mitgliedID: result[0].mitgliedID,
        name: result[0].name,
        permissions: result[0].permissions.split(",").map(Number)
      };
      res.status(200).json(auth.generateJWT(payload));
    })
    .catch(err => {
      res.status(500).send("Query Error");
    });
 }
};