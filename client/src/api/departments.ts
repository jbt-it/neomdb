import api from "../utils/api";
import { AxiosResponse } from "axios";
import { DepartmentDetailsDto, DepartmentMemberDto, DirectorDto } from "../types/membersTypes";

//-----------------------------------------------------------------------------------------------------------------------
// GET ROUTES

/**
 * Get all departments
 * @returns An array of all departments of type DepartmentDetails
 */
export const getDepartments = async (): Promise<AxiosResponse<DepartmentDetailsDto[]>> => {
  return await api.get("/members/departments");
};

/**
 * Get a specific department by ID
 * @param departmentId - The ID of the department
 * @returns The department of type DepartmentDetails
 */
export const getDepartmentMembers = async (): Promise<AxiosResponse<DepartmentMemberDto[]>> => {
  return await api.get("/members/department-members");
};

/**
 * Get all current directors
 * @returns An array of all current directors of type Director
 */
export const getCurrentDirectors = async (): Promise<AxiosResponse<DirectorDto[]>> => {
  return await api.get("/members/directors?current=true");
};

/**
 * Get all directors
 * @returns An array of all directors of type Director
 */
export const getAllDirectors = async (): Promise<AxiosResponse<DirectorDto[]>> => {
  return await api.get("/members/directors?current=false");
};

//-----------------------------------------------------------------------------------------------------------------------
// UPDATE ROUTES

/**
 * Update the details of a department
 * @param department - The details of the department
 * @returns The updated department of type DepartmentDetails
 */
export const updateDepartment = async (
  department: DepartmentDetailsDto
): Promise<AxiosResponse<DepartmentDetailsDto>> => {
  return await api.put(`/members/departments/${department.departmentId}`, {
    linkObjectivePresentation: department.linkObjectivePresentation,
    linkOrganigram: department.linkOrganigram,
  });
};
