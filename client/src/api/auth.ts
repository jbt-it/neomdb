/**
 * This file contains the API calls related to authentication.
 * The functions in this file are used to login, logout, reset password, change password and reset forgotten password.
 */

import { AxiosResponse } from "axios";
import { ChangePasswordParams, Permission } from "../types/globalTypes";
import api from "../utils/api";

/**
 * Parameters for the loginMember function
 */
interface LoginMemberParams {
  username: string;
  password: string;
}

/**
 * Response of the loginMember function
 */
interface LoginMembersResponse {
  userID: number;
  userName: string;
  permissions: Permission[];
  roles: number[];
}

/**
 * Logs in a member
 * @param username - The username of the member
 * @param password - The password of the member
 * @returns The userID, username, permissions and roles of the member
 */
export const loginMember = async ({
  username,
  password,
}: LoginMemberParams): Promise<AxiosResponse<LoginMembersResponse>> => {
  return await api.post("/auth/login", { username, password });
};

/**
 * Logs out a member
 */
export const logoutMember = async (): Promise<void> => {
  return await api.post("/auth/logout");
};

/**
 * Changes the password of a member
 * @param changePasswordData - The old password, the new password and the userID of the member
 * @returns The response of the change password request
 */
export const changePassword = async (changePasswordData: ChangePasswordParams): Promise<AxiosResponse> => {
  return await api.patch("/auth/change-password", changePasswordData);
};

/**
 * Resets the password of a member
 * @param email - The email of the member
 * @returns The response of the reset password request
 */
export const sendResetLink = async (email: string): Promise<AxiosResponse> => {
  return await api.post("/auth/forgot-password", { email });
};

/**
 * Resets the forgotten password of a member
 * @param resetPasswordData - The email, the key and the new password of the member
 * @returns The response of the reset forgotten password request
 */
export const resetForgottenPassword = async (resetPasswordData: {
  email: string;
  key: string;
  newPassword: string;
}): Promise<AxiosResponse> => {
  return await api.patch("/auth/reset-forgot-password", resetPasswordData);
};
