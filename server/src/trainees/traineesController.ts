/**
 * Definition of the handler functions for the trainees module
 */
import database = require("../database");

import { Request, Response } from "express";
import * as traineesTypes from "./traineesTypes";

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
  // TODO: Add database.query call (see 'retrieveCurrentDirectors' function in membersController for a good example)
  // Hint: You get the url parameter (in this case id) like this:
  //        req.params.{name of the url parameter}
  //        e.g.: req.params.id
};
