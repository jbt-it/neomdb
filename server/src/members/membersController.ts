/**
 * Definition of the handler functions for the members module
 */
import database = require("../database");
import auth = require("../global/authController");
import bcrypt = require("bcryptjs");

import {Request, Response} from "express";
import * as membersTypes from "./membersTypes";
import {JWTPayload} from "../global/globalTypes";

/**
 * Obtains username and corresponding permissions
 */
export const login = (req: Request, res: Response): void => {
 if(req.body.username === "" || req.body.password === ""){
   res.status(401).send("Credentials incomplete");
 } else {
   database.query(
    `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
    FROM mitglied
    INNER JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
    WHERE mitglied.name = ?
    GROUP BY mitgliedID, name`,
    [req.body.username])
    .then((result: membersTypes.LoginQueryResult[]) => {
      if (result.length === 0) {
        res.status(401).send("Username or password wrong");
      }
      bcrypt.compare(req.body.password, result[0].passwordHash)
      .then((match) => {
        if(match) {
          const payload: JWTPayload = {
            mitgliedID: result[0].mitgliedID,
            name: result[0].name,
            permissions: result[0].permissions.split(",").map(Number)
          };
          res.status(200).json(auth.generateJWT(payload));
        } else {
          res.status(401).send("Username or password wrong");
        }
    })
      .catch((err) => {
        res.status(401).send("Username or password wrong");
      });
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
 }
};

/**
 * Retrieves an overview of all registered members
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
 * Retrieves a member specified by id
 */
export const retrieveMember = (req: Request, res: Response): void => {
  database.query(
    `SELECT *
    FROM mitglied
    WHERE mitgliedID = ?`,
  [req.params.id])
  .then((result: []) => {
    if(result.length === 0){
      res.status(404).send("User not found");
    } else {
      res.status(200).json(result);
    }
  })
  .catch((err) => {
    res.status(500).send("Query Error");
  });
};

/**
 * Creates a new member
 */
export const createMember = (req: Request, res: Response): void => {
  bcrypt.hash(req.body.password, 12)
  .then((hash) => {
    database.query(
      `INSERT INTO mitglied (vorname, nachname, name, passwordHash, geschlecht,
        geburtsdatum, handy)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.body.vorname, req.body.nachname, req.body.name, hash, req.body.geschlecht,
        req.body.geburtsdatum, req.body.handy])
      .then((result) => {
        res.status(201).send("User created");
      })
      .catch((err) => {
        res.status(500).send("Query Error: Creating User");
      });
  })
  .catch((err) => {
    res.status(500).send("Hashing error");
  });
};

/**
 * Updates an existing member
 */
export const updateMember = (req: Request, res: Response): void => {
  database.query(
    `UPDATE mitglied
    SET handy = ?, arbeitgeber = ?, strasse1 = ?, plz1 = ?, ort1 = ?, tel1 = ?, email1 = ?, strasse2 = ?,
    plz2 = ?, ort2 = ?, tel2 = ?, email2 = ?, hochschule = ?, studiengang = ?, studienbeginn = ?,
    studienende = ?, ausbildung = ?, kontoinhaber = ?, iban = ?, bic = ?, fuehrerschein = ?,
    ersthelferausbildung = ?
    WHERE mitgliedID = ?
  `,
  [req.body.handy, req.body.arbeitgeber, req.body.strasse1, req.body.plz1, req.body.ort1, req.body.tel1,
    req.body.email1, req.body.strasse2, req.body.plz2, req.body.ort2, req.body.tel2, req.body.email2,
    req.body.hochschule, req.body.studiengang, req.body.studienbeginn, req.body.studienende, req.body.ausbildung,
    req.body.kontoinhaber, req.body.iban, req.body.bic, req.body.fuehrerschein, req.body.ersthelferausbildung,
    req.params.id])
  .then((result) => {
    res.status(200).send("Profile Update Successful");
  })
  .catch((err) => {
    res.status(500).send("Query Error: Updating Profile failed");
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