import { useMutation, useQueryClient } from "react-query";
import { updateMemberDetails as updateDetails } from "../../api/members";
import { MemberDetails } from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../useAuth";

/**
 * Hoock that updates the details of a member, uses react-query
 * @param memberDetails - The new details of the member
 * @returns A boolean indicating if the data is loading and a boolean indicating if an error occured
 */

const useUpdateMemberDetails = () => {
  const { dispatchAuth } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isLoading: isUpdatingMemberDetails } = useMutation({
    mutationFn: updateDetails,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MemberDetails"] });
    },
  });

  const updateMemberDetails = (memberDetails: MemberDetails) => {
    mutate(memberDetails);
  };

  return {
    updateMemberDetails,
    isUpdatingMemberDetails,
  };
};

export default useUpdateMemberDetails;
