import * as bcrypt from "bcryptjs";
import * as crypto from "node:crypto";
import { AppDataSource } from "../datasource";
import { DepartmentRepository } from "../resources/members/DepartmentRepository";
import { MemberMapper } from "../resources/members/MemberMapper";
import { MemberHasDirectorPositionRepository, MembersRepository } from "../resources/members/MembersRepository";
import { JWTPayload, PermissionDTO, UserChangePasswordRequest, UserLoginRequest } from "../types/authTypes";
import { ExpiredTokenError, NotFoundError, UnauthenticatedError } from "../types/Errors";
import { getDateDifferenceInDays } from "../utils/dateUtils";
import { sleepRandomly } from "../utils/timeUtils";
import { PasswordResetRepository } from "./PasswordResetRepository";

class AuthService {
  /**
   * Logs a user in
   * @throws UnauthenticatedError if the credentials are incomplete
   * @throws UnauthenticatedError if the username or password is wrong
   */
  loginUser = async (userLogin: UserLoginRequest): Promise<JWTPayload> => {
    if (userLogin.username === "" || userLogin.password === "") {
      throw new UnauthenticatedError("Credentials incomplete");
    }

    const user = await MembersRepository.getMemberByNameWithPermissions(userLogin.username);
    if (user === null) {
      // Sleep to prevent oracle attacks (guessing if a user exists by looking at the response time)
      sleepRandomly(50, 110);
      throw new UnauthenticatedError("Username or password wrong");
    }
    const match = await bcrypt.compare(userLogin.password, user.passwordHash);

    if (!match) {
      throw new UnauthenticatedError("Username or password wrong");
    }

    const directorPermissions: PermissionDTO[] =
      await MemberHasDirectorPositionRepository.getDirectorPermissionsByMemberID(user.memberId);

    const payload: JWTPayload = MemberMapper.memberToJWTPayload(user, directorPermissions);
    return payload;
  };

  /**
   * Retrieves the data of a user
   * @throws NotFoundError if no user was found
   */
  getUserData = async (username: string): Promise<JWTPayload> => {
    const user = await MembersRepository.getMemberByNameWithPermissions(username);

    if (user === null) {
      throw new NotFoundError(`No user found with name ${username}`);
    }

    const directorPermissions: PermissionDTO[] =
      await MemberHasDirectorPositionRepository.getDirectorPermissionsByMemberID(user.memberId);

    const payload: JWTPayload = MemberMapper.memberToJWTPayload(user, directorPermissions);
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
    const user = await MembersRepository.getMemberByName(userChangePasswordRequest.userName);

    if (user === null) {
      throw new UnauthenticatedError("User does not exist");
    }

    const match = await bcrypt.compare(userChangePasswordRequest.oldPassword, user.passwordHash);

    if (!match) {
      throw new UnauthenticatedError("The old password was not correct");
    }

    const newPasswordHash = await bcrypt.hash(userChangePasswordRequest.newPassword, 10);
    user.passwordHash = newPasswordHash;
    await MembersRepository.saveMember(user);
  };

  /**
   * Creates a password reset entry and returns the hash
   * @param email The email of the password reset entry
   */
  createPasswordResetToken = async (name: string, email: string): Promise<string> => {
    const user = await MembersRepository.getMemberByName(name);

    if (user === null) {
      // Sleep to prevent oracle attacks (guessing if a user exists by looking at the response time)
      sleepRandomly(300, 400);
      throw new NotFoundError(`No user found with name ${name}`);
    }

    // Create a hash from the token
    const token = crypto.randomBytes(64).toString("base64url");

    // Delete old entrys, if any exist
    await PasswordResetRepository.deletePasswordResetEntriesByEmail(email);

    // Insert the values into the passwort_reset table
    await PasswordResetRepository.createPasswordResetEntry(email, "salt", token);

    return token;
  };

  /**
   * Resets the password of a user with a token
   * @param name The name of the user
   * @param email The email of the user
   * @param token The token of the password reset entry
   * @param newPassword The new password of the user
   */
  resetPasswordWithToken = async (name: string, email: string, token: string, newPassword: string): Promise<void> => {
    const passwordResetEntry = await PasswordResetRepository.getPasswordResetEntryByEmailAndToken(email, token);

    if (passwordResetEntry === null) {
      throw new NotFoundError(`No password reset entry found with email ${email} and token ${token}`);
    }

    const user = await MembersRepository.getMemberByName(name);

    if (user === null) {
      throw new NotFoundError(`No user found with name ${name}`);
    }

    const timeDiff = getDateDifferenceInDays(passwordResetEntry.date, new Date());

    // Check if the entry is older than five days
    if (timeDiff <= -6) {
      await PasswordResetRepository.deletePasswordResetEntriesByEmail(email);
      throw new ExpiredTokenError("Token already expired");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      user.passwordHash = newPasswordHash;
      await MembersRepository.saveMember(user, transactionalEntityManager);
      await PasswordResetRepository.deletePasswordResetEntriesByEmail(email, transactionalEntityManager);
    });
  };

  /**
   * Checks if a user is authorized for a department by checking every role of the user
   * @param roles Array of roles of the user
   */
  isUserAuthorizedForDepartment = async (roles: number[], departmentID: number): Promise<boolean> => {
    const departments = await DepartmentRepository.getDepartmentsByRoles(roles);
    if (departments === null) {
      return false;
    }
    return departments.some((department) => department.departmentId === departmentID);
  };
}

export default AuthService;
