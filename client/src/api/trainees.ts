import api from "../utils/api";
import { AxiosResponse } from "axios";
import { MembersFieldDto, MentorDto } from "../types/membersTypes";
import {
  Generation,
  InternalProjectDto,
  TraineeAssignmentRequest,
  TraineeChoiceDto,
  TraineeMotivationDto,
  TraineeProgressDto,
  UpdateVotingDeadlinesRequest,
} from "../types/traineesTypes";

//-----------------------------------------------------------------------------------------------------------------------
// GET ROUTES

/**
 * Get all trainees
 * @returns An array of all trainees of type MembersFieldDto
 */
export const getTrainees = async (): Promise<AxiosResponse<MembersFieldDto[]>> => {
  return await api.get<MembersFieldDto[]>("/trainees/");
};

/**
 * Get a specific internal project by ID
 * @param internalProjectId - The ID of the internal project
 * @returns The internal project of type InternalProjectDto
 */
export const getIP = async (internalProjectId: number): Promise<AxiosResponse<InternalProjectDto>> => {
  return await api.get<InternalProjectDto>(`/trainees/ip/${internalProjectId}`);
};

/**
 * Get the choices of mentor, internal project and department of all trainees of a given generation
 * @param generationId - The ID of the generation
 * @returns An array of trainee choices of type TraineeChoiceDto
 */
export const getTraineeChoicesOfGeneration = async (
  generationId: number
): Promise<AxiosResponse<TraineeChoiceDto[]>> => {
  return await api.get<TraineeChoiceDto[]>(`/trainees/generations/${generationId}/trainee-choices`);
};

/**
 * Get all generations
 * @returns An array of all generations of type Generation
 */
export const getGenerations = async (): Promise<AxiosResponse<Generation[]>> => {
  return await api.get<Generation[]>("/trainees/generations");
};

/**
 * Get the motivation of all trainees of a given generation
 * @param generationID - The ID of the generation
 * @returns The motivation of all trainees of the given generation of type TraineeMotivationDto
 */
export const getTraineeMotivation = async (generationID: number): Promise<AxiosResponse<TraineeMotivationDto>> => {
  return await api.get<TraineeMotivationDto>(`/trainees/generations/${generationID}/motivation`);
};

/**
 * Get the mentors of a given generation
 * @param generationID - The ID of the generation
 * @returns An array of mentors of type MentorDto
 */
export const getMentorsOfGeneration = async (generationID: number): Promise<AxiosResponse<MentorDto[]>> => {
  return await api.get<MembersFieldDto[]>(`/trainees/generations/${generationID}/mentors`);
};

/**
 * Get the internal projects of a given generation
 * @param generationID - The ID of the generation
 * @returns An array of internal projects of type InternalProjectDto
 */
export const getInternalProjectsOfGeneration = async (
  generationID: number
): Promise<AxiosResponse<InternalProjectDto[]>> => {
  return await api.get<InternalProjectDto[]>(`/generations/${generationID}/internal-projects`);
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
  return await api.get<InternalProjectDto[]>(`/trainees/ips`);
};

/**
 * Get the trainee progress with the internal project milestones and mandatory workshops feedback
 * @param generationID - The ID of the generation
 * @returns The trainee progress of type TraineeProgressDto
 */
export const getTraineeProgress = async (generationID: number): Promise<AxiosResponse<TraineeProgressDto>> => {
  return await api.get<TraineeProgressDto>(`/trainees/generations/${generationID}/trainee-progress`);
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

/**
 * Set the election deadlines of a generation
 * @param electionDeadlinesData - The election deadlines data and generation ID
 * @returns void
 */
export const setElectionDeadline = async (electionDeadlinesData: UpdateVotingDeadlinesRequest): Promise<void> => {
  const { generationId, ...electionDeadlines } = electionDeadlinesData;
  return await api.post(`/trainees/generations/${generationId}/set-deadline`, electionDeadlines);
};

/**
 * Set the assignment of a trainee to an internal project, mentor and department
 * @param traineeAssignmentRequestData - The trainee assignment request data
 * @returns void
 */
export const setTraineeAssignment = async (traineeAssignmentRequestData: TraineeAssignmentRequest): Promise<void> => {
  const { traineeId, ...traineeAssignment } = traineeAssignmentRequestData;
  return await api.patch(`/trainees/${traineeId}/trainee-assignment`, traineeAssignment);
};

/**
 * Admit a trainee
 * @param traineeId - The ID of the trainee
 * @returns void
 */
export const admitTrainee = async (traineeId: number): Promise<void> => {
  return await api.post(`/trainees/admission/${traineeId}`);
};
