import api from "../utils/api";
import { AxiosResponse } from "axios";
import { InternalProjectDto } from "../types/traineesTypes";

/**
 * Get a specific internal project by ID
 * @param internalProjectId - The ID of the internal project
 * @returns The internal project of type InternalProjectDto
 */
export const getIP = async (internalProjectId: number): Promise<AxiosResponse<InternalProjectDto>> => {
  return await api.get<InternalProjectDto>(`/trainees/ip/${internalProjectId}`);
};

/**
 * Get the current internal projects
 * @returns An array of current internal projects of type InternalProjectDto
 */
export const getCurrentIPs = async (): Promise<AxiosResponse<InternalProjectDto[]>> => {
  return await api.get<InternalProjectDto[]>(`/trainees/ips/current`);
};

/**
 * Get all internal projects
 * @returns An array of all internal projects of type InternalProjectDto
 */
export const getAllIPs = async (): Promise<AxiosResponse<InternalProjectDto[]>> => {
  return await api.get<InternalProjectDto[]>(`/trainees/ips/all`);
};

//-----------------------------------------------------------------------------------------------------------------------
// UPDATE ROUTES

/**
 * Update the an internal project
 * @param internalProject - The internal project
 * @returns The updated internal project of type InternalProjectDto
 */
export const updateIP = async (internalProject: InternalProjectDto): Promise<AxiosResponse<InternalProjectDto>> => {
  return await api.put<InternalProjectDto>(`/trainees/ip/${internalProject.internalProjectID}`, internalProject);
};
