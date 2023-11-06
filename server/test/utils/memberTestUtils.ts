/* eslint-disable no-console */
import MembersRepository from "../../src/resources/members/MembersRepository";
import { executeScript } from "./databaseUtils";
import { Member } from "../../src/types/membersTypes";

/**
 * Utility class for testing the members routes
 */
class MemberTestUtils {
  initMemberScript: string = "./test/scripts/members/db_member_init.sql";
  clearMemberScript: string = "./test/scripts/members/db_member_clear.sql";
  fillMemberScript: string = "./test/scripts/members/db_member_fill.sql";

  membersRepository: MembersRepository = null;
  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
    this.membersRepository = new MembersRepository();
  }

  /**
   * Initializes the member database with data that is not changed during tests
   * (e.g. permissions)
   */
  initMemberData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.initMemberScript, "INSERT");
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
      await executeScript(this.fillMemberScript, "INSERT");
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
      await executeScript(this.clearMemberScript, "TRUNCATE");
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
    const member = await this.membersRepository.getMemberByID(id, true);
    return member;
  };
}

export default MemberTestUtils;
