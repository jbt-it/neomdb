import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";
import { getGenerations, getInternalProjects, getTraineeProgress, getTrainees } from "../api/trainees";
import { authReducerActionType } from "../types/globalTypes";
import { Generation, InternalProjectAll, Trainee, TraineeProgress } from "../types/traineesTypes";
/**
 * Hook that handles the trainees api calls, uses react-query
 * @returns The trainees, internal projects, generations, a boolean indicating if the generations are loading, a boolean indicating if the generations are fetched, the trainee progress and a boolean indicating if the trainee progress is fetched
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
  // will only be enabled if the generationID is provided
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
