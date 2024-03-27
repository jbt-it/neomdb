import api from "../utils/api";
import { AxiosResponse } from "axios";
import { Generation, InternalProject, InternalProjectDetails, Trainee, TraineeAll } from "../types/traineesTypes";

//----------------------------------------
// GET ROUTES

/**
 * Get all trainees
 * @returns An array of all trainees
 */
export const getTrainees = async (): Promise<AxiosResponse<Trainee[]>> => {
  return await api.get<Trainee[]>("/trainees/");
};

/**
 * Get all internal projects
 * @returns An array of all internal projects
 */
export const getInternalProjects = async (): Promise<AxiosResponse<InternalProject[]>> => {
  return await api.get<InternalProject[]>("/trainees/ips/all");
};

/**
 * Get all internal project details
 * @returns The internal project details
 */
export const getInternalProjectDetails = async (id: number): Promise<AxiosResponse<InternalProjectDetails>> => {
  return await api.get<InternalProjectDetails>(`/trainees/ip/${id}`);
};

/**
 * Get all generations
 * @returns An array of all generations
 */
export const getGenerations = async (): Promise<AxiosResponse<Generation[]>> => {
  return await api.get<Generation[]>("/trainees/generations");
};

export const getTraineeProgress = async (generationId: number): Promise<AxiosResponse<TraineeAll[]>> => {
  const response = await api.get<TraineeAll[]>(`/trainees/generations/${generationId}/trainee-progress`);
  return response;
};

//----------------------------------------
// UPDATE ROUTES

/**
 * Update the internal project details
 * @param internalProjectDetails - The internal project details to update
 * @returns The updated internal project details
 */
export const updateInternalProjectDetails = async (
  internalProjectDetails: InternalProjectDetails
): Promise<AxiosResponse<InternalProjectDetails>> => {
  return await api.put(`/trainees/ip/${internalProjectDetails.internesProjektID}`, {
    ...internalProjectDetails,
    kickoff: internalProjectDetails.kickoff ? internalProjectDetails.kickoff.format("YYYY-MM-DD") : null,
    ZPGehalten: internalProjectDetails.ZPGehalten ? internalProjectDetails.ZPGehalten.format("YYYY-MM-DD") : null,
    APGehalten: internalProjectDetails.APGehalten ? internalProjectDetails.APGehalten.format("YYYY-MM-DD") : null,
    projektmitglieder: internalProjectDetails.projektmitglieder.map((member) => ({
      mitgliedID: member.mitgliedID,
      vorname: member.vorname,
      nachname: member.nachname,
    })),
    qualitaetsmanager: internalProjectDetails.qualitaetsmanager.map((member) => ({
      mitgliedID: member.mitgliedID,
      vorname: member.vorname,
      nachname: member.nachname,
    })),
  });
};

//----------------------------------------
// DELETE ROUTES
/**
 * Delete an internal project
 * @param id - The ID of the internal project
 */
export const deleteInternalProject = async (id: number) => {
  return await api.delete(`/trainees/ip/${id}`);
};
