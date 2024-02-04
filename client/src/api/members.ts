import api from "../utils/api";
import { DepartmentDetails, DepartmentMember, Director, Member, MemberDetails } from "../types/membersTypes";
import { AxiosResponse } from "axios";

// GET ROUTES
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

export const getEdvSkills = async (): Promise<string[]> => {
  return await api.get("/members/edv-skills");
};

export const getDepartments = async (): Promise<AxiosResponse<DepartmentDetails[]>> => {
  return await api.get("/members/departments");
};

export const getDepartmentMembers = async (): Promise<AxiosResponse<DepartmentMember[]>> => {
  return await api.get("/members/department-members");
};

export const getCurrentDirectors = async (): Promise<AxiosResponse<Director[]>> => {
  return await api.get("/members/directors?current=true");
};

//----------------------------------------

// UPDATE ROUTES
export const updateMemberDetails = async (memberDetails: MemberDetails): Promise<AxiosResponse<MemberDetails>> => {
  return api.patch(`/members/${memberDetails.mitgliedID}`, memberDetails);
};

interface UpdateMemberStatusParams {
  memberID: number;
  status: string;
}

export const updateMemberStatus = async ({
  memberID,
  status,
}: UpdateMemberStatusParams): Promise<AxiosResponse<MemberDetails>> => {
  return api.patch(`/members/${memberID}/status`, { mitgliedstatus: status });
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

//----------------------------------------

// CREATE ROUTES

interface AddMemberParams {
  name: string;
  password: string;
  vorname: string;
  nachname: string;
  geburtsdatum: null;
  handy: null;
  geschlecht: null;
  generation: null;
  traineeSeit: string;
  email: string;
}
export const addMember = async (member: AddMemberParams): Promise<AxiosResponse<MemberDetails>> => {
  return api.post("/members", member);
};
