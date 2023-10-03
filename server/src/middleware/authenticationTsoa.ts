import * as express from "express";
import * as jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../types/Errors";
import { verifyJWT } from "../utils/jwtUtils";

/**
 * Implements the authentication middleware which **protects** all critical routes from unauthorised access.
 */
const checkDataFromJWT = (req: express.Request, permissions) => {
  return new Promise((resolve, reject) => {
    if (!req.cookies || !req.cookies.token || !verifyJWT(req.cookies.token)) {
      reject(new UnauthenticatedError("Authentication failed: Please log in"));
    }
    const jwtData = verifyJWT(req.cookies.token);
    resolve(jwtData);
  });
};

export const expressAuthentication = (
  request: express.Request,
  securityName: string,
  permissions?: string[]
): Promise<any> => {
  if (securityName === "jwt") {
    console.log(permissions);
    return checkDataFromJWT(request, permissions);
  }
};
