import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { getTrainees, setTraineeAssignment, admitTrainee as admitTraineeApi } from "../../api/trainees";
import { getAllIPs, getCurrentIPs } from "../../api/internalProjects";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { getGenerations } from "../../api/generations";
/**
 * Hook that handles the trainees api calls, uses react-query
 * @returns The trainees, internal projects, generations, a boolean indicating if the generations are loading, a boolean indicating if the generations are fetched, the trainee progress and a boolean indicating if the trainee progress is fetched
 */
const useTrainees = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getTrainees query
  const { data: traineesData, isFetched: isTraineesFetched } = useQuery({
    queryKey: ["trainees"],
    queryFn: getTrainees,
  });

  const trainees = traineesData?.data || [];

  // ----------------------------------------------------------------------------------
  // getInternalProjects query
  const { data: internalProjectsData, isFetched: isinternalProjectsFetched } = useQuery({
    queryKey: ["internalProjects"],
    queryFn: getAllIPs,
  });

  const internalProjects = internalProjectsData?.data || [];

  // ----------------------------------------------------------------------------------
  // getGenerations query
  const {
    data: generationsData,
    isLoading: isGenerationsLoading,
    isFetched: isGenerationsFetched,
  } = useQuery({
    queryKey: ["generations"],
    queryFn: getGenerations,
  });

  const generations = generationsData?.data ? [...generationsData.data].reverse() : [];

  // ----------------------------------------------------------------------------------
  // getCurrentIPs query
  const { data: currentIPsData } = useQuery({
    queryKey: ["currentIPs"],
    queryFn: getCurrentIPs,
  });

  const currentIPs = currentIPsData?.data || [];

  // ----------------------------------------------------------------------------------
  // getAllIPs query
  const { data: allIPsData } = useQuery({
    queryKey: ["currentIPs"],
    queryFn: getAllIPs,
  });

  const allIPs = allIPsData?.data || [];

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // setTraineeAssignment mutation
  const { mutateAsync: mutateTraineeAssignment } = useMutation({
    mutationFn: setTraineeAssignment,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Zuweisung fehlgeschlagen!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainees"] });
      showSuccessMessage("Zuweisung erfolgreich!");
    },
  });

  /**
   * Assigns a trainee to an internal project
   * @param traineeID - The trainee ID
   * @param internalProjectID - The internal project ID
   * @returns The assigned trainee
   */
  const assignTrainee = async (traineeId: number, ipID: number, mentorID: number, departmentID: number) => {
    return await mutateTraineeAssignment({ traineeId, ipID, mentorID, departmentID });
  };

  // ----------------------------------------------------------------------------------
  // admitTrainee mutation
  const { mutateAsync: mutateAdmitTrainee } = useMutation({
    mutationFn: admitTraineeApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Aufnahme fehlgeschlagen!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainees"] });
      showSuccessMessage("Aufnahme erfolgreich!");
    },
  });

  /**
   * Admits a trainee
   * @param traineeId - The ID of the trainee
   * @returns void
   */
  const admitTrainee = async (traineeId: number) => {
    return await mutateAdmitTrainee(traineeId);
  };

  // ----------------------------------------------------------------------------------
  return {
    trainees,
    isTraineesFetched,
    internalProjects,
    isinternalProjectsFetched,
    generations,
    isGenerationsLoading,
    isGenerationsFetched,
    currentIPs,
    allIPs,
    assignTrainee,
    admitTrainee,
  };
};

export default useTrainees;
