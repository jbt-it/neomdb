import { PermissionAssignmentDto } from "../../typeOrm/types/authTypes";
import { Permission } from "../../typeOrm/entities/Permission";
import { MemberMapper } from "./MemberMapper";

export class PermissionMapper {
  static permissionToPermissionAssignment(permission: Permission): PermissionAssignmentDto {
    return {
      name: permission.name,
      permissionID: permission.permissionId,
      description: permission.description,
      members: permission.members.map((member) => MemberMapper.memberToMemberPermissionAssignmentDto(member)),
      directors: permission.directorHasPermissions.map((dhp) =>
        MemberMapper.directorHasPermissionToDirectorPositionDto(dhp)
      ),
    };
  }
}