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

export const loginMember = async ({
  username,
  password,
}: LoginMemberParams): Promise<AxiosResponse<LoginMembersResponse>> => {
  return api.post("/auth/login", { username, password });
};

export const getUserAuthenticated = async (): Promise<AxiosResponse<LoginMembersResponse>> => {
  return api.get("auth/me");
};

export const logoutMember = async (): Promise<void> => {
  api.post("/auth/logout");
};
