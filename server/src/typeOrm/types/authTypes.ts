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
