import { query } from "../../database";
import { Permission, User } from "../../types/authTypes";
import { QueryError } from "../../types/errors";

/**
 * Retrieves a user by its username
 * @throws QueryError if the query fails
 * @returns The user with permissions or null if no user was found
 */
export const getUserByName = async (name: string): Promise<User> => {
  try {
    const userQueryResult = await query(
      `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
        FROM mitglied
        LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
        WHERE mitglied.name = ?
        GROUP BY mitgliedID, name`,
      [name]
    );
    if (Array.isArray(userQueryResult) && userQueryResult.length !== 0) {
      const user = userQueryResult[0] as User;
      return user;
    }

    return null;
  } catch (error) {
    throw new QueryError(`Error retrieving user data with username ${name}`);
  }
};

/**
 * Retrieves the director permissions of a member
 * @throws QueryError if the query fails
 * @returns The director permissions of a member or null if no permissions were found
 */
export const getDirectorPermissionsByMemberID = async (memberID: number): Promise<Permission[]> => {
  try {
    const directorPermissionsQueryResult = await query(
      `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
      FROM mitglied_has_evposten
      LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
      WHERE mitglied_has_evposten.mitglied_mitgliedID = ? AND mitglied_has_evposten.von <= NOW() AND mitglied_has_evposten.bis >= NOW();`,
      [memberID]
    );
    if (Array.isArray(directorPermissionsQueryResult)) {
      const directorPermissions = directorPermissionsQueryResult as Permission[];
      return directorPermissions;
    }

    return null;
  } catch (error) {
    throw new QueryError(`Error retrieving director permissions for member with id ${memberID}`);
  }
};

/**
 * Updates the passwordHash of a user
 * @throws QueryError if the query fails
 */
export const updateUserPassword = async (userName: string, userID: number, newPasswordHash: string): Promise<void> => {
  try {
    await query(
      `UPDATE mitglied
      SET passwordHash = ?
      WHERE mitglied.name = ?
      AND mitglied.mitgliedID = ?`,
      [newPasswordHash, userName, userID]
    );
  } catch (error) {
    throw new QueryError(`Error updating password of member with name ${userName}`);
  }
};
