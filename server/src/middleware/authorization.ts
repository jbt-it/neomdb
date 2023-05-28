import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwtUtils";
import { doesPermissionsHaveSomeOf, doesPermissionsInclude, doesRolesHaveSomeOf } from "../utils/authUtils";

/**
 * Checks if memberID equals ressource id or member has specified permission
 * to grant access to ressource
 * @param permissions Array of permissions which are allowed to use following routes
 * @returns 403 if user is not permitted to use the following routes
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
 * @returns 403 if user is not permitted to use the following routes
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

/**
 * Checks if user has the right roles to use the following routes
 * @param roles Array of roles which are allowed to use following routes
 * @returns 403 if user is not permitted to use the following routes
 */
export const restrictRoutesToRoles = (roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const jwtData = verifyJWT(req.cookies.token);
    if (!doesRolesHaveSomeOf(jwtData.roles, roles)) {
      return res.status(403).send("Authorization failed: You are not permitted to do this");
    }
    next();
  };
};

/**
 * Checks if user has the right roles to manipulate the department with the given id (provided in the request as a parameter)
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns 403 if user is not permitted to use the following routes
 */
export const checkDepartmentAccess = (req: Request, res: Response, next: NextFunction) => {
  const { roles } = verifyJWT(req.cookies.token);
  const departmentID = Number(req.params.id);
  let isMemberAuthorized = false;

  // Map departmentID to roleID
  switch (departmentID) {
    case 1: {
      if (doesRolesHaveSomeOf(roles, [1])) {
        // 1V
        isMemberAuthorized = true;
      }
      break;
    }
    case 2: {
      if (doesRolesHaveSomeOf(roles, [2])) {
        // RL Qualitätsmanagement
        isMemberAuthorized = true;
      }
      break;
    }
    case 3: {
      if (doesRolesHaveSomeOf(roles, [3])) {
        // RL F&R
        isMemberAuthorized;
      }
      break;
    }
    case 4: {
      if (doesRolesHaveSomeOf(roles, [44])) {
        // RL Firmenkontakte
        isMemberAuthorized = true;
      }
      break;
    }
    case 5: {
      if (doesRolesHaveSomeOf(roles, [10])) {
        // RL Mitglieder
        isMemberAuthorized = true;
      }
      break;
    }
    case 6: {
      if (doesRolesHaveSomeOf(roles, [14])) {
        // RL Marketing
        isMemberAuthorized = true;
      }
      break;
    }
    case 7: {
      if (doesRolesHaveSomeOf(roles, [8])) {
        // RL IT
        isMemberAuthorized = true;
      }
      break;
    }
    default: {
      isMemberAuthorized = false;
      break;
    }
  }
  if (!isMemberAuthorized) {
    return res.status(403).send("Authorization failed: You are not permitted to do this");
  }
  next();
};
