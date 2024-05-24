import { MembersFieldDto, MentorDto } from "../types/membersTypes";
import {
  Generation,
  InternalProjectDto,
  TraineeChoiceDto,
  TraineeMotivationDto,
  TraineeProgressDto,
  UpdateVotingDeadlinesRequest,
} from "../types/traineesTypes";
import api from "../utils/api";
import { AxiosResponse } from "axios";

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
  return await api.get<InternalProjectDto[]>(`/trainees/generations/${generationID}/internal-projects`);
};

/**
 * Get the trainee progress with the internal project milestones and mandatory workshops feedback
 * @param generationID - The ID of the generation
 * @returns The trainee progress of type TraineeProgressDto
 */
export const getTraineeProgress = async (generationID: number): Promise<AxiosResponse<TraineeProgressDto[]>> => {
  return await api.get<TraineeProgressDto[]>(`/trainees/generations/${generationID}/trainee-progress`);
};

//-----------------------------------------------------------------------------------------------------------------------
// UPDATE ROUTES

/**
 * Set the election deadlines of a generation
 * @param electionDeadlinesData - The election deadlines data and generation ID
 * @returns void
 */
export const setElectionDeadline = async (electionDeadlinesData: UpdateVotingDeadlinesRequest): Promise<void> => {
  const { generationId, ...electionDeadlines } = electionDeadlinesData;
  return await api.post(`/trainees/generations/${generationId}/set-deadline`, electionDeadlines);
};
