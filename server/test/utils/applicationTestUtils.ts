/* eslint-disable no-console */
import { executeScript } from "./databaseUtils";
import fs from "fs/promises";
import path from "path";

/**
 * Utility class for testing the application routes
 */
class ApplicationTestUtils {
  initApplicationScript = "./test/scripts/application/db_application_init.sql";
  clearInitApplicationScript = "./test/scripts/application/db_application_init_clear.sql";
  clearApplicationScript = "./test/scripts/applicaion/db_application_clear.sql";
  fillApplicationScript = "./test/scripts/applicaion/db_application_fill.sql";

  app: Express.Application = null;

  constructor(app: Express.Application) {
    this.app = app;
  }

  /**
   * Initializes the applicaion database with data that is not changed during tests
   */
  initApplicationData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.initApplicationScript);
      console.log("> Database initialized!");
    } catch (error) {
      console.error(`> ERROR: Failed to init application data: ${error}`);
    }
  };

  /**
   * Clears the database of the initial tables (data that is not changed during tests)
   */
  clearInitApplicationData = async () => {
    try {
      console.log("------------------INIT DATABASE------------------");
      await executeScript(this.clearInitApplicationScript);
      console.log("> Database initialized!");
    } catch (error) {
      console.error(`> ERROR: Failed to init applicaion data: ${error}`);
    }
  };

  /**
   * Fills the application database with data that is changed during tests
   */
  setupApplicationData = async () => {
    try {
      console.log("------------------FILL DATABASE------------------");
      await executeScript(this.fillApplicationScript);
      console.log("> Database filled!");
    } catch (error) {
      console.error(`> ERROR: Failed to setup application data: ${error}`);
    }
  };

  /**
   * Clears the application database
   */
  clearApplicationData = async () => {
    try {
      console.log("------------------CLEAR DATABASE------------------");
      await executeScript(this.clearApplicationScript);
      console.log("> Database cleared!");
    } catch (error) {
      console.error(`> ERROR: Failed to clear application data: ${error}`);
    }
  };

  /**
   * Deletes the application image from the /applicants folder in the file system
   */
  deleteApplicationImage = async (imageName: string) => {
    try {
      console.log("------------------DELETE IMAGES------------------");
      // Construct the directory path
      const directoryPath = path.join(__dirname, "../assets/applicants");
      console.log(`Directory path: ${directoryPath}`);

      // Read the directory contents
      const files = await fs.readdir(directoryPath);
      console.log(`Files in directory: ${files.join(", ")}`);

      // Filter files that start with the given imageName
      const matchingFiles = files.filter((file) => file.startsWith(imageName));
      console.log(`Matching files: ${matchingFiles.join(", ")}`);

      if (matchingFiles.length === 0) {
        console.log("> No matching files found.");
        return;
      }

      // Delete each matching file
      await Promise.all(
        matchingFiles.map(async (file) => {
          const filePath = path.join(directoryPath, file);
          console.log(`Deleting file: ${filePath}`);
          await fs.unlink(filePath);
          console.log(`> Deleted image: ${file}`);
        })
      );

      console.log("> Images deleted!");
    } catch (error) {
      console.error(`> ERROR: Failed to delete image: ${error}`);
    }
  };
}

export default ApplicationTestUtils;
