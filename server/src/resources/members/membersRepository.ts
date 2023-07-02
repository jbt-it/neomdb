import { UserAuthenticationDto } from "global/auth/authTypes";
import { QueryResult } from "databaseTypes";
import { query } from "../../database";
import { QueryError } from "../../types/Errors";

export const getUser = async (username: string): Promise<UserAuthenticationDto> => {
  // TODO: Error handling?
  try {
    const userQueryResult = await query(
      `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
        FROM mitglied
        LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
        WHERE mitglied.name = ?
        GROUP BY mitgliedID, name`,
      [username]
    );
    if (Array.isArray(userQueryResult) && userQueryResult.length !== 0) {
      const user = userQueryResult[0] as UserAuthenticationDto;
      return user;
    }
    return null;
  } catch (error) {
    throw new QueryError(`Error retrieving user data with username ${username}`);
  }
};

export const getDirectorPermissions = async (memberId: number): Promise<QueryResult> => {
  // TODO: Error handling?

  const directorPermissionsQueryResult = await query(
    `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
    FROM mitglied_has_evposten
    LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
    WHERE mitglied_has_evposten.mitglied_mitgliedID = ? AND mitglied_has_evposten.von <= NOW() AND mitglied_has_evposten.bis >= NOW();`,
    [memberId]
  );
  if (Array.isArray(directorPermissionsQueryResult)) {
    return directorPermissionsQueryResult;
  }
  return null;
};
