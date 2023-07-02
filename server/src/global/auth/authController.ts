/**
 * Definition of the functions required for authentification and authorization
 */
import { CookieOptions, Request, Response } from "express";
import database = require("../../database");
import * as globalTypes from "./../globalTypes";
import * as authTypes from "./authTypes";
import { generateJWT, verifyJWT } from "../../utils/jwtUtils";
import { createUserDataPayload } from "../../utils/authUtils";
import { QueryResult } from "databaseTypes";
import { loginUser } from "./authServices";

/**
 * Options for the cookie
 */
const cookieOptions: CookieOptions = {
  httpOnly: true, // Cookie is only accesible via the browser
  secure: true, // Cookie can only be sent to an HTTPS page
  sameSite: "none", // Cookie can be sent to every site
};

/**
 * Sleeps randomly between a given minimum and maximum of miliseconds
 * @param minMiliSec Minimum of miliseconds
 * @param maxMiliSec Maximum of miliseconds
 */
const sleepRandomly = (minMiliSec: number, maxMiliSec: number) => {
  const randomMiliSec = Math.floor(Math.random() * (maxMiliSec - minMiliSec)) + minMiliSec;
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < randomMiliSec);
};

/**
 * Sends an httpOnly cookie to the client and retrieves id, username and corresponding permissions
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const payload = await loginUser(req.body as authTypes.UserLoginDto);
  const token = generateJWT(payload);
  return res.cookie("token", token, cookieOptions).status(200).json(payload);
};

/**
 * Retrieves the data of the currently logged in user
 */
export const retrieveUserData = (req: Request, res: Response) => {
  // Decode the JWT to access the id of the user
  const jwtData = verifyJWT(req.cookies.token);
  database
    .query(
      `SELECT mitgliedID, name, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
      FROM mitglied
      LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
      WHERE mitgliedID = ?
      GROUP BY mitgliedID, name`,
      [jwtData.mitgliedID]
    )
    .then(
      (
        result: QueryResult
        // authTypes.UserDataQueryResult[]
      ) => {
        let member = null;
        if (Array.isArray(result)) {
          member = result[0] as authTypes.UserAuthenticationDto;
        }
        // Selects permissions belonging to a possible role of the member
        database
          .query(
            `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
          FROM mitglied_has_evposten
          LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
          WHERE mitglied_has_evposten.mitglied_mitgliedID = ?;
        `,
            [jwtData.mitgliedID]
          )
          .then(
            (
              directorPermissionsResult: QueryResult
              // globalTypes.Permission[]
            ) => {
              let directorPermissions = null;
              if (Array.isArray(directorPermissionsResult)) {
                directorPermissions = directorPermissionsResult as globalTypes.Permission[];
              }
              const payload = createUserDataPayload(member, directorPermissions);
              res.status(200).json(payload);
            }
          )
          .catch(() => {
            res.status(500).send("Query Error");
          });
      }
    )
    .catch(() => {
      res.status(500).send("Query Error");
    });
};

/**
 * Loggs the user out by removing the jwt from the cookie
 */
export const logout = (req: Request, res: Response) => {
  const token = null;
  res.cookie("token", token, cookieOptions).status(200).send("Logout succesful!");
};
