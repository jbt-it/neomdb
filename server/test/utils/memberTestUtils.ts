/* eslint-disable no-console */
import { MembersRepository } from "../../src/resources/members/MembersRepository";
import { executeScript } from "./databaseUtils";
import { Member } from "../../src/entities/Member";

/**
 * Utility class for testing the members routes
 */
class MemberTestUtils {
  initMemberScript = "./test/scripts/members/db_member_init.sql";
  clearInitMemberScript = "./test/scripts/members/db_member_init_clear.sql";
  clearMemberScript = "./test/scripts/members/db_member_clear.sql";
  fillMemberScript = "./test/scripts/members/db_member_fill.sql";

  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
  }

  /**
   * Initializes the member database with data that is not changed during tests
   * (e.g. permissions)
   */
  initMemberData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.initMemberScript);
      console.log("> Database initialized!");
    } catch (error) {
      console.error(`> ERROR: Failed to init member data: ${error}`);
    }
  };

  /**
   * Clears the database of the initial tables (data that is not changed during tests)
   */
  clearInitMemberData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.clearInitMemberScript);
      console.log("> Database initialized!");
    } catch (error) {
      console.error(`> ERROR: Failed to init member data: ${error}`);
    }
  };

  /**
   * Fills the member database with data that is changed during tests
   * (e.g. members)
   */
  setupMemberData = async () => {
    try {
      console.log("------------------FILL DATABASE------------------");
      await executeScript(this.fillMemberScript);
      console.log("> Database filled!");
    } catch (error) {
      console.error(`> ERROR: Failed to setup member data: ${error}`);
    }
  };

  /**
   * Clears the member database
   */
  clearMemberData = async () => {
    try {
      console.log("------------------CLEAR DATABASE------------------");
      await executeScript(this.clearMemberScript);
      console.log("> Database cleared!");
    } catch (error) {
      console.error(`> ERROR: Failed to clear member data: ${error}`);
    }
  };

  /**
   * Retrieves the member wiht the given `id` from the DB
   * @param id The id of the member
   * @returns The member
   */
  getMemberByIDFromDB = async (id: number): Promise<Member> => {
    const member = await MembersRepository.getMemberByID(id);
    return member;
  };
}

export default MemberTestUtils;
