/* eslint-disable no-console */
import InternalProjectRepository from "../../src/resources/trainees/InternalProjectRepository";
import { executeScript } from "./databaseUtils";
import { InternalProject } from "../../src/entities/InternalProject";

/**
 * Utility class for testing the trainees routes
 */
class TraineeTestUtils {
  initTraineeScript = "./test/scripts/trainees/db_trainee_init.sql";
  clearInitTraineeScript = "./test/scripts/trainees/db_trainee_init_clear.sql";
  clearTraineeScript = "./test/scripts/trainees/db_trainee_clear.sql";
  fillTraineeScript = "./test/scripts/trainees/db_trainee_fill.sql";

  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
  }

  /**
   * Initializes the trainee database with data that is not changed during tests
   * (e.g. permissions)
   */
  initTraineeData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.initTraineeScript);
      console.log("> Database initialized!");
    } catch (error) {
      console.error(`> ERROR: Failed to init trainee data: ${error}`);
    }
  };

  /**
   * Clears the database of the initial tables (data that is not changed during tests)
   */
  clearInitTraineeData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.clearInitTraineeScript);
      console.log("> Database initialized!");
    } catch (error) {
      console.error(`> ERROR: Failed to init trainee data: ${error}`);
    }
  };

  /**
   * Fills the trainee database with data that is changed during tests
   * (e.g. trainees)
   */
  setupTraineeData = async () => {
    try {
      console.log("------------------FILL DATABASE------------------");
      await executeScript(this.fillTraineeScript);
      console.log("> Database filled!");
    } catch (error) {
      console.error(`> ERROR: Failed to setup trainee data: ${error}`);
    }
  };

  /**
   * Clears the trainee database
   */
  clearTraineeData = async () => {
    try {
      console.log("------------------CLEAR DATABASE------------------");
      await executeScript(this.clearTraineeScript);
      console.log("> Database cleared!");
    } catch (error) {
      console.error(`> ERROR: Failed to clear trainee data: ${error}`);
    }
  };

  /**
   * Retrieves the IP wiht the given `id` from the DB
   * @param id The id of the IP
   * @returns The IP
   */
  getIPByIDFromDB = async (id: number): Promise<InternalProject> => {
    const ip = await InternalProjectRepository.getInternalProjectByID(id);
    return ip;
  };
}

export default TraineeTestUtils;
