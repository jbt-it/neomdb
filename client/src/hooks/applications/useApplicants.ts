import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewGeneration as createNewGenerationApi,
  getApplicantsEvaluations,
  getCurrentGeneration,
  getFeedbackStatistics,
  updateGeneration as updateGenerationApi,
  deleteApplication as deleteApplicationApi,
  updateTraineeEvaluation as updateTraineeEvaluationApi,
} from "../../api/application";
import { AxiosError } from "axios";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { authReducerActionType } from "../../types/globalTypes";
import { ChangeRatingDto, GenerationDto, NewGenerationRequestDto } from "../../types/applicationTypes";

/**
 * Hook that handles the application api calls, uses react-query
 * @returns
 */
const useApplicants = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getCurrentGeneration query
  const { data: currentGenerationData } = useQuery({
    queryKey: ["currentGeneration"],
    queryFn: getCurrentGeneration,
  });

  const currentGeneration = currentGenerationData ? currentGenerationData.data : null;

  // ----------------------------------------------------------------------------------
  // getApplicantsEvaluations query
  const { data: applicantsData } = useQuery({
    queryKey: ["applicants"],
    queryFn: getApplicantsEvaluations,
  });

  const applicantsEvaluations = applicantsData ? applicantsData.data : [];

  // ----------------------------------------------------------------------------------
  // getFeedbackStatistics query
  const { data: feedbackStatisticsData } = useQuery({
    queryKey: ["feedback"],
    queryFn: getFeedbackStatistics,
  });

  const feedbackStatistics = feedbackStatisticsData ? feedbackStatisticsData.data : null;

  // ----------------------------------------------------------------------------------
  // ############
  // CREATE QUERIES
  // ############

  // create new generation mutation
  const { mutateAsync: createNewGenerationMutation } = useMutation({
    mutationFn: createNewGenerationApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Generation erstellen fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentGeneration"] });
      showSuccessMessage("Generation erfolgreich erstellt");
    },
  });

  /**
   * Function to create a new generation
   * @param newGeneration The new generation to create
   * @returns The new generation
   */
  const createNewGeneration = async (newGeneration: NewGenerationRequestDto) => {
    return await createNewGenerationMutation(newGeneration);
  };

  // ----------------------------------------------------------------------------------
  // ############
  // UPDATE QUERIES
  // ############

  // update a generation mutation
  const { mutateAsync: updateGenerationMutation } = useMutation({
    mutationFn: updateGenerationApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Generation aktualisieren fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentGeneration"] });
      showSuccessMessage("Generation erfolgreich aktualisiert");
    },
  });

  /**
   * Function to update a generation
   * @param generation The generation to update
   * @returns The updated generation
   */
  const updateGeneration = async (generation: GenerationDto) => {
    return await updateGenerationMutation(generation);
  };

  // ----------------------------------------------------------------------------------

  // update trainee evaluation mutation
  const { mutateAsync: updateTraineeEvaluationMutation } = useMutation({
    mutationFn: updateTraineeEvaluationApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Bewertung aktualisieren fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      showSuccessMessage("Bewertung erfolgreich aktualisiert");
    },
  });

  /**
   * Function to update a trainee evaluation
   * @param evaluation The evaluation to update
   * @returns The updated evaluation
   */
  const updateTraineeEvaluation = async (evaluation: ChangeRatingDto) => {
    return await updateTraineeEvaluationMutation(evaluation);
  };

  // ----------------------------------------------------------------------------------
  // ############
  // DELETE QUERIES
  // ############
  const { mutateAsync: deleteApplicationMutation } = useMutation({
    mutationFn: deleteApplicationApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Bewerbung löschen fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      showSuccessMessage("Bewerbung erfolgreich gelöscht");
    },
  });

  /**
   * Function to delete an application
   * @param applicationId The id of the application to delete
   * @returns boolean
   */
  const deleteApplication = async (applicationId: number) => {
    return await deleteApplicationMutation(applicationId);
  };

  // ----------------------------------------------------------------------------------
  return {
    currentGeneration,
    applicantsEvaluations,
    feedbackStatistics,
    createNewGeneration,
    updateGeneration,
    updateTraineeEvaluation,
    deleteApplication,
  };
};

export default useApplicants;
