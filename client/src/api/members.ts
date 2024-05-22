import api from "../utils/api";
import { AxiosResponse } from "axios";
import {
  AddMemberParams,
  CreateMemberResponse,
  ItSkill,
  Language,
  MemberDetailsDto,
  MemberImage,
  MemberPartialDto,
  UpdateMemberImageParams,
  UpdateMemberStatusParams,
} from "../types/membersTypes";

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
 * Get a specific member by ID
 * @param memberId - The ID of the member
 * @returns The member of type MemberDetails
 */
export const getMemberDetails = async (memberId: number): Promise<AxiosResponse<MemberDetailsDto>> => {
  return await api.get<MemberDetailsDto>(`/members/${memberId}`);
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

/**
 * Update the details of a member
 * @param memberDetails - The details of the member
 * @returns The updated member of type MemberDetails
 */
export const updateMemberDetails = async (
  memberDetails: MemberDetailsDto
): Promise<AxiosResponse<MemberDetailsDto>> => {
  return await api.patch(`/members/${memberDetails.memberId}`, memberDetails);
};

/**
 * Update the status of a member
 * @param memberID - The ID of the member
 * @param status - The status of the member
 * @returns The updated member of type MemberDetails
 */
export const updateMemberStatus = async ({
  memberId,
  status,
}: UpdateMemberStatusParams): Promise<AxiosResponse<void>> => {
  return await api.patch(`/members/${memberId}/status`, { memberStatus: status });
};

/**
 * Convert a file to a base64 string
 * @param file - The file to convert
 * @returns A promise that resolves with the base64 string
 */
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Save the image of a member
 * @param image - The image of the member
 * @param memberID - The ID of the member
 */
export const saveMemberImage = async ({ image, memberID }: UpdateMemberImageParams): Promise<MemberImage> => {
  // Extract file type (the part of the file name after the last dot)
  const mimeType = image.name.split(".").pop();
  const base64 = await convertToBase64(image);

  // Make API call to save the image
  return await api.post(`/members/${memberID}/image`, { base64, mimeType });
};

/**
 * Add a new member
 * @param member - The details of the new member
 * @returns The new member of type MemberDetails
 */
export const addMember = async (member: AddMemberParams): Promise<AxiosResponse<CreateMemberResponse>> => {
  return await api.post("/members", member);
};
