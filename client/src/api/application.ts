import {
  ApplicationDto,
  ApplicationImageDto,
  EvaluationDto,
  FeedbackStatisticsDto,
  GenerationDto,
  NewGenerationRequestDto,
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
 * @param memberId The id of the member
 * @returns EvaluationDto[]
 */
export const getApplicantsEvaluations = async (memberId: number): Promise<EvaluationDto> => {
  return await api.get(`/application/evaluations/${memberId}`);
};

/**
 * Get the feedback statistics
 * @returns FeedbackStatisticsDto
 */
export const getFeedbackStatistics = async (): Promise<FeedbackStatisticsDto> => {
  return await api.get(`/application/feedback`);
};

/**
 * Get the current generation
 * @returns GenerationDto
 */
export const getCurrentGeneration = async (): Promise<GenerationDto> => {
  return await api.get(`/application/generation`);
};

/**
 * Create a new generation
 * @returns GenerationDto
 */
export const createNewGeneration = async (newGeneration: NewGenerationRequestDto): Promise<GenerationDto> => {
  return await api.post(`/application/generation`, newGeneration);
};

/**
 * Update a generation
 * @returns GenerationDto
 */
export const updateGeneration = async (generation: GenerationDto): Promise<GenerationDto> => {
  return await api.patch(`/application/generation`, generation);
};
