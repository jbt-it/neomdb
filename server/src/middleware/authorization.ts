import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwtUtils";
import { doesPermissionsHaveSomeOf, doesPermissionsInclude } from "../utils/authUtils";

/**
 * Checks if memberID equals ressource id or member has specified permission
 * to grant access to ressource
 */
export const restrictRoutesSelfOrPermission = (permissions: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const jwtData = verifyJWT(req.cookies.token);
    const isMemberAuthorized =
      Number(req.params.id) === jwtData.mitgliedID || doesPermissionsInclude(jwtData.permissions, permissions);

    if (!isMemberAuthorized) {
      return res.status(403).send("Authorization failed: You are not permitted to do this");
    }

    res.locals.memberID = jwtData.mitgliedID;
    res.locals.permissions = jwtData.permissions;
    next();
  };
};

/**
 * Checks if user has the right permissions to use the following routes
 * If `includeAll` is true,  every permission in the permissions array needs to be included in the permissions
 * of the received jwt
 * @param permissions Array of permissions which are allowed to use following routes
 * @param includeAll Boolean that specifies if all permissions in `permissions` must be inclded in the jwt
 */
export const restrictRoutes = (permissions: number[], includeAll = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const jwtDataPermissions = verifyJWT(req.cookies.token).permissions;
    if (includeAll) {
      // Checks if all permissions are included in the jwt
      if (!doesPermissionsInclude(jwtDataPermissions, permissions)) {
        return res.status(403).send("Authorization failed: You are not permitted to do this");
      }
      next();
    } else {
      // Checks if some of the permissions are inclded in the jwt (min. one permission must be included)
      if (!doesPermissionsHaveSomeOf(jwtDataPermissions, permissions)) {
        return res.status(403).send("Authorization failed: You are not permitted to do this");
      }
      next();
    }
  };
};
