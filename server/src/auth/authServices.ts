import { JWTPayload, Permission } from "../globalTypes";
import {
  getDirectorPermissionsByMemberID,
  getUserByName,
  updateUserPassword,
} from "../resources/members/membersRepository";
import { NotFoundError, UnauthenticatedError } from "../types/errors";
import { User, UserChangePasswordRequest, UserLoginRequest } from "../types/authTypes";
import bcrypt = require("bcryptjs");
import { createUserDataPayload } from "../utils/authUtils";
import { sleepRandomly } from "../utils/timeUtils";

/**
 * Logs a user in
 * @throws UnauthenticatedError if the credentials are incomplete
 * @throws UnauthenticatedError if the username or password is wrong
 */
export const loginUser = async (userLogin: UserLoginRequest): Promise<JWTPayload> => {
  if (userLogin.username === "" || userLogin.password === "") {
    throw new UnauthenticatedError("Credentials incomplete");
  }

  const user: User = await getUserByName(userLogin.username);

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
 * @throws NotFoundError if no user was found
 */
export const getUserData = async (username: string): Promise<JWTPayload> => {
  const user: User = await getUserByName(username);

  if (user === null) {
    throw new NotFoundError(`No user found with name ${username}`);
  }

  const directorPermissions: Permission[] = await getDirectorPermissionsByMemberID(user.mitgliedID);

  const payload = createUserDataPayload(user, directorPermissions);
  return payload;
};

/**
 * Compares the old password with the passwordHash of the user and updates
 * the passwordHash if the old password is correct
 * @throws UnauthenticatedError if the old password is not correct
 * @throws UnauthenticatedError if the user does not exist
 */
export const changeUserPassword = async (userChangePasswordRequest: UserChangePasswordRequest): Promise<void> => {
  // const userPassword = await getUserPasswordByName(userChangePasswordRequest.userName);
  const user = await getUserByName(userChangePasswordRequest.userName);

  if (user === null) {
    throw new UnauthenticatedError("User does not exist");
  }

  const match = await bcrypt.compare(userChangePasswordRequest.oldPassword, user.passwordHash);

  if (!match) {
    throw new UnauthenticatedError("The old password was not correct");
  }

  const newPasswordHash = await bcrypt.hash(userChangePasswordRequest.newPassword, 10);

  await updateUserPassword(userChangePasswordRequest.userName, userChangePasswordRequest.userID, newPasswordHash);
};
