import { JWTPayload, Permission } from "global/globalTypes";
import { getDirectorPermissions, getUser } from "../../resources/members/membersRepository";
import { UnauthenticatedError } from "../../types/Errors";
import { UserAuthenticationDto, UserLoginDto } from "./authTypes";
import bcrypt = require("bcryptjs");

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
 * Creates the payload for the user data
 * @param result The result of the login query
 * @param directorPermissionsResult The result of the director permissions query
 * @returns The payload for the user data
 */
export const createUserDataPayload = (result: UserAuthenticationDto, directorPermissionsResult: Permission[]) => {
  const permissions = [];
  const roles = [];
  // Adds role permissions to the permissions array and adds directorID to the roles array
  if (directorPermissionsResult.length !== 0) {
    directorPermissionsResult.forEach((permission) => {
      permissions.push({ permissionID: permission.permissionID, canDelegate: permission.canDelegate });
      if (!roles.includes(permission.directorID)) {
        roles.push(permission.directorID);
      }
    });
  }

  // Adds normal permissions to the permissions array
  if (result.permissions) {
    result.permissions

      .split(",")
      .map(Number)
      .map((perm) => {
        // A Permission which was delegated to a member cannot be delegated further (therefore canDelegate is always 0)
        permissions.push({ permissionID: perm, canDelegate: 0 });
      });
  }
  const payload: JWTPayload = {
    mitgliedID: result.mitgliedID,
    name: result.name,
    permissions,
    roles,
  };
  return payload;
};

// TODO: Change types: JWT Payload, UserLoginDto
export const loginUser = async (userLogin: UserLoginDto): Promise<JWTPayload> => {
  if (userLogin.username === "" || userLogin.password === "") {
    throw new UnauthenticatedError("Credentials incomplete");
  }

  const user: UserAuthenticationDto = await getUser(userLogin.username);

  if (user === null) {
    sleepRandomly(50, 110);
    throw new UnauthenticatedError("Username or password wrong");
  }

  const directorPermissionsResult = await getDirectorPermissions(user.mitgliedID);
  let directorPermissions = null;

  if (Array.isArray(directorPermissionsResult)) {
    directorPermissions = directorPermissionsResult as Permission[];
  }

  const match = await bcrypt.compare(userLogin.password, user.passwordHash);

  if (!match) {
    throw new UnauthenticatedError("Username or password wrong");
  }

  const payload = createUserDataPayload(user, directorPermissions);
  return payload;
};
