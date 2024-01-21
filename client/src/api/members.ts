import api from "../utils/api";
import { Member, MemberDetails } from "../types/membersTypes";
import { AxiosResponse } from "axios";

// GET
export const getMembers = async (): Promise<AxiosResponse<Member[]>> => {
  return await api.get<Member[]>("/members/");
};

export const getMemberDetails = async (memberId: number): Promise<AxiosResponse<MemberDetails>> => {
  return await api.get<MemberDetails>(`/members/${memberId}`);
};

export const getMemberImage = async (id: number): Promise<AxiosResponse<string>> => {
  return await api.get(`/members/${id}/image`);
};

export const getLanguages = async (): Promise<string[]> => {
  return await api.get("/members/languages");
};

export const getDepartments = async (): Promise<string[]> => {
  return await api.get("/members/departments");
};

export const getEdvSkills = async (): Promise<string[]> => {
  return await api.get("/members/edv-skills");
};

//----------------------------------------

export const updateMemberDetails = async (memberDetails: MemberDetails): Promise<AxiosResponse<MemberDetails>> => {
  return api.patch(`/members/${memberDetails.mitgliedID}`, memberDetails);
};

export const saveMemberImage = async (image: File, id: number): Promise<void> => {
  // Extract file type (the part of the file name after the last dot)
  const mimeType = image.name.split(".").pop();

  // Transform file to base64 string
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onloadend = () => {
    const base64 = reader.result?.toString().split(",")[1];
    api.post(
      `/members/${id}/image`,
      { base64, mimeType },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };
};
