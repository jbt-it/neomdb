import api from "../utils/api";
import { AxiosResponse } from "axios";
import {
  AddDirectorRequestParams,
  AddMemberParams,
  CreateMemberResponseDto,
  DeleteDirectorPositionRequestParams,
  DirectorPositionDto,
  ItSkill,
  Language,
  MemberDetailsDto,
  MemberDirectorPositionsDto,
  MemberImage,
  MemberPartialDto,
  UpdateMemberImageParams,
  UpdateMemberStatusParams,
} from "../types/membersTypes";
import { convertToBase64 } from "../utils/imageUtils";

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

/**
 * Get director positions of the current member
 */
export const getMemberDirectorPositions = async (
  memberID: number
): Promise<AxiosResponse<MemberDirectorPositionsDto[]>> => {
  return await api.get(`/members/${memberID}/director-positions`);
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
export const addMember = async (member: AddMemberParams): Promise<AxiosResponse<CreateMemberResponseDto>> => {
  return await api.post("/members", member);
};

/**
 * Add a new director position to the member
 * @param directorId - The ID of the director
 * @param memberId - The ID of the member
 * @param from - The start date of the position
 * @param until - The end date of the position
 * @returns The new director position
 */
export const addDirectorPosition = async ({
  directorID,
  memberID,
  from,
  until,
}: AddDirectorRequestParams): Promise<AxiosResponse<void>> => {
  return await api.post(`/members/${memberID}/director-positions/${directorID}`, { from, until });
};

/**
 * Delete a director position of a member
 * @param memberID - The ID of the member
 * @param directorID - The ID of the director position
 * @returns void
 */
export const deleteDirectorPosition = async ({
  memberID,
  directorID,
}: DeleteDirectorPositionRequestParams): Promise<AxiosResponse<void>> => {
  return await api.delete(`/members/${memberID}/director-positions/${directorID}`);
};

/**
 * Change the director position of a member
 * @param directorID - The ID of the director position
 * @param memberID - The ID of the member
 * @param from - The start date of the position
 * @param until - The end date of the position
 * @returns void
 */
export const changeDirectorPosition = async ({
  directorID,
  memberID,
  from,
  until,
}: AddDirectorRequestParams): Promise<AxiosResponse<void>> => {
  return await api.patch(`/members/${memberID}/director-positions/${directorID}`, { from, until });
};
