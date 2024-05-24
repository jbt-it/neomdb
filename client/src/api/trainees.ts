import api from "../utils/api";
import { AxiosResponse } from "axios";
import { MembersFieldDto } from "../types/membersTypes";
import { TraineeAssignmentRequest } from "../types/traineesTypes";

//-----------------------------------------------------------------------------------------------------------------------
// GET ROUTES

/**
 * Get all trainees
 * @returns An array of all trainees of type MembersFieldDto
 */
export const getTrainees = async (): Promise<AxiosResponse<MembersFieldDto[]>> => {
  return await api.get<MembersFieldDto[]>("/trainees/");
};

//-----------------------------------------------------------------------------------------------------------------------
// UPDATE ROUTES

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
