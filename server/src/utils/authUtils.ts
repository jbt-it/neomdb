// File for providing authenticaion based util functions

import { JWTPayload, Permission, User } from "../types/authTypes";

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
export const doesPermissionsHaveSomeOf = (memberPermissions: Permission[], permissions: number[]) => {
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

/**
 * Checks if a list of roles of a member has some of the item in the list of role IDs
 * @param memberRoles The array of roles of the member
 * @param roles The array of role IDs the `memberRoles` should include at least one
 * @returns true if at least one of the `roles` are included in `memberRoles`
 */
export const doesRolesHaveSomeOf = (memberRoles: number[], roles: number[]) => {
  return roles.some((element) => memberRoles.includes(element));
};

/**
 * Creates the payload for the user data
 * @param result The result of the login query
 * @param directorPermissionsResult The result of the director permissions query
 * @returns The payload for the user data
 */
export const createUserDataPayload = (result: User, directorPermissionsResult: Permission[]) => {
  const permissions = [];
  const roles = [];
  // Adds role permissions to the permissions array and adds directorID to the roles array
  if (directorPermissionsResult.length !== 0) {
    directorPermissionsResult.forEach((permission) => {
      permissions.push({ permissionID: permission.permissionID, canDelegate: permission.canDelegate });
      if (!roles.includes(permission.directorID)) {
        roles.push(permission.directorID);
      }
    });
  }

  // Adds normal permissions to the permissions array
  if (result.permissions) {
    result.permissions
      .split(",")
      .map(Number)
      .map((perm) => {
        // A Permission which was delegated to a member cannot be delegated further (therefore canDelegate is always 0)
        permissions.push({ permissionID: perm, canDelegate: 0 });
      });
  }
  const payload: JWTPayload = {
    mitgliedID: result.mitgliedID,
    name: result.name,
    permissions,
    roles,
  };
  return payload;
};
