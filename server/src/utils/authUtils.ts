import { Permission } from "global/globalTypes";

/**
 * Checks if a given id is in the given permissions list
 * @param permissions The list of the permissions of the current user
 * @param id The id that the user should have
 * @returns true if the permissions list of the current user contains the given id
 */
export const checkForPermissions = (permissions: Permission[], id: number) => {
  return permissions.filter((perm) => perm.permissionID === id).length > 0;
};
