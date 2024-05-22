import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MemberPartialDto } from "../../types/membersTypes";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import { getMembers } from "../../api/members";
import { authReducerActionType } from "../../types/globalTypes";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useMembers = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getMembers query
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const members = (membersData?.data as MemberPartialDto[]) || [];

  // ----------------------------------------------------------------------------------
  // Objects and functions returned by the hook
  return {
    members,
    isMembersLoading,
    isMembersError,
  };
};

export default useMembers;
