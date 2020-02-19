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
export const login = (req: Request, res: Response): void => {
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

/**
 * Retrieves an overview of all registered users
 */
export const retrieveMemberList = (req: Request, res: Response): void => {
  database.query(
   `SELECT nachname, vorname, handy
   FROM mitglied
   ORDER BY nachname DESC`,
   [])
   .then((result: membersTypes.GetMembersQueryResult) => {
     res.status(200).json(result);
   })
   .catch(err => {
    res.status(500).send("Query Error");
   });
};

/**
 * Retrieves an overview of all issued permissions
 */
export const retrievePermissionsList = (req: Request, res: Response): void => {
  database.query(
    `SELECT vorname, nachname, berechtigung_berechtigungID AS permission
    FROM mitglied
    INNER JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID`,
  [])
  .then((result: membersTypes.GetPermissionsQueryResult) => {
    res.status(200).json(result);
  })
  .catch((err) => {
    res.status(500).send("Query Error: Getting permissions failed");
  });
};

/**
 * Create new permission
 */
export const createPermission = (req: Request, res: Response): void => {
  database.query(
    `INSERT INTO mitglied_has_berechtigung (mitglied_mitgliedID, berechtigung_berechtigungID)
    VALUES (?, ?)`,
  [req.body.memberID, req.body.permissionID])
  .then((result) => {
    res.status(201).send("Permission created");
  })
  .catch((err) => {
    res.status(500).send("Database Error: Creating Permission failed");
  });
};

/**
 * Delete issued permission
 */
export const deletePermission = (req: Request, res: Response): void => {
  database.query(
    `DELETE
    FROM mitglied_has_berechtigung
    WHERE mitglied_mitgliedID = ? AND berechtigung_berechtigungID = ?`,
  [req.body.memberID, req.body.permissionID])
  .then((result) => {
    res.status(200).send("Permission deleted");
  })
  .catch((err) => {
    res.status(500).send("Database Error: Deleting Permission failed");
  });
};