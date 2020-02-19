/**
 * Definition of the handler functions for the users module
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
 * Creates a new member
 */
export const createNewMember = (req: Request, res: Response): void => {
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
