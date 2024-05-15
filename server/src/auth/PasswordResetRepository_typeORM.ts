import { AppDataSource } from "../datasource";
import { PasswordReset } from "../typeOrm/entities/PasswordReset";

export const PasswordResetRepository_typeORM = AppDataSource.getRepository(PasswordReset).extend({
  /**
   * Deletes a password reset entries by its email
   * @param memberJbtEmail The email of the password reset entries
   * @returns A promise that resolves when the entries are deleted
   */
  deletePasswordResetEntriesByEmail(memberJbtEmail: string): Promise<void> {
    return this.delete({ memberJbtEmail });
  },

  /**
   * Creates a password reset entry
   * @param memberJbtEmail - The email of the password reset entry
   * @param salt - The salt of the password reset entry
   * @param token - The hash of the password reset entry
   * @returns A promise that resolves when the entry is created
   */
  createPasswordResetEntry(memberJbtEmail: string, salt: string, token: string): Promise<void> {
    return this.save({ memberJbtEmail, salt, token });
  },

  /**
   * Retrieves a password reset entry by its email and token
   * @param memberJbtEmail - The email of the password reset entry
   * @param token - The hash of the password reset entry
   * @returns The password reset entry or null if no entry was found
   */
  getPasswordResetEntryByEmailAndToken(memberJbtEmail: string, token: string): Promise<PasswordReset | null> {
    return this.findOne({ where: { memberJbtEmail, token } });
  },
});
