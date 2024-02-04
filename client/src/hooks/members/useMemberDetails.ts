import { useQuery, useMutation, useQueryClient } from "react-query";
import { getMemberDetails, getMemberImage } from "../../api/members";
import { Member, MemberDetails, MemberImage } from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../useAuth";
import { updateMemberDetails as updateDetails } from "../../api/members";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useMemberDetails = (memberID: number) => {
  const { dispatchAuth } = useAuth();
  const queryClient = useQueryClient();

  // If a memberID is provided, the following code will be executed
  // Not good ... rather use a separate hook for the updateMemberStatus mutation

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
  // getMemberImage query
  const {
    data: memberImageData,
    isLoading: isMemberImageLoading,
    isError: isMemberImageError,
  } = useQuery({
    queryKey: ["MemberImage", memberID],
    queryFn: () => getMemberImage(memberID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const memberImage = memberImageData ? (memberImageData.data as MemberImage) : null;

  // ----------------------------------------------------------------------------------
  // updateMemberDetails mutation
  const { mutate: mutateDetails, isLoading: isUpdatingMemberDetails } = useMutation({
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
    mutateDetails(memberDetails);
  };

  // ----------------------------------------------------------------------------------

  return {
    memberDetails,
    isMemberDetailsLoading,
    isMemberDetailsError,
    updateMemberDetails,
    isUpdatingMemberDetails,
    memberImage,
    isMemberImageLoading,
    isMemberImageError,
  };
};

export default useMemberDetails;
