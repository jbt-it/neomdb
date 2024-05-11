import { Permission } from "../../typeOrm/entities/Permission";
import { DirectorPositionDto, MemberPermissionAssignmentDto } from "./memberTypes";

/**
 * Type of the permission assignment (permission of a member or a director)
 */
export type PermissionAssignmentDto = {
  permissionID: number;
  name: string;
  description: string;
  members: MemberPermissionAssignmentDto[];
  directors: DirectorPositionDto[];
};

/**
 * Type for the request to login a user
 */
export type UserLoginRequest = {
  username: string;
  password: string;
};

/**
 * Type for the user of the application
 * A user is a member abstracted to the details needed for authentication
 */
export type User = {
  memberId: number;
  name: string;
  passwordHash?: string;
  permissions: Permission[];
};

/**
 * Type of the permission
 */
export type PermissionDTO = {
  permissionId: number;
  canDelegate: boolean;
  directorId?: number;
};

/**
 * Type of the payload if the jason web token
 */
export type JWTPayload = {
  memberId: number;
  name: string;
  permissions: PermissionDTO[];
  roles: number[];
};
