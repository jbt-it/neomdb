import { AxiosResponse } from "axios";
import {
  ApplicationDto,
  ApplicationImageDto,
  ChangeRatingDto,
  FeedbackStatisticsDto,
  GenerationDto,
  NewGenerationRequestDto,
  TraineeEvaluationDto,
} from "../types/applicationTypes";
import api from "../utils/api";

/**
 * Save the application
 * @param application The application to save
 */
export const saveApplication = async (
  application: ApplicationDto,
  applicationImage: ApplicationImageDto
): Promise<boolean> => {
  const data = { application: application, applicationImage: applicationImage };
  // Make API call to save the application
  return await api.post(`/application`, data);
};

/**
 * Get all evaluations for a member
 * @returns TraineeEvaluationDto[]
 */
export const getApplicantsEvaluations = async (): Promise<AxiosResponse<TraineeEvaluationDto[]>> => {
  return await api.get<TraineeEvaluationDto[]>(`/application/evaluations`);
};

/**
 * Get the feedback statistics
 * @returns FeedbackStatisticsDto
 */
export const getFeedbackStatistics = async (): Promise<AxiosResponse<FeedbackStatisticsDto>> => {
  return await api.get<FeedbackStatisticsDto>(`/application/feedback`);
};

/**
 * Get the current generation
 * @returns GenerationDto
 */
export const getCurrentGeneration = async (): Promise<AxiosResponse<GenerationDto>> => {
  return await api.get<GenerationDto>(`/application/generation`);
};

/**
 * Create a new generation
 * @returns GenerationDto
 */
export const createNewGeneration = async (
  newGeneration: NewGenerationRequestDto
): Promise<AxiosResponse<GenerationDto>> => {
  return await api.post<GenerationDto>(`/application/generation`, newGeneration);
};

/**
 * Update a generation
 * @returns GenerationDto
 */
export const updateGeneration = async (generation: GenerationDto): Promise<AxiosResponse<GenerationDto>> => {
  return await api.patch<GenerationDto>(`/application/generation`, generation);
};

/**
 * Update the evaluation of a trainee
 * @param evaluation The evaluation to update
 * @returns TraineeEvaluationDto
 */
export const updateTraineeEvaluation = async (
  evaluation: ChangeRatingDto
): Promise<AxiosResponse<TraineeEvaluationDto>> => {
  return await api.post<TraineeEvaluationDto>(`/application/evaluations/${evaluation.traineeApplicantId}`, evaluation);
};

/**
 * Delete an application
 * @param applicationId The id of the application to delete
 * @returns boolean
 */
export const deleteApplication = async (applicationId: number): Promise<boolean> => {
  return await api.delete(`/application/${applicationId}`);
};
