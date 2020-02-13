/**
 * Definition of the functions required for authentification and authorization
 */
import jwt = require("jsonwebtoken");
import fs = require("fs");

import {Request, Response, NextFunction} from "express";
import * as globalTypes from "./globalTypes";

const JWTKeys = {
  public: fs.readFileSync(process.env.JWT_PUBLIC),
  private: fs.readFileSync(process.env.JWT_PRIVATE)
};

const JWTSignOptions: jwt.SignOptions = {
  expiresIn: 60*60*24, // Expires in 24 hours
  algorithm: "RS256"
};

const JWTVerifyOptions:jwt.VerifyOptions = {
  algorithms: ["RS256"]
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
export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWTKeys.public, JWTVerifyOptions);
  }
  catch (err) {
    return false;
  }
};

/**
 * Verifies JWT and protects following routes from unauthorised access
 */
export const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && verifyJWT(req.headers.authorization.replace("Bearer ", ""))) {
    next();
  } else {
    return res.status(401).send("Authentication failed: Please log in");
  }
};

/**
 * Checks if user has the right permissions to use the following routes
 * Every permission in the permissions array needs to be included in the permissions
 * of the received jwt
 * @param permissions Array of permissions which are allowed to use following routes
 */
export const restrictRoutes = (permissions: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const jwtPermissions = verifyJWT(req.headers.authorization.replace("Bearer ", "")).permissions;
    if(permissions.every(element => jwtPermissions.includes(element))) {
      next();
    } else {
      return res.status(401).send("Authorization failed: You are not permitted to do this");
    }
  };
};