import { useQuery, useMutation, useQueryClient } from "react-query";
import { getMemberDetails, getMembers } from "../../api/members";
import { Member, MemberDetails } from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../useAuth";
import { updateMemberDetails as updateDetails } from "../../api/members";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useMembersApi = (memberID: number) => {
  const { dispatchAuth } = useAuth();
  const queryClient = useQueryClient();

  // ----------------------------------------------------------------------------------
  // getMembers query
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ["Members"],
    queryFn: getMembers,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const members = (membersData?.data as Member[]) || [];

  // ----------------------------------------------------------------------------------
  // getMemberDetails query
  const {
    data: memberDetailsData,
    isLoading: isMemberDetailsLoading,
    isError: isMemberDetailsError,
  } = useQuery({
    queryKey: ["MemberDetails", memberID],
    queryFn: () => getMemberDetails(memberID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const memberDetails = memberDetailsData && (memberDetailsData.data as MemberDetails);

  // ----------------------------------------------------------------------------------
  // updateMemberDetails mutation
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

  // ----------------------------------------------------------------------------------

  return {
    members,
    isMembersLoading,
    isMembersError,
    memberDetails,
    isMemberDetailsLoading,
    isMemberDetailsError,
    updateMemberDetails,
    isUpdatingMemberDetails,
  };
};

export default useMembersApi;
