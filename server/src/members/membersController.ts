/**
 * Definition of the handler functions for the users module
 */
import {Request, Response} from "express";

import * as usersTypes from "members/membersTypes";

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
const checkCredentials = (credentials: usersTypes.Credentials): string | usersTypes.Credentials => {
 if(credentials.username === "" || credentials.password === ""){
   return("credetials are not complete");
 } else {
  return(credentials);
 }
};