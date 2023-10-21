import * as express from "express";
import { UnauthenticatedError, UnauthorizedError } from "../types/Errors";
import { checkForValidJWT, extractJWTFromHeader, verifyJWT } from "../utils/jwtUtils";
import { Permission } from "types/authTypes";

/**
 * Checks if the user has the required permissions to access the route
 * @param jwtPermissions Permissions of the user extracted from the JWT
 * @param permissions Permissions required to access the route
 * @throws UnauthenticatedError if the user does not have the required permissions
 */
const checkPermissions = (jwtPermissions: Permission[], permissions: string[]) => {
  // TODO: Use doesPermissionsHaveSomeOf function from authUtils.ts after refactoring is done
  if (!jwtPermissions.some((permission) => permissions.includes(permission.permissionID.toString()))) {
    throw new UnauthorizedError("Authorization failed: Insufficient permissions");
  }
};

/**
 * Implements the authentication middleware which **protects** all critical routes from unauthorised access
 * @param req the request object
 * @param permissions the permissions required to access the route
 * @param checkHeader whether to check the header or the cookie for the JWT
 * (the header is only used in development because swagger-ui does not support cookies)
 */
const checkDataFromJWT = (req: express.Request, permissions: string[], checkHeader: boolean) => {
  return new Promise((resolve, reject) => {
    if (!checkForValidJWT(req, checkHeader)) {
      reject(new UnauthenticatedError("Authentication failed: Please log in"));
    }
    const token = req.cookies["token"] || extractJWTFromHeader(req.headers.authorization);
    const jwtData = verifyJWT(token);

    if (jwtData === null) {
      reject(new UnauthenticatedError("Authentication failed: Please log in"));
    }

    if (Array.isArray(permissions) && permissions.length > 0) {
      checkPermissions(jwtData.permissions, permissions);
    }

    resolve(jwtData);
  });
};

/**
 * Implements the authentication middleware which **protects** all critical routes from unauthorised access
 * and stores the user data in **request.user** (implicitly handled by security middleware of tsoa)
 * and can be accessed in the controller
 * @param request the request object
 * @param securityName the name of the security scheme (e.g. jwt)
 * @param permissions the permissions required to access the route
 * @returns a promise which resolves to the decoded payload of the JWT
 */
export const expressAuthentication = (
  request: express.Request,
  securityName: string,
  permissions?: string[]
): Promise<any> => {
  const checkHeader = process.env.IS_PRODUCTION !== "true";
  if (securityName === "jwt") {
    return checkDataFromJWT(request, permissions, checkHeader);
  }
};
