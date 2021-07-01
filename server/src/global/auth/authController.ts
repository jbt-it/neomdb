/**
 * Definition of the functions required for authentification and authorization
 */
import jwt = require("jsonwebtoken");
import fs = require("fs");
import bcrypt = require("bcryptjs");
import {Request, Response, NextFunction} from "express";
import database = require("../../database");
import * as globalTypes from "./../globalTypes";
import * as authTypes from "./authTypes";


const JWTKeys = {
  public: fs.readFileSync(process.env.JWT_PUBLIC),
  private: fs.readFileSync(process.env.JWT_PRIVATE)
};

const JWTSignOptions: jwt.SignOptions = {
  expiresIn: 60*60, // Expires in 1 hour
  algorithm: "RS256"
};

const JWTVerifyOptions:jwt.VerifyOptions = {
  algorithms: ["RS256"]
};

/**
 * Options fot the cookie
 */
const cookieOptions = {
  httpOnly: true, // Cookie is onyl accesible via the browser
  secure: true, // Cookie can only be sent to an HTTPS page
  sameSite: true // Cookie can only be sent to the same site
};

/**
 * Generates JWT based on query results for the login process
 * @param payload object containing non sensitive user data
 */
export const generateJWT = (payload: globalTypes.JWTPayload): string => {
  return jwt.sign(payload, JWTKeys.private, JWTSignOptions);
};

/**
 * Verifies recived JWT from the user and returnes decoded payload or false
 * @param token JWT sent with the users request
 */
export const verifyJWT = (token: string): null | globalTypes.JWTPayload => {
  try {
    return jwt.verify(token, JWTKeys.public, JWTVerifyOptions) as globalTypes.JWTPayload;
  }
  catch (err) {
    return null;
  }
};

/**
 * Verifies JWT and protects following routes from unauthorised access
 */
export const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies) {
    const jwtData = verifyJWT(req.cookies.token);
    if (jwtData !== null) {
      res.locals.memberID = jwtData.mitgliedID;
      res.locals.permissions = jwtData.permissions;
      next();
    } else {
      return res.status(401).send("Authentication failed: Please log in");
    }
  } else {
    return res.status(401).send("Authentication failed: Please log in");
  }
};

/**
 * Checks if memberID equals ressource id or member has specified permission
 * to grant access to ressource
 */
export const restrictRoutesSelfOrPermission = (permissions: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const jwtData = verifyJWT(req.cookies.token);
    if (Number(req.params.id) === jwtData.mitgliedID ||
      permissions.every(element => jwtData.permissions.includes(element))) {
      res.locals.memberID = jwtData.mitgliedID;
      res.locals.permissions = jwtData.permissions;
      next();
    } else {
      return res.status(403).send("Authorization failed: You are not permitted to do this");
    }
  };
};

/**
 * Checks if user has the right permissions to use the following routes
 * Every permission in the permissions array needs to be included in the permissions
 * of the received jwt
 * @param permissions Array of permissions which are allowed to use following routes
 */
export const restrictRoutes = (permissions: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const jwtDataPermissions = verifyJWT(req.cookies.token).permissions;
    if (permissions.every(element => jwtDataPermissions.includes(element))) {
      next();
    } else {
      return res.status(403).send("Authorization failed: You are not permitted to do this");
    }
  };
};

/**
 * Sends an httpOnly cookie to the client and retrieves id, username and corresponding permissions
 */
export const login = (req: Request, res: Response): void => {
  if (req.body.username === "" || req.body.password === "") {
    res.status(401).send("Credentials incomplete");
  } else {
    database.query(
      `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
    FROM mitglied
    LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
    WHERE mitglied.name = ?
    GROUP BY mitgliedID, name`,
      [req.body.username])
      .then((result: authTypes.LoginQueryResult[]) => {
        if (result.length === 0) {
          res.status(401).send("Username or password wrong");
        }
        bcrypt.compare(req.body.password, result[0].passwordHash)
          .then((match) => {
            if (match) {
              const payload: globalTypes.JWTPayload = {
                mitgliedID: result[0].mitgliedID,
                name: result[0].name,
                permissions: result[0].permissions ?
                  result[0].permissions.split(",").map(Number) : []
              };
              const token = generateJWT(payload);
              res.cookie("token", token, cookieOptions).status(200).json(payload);
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
 * Retrieves the data of the currently logged in user
 */
export const retrieveUserData = (req: Request, res: Response) => {

  // Decode the JWT to access the id of the user
  const jwtData = verifyJWT(req.cookies.token);
  database.query(
    `SELECT mitgliedID, name, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
    FROM mitglied
    LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
    WHERE mitgliedID = ?
    GROUP BY mitgliedID, name`,
    [jwtData.mitgliedID])
    .then((result: authTypes.UserDataQueryResult[]) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).send("Query Error");
    });
};