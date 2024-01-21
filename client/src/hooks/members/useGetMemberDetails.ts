import { useQuery } from "react-query";
import { getMemberDetails } from "../../api/members";
import { MemberDetails } from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../useAuth";

/**
 * Hook that fetches the details of a member, uses react-query
 * @param id - The id of the member
 * @returns The member details, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useGetMemberDetails = (id: number) => {
  const { dispatchAuth } = useAuth();
  const {
    data: memberDetailsData,
    isLoading: isMemberDetailsLoading,
    isError: isMemberDetailsError,
  } = useQuery({
    queryKey: ["MemberDetails", id],
    queryFn: () => getMemberDetails(id),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const memberDetails = memberDetailsData && (memberDetailsData.data as MemberDetails);

  return {
    memberDetails,
    isMemberDetailsLoading,
    isMemberDetailsError,
  };
};

export default useGetMemberDetails;
