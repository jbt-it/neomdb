import { query } from "../database";
import { PasswordResetEntry, User } from "../types/authTypes";
import { QueryError } from "../types/Errors";
import mysql = require("mysql2");

class AuthRepository {
  // ---------------------------- USER ---------------------------- \\

  /**
   * Retrieves a user by its username
   * @throws QueryError if the query fails
   * @returns The user with permissions or null if no user was found
   */
  getUserByName = async (name: string, connection?: mysql.PoolConnection): Promise<User> => {
    try {
      /*
       * This database call searches for all members which are trainees, active members or seniors
       * and their assigned departments if they are not currently a director
       */
      const userQueryResult = await query(
        `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
      FROM mitglied
        LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
        WHERE mitglied.name = ?
        GROUP BY mitgliedID, name`,
        [name],
        connection
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
   * Retrieves a user by its user id
   * @throws QueryError if the query fails
   * @returns The user with permissions or null if no user was found
   */
  getUserByID = async (userID: number, connection?: mysql.PoolConnection): Promise<User> => {
    try {
      /*
       * This database call searches for all members which are trainees, active members or seniors
       * and their assigned departments if they are not currently a director
       */
      const userQueryResult = await query(
        `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
      FROM mitglied
        LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
        WHERE mitglied.mitgliedID = ?
        GROUP BY mitgliedID, name`,
        [userID],
        connection
      );
      if (Array.isArray(userQueryResult) && userQueryResult.length !== 0) {
        const user = userQueryResult[0] as User;
        return user;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving user data with id ${userID}`);
    }
  };

  /**
   * Updates the passwordHash of a user
   * @throws QueryError if the query fails
   */
  updateUserPasswordByUserNameAndUserID = async (
    userName: string,
    userID: number,
    newPasswordHash: string,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `UPDATE mitglied
      SET passwordHash = ?
      WHERE mitglied.name = ?
      AND mitglied.mitgliedID = ?`,
        [newPasswordHash, userName, userID],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error updating password of member with name ${userName}`);
    }
  };

  // ---------------------------- PASSWORD RESET ---------------------------- \\

  getPasswordReserEntryByEmailAndToken = async (
    date: string,
    email: string,
    token: string,
    connection?: mysql.PoolConnection
  ): Promise<PasswordResetEntry> => {
    try {
      const passwordResetEntryQueryResult = await query(
        `SELECT mitglied_jbt_email, DATEDIFF(datum, ?) AS datediff, token FROM passwort_reset
      WHERE mitglied_jbt_email = ?
      AND token = ?`,
        [date, email, token],
        connection
      );
      if (Array.isArray(passwordResetEntryQueryResult) && passwordResetEntryQueryResult.length !== 0) {
        const passwordResetEntry = passwordResetEntryQueryResult[0] as PasswordResetEntry;
        return passwordResetEntry;
      }

      return null;
    } catch (error) {
      throw new QueryError(`Error retrieving password reset entry with email ${email}`);
    }
  };

  /**
   * Deletes a password reset entries by its email
   * @param email The email of the password reset entries
   * @throws QueryError if the query fails
   */
  deletePasswordResetEntriesByEmail = async (email: string, connection?: mysql.PoolConnection): Promise<void> => {
    try {
      await query(
        `DELETE FROM passwort_reset
        WHERE mitglied_jbt_email = ?`,
        [email],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error deleting password reset by email ${email}`);
    }
  };

  /**
   * Creates a password reset entry
   * @param email The email of the password reset entry
   * @param salt The salt of the password reset entry
   * @param token The hash of the password reset entry
   * @throws QueryError if the query fails
   */
  createPasswordResetEntry = async (
    email: string,
    salt: string,
    token: string,
    connection?: mysql.PoolConnection
  ): Promise<void> => {
    try {
      await query(
        `INSERT INTO passwort_reset (mitglied_jbt_email, salt, token)
        VALUES (?, ?, ?)`,
        [email, salt, token],
        connection
      );
    } catch (error) {
      throw new QueryError(`Error creating password reset entry for email ${email}`);
    }
  };
}

export default AuthRepository;
