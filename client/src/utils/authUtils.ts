import { Permission } from "../types/globalTypes";
/**
 * Checks if a list of permissions of a member has some of the item in the list of permission IDs
 *
 * @param memberPermissions The array of permissions of the member
 * @param permissions The array of permission IDs the `memberPermissions` should include at least one
 * @returns true if at least one of the `permissions` are included in `memberPermissions`
 */
export const doesPermissionsHaveSomeOf = (memberPermissions: Permission[], permissions: number[]) => {
  return permissions.some((element) => memberPermissions.some((permission) => permission.permissionId === element));
};

/**
 * Checks if a list of roles of a member has some of the item in the list of role IDs
 * @param memberRoles The array of roles of the member
 * @param roles The array of role IDs the `memberRoles` should include at least one
 * @returns true if at least one of the `roles` are included in `memberRoles`
 */
export const doesRolesHaveSomeOf = (memberRoles: number[], roles: number[]) => {
  return roles.some((element) => memberRoles.includes(element));
};
