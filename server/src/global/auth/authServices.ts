import { JWTPayload, Permission } from "../globalTypes";
import { getDirectorPermissionsByMemberID, getUserByUsername } from "../../resources/members/membersRepository";
import { NotFoundError, UnauthenticatedError } from "../../types/errors";
import { User, UserLoginRequest } from "./authTypes";
import bcrypt = require("bcryptjs");
import { createUserDataPayload } from "../../utils/authUtils";
import { sleepRandomly } from "../../utils/timeUtils";

/**
 * Logs a user in
 */
export const loginUser = async (userLogin: UserLoginRequest): Promise<JWTPayload> => {
  if (userLogin.username === "" || userLogin.password === "") {
    throw new UnauthenticatedError("Credentials incomplete");
  }

  const user: User = await getUserByUsername(userLogin.username);

  if (user === null) {
    // Sleep to prevent oracle attacks (guessing if a user exists by looking at the response time)
    sleepRandomly(50, 110);
    throw new UnauthenticatedError("Username or password wrong");
  }

  const directorPermissions: Permission[] = await getDirectorPermissionsByMemberID(user.mitgliedID);

  const match = await bcrypt.compare(userLogin.password, user.passwordHash);

  if (!match) {
    throw new UnauthenticatedError("Username or password wrong");
  }

  const payload: JWTPayload = createUserDataPayload(user, directorPermissions);
  return payload;
};

/**
 * Retrieves the data of a user
 */
export const getUserData = async (username: string): Promise<JWTPayload> => {
  const user: User = await getUserByUsername(username);

  if (user === null) {
    throw new NotFoundError(`No user found with name ${username}`);
  }

  const directorPermissions: Permission[] = await getDirectorPermissionsByMemberID(user.mitgliedID);

  const payload = createUserDataPayload(user, directorPermissions);
  return payload;
};
