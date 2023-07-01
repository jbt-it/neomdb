import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwtUtils";

/**
 * Implements the authentication middleware which **protects** all critical routes from unauthorised access.
 */
const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies || !req.cookies.token || !verifyJWT(req.cookies.token)) {
    return res.status(401).send("Authentication failed: Please log in");
  }
  const jwtData = verifyJWT(req.cookies.token);
  res.locals.memberID = jwtData.mitgliedID;
  res.locals.permissions = jwtData.permissions;
  next();
};

export default authenticationMiddleware;
