/* eslint-disable no-console */
import TraineesRepository from "../../src/resources/trainees/TraineesRepository";
import { InternalProject } from "../../src/types/traineesTypes";
import { executeScript } from "./databaseUtils";

/**
 * Utility class for testing the trainees routes
 */
class TraineeTestUtils {
  clearTraineeScript = "./test/scripts/trainees/db_trainee_clear.sql";
  fillTraineeScript = "./test/scripts/trainees/db_trainee_fill.sql";

  traineesRepository: TraineesRepository = null;
  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
    this.traineesRepository = new TraineesRepository();
  }

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
    const ip = await this.traineesRepository.getIPByID(id);
    return ip;
  };
}

export default TraineeTestUtils;
