import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MemberPartialDto } from "../../types/membersTypes";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import { getMembers } from "../../api/members";
import { authReducerActionType } from "../../types/globalTypes";

/**
 * Hook that handles the permission api calls, uses react-query
 * @returns
 */
const usePermissions = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  return {};
};

export default usePermissions;
