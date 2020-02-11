/**
 * Definition of the handler functions for the users module
 */
import {Request, Response} from "express";
import database = require("../database");

/**
 * Handles transmitted credentials and replies accordingly
 */
export const replyCredentials = (req: Request, res: Response): void => {
 if(req.body.username === "" || req.body.password === ""){
   res.status(400).send("Credentials incomplete");
 } else {
   database.query("SELECT * FROM mitglied WHERE name = ? AND passwort = ?", [req.body.username, req.body.password])
    .then((result: (string | number)[]) => {
      if (result.length === 0) {
        res.status(401).send("Username or password wrong");
      }
      res.status(200).json(JSON.stringify(result));
    })
    .catch(err => {
      console.log("Error " + err);
      res.status(500).send("Query Error");
    });
 }
};