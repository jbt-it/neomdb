import api from "../utils/api";
import { AxiosResponse } from "axios";
import { MemberPartialDto } from "../types/membersTypes";

/**
 * Get all members
 * @returns An array of all members of type Member
 */
export const getMembers = async (): Promise<AxiosResponse<MemberPartialDto[]>> => {
  return await api.get<MemberPartialDto[]>("/members/");
};
