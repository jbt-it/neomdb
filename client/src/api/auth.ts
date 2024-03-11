import { AxiosResponse } from "axios";
import { Permission } from "../types/globalTypes";
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

interface ResetPasswordParams {
  email: string;
}

export const loginMember = async ({
  username,
  password,
}: LoginMemberParams): Promise<AxiosResponse<LoginMembersResponse>> => {
  return api.post("/auth/login", { username, password });
};

export const logoutMember = async (): Promise<void> => {
  return api.post("/auth/logout");
};

export const resetPassword = async ({ email }: ResetPasswordParams): Promise<void> => {
  return api.post("/auth/forgot-password", { email });
};
