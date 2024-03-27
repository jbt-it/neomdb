import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";
import { getGenerations, getInternalProjects, getTraineeProgress, getTrainees } from "../api/trainees";
import { authReducerActionType } from "../types/globalTypes";
import { Generation, InternalProjectAll, Trainee, TraineeProgress } from "../types/traineesTypes";
/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useTrainees = (generationID?: number) => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getTrainees query
  const { data: traineesData } = useQuery({
    queryKey: ["Trainees"],
    queryFn: getTrainees,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const trainees = (traineesData?.data as Trainee[]) || [];

  // getInternalProjects query
  const { data: internalProjectsData } = useQuery({
    queryKey: ["InternalProjects"],
    queryFn: getInternalProjects,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const internalProjects = (internalProjectsData?.data as InternalProjectAll[]) || [];

  // getGenerations query
  const {
    data: generationsData,
    isLoading: isGenerationsLoading,
    isFetched: isGenerationsFetched,
  } = useQuery({
    queryKey: ["Generations"],
    queryFn: getGenerations,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const generations = (generationsData?.data as Generation[]) || [];

  // getTraineeProgress query
  const { data: traineeProgressData, isFetched: isTraineeProgressFetched } = useQuery({
    queryKey: ["TraineeProgress", generationID],
    queryFn: () => {
      if (typeof generationID === "number") {
        return getTraineeProgress(generationID);
      }
      return Promise.resolve(null);
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    enabled: generationID !== undefined,
  });

  const traineeProgress = (traineeProgressData?.data as TraineeProgress[]) || [];

  return {
    trainees,
    internalProjects,
    generations,
    isGenerationsLoading,
    isGenerationsFetched,
    traineeProgress,
    isTraineeProgressFetched,
  };
};

export default useTrainees;
