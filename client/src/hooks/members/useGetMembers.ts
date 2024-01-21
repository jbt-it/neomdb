import { useQuery } from "react-query";
import { getMembers } from "../../api/members";
import { Member } from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../useAuth";

/**
 * Hook that fetches all members, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useGetMembers = () => {
  const { dispatchAuth } = useAuth();
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

  return {
    members,
    isMembersLoading,
    isMembersError,
  };
};

export default useGetMembers;
