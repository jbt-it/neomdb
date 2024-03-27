import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";
import {
  deleteInternalProject as deleteInternalProjectApi,
  getInternalProjectDetails,
  updateInternalProjectDetails as updateInternalProjectDetailsApi,
} from "../api/trainees";
import { authReducerActionType } from "../types/globalTypes";
import { InternalProjectDetails } from "../types/traineesTypes";
import dayjs from "dayjs";
import { showErrorMessage, showSuccessMessage } from "../utils/toastUtils";

/**
 * Hook that handles the internal project details api calls, uses react-query
 * @param internalProjectID - The internal project ID
 * @returns The internal project details, a function to update the internal project details and a function to delete the internal project
 */
const useInternalProjectDetails = (internalProjectID: number) => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getInternalProjectDetails query
  const { data: internalProjectDetailsData } = useQuery({
    queryKey: ["InternalProjectDetails", internalProjectID],
    queryFn: () => getInternalProjectDetails(internalProjectID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const internalProjectDetails =
    internalProjectDetailsData &&
    ({
      ...internalProjectDetailsData.data,
      kickoff: internalProjectDetailsData.data.kickoff ? dayjs(internalProjectDetailsData.data.kickoff) : null,
      ZPGehalten: internalProjectDetailsData.data.ZPGehalten ? dayjs(internalProjectDetailsData.data.ZPGehalten) : null,
      APGehalten: internalProjectDetailsData.data.APGehalten ? dayjs(internalProjectDetailsData.data.APGehalten) : null,
      projektmitglieder: internalProjectDetailsData.data.projektmitglieder.map((member) => ({
        ...member,
        name: `${member.vorname} ${member.nachname}`,
      })),
      qualitaetsmanager: internalProjectDetailsData.data.qualitaetsmanager.map((member) => ({
        ...member,
        name: `${member.vorname} ${member.nachname}`,
      })),
    } as InternalProjectDetails);

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // updateInternalProjectDetails mutation
  const { mutateAsync: mutateInternalProjectDetails } = useMutation({
    mutationFn: updateInternalProjectDetailsApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Aktualisierung ist fehlgeschlagen!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["InternalProjectDetails", internalProjectID] });
      showSuccessMessage("Aktualisierung erfolgreich!");
    },
  });

  /**
   * Updates the internal project details
   * @param internalProjectDetails - The internal project details to update
   * @returns The updated internal project details
   */
  const updateInternalProjectDetails = async (internalProjectDetails: InternalProjectDetails) => {
    return await mutateInternalProjectDetails(internalProjectDetails);
  };

  // ############
  // DELETE QUERIES
  // ############

  // deleteInternalProject mutation
  const { mutateAsync: mutateDeleteInternalProject } = useMutation({
    mutationFn: deleteInternalProjectApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Löschen ist fehlgeschlagen!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["InternalProjectDetails", internalProjectID] });
      showSuccessMessage("Internes Projekt wurde gelöscht!");
    },
  });

  /**
   * Deletes the internal project
   * @param internalProjectID - The internal project ID
   */
  const deleteInternalProject = async (internalProjectID: number) => {
    return await mutateDeleteInternalProject(internalProjectID);
  };

  return { internalProjectDetails, updateInternalProjectDetails, deleteInternalProject };
};

export default useInternalProjectDetails;
