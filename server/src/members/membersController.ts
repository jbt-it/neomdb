/**
 * Definition of the handler functions for the users module
 */
import {Request, Response} from "express";
import database = require("../database");

import * as membersTypes from "members/membersTypes";

/**
 * Handles transmitted credentials and replies accordingly
 */
export const replyCredentials = (req: Request, res: Response): void => {
  res.json(checkCredentials(req.body));
};

/**
 * Checks if complete credenials were specified
 * @param credentials Credentials specified by the user
 */
const checkCredentials = (credentials: membersTypes.Credentials): string | membersTypes.Credentials => {
 if(credentials.username === "" || credentials.password === ""){
   return("credetials are not complete");
 } else {
   database.query("SELECT * FROM mitglied WHERE name = ? AND passwort = ?", [credentials.username, credentials.password])
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log("Error " + err);
    });
 }
};