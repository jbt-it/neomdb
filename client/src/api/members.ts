import api from "../utils/api";
import { AxiosResponse } from "axios";
import { ItSkill, Language, MemberImage, MemberPartialDto } from "../types/membersTypes";

//-----------------------------------------------------------------------------------------------------------------------
// GET ROUTES

/**
 * Get all members
 * @returns An array of all members of type Member
 */
export const getMembers = async (): Promise<AxiosResponse<MemberPartialDto[]>> => {
  return await api.get<MemberPartialDto[]>("/members/");
};

/**
 * Get the image of a specific member
 * @param id - The ID of the member
 * @returns The image of the member of type MemberImage
 */
export const getMemberImage = async (id: number): Promise<AxiosResponse<MemberImage>> => {
  return await api.get(`/members/${id}/image`);
};

/**
 * Get all languages
 * @returns An array of all languages of type Language
 */
export const getLanguages = async (): Promise<AxiosResponse<Language[]>> => {
  return await api.get("/members/languages");
};

/**
 * Get all IT skills
 * @returns An array of all IT skills of type ITSkill
 */
export const getITSkills = async (): Promise<AxiosResponse<ItSkill[]>> => {
  return await api.get("/members/edv-skills");
};

//-----------------------------------------------------------------------------------------------------------------------
// UPDATE ROUTES
