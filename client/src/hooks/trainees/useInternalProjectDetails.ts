import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { InternalProjectDto } from "../../types/traineesTypes";
import { getIP, updateIP } from "../../api/internalProjects";

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
    queryKey: ["internalProjectDetails", internalProjectID],
    queryFn: () => getIP(internalProjectID),
  });

  // The dates are converted to dayjs objects and the members are formatted to also include a name
  const internalProjectDetails = internalProjectDetailsData?.data || {};

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // updateInternalProjectDetails mutation
  const { mutateAsync: mutateInternalProjectDetails } = useMutation({
    mutationFn: updateIP,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Aktualisierung ist fehlgeschlagen!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internalProjectDetails", internalProjectID] });
      showSuccessMessage("Aktualisierung erfolgreich!");
    },
  });

  /**
   * Updates the internal project details
   * @param internalProjectDetails - The internal project details to update
   * @returns The updated internal project details
   */
  const updateInternalProjectDetails = async (internalProjectDetails: InternalProjectDto) => {
    return await mutateInternalProjectDetails(internalProjectDetails);
  };

  return { internalProjectDetails, updateInternalProjectDetails };
};

export default useInternalProjectDetails;
