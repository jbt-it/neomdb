import { Permission } from "global/globalTypes";

/**
 * Checks if a list of permissions of a member include a list of permission IDs
 *
 * @param memberPermissions The array of permissions of the member
 * @param permissions The array of permission IDs the `memberPermissions` should include
 * @returns true if all `permissions` are included in `memberPermissions`
 */
export const doesPermissionsInclude = (memberPermissions: Permission[], permissions: number[]) => {
  return permissions.every((element) => memberPermissions.some((permission) => permission.permissionID === element));
};

/**
 * Checks if a list of permissions of a member has some of the item in the list of permission IDs
 *
 * @param memberPermissions The array of permissions of the member
 * @param permissions The array of permission IDs the `memberPermissions` should include at least one
 * @returns true if at least one of the `permissions` are included in `memberPermissions`
 */
export const doesPermissionHaveSomeOf = (memberPermissions: Permission[], permissions: number[]) => {
  return permissions.some((element) => memberPermissions.some((permission) => permission.permissionID === element));
};

/**
 * Checks if a permission can be delegated by a member
 *
 * @param memberPermissions The array of permissions of the member
 * @param permissionToBeDelegated The permission that should be delegated
 * @returns true if the permission can be delegated by the member
 */
export const canPermissionBeDelegated = (memberPermissions: Permission[], permissionToBeDelegated: number) => {
  return memberPermissions.some(
    (permission) => permission.permissionID === permissionToBeDelegated && permission.canDelegate
  );
};