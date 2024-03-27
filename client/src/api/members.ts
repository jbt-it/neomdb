import api from "../utils/api";
import {
  DepartmentDetails,
  DepartmentMember,
  Director,
  EDVSkill,
  Language,
  Member,
  MemberDetails,
  MemberImage,
  PermissionAssignment,
  Permissions,
} from "../types/membersTypes";
import { AxiosResponse } from "axios";

//----------------------------------------
// GET ROUTES

/**
 * Get all members
 * @returns An array of all members of type Member
 */
export const getMembers = async (): Promise<AxiosResponse<Member[]>> => {
  return await api.get<Member[]>("/members/");
};

/**
 * Get a specific member by ID
 * @param memberId - The ID of the member
 * @returns The member of type MemberDetails
 */
export const getMemberDetails = async (memberId: number): Promise<AxiosResponse<MemberDetails>> => {
  return await api.get<MemberDetails>(`/members/${memberId}`);
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
 * Get all EDV skills
 * @returns An array of all EDV skills of type EDVSkill
 */
export const getEdvSkills = async (): Promise<AxiosResponse<EDVSkill[]>> => {
  return await api.get("/members/edv-skills");
};

/**
 * Get all departments
 * @returns An array of all departments of type DepartmentDetails
 */
export const getDepartments = async (): Promise<AxiosResponse<DepartmentDetails[]>> => {
  return await api.get("/members/departments");
};

/**
 * Get a specific department by ID
 * @param departmentId - The ID of the department
 * @returns The department of type DepartmentDetails
 */
export const getDepartmentMembers = async (): Promise<AxiosResponse<DepartmentMember[]>> => {
  return await api.get("/members/department-members");
};

/**
 * Get all current directors
 * @returns An array of all current directors of type Director
 */
export const getCurrentDirectors = async (): Promise<AxiosResponse<Director[]>> => {
  return await api.get("/members/directors?current=true");
};

/**
 * Get all directors
 * @returns An array of all directors of type Director
 */
export const getAllDirectors = async (): Promise<AxiosResponse<Director[]>> => {
  return await api.get("/members/directors?current=false");
};

/**
 * Get all permissions
 * @returns An array of all permissions of type Permissions
 */
export const getPermissions = async (): Promise<AxiosResponse<Permissions[]>> => {
  return await api.get("/members/permissions");
};

/**
 * Get all directors and members permission assignments
 * @returns An array of all permission assignments of type PermissionAssignment
 */
export const getPermissionAssignments = async (): Promise<AxiosResponse<PermissionAssignment[]>> => {
  return await api.get("/members/permission-assignments");
};

//----------------------------------------
// UPDATE ROUTES

/**
 * Update the details of a member
 * @param memberDetails - The details of the member
 * @returns The updated member of type MemberDetails
 */
export const updateMemberDetails = async (memberDetails: MemberDetails): Promise<AxiosResponse<MemberDetails>> => {
  return await api.patch(`/members/${memberDetails.mitgliedID}`, memberDetails);
};

interface UpdateMemberStatusParams {
  memberID: number;
  status: string;
}

/**
 * Update the status of a member
 * @param memberID - The ID of the member
 * @param status - The status of the member
 * @returns The updated member of type MemberDetails
 */
export const updateMemberStatus = async ({
  memberID,
  status,
}: UpdateMemberStatusParams): Promise<AxiosResponse<MemberDetails>> => {
  return await api.patch(`/members/${memberID}/status`, { mitgliedstatus: status });
};

interface UpdateMemberImageParams {
  image: File;
  memberID: number;
}

/**
 * Save the image of a member
 * @param image - The image of the member
 * @param memberID - The ID of the member
 */
export const saveMemberImage = async ({ image, memberID }: UpdateMemberImageParams): Promise<void> => {
  // Extract file type (the part of the file name after the last dot)
  const mimeType = image.name.split(".").pop();

  // Transform file to base64 string
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onloadend = () => {
    const base64 = reader.result?.toString().split(",")[1];
    api.post(`/members/${memberID}/image`, { base64, mimeType });
  };
};

/**
 * Update the details of a department
 * @param department - The details of the department
 * @returns The updated department of type DepartmentDetails
 */
export const updateDepartment = async (department: DepartmentDetails): Promise<AxiosResponse<DepartmentDetails>> => {
  return await api.put(`/members/departments/${department.ressortID}`, {
    linkZielvorstellung: department.linkZielvorstellung,
    linkOrganigramm: department.linkOrganigramm,
  });
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

/**
 * Add a new member
 * @param member - The details of the new member
 * @returns The new member of type MemberDetails
 */
export const addMember = async (member: AddMemberParams): Promise<AxiosResponse<MemberDetails>> => {
  return await api.post("/members", member);
};

interface PermissionAssigmentData {
  memberID: number;
  permissionID: number;
}

/**
 * Add a new permission assignment
 * @param memberID - The ID of the member
 * @param permissionID - The ID of the permission
 * @returns The new permission assignment of type PermissionAssignment
 */
export const createPermissionAssignment = async (
  permissionAssigment: PermissionAssigmentData
): Promise<AxiosResponse<PermissionAssignment>> => {
  return await api.post("/members/permissions", permissionAssigment);
};

//----------------------------------------
// DELETE ROUTES

/**
 * Delete a permission assignment
 * @param memberID - The ID of the member
 * @param permissionID - The ID of the permission
 */
export const deletePermissionAssignment = async (permissionAssigment: PermissionAssigmentData): Promise<void> => {
  return await api.delete("/members/permissions", {
    data: permissionAssigment,
  });
};
