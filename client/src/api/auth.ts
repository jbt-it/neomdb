import { AxiosResponse } from "axios";
import { ChangePasswordParams, Permission } from "../types/globalTypes";
import api from "../utils/api";

interface LoginMemberParams {
  username: string;
  password: string;
}

interface LoginMembersResponse {
  userID: number;
  userName: string;
  permissions: Permission[];
  roles: number[];
}

export const loginMember = async ({
  username,
  password,
}: LoginMemberParams): Promise<AxiosResponse<LoginMembersResponse>> => {
  return await api.post("/auth/login", { username, password });
};

export const logoutMember = async (): Promise<void> => {
  return await api.post("/auth/logout");
};

export const resetPassword = async (email: string): Promise<AxiosResponse> => {
  return await api.post("/auth/forgot-password", { email });
};

export const changePassword = async (changePasswordData: ChangePasswordParams): Promise<AxiosResponse> => {
  return await api.patch("/auth/change-password", changePasswordData);
};
