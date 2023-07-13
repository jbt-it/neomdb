import MembersRepository from "../resources/members/membersRepository";
import { JWTPayload, Permission, User, UserChangePasswordRequest, UserLoginRequest } from "../types/authTypes";
import { NotFoundError, UnauthenticatedError } from "../types/errors";
import { createUserDataPayload } from "../utils/authUtils";
import { sleepRandomly } from "../utils/timeUtils";
import bcrypt = require("bcryptjs");

class AuthService {
  membersRepository = new MembersRepository();

  /**
   * Logs a user in
   * @throws UnauthenticatedError if the credentials are incomplete
   * @throws UnauthenticatedError if the username or password is wrong
   */
  loginUser = async (userLogin: UserLoginRequest): Promise<JWTPayload> => {
    if (userLogin.username === "" || userLogin.password === "") {
      throw new UnauthenticatedError("Credentials incomplete");
    }

    const user: User = await this.membersRepository.getUserByName(userLogin.username);

    if (user === null) {
      // Sleep to prevent oracle attacks (guessing if a user exists by looking at the response time)
      sleepRandomly(50, 110);
      throw new UnauthenticatedError("Username or password wrong");
    }

    const directorPermissions: Permission[] = await this.membersRepository.getDirectorPermissionsByMemberID(
      user.mitgliedID
    );

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
  getUserData = async (username: string): Promise<JWTPayload> => {
    const user: User = await this.membersRepository.getUserByName(username);

    if (user === null) {
      throw new NotFoundError(`No user found with name ${username}`);
    }

    const directorPermissions: Permission[] = await this.membersRepository.getDirectorPermissionsByMemberID(
      user.mitgliedID
    );

    const payload = createUserDataPayload(user, directorPermissions);
    return payload;
  };

  /**
   * Compares the old password with the passwordHash of the user and updates
   * the passwordHash if the old password is correct
   * @throws UnauthenticatedError if the old password is not correct
   * @throws UnauthenticatedError if the user does not exist
   */
  changeUserPassword = async (userChangePasswordRequest: UserChangePasswordRequest): Promise<void> => {
    // const userPassword = await getUserPasswordByName(userChangePasswordRequest.userName);
    const user = await this.membersRepository.getUserByName(userChangePasswordRequest.userName);

    if (user === null) {
      throw new UnauthenticatedError("User does not exist");
    }

    const match = await bcrypt.compare(userChangePasswordRequest.oldPassword, user.passwordHash);

    if (!match) {
      throw new UnauthenticatedError("The old password was not correct");
    }

    const newPasswordHash = await bcrypt.hash(userChangePasswordRequest.newPassword, 10);

    await this.membersRepository.updateUserPasswordByUserNameAndUserID(
      userChangePasswordRequest.userName,
      userChangePasswordRequest.userID,
      newPasswordHash
    );
  };

  /**
   * Checks if a user is authorized for a department by checking every role of the user
   * @param roles Array of roles of the user
   */
  isUserAuthorizedForDepartment = async (roles: number[], departmentID: number): Promise<boolean> => {
    const departments = await this.membersRepository.getDepartmentsByRoles(roles);

    if (departments === null) {
      return false;
    }

    for (let i = 0; i < departments.length; i++) {
      if (departments[i].ressortID === departmentID) {
        return true;
      }
    }
    return false;
  };
}

export default AuthService;
