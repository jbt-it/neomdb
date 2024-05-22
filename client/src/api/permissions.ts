import { AssignPermissionToMemberRequest, PermissionAssignmentDto } from "../types/membersTypes";
import api from "../utils/api";
import { AxiosResponse } from "axios";

//-----------------------------------------------------------------------------------------------------------------------
// GET ROUTES

/**
 * Get all permissions
 * @returns An array of all permissions of type Permissions
 */
export const getPermissions = async (): Promise<AxiosResponse<Permissions[]>> => {
  return await api.get("/members/permissions");
};

/**
 * Get all directors and members permission assignments
 * @returns An array of all permission assignments of type PermissionAssignment
 */
export const getPermissionAssignments = async (): Promise<AxiosResponse<PermissionAssignmentDto[]>> => {
  return await api.get("/members/permission-assignments");
};

//-----------------------------------------------------------------------------------------------------------------------
// CREATE ROUTES

/**
 * Add a new permission assignment
 * @param memberId - The ID of the member
 * @param permissionID - The ID of the permission
 * @returns The new permission assignment of type PermissionAssignment
 */
export const createPermissionAssignment = async (
  permissionAssigment: AssignPermissionToMemberRequest
): Promise<AxiosResponse<AssignPermissionToMemberRequest>> => {
  return await api.post("/members/permissions", permissionAssigment);
};

//----------------------------------------
// DELETE ROUTES

/**
 * Delete a permission assignment
 * @param memberID - The ID of the member
 * @param permissionID - The ID of the permission
 */
export const deletePermissionAssignment = async (
  permissionAssigment: AssignPermissionToMemberRequest
): Promise<void> => {
  return await api.delete("/members/permissions", {
    data: permissionAssigment,
  });
};
