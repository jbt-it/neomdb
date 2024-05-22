import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import {
  createPermissionAssignment,
  deletePermissionAssignment,
  getPermissionAssignments,
  getPermissions,
} from "../../api/permissions";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";

/**
 * Hook that handles the permission api calls, uses react-query
 * @returns
 */
const usePermissions = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // ----------------------------------------------------------------------------------
  // getPermissions
  const { data: permissionsData } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const permissions = permissionsData?.data || [];

  // ----------------------------------------------------------------------------------
  // getPermissionAssignments
  const { data: permissionAssignmentData } = useQuery({
    queryKey: ["permissionAssignments"],
    queryFn: getPermissionAssignments,
  });

  const permissionAssignments = permissionAssignmentData?.data || [];

  // ############
  // CREATE MUTATIONS
  // ############

  // createPermissionAssignment
  const { mutateAsync: mutateCreatePermissionAssignment } = useMutation({
    mutationFn: createPermissionAssignment,
    onError: (err: AxiosError) => {
      showErrorMessage("Berechtigung konnte nicht erteilt werden");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionAssignments"] });
      showSuccessMessage("Berechtigung wurde erfolgreich erteilt");
    },
  });

  /**
   * Function to create a new relation between a member and a permission
   * @param memberId - The ID of the member
   * @param permissionID - The ID of the permission
   * @returns The new permission assignment
   */
  const createPermission = async (memberId: number, permissionID: number) => {
    return await mutateCreatePermissionAssignment({ memberId, permissionID });
  };

  // ############
  // DELETE MUTATIONS
  // ############

  // deletePermissionAssignment
  const { mutateAsync: mutateDeletePermissionAssignment } = useMutation({
    mutationFn: deletePermissionAssignment,
    onError: (err: AxiosError) => {
      showErrorMessage("Berechtigung konnte nicht entzogen werden");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PermissionAssignments"] });
      showSuccessMessage("Berechtigung wurde erfolgreich entzogen");
    },
  });

  /**
   * Function to delete a relation between a member and a permission
   * @param memberID - The ID of the member
   * @param permissionID - The ID of the permission
   */
  const deletePermission = async (memberId: number, permissionID: number) => {
    return await mutateDeletePermissionAssignment({ memberId, permissionID });
  };

  // ----------------------------------------------------------------------------------
  return { permissions, permissionAssignments, createPermission, deletePermission };
};

export default usePermissions;
