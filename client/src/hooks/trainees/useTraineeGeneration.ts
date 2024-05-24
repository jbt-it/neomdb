import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInternalProjectsOfGeneration,
  getTraineeChoicesOfGeneration,
  getTraineeMotivation,
  getTraineeProgress,
  setElectionDeadline as setElectionDeadlineApi,
} from "../../api/generations";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";

const useTraineeGeneration = (generationID: number) => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // getTraineeProgress query
  const { data: traineeProgressData, isFetched: isTraineeProgressFetched } = useQuery({
    queryKey: ["traineeProgress", generationID],
    queryFn: () => {
      if (typeof generationID === "number") {
        return getTraineeProgress(generationID);
      }
      return Promise.resolve(null);
    },
  });

  const traineeProgress = traineeProgressData?.data || [];

  // ----------------------------------------------------------------------------------
  // getTraineeChoicesOfGeneration query
  const { data: traineeChoicesData } = useQuery({
    queryKey: ["traineeChoices", generationID],
    queryFn: () => {
      if (typeof generationID === "number") {
        return getTraineeChoicesOfGeneration(generationID);
      }
      return Promise.resolve(null);
    },
  });

  const traineeChoices = traineeChoicesData?.data || [];

  // ----------------------------------------------------------------------------------
  // getTraineeMotivation query
  const { data: traineeMotivationData } = useQuery({
    queryKey: ["traineeMotivation", generationID],
    queryFn: () => {
      if (typeof generationID === "number") {
        return getTraineeMotivation(generationID);
      }
      return Promise.resolve(null);
    },
  });

  const traineeMotivation = traineeMotivationData?.data || [];

  // ----------------------------------------------------------------------------------
  // getInternalProjectsOfGeneration query
  const { data: internalProjectsOfGenerationData, isFetched: isInternalProjectsOfGenerationFetched } = useQuery({
    queryKey: ["internalProjectsOfGeneration", generationID],
    queryFn: () => {
      if (typeof generationID === "number") {
        return getInternalProjectsOfGeneration(generationID);
      }
      return Promise.resolve(null);
    },
  });

  const internalProjectsOfGeneration = internalProjectsOfGenerationData?.data || [];

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // setElectionDeadline mutation
  const { mutateAsync: mutateSetElectionDeadline } = useMutation({
    mutationFn: setElectionDeadlineApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Fehler beim Setzen des Wahlendes!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traineeProgress", generationID] });
      showSuccessMessage("Wahlenddatum erfolgreich gesetzt!");
    },
  });

  /**
   * Sets the election deadline
   * @param electionDeadline - The election deadline
   * @returns The election deadline
   */
  const setElectionDeadline = async (electionStart: Date, electionEnd: Date) => {
    return await mutateSetElectionDeadline({
      generationId: generationID,
      electionStart: electionStart,
      electionEnd: electionEnd,
    });
  };

  // ----------------------------------------------------------------------------------
  return {
    traineeProgress,
    isTraineeProgressFetched,
    traineeChoices,
    traineeMotivation,
    internalProjectsOfGeneration,
    isInternalProjectsOfGenerationFetched,
    setElectionDeadline,
  };
};

export default useTraineeGeneration;
